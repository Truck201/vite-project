import { Scene } from "phaser";

export class Preload extends Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.image("asteroid", "/assets/background/parallax/asteroids-1.png");

    this.load.image("background", "/assets/background/parallax/stars-1.png");

    this.load.spritesheet(
      "obstacle",
      "/assets/player/spritesheet/obstaculo.png",
      {
        frameWidth: 28,
        frameHeight: 14,
      }
    );

    this.load.image("bullet", "/assets/player/sprites/bullet.png");

    this.load.image("explosion", "/assets/Invasors/sprites/explosion.png");

    this.load.spritesheet(
      "ship",
      "/assets/player/spritesheet/player-move.png",
      {
        frameWidth: 17,
        frameHeight: 17,
      }
    );

    this.load.spritesheet(
      "shipIdle",
      "/assets/player/spritesheet/player-idle.png",
      {
        frameWidth: 17,
        frameHeight: 17,
      }
    );

    this.load.image("flar", "/assets/player/sprites/flare-1.png");

    this.load.spritesheet("flares", "/assets/player/spritesheet/flare.png", {
      frameWidth: 11,
      frameHeight: 6,
    });

    // Invasors
    this.load.spritesheet(
      "skull",
      "/assets/Invasors/spritesheet/calavera.png",
      {
        frameWidth: 14,
        frameHeight: 10,
      }
    );

    this.load.spritesheet(
      "marciano",
      "/assets/Invasors/spritesheet/marciano.png",
      {
        frameWidth: 13,
        frameHeight: 10,
      }
    );

    this.load.spritesheet("octopus", "/assets/Invasors/spritesheet/pulpo.png", {
      frameWidth: 10,
      frameHeight: 10,
    });

    this.load.spritesheet(
      "bonusFlyer",
      "/assets/Invasors/spritesheet/nave.png",
      {
        frameWidth: 18,
        frameHeight: 9,
      }
    );

    // Boss

    this.load.image("boss", "/assets/Invasors/sprites/boss.png");

    this.load.spritesheet(
      "bossIdle",
      "/assets/Invasors/spritesheet/boss-idle.png",
      {
        frameWidth: 32,
        frameHeight: 18,
      }
    );

    // shoot
    this.load.image("ballsprite", "/assets/Invasors/sprites/boss-ball.png");

    this.load.spritesheet(
      "ball-anim",
      "/assets/Invasors/spritesheet/boss-ball.png",
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
