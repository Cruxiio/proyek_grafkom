import * as THREE from "three";

export function loadModels(scene, loader, worldOctree, arrObj) {
  // Load and add the art desk model
  // loader.load("public/art_desk.glb", function (gltf) {
  //   let art_desk = gltf.scene;
  //   art_desk.position.set(-150, 0, 1);
  //   worldOctree.fromGraphNode(art_desk);
  //   arrObj.push(art_desk);

  //   art_desk.traverse((child) => {
  //     if (child.isMesh) {
  //       child.castShadow = true; // Enable shadow casting
  //       child.receiveShadow = true; // Enable shadow receiving
  //     }
  //   });

  //   scene.add(art_desk);
  // });
  //meja makan
  loader.load("public/table_and_chairs.glb", function (gltf) {
    let table_and_chairs = gltf.scene;
    table_and_chairs.position.set(-800, 0, 0);
    table_and_chairs.scale.set(100, 100, 100);
    table_and_chairs.rotateY((Math.PI / 2) * 3);
    worldOctree.fromGraphNode(table_and_chairs);
    // arrObj.push(table_and_chairs);

    table_and_chairs.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });

    scene.add(table_and_chairs);
  });

  loader.load("public/coffee_table_marina.glb", function (gltf) {
    let coffee_table_marina = gltf.scene;
    coffee_table_marina.position.set(-300, 0, 1);
    coffee_table_marina.scale.set(0.2, 0.2, 0.2);
    worldOctree.fromGraphNode(coffee_table_marina);
    // arrObj.push(coffee_table_marina);

    coffee_table_marina.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });

    scene.add(coffee_table_marina);
  });

  loader.load("public/stretto_large_shelves_grey.glb", function (gltf) {
    let shelves = gltf.scene;
    shelves.position.set(-515, 0, -300);
    shelves.rotateY((Math.PI / 2) * 1);
    // shelves.scale.set(100, 100, 100);
    // worldOctree.fromGraphNode(shelves);
    // arrObj.push(shelves);

    shelves.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });

    scene.add(shelves);
  });

  loader.load("public/office_chair_low-poly.glb", function (gltf) {
    let chair = gltf.scene;
    chair.position.set(-450, 0, 1);
    worldOctree.fromGraphNode(chair);
    // arrObj.push(chair);

    chair.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });

    scene.add(chair);
  });
  loader.load("public/kitchen_sink.glb", function (gltf) {
    let kitchen_sink = gltf.scene;
    kitchen_sink.position.set(-1000, 0, 550);
    kitchen_sink.scale.set(100, 100, 100);
    kitchen_sink.rotateY((Math.PI / 2) * 3);
    worldOctree.fromGraphNode(kitchen_sink);
    // arrObj.push(kitchen_sink);

    kitchen_sink.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });

    scene.add(kitchen_sink);
  });
  loader.load("public/desk.glb", function (gltf) {
    let desk = gltf.scene;
    desk.position.set(-1000, 0, 550);
    desk.scale.set(10, 10, 10);
    worldOctree.fromGraphNode(desk);
    // arrObj.push(desk);

    desk.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });

    scene.add(desk);
  });
  loader.load("public/wardrobe.glb", function (gltf) {
    let wardrobe = gltf.scene;
    wardrobe.position.set(-20, 100, -300);
    wardrobe.scale.set(100, 100, 100);
    wardrobe.rotateY((Math.PI / 2) * 3);
    worldOctree.fromGraphNode(wardrobe);
    // arrObj.push(wardrobe);

    wardrobe.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });

    scene.add(wardrobe);
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
    armchair.scale.set(150, 150, 150);
    worldOctree.fromGraphNode(armchair);
    // arrObj.push(armchair);

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
    // arrObj.push(air_conditioner);

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
      // arrObj.push(sideboard);

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
    bed.position.set(-100, 0, -505);
    worldOctree.fromGraphNode(bed);
    // arrObj.push(bed);

    bed.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting
        child.receiveShadow = true; // Enable shadow receiving
      }
    });
    scene.add(bed);
  });
}
