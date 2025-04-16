import { spawnBoss } from "./boss";

export class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.isBossLevel = false;
    this.enemiesCreated = false;

    this.scene.scene.get("hud").update_level(!this.isBossLevel);
    this.level = this.scene.scene.get("hud").get_level();
  }

  startLevel() {
    this.scene.enemies?.clear(true, true);
    this.scene.bossGroup?.clear(true, true);
    this.scene.enemyBullets?.clear(true, true);
    this.scene.bossProjectiles?.clear(true, true);
    this.isBossLevel = this.level % 2 === 0;

    if (this.isBossLevel) {
      console.log("🛸 Nivel BOSS");
      spawnBoss(this.scene);
    } else {
      console.log("👾 Nivel normal");
      this.createEnemies();
      this.setupEnemyMovement();
      this.setupEnemyBullets();
    }

    this.enemiesCreated = true;
  }

  createEnemies() {
    const { width, height } = this.scene.scale;

    if (!this.scene.enemies) {
      this.scene.enemies = this.scene.physics.add.group({
        immovable: true,
        allowGravity: false,
      });
    }

    const columns = 8;
    const spacingX = 20;
    const spacingY = 20;
    const startX = width * 0.15;

    const rows = [
      { type: "octopus", offset: -1 },
      { type: "marciano", offset: 0 },
      { type: "marciano", offset: 1 },
      { type: "skull", offset: 2 },
      { type: "skull", offset: 3 },
    ];

    rows.forEach((row, rowIndex) => {
      for (let col = 0; col < columns; col++) {
        const x = startX + col * spacingX;
        const finalY = height * 0.22 + row.offset * spacingY;
        const startY = -Phaser.Math.Between(100, 30); // empieza desde arriba de la pantalla

        const alien = this.scene.enemies
          .create(x, startY, row.type)
          .setDepth(20)
          .setOrigin(0.5)
          .setCollideWorldBounds(true);

        alien.body.setImmovable(true);
        alien.body.allowGravity = false;
        alien.anims.play(row.type + "er", true);

        // Tween para descender hasta su posición final
        this.scene.tweens.add({
          targets: alien,
          y: finalY,
          duration: 1200,
          ease: "Power2",
          delay: Phaser.Math.Between(0, 130), // agrega variación para hacerlo más dinámico
        });
      }
    });
  }

  setupEnemyMovement() {
    const scene = this.scene;

    if (scene.alienDirection === undefined) {
      scene.alienDirection = 1;
      scene.baseSpeed = 0.5;
      scene.enemieSpeed = scene.baseSpeed;

      scene.moveTimer = scene.time.addEvent({
        delay: 80,
        loop: true,
        callback: () => this.moveEnemies(),
      });
    }
  }

  setupEnemyBullets() {
    const scene = this.scene;

    if (!this.scene.enemyBullets) {
      scene.enemyBullets = scene.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
        runChildUpdate: true,
      });
    }

    if (!this.timerEnemyAttack) {
      this.timerEnemyAttack = scene.time.addEvent({
        delay: Phaser.Math.Between(750, 1300),
        loop: true,
        callback: () => {
          const shooters = scene.enemies.getChildren().filter((e) => e.active);
          if (shooters.length === 0) return;

          const shooter = Phaser.Utils.Array.GetRandom(shooters);

          // Cálculo de probabilidades con leve aumento por nivel
          const levelMultiplier = this.level * 0.01; // Por cada nivel aumenta 0.1%
          const chanceDoubleShot = 0.03 + levelMultiplier;
          const chanceTripleShot = 0.01 + levelMultiplier;

          const shotCount = (() => {
            const rand = Math.random();
            if (rand < chanceTripleShot) return 3;
            if (rand < chanceTripleShot + chanceDoubleShot) return 2;
            return 1;
          })();

          for (let i = 0; i < shotCount; i++) {
            const bullet = scene.enemyBullets.get(
              shooter.x,
              shooter.y + 8,
              "EnemyBullet"
            );
            if (bullet) {
              bullet.setActive(true).setVisible(true);
              bullet.body.allowGravity = false;

              const bulletSpeed = 100 + (this.level - 1) * 5;
              bullet.setVelocityY(bulletSpeed);
              bullet.setDepth(5);

              // Inicializa color cíclico
              const colors = [0xff0000, 0xffff00, 0x00ff00]; // rojo, amarillo, Verde
              let colorIndex = 0;
              bullet.setTint(colors[colorIndex]);

              // Crea un temporizador para cambiar el color cada 160ms
              bullet.colorTimer = scene.time.addEvent({
                delay: 250,
                loop: true,
                callback: () => {
                  if (!bullet.active) {
                    bullet.clearTint();
                    bullet.colorTimer.remove();
                    return;
                  }
                  colorIndex = (colorIndex + 1) % colors.length;
                  bullet.setTint(colors[colorIndex]);
                },
              });
            }
          }
        },
      });
    }
  }

  // 🔁 Mueve todos los enemies en grupo
  moveEnemies() {
    const scene = this.scene;
    const enemiesRemaining = scene.enemies.countActive(true);

    if (enemiesRemaining <= 5 && enemiesRemaining > 0) {
      const power = 6.2 - enemiesRemaining;
      scene.enemieSpeed = scene.baseSpeed * Math.pow(2, power);
    } else {
      scene.enemieSpeed = scene.baseSpeed;
    }

    if (scene.shouldMoveDown) {
      scene.enemies.children.iterate((alien) => (alien.y += 10));
      scene.shouldMoveDown = false;
      return;
    }

    let reachedEdge = false;
    scene.enemies.children.iterate((alien) => {
      const nextX = alien.x + scene.enemieSpeed * scene.alienDirection;
      if (nextX >= scene.scale.width - 10 || nextX <= 10) {
        reachedEdge = true;
      }
    });

    if (reachedEdge) {
      scene.alienDirection *= -1;
      scene.shouldMoveDown = true;
      return;
    }

    scene.enemies.children.iterate((alien) => {
      alien.x += scene.enemieSpeed * scene.alienDirection;
    });
  }

  update() {
    if (this.isBossLevel) {
      if (this.scene.bossKilled >= 5) {
        console.log("advance level !! boss killed >= 5");
        this.advanceLevel();
      }
    } else {
      if (this.scene.enemies.countActive(true) === 0 && this.enemiesCreated) {
        console.log("advance level !! No enemies normal, true enemies created");
        this.advanceLevel();
      }
    }
  }

  is_boss_level() {
    return this.isBossLevel;
  }

  advanceLevel() {
    console.log("✅ Nivel completado. Avanzando…");

    this.scene.scene.get("hud").update_level(!this.isBossLevel);
    this.level = this.scene.scene.get("hud").get_level();

    // Aumentar velocidad de la nave (0.10% por nivel)
    const speedIncrement = 0.01 * this.level; // 0.10% = 0.001
    this.scene.player.speedMultiplier = 1 + speedIncrement;

    // Aumentar velocidad del parallax
    this.scene.parallaxLayers.forEach((layer) => {
      layer.speed += 0.05;
    });

    this.enemiesCreated = false;

    // Ir a escena intermedia
    this.scene.scene.launch("announcement", {
      nextLevel: "game",
      isBossLevel: this.level % 2 === 0,
    });

    this.scene.scene.pause("game"); // Pausa el juego temporalmente
  }
}
