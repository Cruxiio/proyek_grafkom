import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth camera movement

const loader = new GLTFLoader();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 140;
camera.position.y = 140;
camera.position.x = 1;

renderer.setClearColor(0x000000);

loader.load("art_desk.glb", function (gltf) {
  let lampu = gltf.scene;
  lampu.position.set(0, -3, 1);
  scene.add(lampu);
});

loader.load("ikea_lamp.glb", function (gltf) {
  const ikeaLamp = gltf.scene;
  ikeaLamp.position.set(60, 0, -10);
  scene.add(ikeaLamp);
});
loader.load("apartment.glb", function (gltf) {
  const apartment = gltf.scene;
  apartment.position.set(0, 0, 0);
  scene.add(apartment);
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

// const specularLight = new THREE.DirectionalLight(0xffffff, 0.5);
// specularLight.position.set(1, 0, 0);
// scene.add(specularLight);

// Keyboard state for movement
const keyboardState = {};

document.addEventListener("keydown", function (event) {
  keyboardState[event.code] = true;
});

document.addEventListener("keyup", function (event) {
  keyboardState[event.code] = false;
});

const movementSpeed = 2;
var cameraRotationSpeed = 0.01; // Adjust as needed

// Update camera rotation based on keyboard input
function updateCameraRotation() {
  if (keyboardState["ArrowLeft"]) {
    camera.rotation.y += cameraRotationSpeed; // Rotate left
  }
  if (keyboardState["ArrowRight"]) {
    camera.rotation.y -= cameraRotationSpeed; // Rotate right
  }
  // if (keyboardState["ArrowUp"]) {
  //   camera.rotation.x -= cameraRotationSpeed; // Rotate up
  // }
  // if (keyboardState["ArrowDown"]) {
  //   camera.rotation.x += cameraRotationSpeed; // Rotate down
  // }
}

function animate() {
  requestAnimationFrame(animate);

  // Update camera position based on keyboard input
  if (keyboardState["KeyW"]) {
    camera.position.add(
      camera
        .getWorldDirection(new THREE.Vector3())
        .multiplyScalar(movementSpeed)
    );
  }
  if (keyboardState["KeyS"]) {
    camera.position.sub(
      camera
        .getWorldDirection(new THREE.Vector3())
        .multiplyScalar(movementSpeed)
    );
  }
  if (keyboardState["KeyA"]) {
    camera.position.sub(
      camera
        .getWorldDirection(new THREE.Vector3())
        .cross(camera.up)
        .multiplyScalar(movementSpeed)
    );
  }
  if (keyboardState["KeyD"]) {
    camera.position.add(
      camera
        .getWorldDirection(new THREE.Vector3())
        .cross(camera.up)
        .multiplyScalar(movementSpeed)
    );
  }
  updateCameraRotation();

  renderer.render(scene, camera);
}

animate();
