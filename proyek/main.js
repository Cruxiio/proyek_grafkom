import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { Octree } from "three/addons/math/Octree.js";
import { Capsule } from "three/addons/math/Capsule.js";
import { OctreeHelper } from "three/addons/helpers/OctreeHelper.js";

const worldOctree = new Octree();
const boundingBox = [];
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffff00,
  transparent: true,
  opacity: 0,
});

const playerCollider = new Capsule(
  new THREE.Vector3(-100, 0.35, 0),
  new THREE.Vector3(-100, 100, 0),
  10
);

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

const clock = new THREE.Clock();

// state
let lineHelper = false;
let arrObj = [];

// setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaFactor = 2.2;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // Soft shadows for smoother appearance
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

let degrees = 270;
let radians = THREE.MathUtils.degToRad(degrees);

const loader = new GLTFLoader();

// Add a cube to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0,
});
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;
camera.position.y = 1;
// camera.position.x = 100;

renderer.setClearColor(0x000000);

// Set up Pointer Lock Controls
let controls = new PointerLockControls(camera, document.body);

document.addEventListener("click", function (event) {
  controls.lock();
});

scene.add(controls.getObject());

// Load and add the art desk model
loader.load("public/art_desk.glb", function (gltf) {
  let art_desk = gltf.scene;
  art_desk.position.set(0, 0, 1);
  worldOctree.fromGraphNode(art_desk);
  arrObj.push(art_desk);

  art_desk.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true; // Enable shadow casting
      child.receiveShadow = true; // Enable shadow receiving
    }
  });

  scene.add(art_desk);
});

// Load and add the IKEA lamp model
loader.load("public/ikea_lamp.glb", function (gltf) {
  const ikeaLamp = gltf.scene;
  ikeaLamp.position.set(-100, 0, 0);
  scene.add(ikeaLamp);

  const light = new THREE.PointLight(0xffffff, 100000, 100000); // Increased intensity
  light.position.set(-100, 125, 0); // Position the light at the same location as the light bulb
  light.castShadow = true; // Enable shadows for the point light
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  // light.shadow.bias= -0.005
  light.shadow.normalBias = 0.05;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;
  scene.add(light);
});

loader.load("public/house.glb", function (gltf) {
  const apartment = gltf.scene;
  apartment.scale.set(3, 3, 3); 
  // worldOctree.fromGraphNode(gltf.scene);
  apartment.position.set(-500, 0, 0);
  apartment.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true; // Allow the model to cast shadows
      child.receiveShadow = true; // Allow the model to receive shadows
    }
  });
  scene.add(apartment);
});

// Load and add the fridge model
let fridgeDegrees = 270;
let fridgeRadians = THREE.MathUtils.degToRad(fridgeDegrees);
loader.load("public/fridge.glb", function (gltf) {
  const fridge = gltf.scene;
  fridge.position.set(-200, 0, -150);
  fridge.scale.set(100, 100, 100);
  // fridge.rotateY(radians);
  fridge.rotateY(fridgeRadians);
  worldOctree.fromGraphNode(fridge);
  scene.add(fridge);

  fridge.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true; // Allow the model to cast shadows
      child.receiveShadow = true; // Allow the model to receive shadows
    }
  });
});

// Load and add the light bulb model
degrees = 180;
radians = THREE.MathUtils.degToRad(degrees);

