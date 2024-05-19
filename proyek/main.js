import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

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
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
camera.position.y = 1;

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

  art_desk.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;   // Enable shadow casting
      child.receiveShadow = true;// Enable shadow receiving
    }
  });

  scene.add(art_desk);
});

// Load and add the IKEA lamp model
loader.load("public/ikea_lamp.glb", function (gltf) {
  const ikeaLamp = gltf.scene;
  ikeaLamp.position.set(-100, 0, 0);
  scene.add(ikeaLamp);
  
  const light = new THREE.PointLight(0xffffff, 100000, 100000);  // Increased intensity
  light.position.set(-100, 125, 0); // Position the light at the same location as the light bulb
  light.castShadow = true; // Enable shadows for the point light
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  // light.shadow.bias= 0.005
  light.shadow.normalBias = 0.05;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;
  scene.add(light); 
});

// Load and add the apartment model
loader.load('public/apartment.glb', (gltf) => {
  const apartment = gltf.scene;
  apartment.position.set(0, 0, 0);
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
  fridge.rotateY(fridgeRadians);
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
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  light.shadow.bias= -0.05 
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

// Add a directional light to the scene
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(0, 1, 0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.near = 0.5;
// directionalLight.shadow.camera.far = 500;

// Keyboard state for movement
const keyboardState = {};

document.addEventListener("keydown", function (event) {
  keyboardState[event.code] = true;
});

document.addEventListener("keyup", function (event) {
  keyboardState[event.code] = false;
});

const movementSpeed = 1;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update camera position based on keyboard input
  if (keyboardState["KeyW"]) {
    const direction = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(movementSpeed);
    direction.y = 0; // Ignore y-axis movement
    camera.position.add(direction);
  }
  if (keyboardState["KeyS"]) {
    const direction = camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-movementSpeed);
    direction.y = 0; // Ignore y-axis movement
    camera.position.add(direction);
  }
  if (keyboardState["KeyA"]) {
    const direction = camera.getWorldDirection(new THREE.Vector3()).cross(camera.up).multiplyScalar(-movementSpeed);
    direction.y = 0; // Ignore y-axis movement
    camera.position.add(direction);
  }
  if (keyboardState["KeyD"]) {
    const direction = camera.getWorldDirection(new THREE.Vector3()).cross(camera.up).multiplyScalar(movementSpeed);
    direction.y = 0; // Ignore y-axis movement
    camera.position.add(direction);
  }

  // Keep the overall y position fixed
  camera.position.y = 100;

  renderer.render(scene, camera);
}

animate();
