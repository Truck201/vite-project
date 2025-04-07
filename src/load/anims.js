export function initialAnimations(scene) {
  if (!scene.anims.exists()) {
    scene.anims.create({
      key: "idle",
      frames: scene.anims.generateFrameNumbers("shipIdle", {
        start: 0,
        end: 3,
      }),
      repeat: -1,
      frameRate: 4,
    });

    scene.anims.create({
      key: "left",
      frames: scene.anims.generateFrameNumbers("ship", {
        start: 0,
        end: 2,
      }),
      frameRate: 12,
    });

    scene.anims.create({
      key: "right",
      frames: scene.anims.generateFrameNumbers("ship", {
        start: 3,
        end: 5,
      }),
      frameRate: 12,
    });

    scene.anims.create({
      key: "flaires",
      frames: scene.anims.generateFrameNumbers("flares", {
        start: 0,
        end: 1,
      }),
      frameRate: 17,
      repeat: -1, // La animación se repite indefinidamente
    });

    // aliens
    scene.anims.create({
      key: "skuller",
      frames: scene.anims.generateFrameNumbers("skull", {
        start: 0,
        end: 1,
      }),
      frameRate: 1.5,
      repeat: -1,
    });

    scene.anims.create({
      key: "marcianoer",
      frames: scene.anims.generateFrameNumbers("marciano", {
        start: 0,
        end: 1,
      }),
      frameRate: 1.5,
      repeat: -1,
    });

    scene.anims.create({
      key: "octopuser",
      frames: scene.anims.generateFrameNumbers("octopus", {
        start: 0,
        end: 1,
      }),
      frameRate: 1.5,
      repeat: -1,
    });

    scene.anims.create({
      key: "flyer",
      frames: scene.anims.generateFrameNumbers("bonusFlyer", {
        start: 0,
        end: 1,
      }),
      frameRate: 4,
      repeat: -1,
    });

    console.log("Starts anims");
  }
}
