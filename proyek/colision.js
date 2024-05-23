import * as THREE from "three";

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffff00,
  transparent: true,
  opacity: 0,
});
// Add a cube to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0,
});

// set bounding box
function setPositionScaleRotation(object, position, scale, rotation) {
  object.position.set(...position);
  object.scale.set(...scale);
  object.rotation.set(...rotation.map((deg) => (deg * Math.PI) / 180));
}

export function createBoundingBox(
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

export function changeMaterialOpacity(state) {
  if (state) {
    lineMaterial.opacity = 1;
  } else {
    lineMaterial.opacity = 0;
  }
}

export function colision(scene, worldOctree, boundingBox, interactibles) {
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

  // pintu
  createBoundingBox(
    scene,
    [-830, 0, 580],
    [820, 100, 10],
    [0, 0, 0],
    worldOctree,
    boundingBox
  );
}

// module.exports = {
//   colision: colision,
// };
