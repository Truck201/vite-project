import { Scene } from "phaser";

export class Preload extends Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.image(
      "asteroid",
      "../public/assets/background/parallax/asteroids-1.png"
    );

    this.load.image(
      "background",
      "../public/assets/background/parallax/stars-1.png"
    );

    this.load.spritesheet(
      "obstacle",
      "../public/assets/player/spritesheet/obstaculo.png",
      {
        frameWidth: 28,
        frameHeight: 14,
      }
    );

    this.load.image("bullet", "../public/assets/player/sprites/bullet.png");

    this.load.image(
      "explosion",
      "../public/assets/Invasors/sprites/explosion.png"
    );

    this.load.spritesheet(
      "ship",
      "../public/assets/player/spritesheet/player-move.png",
      {
        frameWidth: 17,
        frameHeight: 17,
      }
    );

    this.load.spritesheet(
      "shipIdle",
      "../public/assets/player/spritesheet/player-idle.png",
      {
        frameWidth: 17,
        frameHeight: 17,
      }
    );

    this.load.image("flar", "../public/assets/player/sprites/flare-1.png");

    this.load.spritesheet(
      "flares",
      "../public/assets/player/spritesheet/flare.png",
      {
        frameWidth: 11,
        frameHeight: 6,
      }
    );

    // Invasors
    this.load.spritesheet(
      "skull",
      "../public/assets/Invasors/spritesheet/calavera.png",
      {
        frameWidth: 14,
        frameHeight: 10,
      }
    );

    this.load.spritesheet(
      "marciano",
      "../public/assets/Invasors/spritesheet/marciano.png",
      {
        frameWidth: 13,
        frameHeight: 10,
      }
    );

    this.load.spritesheet(
      "octopus",
      "../public/assets/Invasors/spritesheet/pulpo.png",
      {
        frameWidth: 10,
        frameHeight: 10,
      }
    );

    this.load.spritesheet(
      "bonusFlyer",
      "../public/assets/Invasors/spritesheet/nave.png",
      {
        frameWidth: 18,
        frameHeight: 9,
      }
    );

    // Boss

    this.load.image("boss", "../public/assets/Invasors/sprites/boss.png");

    this.load.spritesheet(
      "bossIdle",
      "../public/assets/Invasors/spritesheet/boss-idle.png",
      {
        frameWidth: 32,
        frameHeight: 18,
      }
    );

    // shoot
    this.load.image(
      "ballsprite",
      "../public/assets/Invasors/sprites/boss-ball.png"
    );

    this.load.spritesheet(
      "ball-anim",
      "../public/assets/Invasors/spritesheet/boss-ball.png",
      {
        frameWidth: 16,
        frameHeight: 14,
      }
    );
  }

  create() {
    this.scene.start("main-menu");
  }
}
