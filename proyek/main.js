import * as THREE from "three";
// import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { Octree } from "three/addons/math/Octree.js";
import { Capsule } from "three/addons/math/Capsule.js";

const worldOctree = new Octree();
const boundingBox = [];
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffff00,
  transparent: true,
  opacity: 0,
});

const playerCollider = new Capsule(
  new THREE.Vector3(0, 0.35, 0),
  new THREE.Vector3(0, 1, 0),
  0.35
);

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

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
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
camera.position.y = 1;

renderer.setClearColor(0x000000);

let controls = new PointerLockControls(camera, document.body);

document.addEventListener("click", function (event) {
  controls.lock();
});

scene.add(controls.getObject());

loader.load("public/art_desk.glb", function (gltf) {
  let lampu = gltf.scene;
  lampu.position.set(0, -3, 1);
  scene.add(lampu);
});

loader.load("ikea_lamp.glb", function (gltf) {
  const ikeaLamp = gltf.scene;
  ikeaLamp.position.set(20, 0, -50);
  scene.add(ikeaLamp);
});

loader.load("public/apartment.glb", function (gltf) {
  const apartment = gltf.scene;
  apartment.position.set(0, 0, 0);
  scene.add(apartment);
});

let degrees = 270;
let radians = THREE.MathUtils.degToRad(degrees);
loader.load("public/fridge.glb", function (gltf) {
  const fridge = gltf.scene;
  fridge.position.set(0, 0, 0);
  fridge.scale.set(100, 100, 100);
  fridge.rotateY(10);
  scene.add(fridge);
});
// Load the light bulb model
loader.load("led_light_bulb.glb", function (gltf) {
  const lightBulb = gltf.scene;
  lightBulb.position.set(200, 0, 0);
  scene.add(lightBulb);

  // Create a PointLight positioned at the location of the light bulb
  const light = new THREE.DirectionalLight(0xffffff, 50); // Increased intensity
  light.position.set(200, 0, 0);
  scene.add(light);

  // Enable shadows for the light
  light.castShadow = true;

  // Configure material of objects to receive shadows
  lightBulb.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
});

// Configure renderer for shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows for smoother appearance

// Configure materials to receive shadows
scene.traverse((child) => {
  if (child.isMesh) {
    child.receiveShadow = true;
  }
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;

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
    console.log("yay");
    interactibles.boundingBox = {
      cube: cube,
      line: line,
    };
  }
}

// Keyboard state for movement
const keyboardState = {};

document.addEventListener("keydown", function (event) {
  keyboardState[event.code] = true;
});

document.addEventListener("keyup", function (event) {
  keyboardState[event.code] = false;
});

const movementSpeed = 0.1;

function animate() {
  requestAnimationFrame(animate);

  // Update camera position based on keyboard input
  if (keyboardState["KeyW"]) {
    const direction = camera
      .getWorldDirection(new THREE.Vector3())
      .multiplyScalar(movementSpeed);
    direction.y = 0; // Ignore y-axis movement
    camera.position.add(direction);
  }
  if (keyboardState["KeyS"]) {
    const direction = camera
      .getWorldDirection(new THREE.Vector3())
      .multiplyScalar(-movementSpeed);
    direction.y = 0; // Ignore y-axis movement
    camera.position.add(direction);
  }
  if (keyboardState["KeyA"]) {
    const direction = camera
      .getWorldDirection(new THREE.Vector3())
      .cross(camera.up)
      .multiplyScalar(-movementSpeed);
    direction.y = 0; // Ignore y-axis movement
    camera.position.add(direction);
  }
  if (keyboardState["KeyD"]) {
    const direction = camera
      .getWorldDirection(new THREE.Vector3())
      .cross(camera.up)
      .multiplyScalar(movementSpeed);
    direction.y = 0; // Ignore y-axis movement
    camera.position.add(direction);
  }

  // Keep the overall y position fixed
  camera.position.y = 100;

  renderer.render(scene, camera);
}

animate();