let lightBulb;
loader.load("public/led_light_bulb.glb", function (gltf) {
  lightBulb = gltf.scene;
  lightBulb.position.set(-200, 235, 0);
  lightBulb.rotateX(radians);
  scene.add(lightBulb);

  const light = new THREE.PointLight(0xffffff, 100000, 10000); // Increased intensity
  light.position.set(-200, 230, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  // light.shadow.bias = -0.05;
  light.shadow.normalBias =0.05
  light.shadow.camera.near = 0.5;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;
  scene.add(light);

  lightBulb.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false; // Light bulb should not cast shadows
      child.receiveShadow = true; // Light bulb should receive shadows
    }
  });

  scene.traverse((child) => {
    if (child !== lightBulb && child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
});

// Configure renderer for shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap; // Soft shadows for smoother appearance

// Configure materials to receive shadows
// scene.traverse((child) => {
//   if (child.isMesh) {
//     child.receiveShadow = true;
//   }
// });

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(0, 1, 0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.near = 0.5;
// directionalLight.shadow.camera.far = 500;

// set bounding box
function setPositionScaleRotation(object, position, scale, rotation) {
  object.position.set(...position);
  object.scale.set(...scale);
  object.rotation.set(...rotation.map((deg) => (deg * Math.PI) / 180));
}

function createBoundingBox(
  scene,
  position,
  scale,
  rotation,
  octree,
  boundingBox,
  interactibles
) {
  const cube = new THREE.Mesh(geometry, material);
  setPositionScaleRotation(cube, position, scale, rotation);
  octree.fromGraphNode(cube);
  scene.add(cube);

  const edges = new THREE.EdgesGeometry(cube.geometry);
  const line = new THREE.LineSegments(edges, lineMaterial);
  line.position.copy(cube.position);
  line.scale.copy(cube.scale);
  line.rotation.copy(cube.rotation);
  scene.add(line);

  boundingBox.push({
    cube: cube,
    line: line,
  });

  if (interactibles) {
    // console.log("yay");
    interactibles.boundingBox = {
      cube: cube,
      line: line,
    };
  }
}

// buat bounding box untuk setiap object
//tembok kanan
createBoundingBox(
  scene,
  [-250, 0, -620],
  [2000, 100, 10],
  [0, 0, 0],
  worldOctree,
  boundingBox
);
//tmbk Belakang
createBoundingBox(
  scene,
  [30, 0, 0],
  [10, 100, 1200],
  [0, 0, 0],
  worldOctree,
  boundingBox
);

// tmbk kiri (besar)
createBoundingBox(
  scene,
  [-145, 0, 169],
  [820, 100, 10],
  [0, 0, 0],
  worldOctree,
  boundingBox
);
//tengah kiri
createBoundingBox(
  scene,
  [-550, 0, 340],
  [10, 100, 500],
  [0, 0, 0],
  worldOctree,
  boundingBox
);

//tengah kanan
createBoundingBox(
  scene,
  [-550, 0, -350],
  [10, 100, 550],
  [0, 0, 0],
  worldOctree,
  boundingBox
);

//tmbk Depan
createBoundingBox(
  scene,
  [-1250, 0, 0],
  [10, 100, 1200],
  [0, 0, 0],
  worldOctree,
  boundingBox
);
// tembok kiri depan
createBoundingBox(
  scene,
  [-830, 0, 580],
  [820, 100, 10],
  [0, 0, 0],
  worldOctree,
  boundingBox
);

// tmbk belakang kanan (kecil)
// createBoundingBox(
//   scene,
//   [-620, 0, 169],
//   [260, 100, 10],
//   [0, 0, 0],
//   worldOctree,
//   boundingBox
// );

// tembok kiri 1
// createBoundingBox(
//   scene,
//   [-759, 0, 80],
//   [10, 100, 178],
//   [0, 0, 0],
//   worldOctree,
//   boundingBox
// );

// tembok kiri 2
// createBoundingBox(
//   scene,
//   [-759, 0, -165],
//   [10, 100, 70],
//   [0, 0, 0],
//   worldOctree,
//   boundingBox
// );

// //meja
// createBoundingBox(
//   scene,
//   [0, 0, 0],
//   [100, 100, 100],
//   [0, 0, 0],
//   worldOctree,
//   boundingBox
// );

// Keyboard state for movement
const keyboardState = {};

document.addEventListener("keydown", function (event) {
  keyboardState[event.code] = true;
});

document.addEventListener("keyup", function (event) {
  keyboardState[event.code] = false;
});

// const movementSpeed = 1.5;

function getForwardVector() {
  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();

  return playerDirection;
}

function getSideVector() {
  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross(camera.up);

  return playerDirection;
}

function playerCollisions() {
  const result = worldOctree.capsuleIntersect(playerCollider);
  // console.log(result);

  let playerOnFloor = false;

  if (result) {
    playerOnFloor = result.normal.y > 0;

    if (!playerOnFloor) {
      playerVelocity.addScaledVector(
        result.normal,
        -result.normal.dot(playerVelocity)
      );
    }

    playerCollider.translate(result.normal.multiplyScalar(result.depth));
  }
}

function updatePlayer(deltaTime) {
  let damping = Math.exp(-4 * deltaTime) - 1;

  // if ( ! playerOnFloor ) {

  //   playerVelocity.y -= GRAVITY * deltaTime;

  //   // small air resistance
  //   damping *= 0.1;

  // }

  playerVelocity.addScaledVector(playerVelocity, damping);

  const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
  playerCollider.translate(deltaPosition);

  playerCollisions();

  camera.position.copy(playerCollider.end);
}

function movement(deltaTime) {
  // gives a bit of air control
  let playerOnFloor = true;
  const movementSpeed = deltaTime * (playerOnFloor ? 500 : 8);
  // const movementSpeed = 1.5;
  // let direction = null;

  // let damping = Math.exp(-4 * deltaTime) - 1;

  // Update camera position based on keyboard input
  if (keyboardState["KeyW"]) {
    // direction = getForwardVector().multiplyScalar(movementSpeed);
    playerVelocity.add(getForwardVector().multiplyScalar(movementSpeed));

    // const direction = camera
    //   .getWorldDirection(new THREE.Vector3())
    //   .multiplyScalar(movementSpeed);
    // direction.y = 0; // Ignore y-axis movement
  }
  if (keyboardState["KeyS"]) {
    // direction = getForwardVector().multiplyScalar(-movementSpeed);
    playerVelocity.add(getForwardVector().multiplyScalar(-movementSpeed));

    // const direction = camera
    //   .getWorldDirection(new THREE.Vector3())
    //   .multiplyScalar(-movementSpeed);
    // direction.y = 0; // Ignore y-axis movement
    // camera.position.add(direction);
  }
  if (keyboardState["KeyA"]) {
    // direction = getSideVector().multiplyScalar(-movementSpeed);
    playerVelocity.add(getSideVector().multiplyScalar(-movementSpeed));
    // const direction = camera
    //   .getWorldDirection(new THREE.Vector3())
    //   .cross(camera.up)
    //   .multiplyScalar(-movementSpeed);
    // direction.y = 0; // Ignore y-axis movement
    // camera.position.add(direction);
  }
  if (keyboardState["KeyD"]) {
    // direction = getSideVector().multiplyScalar(movementSpeed);
    playerVelocity.add(getSideVector().multiplyScalar(movementSpeed));
    // const direction = camera
    //   .getWorldDirection(new THREE.Vector3())
    //   .cross(camera.up)
    //   .multiplyScalar(movementSpeed);
    // direction.y = 0; // Ignore y-axis movement
    // camera.position.add(direction);
  }

  if (keyboardState["KeyH"]) {
    lineHelper = !lineHelper;
    if (lineHelper) {
      lineMaterial.opacity = 1;
    } else {
      lineMaterial.opacity = 0;
    }
  }

  if (keyboardState["KeyE"]) {
    let camPos = camera.position;
    let objPos = arrObj[0].position;
    console.log(camPos, objPos);

    let dist = camPos.distanceTo(objPos);
    console.log(camPos, objPos, dist);

    if (dist <= 120) {
      console.log("interact");
    } else {
      console.log("sek lama");
    }
  }

  // playerVelocity.addScaledVector(playerVelocity, damping);

  // const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
  // playerCollider.translate(deltaPosition);

  // camera.position.copy(playerCollider.end);

  // if (direction != null) {
  //   camera.position.add(direction);
  // }
}

// const helper = new OctreeHelper(worldOctree);
// helper.visible = true;
// scene.add(helper);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const deltaTime = Math.min(0.05, clock.getDelta());
  movement(deltaTime);
  updatePlayer(deltaTime);

  // // Update camera position based on keyboard input
  // if (keyboardState["KeyW"]) {
  //   const direction = camera
  //     .getWorldDirection(new THREE.Vector3())
  //     .multiplyScalar(movementSpeed);
  //   direction.y = 0; // Ignore y-axis movement
  //   camera.position.add(direction);
  // }
  // if (keyboardState["KeyS"]) {
  //   const direction = camera
  //     .getWorldDirection(new THREE.Vector3())
  //     .multiplyScalar(-movementSpeed);
  //   direction.y = 0; // Ignore y-axis movement
  //   camera.position.add(direction);
  // }
  // if (keyboardState["KeyA"]) {
  //   const direction = camera
  //     .getWorldDirection(new THREE.Vector3())
  //     .cross(camera.up)
  //     .multiplyScalar(-movementSpeed);
  //   direction.y = 0; // Ignore y-axis movement
  //   camera.position.add(direction);
  // }
  // if (keyboardState["KeyD"]) {
  //   const direction = camera
  //     .getWorldDirection(new THREE.Vector3())
  //     .cross(camera.up)
  //     .multiplyScalar(movementSpeed);
  //   direction.y = 0; // Ignore y-axis movement
  //   camera.position.add(direction);
  // }

  // Keep the overall y position fixed
  // camera.position.y = 100;

  renderer.render(scene, camera);
}

animate();
