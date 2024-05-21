import * as THREE from "three";

export function loadModels(scene, loader, worldOctree, arrObj) {
  // Load and add the art desk model
  loader.load("public/art_desk.glb", function (gltf) {
    let art_desk = gltf.scene;
    art_desk.position.set(-150, 0, 1);
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

  loader.load("public/kitchen_sink.glb", function (gltf) {
    let kitchen_sink = gltf.scene;
    kitchen_sink.position.set(-1000, 0, 550);
    kitchen_sink.scale.set(100, 100, 100);
    kitchen_sink.rotateY((Math.PI / 2) * 3);
    worldOctree.fromGraphNode(kitchen_sink);
    arrObj.push(kitchen_sink);

    kitchen_sink.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });

    scene.add(kitchen_sink);
  });

  // Load and add the fridge model
  loader.load("public/fridge.glb", function (gltf) {
    const fridge = gltf.scene;
    fridge.position.set(-800, 0, 550);
    fridge.scale.set(100, 100, 100);
    fridge.rotateY(Math.PI / 2);
    worldOctree.fromGraphNode(fridge);
    scene.add(fridge);

    fridge.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Allow the model to cast shadows
        child.receiveShadow = true; // Allow the model to receive shadows
      }
    });
  });

  loader.load("public/armchair.glb", function (gltf) {
    let armchair = gltf.scene;
    armchair.position.set(-100, 0, -200);
    armchair.position.set(-100, 0, -200);
    armchair.scale.set(150, 150, 150);
    worldOctree.fromGraphNode(armchair);
    arrObj.push(armchair);

    armchair.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(armchair);
  });

  loader.load("public/air_conditioner.glb", function (gltf) {
    let air_conditioner = gltf.scene;
    air_conditioner.position.set(-520, 250, -233);
    air_conditioner.scale.set(10, 10, 10);
    air_conditioner.rotateY(Math.PI / 2);
    worldOctree.fromGraphNode(air_conditioner);
    arrObj.push(air_conditioner);

    air_conditioner.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(air_conditioner);
  });

  loader.load(
    "public/aveiro_sideboard_natural_oak_and_white.glb",
    function (gltf) {
      let sideboard = gltf.scene;
      sideboard.position.set(-580, 0, -444);
      sideboard.rotateY((Math.PI / 2) * 3);
      worldOctree.fromGraphNode(sideboard);
      arrObj.push(sideboard);

      sideboard.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true; // Enable shadow casting
          child.receiveShadow = true; // Enable shadow receiving
        }
      });
      scene.add(sideboard);
    }
  );

  loader.load("public/bed.glb", function (gltf) {
    let bed = gltf.scene;
    bed.position.set(-50, 0, -505);
    worldOctree.fromGraphNode(bed);
    arrObj.push(bed);

    bed.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(bed);
  });
  // loader.load("public/oven.glb", function (gltf) {
  //   let oven = gltf.scene;
  //   oven.position.set(-300, 0, -200);
  //   oven.scale.set(50, 50, 50);
  //   worldOctree.fromGraphNode(oven);
  //   arrObj.push(oven);

  //   oven.traverse((child) => {
  //     if (child.isMesh) {
  //       child.castShadow = true; // Enable shadow casting
  //       child.receiveShadow = true; // Enable shadow receiving
  //     }
  //   });
  //   scene.add(oven);
  // });

  //   let pivot = new THREE.Object3D();
  //   scene.add(pivot);
  //   let door;
  //   loader.load("public/door.glb", function (gltf) {
  //     door = gltf.scene;
  //     door.position.set(-200, 0, -200);
  //     door.scale.set(150, 150, 150);
  //     worldOctree.fromGraphNode(door);
  //     arrObj.push(door);

  //     door.traverse((child) => {
  //       if (child.isMesh) {
  //         child.castShadow = true; // Enable shadow casting
  //         child.receiveShadow = true; // Enable shadow receiving
  //       }
  //     });

  //     // Add the door to the pivot
  //     // pivot.add(door);
  //     // door.position.set(-door.geometry.parameters.width / 2, 0, 0);

  //     scene.add(door);
  //   });
}