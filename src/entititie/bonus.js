export class addBonus {
  constructor(scene) {
    this.scene = scene;
    this.bonusSprite = null;
    this.colorIndex = 0;
    this.colorTimer = null;
    this.colors = [0xff0000, 0xffff00, 0x00ff00]; // rojo, amarillo, verde

    this.create();
  }

  create() {
    let num = Phaser.Math.FloatBetween(0, 1);

    if (num >= 0.5) {
      this.offset = -50;
      this.speed = 100;
    }
    if (num < 0.5) {
      this.offset = this.scene.scale.width + 50;
      this.speed = -100;
    }

    const y = 20;

    this.bonusSprite = this.scene.physics.add
      .sprite(this.offset, y, "bonusFlyer")
      .setScale(1)
      .setDepth(25);

    this.bonusSprite.setVelocityX(this.speed);
    this.bonusSprite.body.setAllowGravity(false);
    this.bonusSprite.anims.play("flyer", true);

    // Verificar si la escena 'announcement' está activa
    if (
      !this.scene.scene.isActive("announcement") ||
      !this.scene.scene.isActive("game-over")
    ) {
      this.scene.BonusIdle.play();
    } else {
      // Si ya está activa, pausar por si estuviera sonando
      this.scene.BonusIdle.pause();
    }

    // 🟡 Timer para cambiar el color cada 160ms
    this.colorTimer = this.scene.time.addEvent({
      delay: 550,
      loop: true,
      callback: () => {
        if (!this.bonusSprite || !this.bonusSprite.active) return;
        this.bonusSprite.setTint(this.colors[this.colorIndex]);
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
      },
    });

    if (!this.bonusSprite || !this.scene.bullets) {
      console.error("BonusSprite or Bullets undefined at overlap creation");
      return;
    }

    this.scene.physics.add.overlap(
      this.scene.bullets,
      this.bonusSprite,
      this.hitBonusSprite,
      null,
      this
    );
  }

  isAlive() {
    return this.bonusSprite && this.bonusSprite.active;
  }

  hitBonusSprite(bullet, bonus) {
    if (!bullet || !bonus) {
      console.error("Bullet or Bonus is undefined");
      return;
    }

    bonus.destroy();
    bullet.destroy();

    // 🔴 Limpiar el timer de colores si existe
    if (this.colorTimer) {
      this.colorTimer.remove(false);
    }

    let explotion = this.scene.add
      .sprite(bonus.x, bonus.y, "explosion")
      .setDepth(20)
      .setScale(2);

    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        explotion.destroy();
      },
    });

    // Mostrar texto de puntos
    const text = this.scene.add
      .text(bonus.x, bonus.y, "+500", {
        fontSize: "16px",
        fill: "#ffff00",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      y: bonus.y - 40,
      alpha: 0,
      duration: 800,
      ease: "Power2",
      onComplete: () => text.destroy(),
    });

    this.scene.scene.get("hud").update_points(500);

    // Sounds
    this.scene.BonusIdle.stop();
    this.scene.BonusHit.play();
    this.scene.BonusDead.play();
  }

  muteBonus() {
    if (this.scene.BonusIdle) {
      this.scene.BonusIdle.stop();
    }
  }
}
