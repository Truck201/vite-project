export function StarterAnims(scene) {
  if (!scene.anims.exists()) {
    scene.anims.create({
      key: "StartGame",
      frames: scene.anims.generateFrameNumbers("starter", {
        start: 0,
        end: 13,
      }),
      frameRate: 10,
    });
  }
}
