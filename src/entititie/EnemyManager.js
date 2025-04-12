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

    const columns = 7; // const columns = 7;
    const spacingX = 28; // const spacingX = 16;
    const spacingY = 26; // const spacingY = 14;
    const startX = width * 0.15; // const startX = x * 0.165;

    const rows = [
      { type: "octopus", offset: -1 },
      { type: "skull", offset: 0 },
      { type: "skull", offset: 1 },
      { type: "marciano", offset: 2 },
    ];

    for (let col = 0; col < columns; col++) {
      rows.forEach((row, rowIndex) => {
        const x = startX + col * spacingX;
        const y = height * 0.22 + row.offset * spacingY;

        const alien = this.scene.enemies
          .create(x, y, row.type)
          .setDepth(20)
          .setOrigin(0.5)
          .setCollideWorldBounds(true);

        alien.body.setImmovable(true);
        alien.body.allowGravity = false;
        alien.anims.play(row.type + "er", true); // Asegúrate de tener "skuller", "octopuser", "marcianoer"
      });
    }
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
          const bullet = scene.enemyBullets.get(
            shooter.x,
            shooter.y + 8,
            "bullet"
          );
          if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.body.allowGravity = false;
            bullet.setVelocityY(120);
            bullet.setDepth(5).setScale(0.74);
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
        this.advanceLevel();
      }
    } else {
      if (this.scene.enemies.countActive(true) === 0 && this.enemiesCreated) {
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

    this.enemiesCreated = false;
    this.startLevel();
  }
}
