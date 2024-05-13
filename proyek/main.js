import * as THREE from "three";
// import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
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

document.addEventListener("mousemove", function (event) {
  controls.lock();
});

scene.add(controls.getObject());

loader.load("public/art_desk.glb", function (gltf) {
  let lampu = gltf.scene;
  lampu.position.set(0, -3, 1);
  scene.add(lampu);
});

loader.load("public/ikea_lamp.glb", function (gltf) {
  const ikeaLamp = gltf.scene;
  ikeaLamp.position.set(100, 0, 0);
  scene.add(ikeaLamp);
});
loader.load("public/apartment.glb", function (gltf) {
  const apartment = gltf.scene;
  apartment.position.set(0, 0, 0);
  scene.add(apartment);
});

loader.load("public/fridge.glb", function (gltf) {
  const fridge = gltf.scene;
  fridge.position.set(0, 0, 0);
  fridge.scale.set(100, 100, 100);
  fridge.rotateY(10);
  scene.add(fridge);
});
// Load the light bulb model
loader.load("public/led_light_bulb.glb", function (gltf) {
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

// // Mouse state for looking around
// const mouseState = {
//   x: 0,
//   y: 0,
// };

// let centerX = window.innerWidth / 2;
// let centerY = window.innerHeight / 2;

// document.addEventListener("mousemove", function (event) {
//   mouseState.x = (event.clientX - centerX) / centerX * Math.PI / 2;
//   mouseState.y = (event.clientY - centerY) / centerY * Math.PI / 2;
// });

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

  // // Look around based on mouse movement
  // camera.rotation.y += (mouseState.x - camera.rotation.y) * 0.1;
  // camera.rotation.x += (mouseState.y - camera.rotation.x) * 0.1;

  // // Clamp vertical rotation to a specific range
  // const maxVerticalRotation = Math.PI / 4; // 45 degrees
  // camera.rotation.x = Math.max(
  //   -maxVerticalRotation,
  //   Math.min(maxVerticalRotation, camera.rotation.x)
  // );

  // Keep the overall y position fixed
  camera.position.y = 100;

  renderer.render(scene, camera);
}

// init();
animate();
