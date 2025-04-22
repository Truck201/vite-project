export function addSounds(scene) {
  // --> Bonus
  scene.BonusIdle = scene.sound.add("bonus_idle_2", {
    volume: 0.035,
    loop: true,
  });
  scene.BonusHit = scene.sound.add("bonus_hit", { volume: 0.07 });
  scene.BonusDead = scene.sound.add("bonus_dead", { volume: 0.07 });

  // --> Player
  scene.PlayerBullet_1 = scene.sound.add("bullet_1", { volume: 0.06 });
  scene.PlayerBullet_2 = scene.sound.add("bullet_2", { volume: 0.06 });
  scene.PlayerDead = scene.sound.add("player_dead", { volume: 0.17 });
  scene.PlayerHit = scene.sound.add("player_hit", { volume: 0.1 });

  // --> Enemy
  scene.currentAlienSoundIndex = 0;
  scene.alienSounds = [
    scene.sound.add("enemy_move_1", { volume: 0.09 }),
    scene.sound.add("enemy_move_2", { volume: 0.09 }),
    scene.sound.add("enemy_move_3", { volume: 0.09 }),
    scene.sound.add("enemy_move_4", { volume: 0.09 }),
  ];

  scene.EnemyDead = scene.sound.add("enemy_dead", { volume: 0.08 });
  scene.EnemyHit = scene.sound.add("enemy_hit", { volume: 0.08 });

  // --> Boss
  // scene.BossAppear_2 = scene.sound.add("boss_appear_1", { volume: 0.1 });
  scene.BossAppear_1 = scene.sound.add("boss_appear_2", { volume: 0.08 });
  scene.BossDead_1 = scene.sound.add("boss_dead_1", { volume: 0.08 });
  scene.BossDead_2 = scene.sound.add("boss_dead_2", { volume: 0.08 });
  scene.BossDamage = scene.sound.add("boss_damage", { volume: 0.04 });
  // scene.BossMove = scene.sound.add("boss_move", { volume: 0.1 });
  scene.BossBullet = scene.sound.add("boss_bullet", { volume: 0.05 });
}
