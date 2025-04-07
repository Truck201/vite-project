// boss.js
export function spawnBoss(scene) {
  const x = scene.scale.width * 0.5;
  const y = scene.scale.height * 0.25;

  scene.boss = scene.physics.add.sprite(x, y, "boss").setDepth(20);
  scene.boss.hp = 15;
  scene.boss.setImmovable(true);
  scene.boss.body.allowGravity = false;

  scene.boss.anims.play("boss_idle", true);

  scene.physics.add.overlap(scene.playerBullets, scene.boss, (bullet, boss) => {
    bullet.destroy();
    boss.hp--;

    if (boss.hp <= 0) {
      bossDies(scene);
    }
  });
}

function bossDies(scene) {
  const explosion = scene.add
    .sprite(scene.boss.x, scene.boss.y, "explosion")
    .setDepth(20)
    .setScale(2);

  scene.boss.destroy();

  scene.time.addEvent({
    delay: 1000,
    callback: () => {
      explosion.destroy();
      scene.startLevel(scene.currentLevel + 1);
    },
  });
}
