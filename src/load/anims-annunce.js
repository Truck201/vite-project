export function AnimsAnnucement(scene) {
  if (!scene.anims.exists()) {
    scene.anims.create({
      key: "announcement1",
      frames: scene.anims.generateFrameNumbers("annunceBoss", {
        start: 0,
        end: 40,
      }),
      frameRate: 12,
    });

    scene.anims.create({
      key: "announcement2",
      frames: scene.anims.generateFrameNumbers("annunceNormal", {
        start: 0,
        end: 14,
      }),
      frameRate: 8,
    });
  }
}
