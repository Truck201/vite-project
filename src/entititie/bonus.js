export class addBonus {
  constructor(scene) {
    this.scene = scene;
    this.bonusSprite = null;
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
      .setDepth(150);

    this.bonusSprite.setVelocityX(this.speed);
    this.bonusSprite.body.setAllowGravity(false);
    this.bonusSprite.anims.play("flyer", true);

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
  }
}
