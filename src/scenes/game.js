import { Scene } from "phaser";
import { initialAnimations } from "../load/anims";
import { Addenemies, setupEnemyBullets } from "../load/aliens";
import { createBulletSystem, updateBullets } from "../entititie/bullet";
import { addBonus } from "../load/bonus";
import { spawnBoss } from "../load/boss";

export class Game extends Scene {
  constructor() {
    super("game");
  }

  points = 0;
  game_over_timeout;
  time_event;
  playerIsMoving = false;
  currentDirection = null;
  playerHP = 3;
  hasWon = false;

  init(data) {
    //Points
    this.points = data.points || 0;
    this.game_over_timeout = 40;

    this.scene.launch("hud", {
      points: this.points,
      playerHP: this.playerHP,
    });
  }

  create() {
    const x = this.scale.width;
    const y = this.scale.height;

    this.currentLevel = 1;
    this.isBossLevel = false;

    initialAnimations(this);

    // Añadir bonus
    this.time.addEvent({
      delay: Phaser.Math.Between(7000, 13000),
      loop: true,
      callback: () => {
        this.bonus = new addBonus(this);
      },
    });

    // fondo
    this.asteroids = this.add
      .tileSprite(
        this.game.config.width * 0.5,
        this.game.config.height * 0.5,
        0,
        0,
        "asteroid"
      )
      .setDepth(1);

    this.stars = this.add
      .tileSprite(
        this.game.config.width * 0.5,
        this.game.config.height * 0.5,
        0,
        0,
        "background"
      )
      .setDepth(0);

    this.parallaxLayers = [
      {
        speed: 1.3,
        sprite: this.asteroids,
      },
      {
        speed: 0.23,
        sprite: this.stars,
      },
    ];

    // add player
    this.player = this.physics.add
      .sprite(x * 0.5, y * 0.82, "ship")
      .setOffset(0.5);

    this.player.body.setAllowGravity(false);

    this.player.setCollideWorldBounds(true).setDepth(8);

    this.player.anims.play("idle", true);

    this.flares = this.add.sprite(this.player.x, 180, "flar");
    this.physics.add.existing(this.flares);
    this.flares.setImmovable;
    this.flares.setOrigin(0.5);
    this.flares.body.allowGravity = false;
    this.flares.play("flaires", true);

    this.startLevel(1);

    if (this.enemyBullets && this.player) {
      this.physics.add.overlap(
        this.enemyBullets,
        this.player,
        this.handlePlayerHit,
        null,
        this
      );
    }

    if (this.enemies && this.player) {
      this.physics.add.overlap(
        this.enemies,
        this.player,
        this.handlePlayerHit,
        null,
        this
      );
    }

    //Agregar los cursores
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.moveParallax();
    this.playerMove(88);
    updateBullets(this, this.time.now);

    if (
      (this.bonusAlien && this.bonusAlien.x > this.scale.width + 80) ||
      (this.bonusAlien && this.bonusAlien.x < -80)
    ) {
      this.bonusAlien.destroy();
      this.bonusAlien = null;
    }
    if (this.flares) {
      this.flares.x = this.player.x;
      this.flares.y = this.player.y + 10.5; // ajustá el valor si necesitás que esté debajo
    }

    if (
      !this.isBossLevel &&
      this.enemies &&
      this.enemies.countActive(true) === 0
    ) {
      this.time.delayedCall(1000, () => {
        this.startLevel(this.currentLevel + 1);
      });
    }
  }

  hitBonusAlien(bullet, bonus) {
    bullet.destroy();
    bonus.destroy();

    let explotion = this.add
      .sprite(bonus.x, bonus.y, "explosion")
      .setDepth(20)
      .setScale(2);

    this.time.addEvent({
      delay: 100,
      callback: () => {
        explotion.destroy();
      },
    });

    // Mostrar texto de puntos
    const text = this.add
      .text(bonus.x, bonus.y, "+500", {
        fontSize: "16px",
        fill: "#ffff00",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: bonus.y - 40,
      alpha: 0,
      duration: 800,
      ease: "Power2",
      onComplete: () => text.destroy(),
    });

    this.scene.get("hud").update_points(500);
  }

  startLevel(level) {
    this.currentLevel = level;
    this.isBossLevel = level % 2 === 0; // Nivel par → jefe

    if (this.enemies) {
      this.enemies.clear(true, true);
    }

    if (this.boss) {
      this.boss.destroy();
      this.boss = null;
    }

    if (this.enemyBullets) {
      this.enemyBullets.clear(true, true);
    }

    if (this.isBossLevel) {
      spawnBoss(this);
    } else {
      const x = this.scale.width * 0.5;
      const y = this.scale.height * 0.5;

      Addenemies(this, x, y, "skull");
      Addenemies(this, x, y, "octopus");
      Addenemies(this, x, y, "marciano");

      createBulletSystem(this);
      setupEnemyBullets(this);
    }
  }

  playerMove(speed) {
    if (this.cursor.left.isDown && this.currentDirection !== "left") {
      this.player.body.setVelocityX(-speed);

      if (!this.playerIsMoving) {
        this.player.anims.play("left", true);
        this.playerIsMoving = true;
        this.currentDirection = "left";
      }
    } else if (this.cursor.right.isDown && this.currentDirection !== "right") {
      this.player.body.setVelocityX(+speed);

      if (!this.playerIsMoving) {
        this.player.anims.play("right", true);
        this.playerIsMoving = true;
        this.currentDirection = "right";
      }
    } else if (!this.cursor.left.isDown && !this.cursor.right.isDown) {
      this.player.body.setVelocityX(0);

      if (this.player.anims.getName() !== "idle") {
        this.player.anims.play("idle", true);
        this.currentDirection = null;
        this.playerIsMoving = false;
      }
    }
  }

  handlePlayerHit(player, bullet) {
    bullet.destroy();

    let healt = this.scene.get("hud").getHitPoints();
    this.scene.get("hud").update_hp(healt);

    // Efecto de daño visual
    this.tweens.add({
      targets: this.player,
      alpha: 0.3,
      yoyo: true,
      duration: 100,
      repeat: 3,
      onComplete: () => {
        this.player.setAlpha(1);
      },
    });
  }

  moveParallax() {
    this.parallaxLayers.forEach((layer) => {
      layer.sprite.tilePositionY -= layer.speed;
    });
  }
}
