// boss.js
export function spawnBoss(scene) {
  scene.bossWave = 1;
  scene.bossCount = 0;
  scene.bossKilled = 0;

  scene.bossStanding_defeat = false;

  scene.bossGroup = scene.physics.add.group({
    immovable: true,
    allowGravity: false,
  });

  // Grupo para proyectiles enemigos
  scene.bossProjectiles = scene.physics.add.group({
    allowGravity: false,
  });

  scene.bossTimer = scene.time.addEvent({
    delay: 1200,
    loop: true,
    callback: () => {
      if (scene.bossWave === 1 && scene.bossCount < 4) {
        appearBoss(scene);
        scene.bossCount++;
      } else if (scene.bossWave === 1 && scene.bossCount >= 4) {
        scene.bossTimer.remove();
      }
    },
  });
}

function bossDies(scene, boss) {
  const explotion = scene.add
    .sprite(boss.x, boss.y, "explotion")
    .setScale(1)
    .setDepth(60);
  explotion.anims.play("destroy", true);

  explotion.on("animationcomplete", () => {
    explotion.destroy();
  });

  scene.PlayerDead.play();
  // Cancelar el disparo si aún existe el timer
  if (boss.shootTimer) {
    boss.shootTimer.remove();
  }
  boss.destroy();
  scene.bossKilled++;

  scene.scene.get("hud").update_points(300);

  scene.time.addEvent({
    delay: Phaser.Math.Between(1800, 3600),
    callback: () => {
      if (scene.bossStanding_defeat === true) {
        console.log("Todos los bosses derrotados. Avanzando de nivel.");
        scene.isBossLevel = false;
      }
    },
  });

  scene.BossDead_1.play();

  if (scene.bossWave === 1 && scene.bossKilled >= 4) {
    scene.bossWave = 2;
    scene.bossCount = 0;
    scene.bossKilled = 0;
    spawnSecondWave(scene);
  }
}

function spawnSecondWave(scene) {
  // Spawnea 2 bosses normales
  for (let i = 0; i < 2; i++) {
    scene.time.addEvent({
      delay: 1200 * i,
      callback: () => {
        appearBoss(scene, true); // Pasamos true para restringir movimiento
        scene.bossCount++;
      },
    });
  }

  // Spawnea el boss central
  spawnCentralBoss(scene);
}

function appearBoss(scene, restrict = false) {
  const maxAttempts = 30;
  const minDistance = 50;
  let attempts = 0;
  let positionFound = false;
  let x, y;

  const minY = scene.scale.height * 0.2;
  const maxY = scene.scale.height * 0.42;

  while (!positionFound && attempts < maxAttempts) {
    x = Phaser.Math.Between(20, scene.scale.width - 20);
    y = Phaser.Math.Between(minY, maxY);

    // Si hay un boss central, evitamos que spawneen encima
    if (restrict && scene.bossCentral) {
      const distToCentral = Phaser.Math.Distance.Between(
        x,
        y,
        scene.bossCentral.x,
        scene.bossCentral.y
      );
      if (distToCentral < 100) {
        attempts++;
        continue;
      }
    }

    positionFound = true;

    scene.bossGroup.getChildren().forEach((existingBoss) => {
      const dist = Phaser.Math.Distance.Between(
        x,
        y,
        existingBoss.x,
        existingBoss.y
      );
      if (dist < minDistance) {
        positionFound = false;
      }
    });

    attempts++;
  }

  if (!positionFound) return;

  const boss = scene.physics.add.sprite(x, y - 80, "boss").setDepth(20);
  boss.hp = 5;
  boss.setImmovable(true);
  boss.body.allowGravity = false;

  scene.tweens.add({
    targets: boss,
    y: y,
    duration: 500,
    ease: "Power2",
    onComplete: () => boss.anims.play("boss-idle", true),
  });

  scene.bossGroup.add(boss);

  scene.physics.add.overlap(boss, scene.bullets, (bossObj, bullet) => {
    bullet.destroy();
    bossObj.hp--;
    scene.BossDamage.play();

    if (bossObj.hp <= 0) {
      bossDies(scene, bossObj);
    }
  });

  const shootInterval = Phaser.Math.Between(1200, 2000);
  boss.shootTimer = scene.time.addEvent({
    delay: shootInterval,
    loop: true,
    callback: () => shootBossProjectile(scene, boss, restrict),
  });

  scene.BossAppear_1.play();
  scene.activeSounds.push(scene.BossAppear_1);
}

function shootBossProjectile(scene, boss) {
  const projectile = scene.bossProjectiles.create(
    boss.x,
    boss.y + 10,
    "ballsprite"
  );

  const level = scene.scene.get("hud").get_level();
  const bossBulletSpeed = 80 + (level - 1) * 10;
  projectile.setVelocityY(bossBulletSpeed);

  projectile.setDepth(5);
  projectile.play("ballAnim"); // animación
  projectile.body.setSize(projectile.width * 0.7, projectile.height * 0.7); // ajuste de hitbox si necesario

  // Destruir al salir de pantalla
  projectile.checkWorldBounds = true;
  projectile.outOfBoundsKill = true;

  scene.physics.add.overlap(projectile, scene.player.player, () => {
    console.log("¡El jugador fue golpeado!");
    scene.player.handlePlayerHit(scene.player.player, projectile);
  });

  // Posibilidad de moverse (55%)
  if (Phaser.Math.Between(1, 100) <= 55) {
    tryMoveBoss(scene, boss);
  }

  scene.BossBullet.play();
  scene.activeSounds.push(scene.BossBullet);
}

