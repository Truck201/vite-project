// boss.js
export function spawnBoss(scene) {
  scene.bossCount = 0;
  scene.bossKilled = 0;

  scene.bossGroup = scene.physics.add.group({
    immovable: true,
    allowGravity: false,
  });

  // Grupo para proyectiles enemigos
  scene.bossProjectiles = scene.physics.add.group({
    allowGravity: false,
  });

  scene.bossTimer = scene.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      if (scene.bossCount < 5) {
        appearBoss(scene);
        scene.bossCount++;
      } else {
        scene.bossTimer.remove(); // detiene el evento de spawn
      }
    },
  });
}

function bossDies(scene, boss) {
  const explosion = scene.add
    .sprite(boss.x, boss.y, "explosion")
    .setDepth(20)
    .setScale(2);

  scene.time.addEvent({
    delay: 220,
    callback: () => {
      explosion.destroy();
    },
  });
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
      if (scene.bossKilled >= 5) {
        console.log("Todos los bosses derrotados. Avanzando de nivel.");
        scene.isBossLevel = false;
      }
    },
  });
}

function appearBoss(scene) {
  const maxAttempts = 30; // Para evitar bucles infinitos
  const minDistance = 28; // Distancia mínima entre bosses
  let attempts = 0;
  let positionFound = false;
  let x, y;

  while (!positionFound && attempts < maxAttempts) {
    x = Phaser.Math.Between(14, scene.scale.width - 14);
    y = Phaser.Math.Between(
      scene.scale.height * 0.2,
      scene.scale.height * 0.42
    );

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

  if (!positionFound) {
    console.warn(
      "No se encontró una posición válida para el boss. Se canceló su aparición."
    );
    return;
  }

  const boss = scene.physics.add.sprite(x, y - 80, "boss").setDepth(20);
  boss.hp = 5;
  boss.setImmovable(true);
  boss.body.allowGravity = false;

  // Tween
  scene.tweens.add({
    targets: boss,
    y: y,
    duration: 500,
    ease: "Power2",
    onComplete: () => {
      boss.anims.play("boss-idle", true); // Reproducir animación al llegar
    },
  });

  scene.bossGroup.add(boss); // Añadir al grupo

  scene.physics.add.overlap(boss, scene.bullets, (bossObj, bullet) => {
    bullet.destroy();
    bossObj.hp--;

    if (bossObj.hp <= 0) {
      bossDies(scene, bossObj);
    }
  });

  // Iniciar disparo del boss
  const shootInterval = Phaser.Math.Between(1200, 2000);
  boss.shootTimer = scene.time.addEvent({
    delay: shootInterval,
    loop: true,
    callback: () => {
      shootBossProjectile(scene, boss);
    },
  });
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
}

function tryMoveBoss(scene, boss) {
  const maxAttempts = 30;
  const minDistance = 28;
  let attempts = 0;
  let newX, newY;
  let validPosition = false;

  while (!validPosition && attempts < maxAttempts) {
    newX = Phaser.Math.Between(14, scene.scale.width - 14);
    newY = Phaser.Math.Between(
      scene.scale.height * 0.2,
      scene.scale.height * 0.42
    );

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
