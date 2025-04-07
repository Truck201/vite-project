export function createBulletSystem(scene) {
  // Grupo de balas
  scene.bullets = scene.physics.add.group({
    classType: Phaser.GameObjects.Image,
    runChildUpdate: true,
    immovable: true,
    allowGravity: false,
  });

  // Evento de disparo
  scene.spaceKey = scene.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  scene.lastFired = 0;

  // Colisiones entre balas y enemigos
  scene.physics.add.overlap(scene.bullets, scene.enemies, (bullet, enemy) => {
    bullet.destroy();
    enemy.destroy();

    let explotion = scene.add
      .sprite(enemy.x, enemy.y, "explosion")
      .setScale(1)
      .setDepth(20);

    scene.time.addEvent({
      delay: 100,
      callback: () => {
        explotion.destroy();
      },
    });

    // update 10 points
    scene.scene.get("hud").update_points(10);
  });
}

export function updateBullets(scene, time) {
  // Disparo (con enfriamiento)
  if (scene.spaceKey.isDown && time > scene.lastFired + 350) {
    const bullet = scene.bullets.create(
      scene.player.x,
      scene.player.y - 9,
      "bullet"
    );
    bullet.setDepth(5).setScale(0.6);
    bullet.body.setVelocityY(-300);
    bullet.body.setCollideWorldBounds(false);
    scene.lastFired = time;
  }

  // Destruir balas que salen de pantalla
  scene.bullets.children.each((b) => {
    if (b.y < 0) {
      b.destroy();
    } else {
      const ratio = Phaser.Math.Clamp(1 - b.y / scene.scale.height, 0, 1);

      const red = 255;
      const greenBlue = Math.floor(255 * (1 - ratio)); // disminuye hacia 0

      // Color hexadecimal en formato 0xRRGGBB
      const color = (red << 16) | (greenBlue << 8) | greenBlue;
      b.setTint(color);
    }
  });
}