function tryMoveBoss(scene, boss, restrict = false) {
  const maxAttempts = 30;
  const minDistance = 50;
  let attempts = 0;
  let newX, newY;
  let validPosition = false;

  while (!validPosition && attempts < maxAttempts) {
    newX = Phaser.Math.Between(20, scene.scale.width - 20);
    newY = Phaser.Math.Between(
      scene.scale.height * 0.2,
      scene.scale.height * 0.42
    );

    if (restrict && scene.bossCentral) {
      const distToCentral = Phaser.Math.Distance.Between(
        newX,
        newY,
        scene.bossCentral.x,
        scene.bossCentral.y
      );
      if (distToCentral < 100) {
        attempts++;
        continue;
      }
    }

    validPosition = true;

    scene.bossGroup.getChildren().forEach((otherBoss) => {
      if (otherBoss === boss) return; // Ignorar a sí mismo
      const dist = Phaser.Math.Distance.Between(
        newX,
        newY,
        otherBoss.x,
        otherBoss.y
      );
      if (dist < minDistance) {
        validPosition = false;
      }
    });

    attempts++;
  }

  if (!validPosition) {
    return; // No se encontró posición válida, no se mueve
  }

  // Mover al boss con tween
  scene.tweens.add({
    targets: boss,
    x: newX,
    y: newY,
    duration: 600,
    ease: "Sine.easeInOut",
  });
}

function spawnCentralBoss(scene) {
  const x = scene.scale.width / 2;
  const y = scene.scale.height * 0.28;

  const boss = scene.physics.add
    .sprite(x, y - 80, "standing_boss")
    .setDepth(20)
    .setOrigin(0.5);

  scene.tweens.add({
    targets: boss,
    y: y,
    duration: 500,
    ease: "Power2",
    onComplete: () =>
      boss.anims.play("standing-boss-idle", true).setOrigin(0.5),
  });

  boss.setImmovable(true);
  boss.hp = 10;
  boss.body.allowGravity = false;
  boss.isCentral = true;
  scene.bossCentral = boss;
  scene.bossGroup.add(boss);

  // Disparo continuo
  const shootTimer = scene.time.addEvent({
    delay: Phaser.Math.Between(1300, 1900),
    loop: true,
    callback: () => {
      shootCentralBeam(scene, boss);
    },
  });
  boss.shootTimer = shootTimer;

  // Verifica si está solo y ajusta la cadencia
  const otherBossesAlive = scene.bossGroup
    .getChildren()
    .some((b) => !b.isCentral && b.active);

  if (!otherBossesAlive) {
    // Aumenta la cadencia si está solo (dispara más seguido)
    shootTimer.delay = Phaser.Math.Between(700, 1000);
    console.log("disparo --> 700, 1000");
  } else {
    // Cadencia normal
    shootTimer.delay = Phaser.Math.Between(1900, 2000);
    console.log("disparo --> 1900, 2000 ");
  }

  // Colisión con balas del jugador
  scene.physics.add.overlap(boss, scene.bullets, (bossObj, bullet) => {
    bullet.destroy();

    const otherBossesAlive = scene.bossGroup
      .getChildren()
      .some((b) => !b.isCentral && b.active);

    if (otherBossesAlive) return;

    bossObj.hp--;
    scene.BossDamage.play();

    if (bossObj.hp <= 0) {
      bossDies(scene, bossObj, true);
      scene.bossStanding_defeat = true;
    }
  });

  scene.BossAppear_1.play();
  scene.activeSounds.push(scene.BossAppear_1);

  // Movimiento izquierda-derecha cuando está solo
  const moveBoss = () => {
    const leftX = 20;
    const rightX = scene.scale.width - 20;

    const moveLeft = () => {
      if (!boss.active) return;
      scene.tweens.add({
        targets: boss,
        x: leftX,
        duration: 1500,
        ease: "Sine.easeInOut",
        onComplete: moveRight,
      });
    };

    const moveRight = () => {
      if (!boss.active) return;
      scene.tweens.add({
        targets: boss,
        x: rightX,
        duration: 1500,
        ease: "Sine.easeInOut",
        onComplete: moveLeft,
      });
    };

    moveRight();
  };

  // Verifica si está solo antes de moverse
  scene.time.addEvent({
    delay: 500,
    loop: true,
    callback: () => {
      const othersAlive = scene.bossGroup
        .getChildren()
        .some((b) => !b.isCentral && b.active);

      if (!othersAlive && boss.active && !boss.movingStarted) {
        boss.movingStarted = true;
        moveBoss();
      }
    },
  });
}

function shootCentralBeam(scene, boss) {
  const beam = scene.bossProjectiles.create(boss.x, boss.y + 10, "raySprite");
  beam.play("raySpriteAnim", true);
  beam.setVelocityY(280);
  beam.setDepth(5);
  // beam.play("rayAnim");

  scene.physics.add.overlap(beam, scene.player.player, () => {
    scene.player.handlePlayerHit(scene.player.player, beam);
  });
}
