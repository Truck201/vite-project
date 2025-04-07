export class addBonus {
  constructor(scene) {
    this.scene = scene;

    this.create();
  }

  create() {
    this.scene.bonusAlien = null;

    let num = Phaser.Math.FloatBetween(0, 1);
    console.log(num);
    if (num >= 0.5) {
      this.offset = -50;
      this.speed = 100;
    }
    if (num < 0.5) {
      this.offset = this.scene.scale.width + 50;
      this.speed = -100;
    }

    const y = 20;

    this.scene.bonusAlien = this.scene.physics.add
      .sprite(this.offset, y, "bonusFlyer")
      .setScale(1)
      .setDepth(150);

    this.scene.bonusAlien.setVelocityX(this.speed);
    this.scene.bonusAlien.body.setAllowGravity(false);

    this.scene.bonusAlien.anims.play("flyer", true);

    this.scene.physics.add.overlap(
      this.scene.bullets,
      this.scene.bonusAlien,
      this.scene.hitBonusAlien,
      null,
      this.scene
    );
  }
}
