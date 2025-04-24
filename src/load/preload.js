import { Scene } from "phaser";
import { StarterAnims } from "./startAnims";
import { Sounds } from "./audios";
export class Preload extends Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // Sounds
    Sounds(this);
    // Menu
    this.load.image("layer0", "/assets/background/backLayer.png");
    this.load.image("layer1", "/assets/background/backLayerBlack.png");

    this.load.image("portada", "/assets/menu/portada.png");
    this.load.spritesheet("starter", "/assets/menu/starter.png", {
      frameWidth: 288,
      frameHeight: 240,
    });

    // background
    this.load.image("asteroid", "/assets/background/parallax/asteroids-1.png");
    this.load.image("asteroid2", "/assets/background/parallax/asteroids-2.png");
    this.load.image("background", "/assets/background/parallax/stars-1.png");

    this.load.image("bullet", "/assets/player/sprites/bullet.png");
    this.load.image("bulletFinal", "/assets/player/sprites/bullet-final.png");
    this.load.image("EnemyBullet", "/assets/Invasors/sprites/Enemybullet.png");
    this.load.image("explosion", "/assets/Invasors/sprites/explosion.png");

    // player
    this.load.image("ship-sprite", "/assets/player/sprites/idle.png");

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

    this.load.spritesheet(
      "explotion",
      "/assets/player/spritesheet/explotion.png",
      {
        frameWidth: 20,
        frameHeight: 20,
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

    this.load.image("boss", "/assets/Invasors/sprites/nave-martian.png");

    this.load.spritesheet(
      "bossIdle",
      "/assets/Invasors/spritesheet/nave-idle-martian.png",
      {
        frameWidth: 20,
        frameHeight: 12,
      }
    );

    this.load.image("ballsprite", "/assets/Invasors/sprites/boss-ball.png");

    this.load.spritesheet(
      "ball-anim",
      "/assets/Invasors/spritesheet/boss-ball.png",
      {
        frameWidth: 16,
        frameHeight: 14,
      }
    );

    // Standing Boss
    this.load.image(
      "standing_boss",
      "/assets/Invasors/sprites/boss-martian-1.png"
    );

    this.load.spritesheet(
      "standing_boss_idle",
      "/assets/Invasors/spritesheet/boss-idle-martian.png",
      {
        frameWidth: 44,
        frameHeight: 44,
      }
    );

    this.load.image("raySprite", "/assets/Invasors/sprites/boss-ball.png");

    this.load.spritesheet(
      "raySprite-anim",
      "/assets/Invasors/spritesheet/boss-ray-idle.png",
      {
        frameWidth: 16,
        frameHeight: 14,
      }
    );

    // Annuncement
    this.load.spritesheet("annunceBoss", "/assets/annucement/anim-sos.png", {
      frameWidth: 288,
      frameHeight: 240,
    });

    this.load.spritesheet("annunceNormal", "/assets/annucement/anim-sos2.png", {
      frameWidth: 288,
      frameHeight: 240,
    });
  }

  create() {
    // Configuración de animaciones
    StarterAnims(this);

    this.add
      .sprite(this.scale.width * 0.5, this.scale.height * 0.5, "layer1")
      .setDepth(1);
    // Configuración de sprite inicial
    this.starterAnim = this.add
      .sprite(this.scale.width * 0.5, this.scale.height * 0.5, "starter")
      .setDepth(10);

    this.starterAnim.play("StartGame", true);

    // Evento cuando la animación termina
    this.starterAnim.on("animationcomplete", () => {
      // Parpadeo cada 200ms
      let elapsedTime = 0;
      const blinkTimer = this.time.addEvent({
        delay: 200, // Cada 200ms
        loop: true, // Hacer que sea continuo
        callback: () => {
          // Alterna entre alpha 0 y 1
          this.starterAnim.alpha = this.starterAnim.alpha === 1 ? 0 : 1;
          elapsedTime += 200;

          // Si ha pasado el tiempo límite (1200ms), detener el parpadeo y cambiar de escena
          if (elapsedTime >= 1400) {
            blinkTimer.remove(); // Detener el parpadeo
            this.cameras.main.fadeOut(700, 0, 0, 0, () => {
              this.scene.start("main-menu");
            });
          }
        },
      });
    });
  }
}
