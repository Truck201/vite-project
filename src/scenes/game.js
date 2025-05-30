import { Scene } from "phaser";
import { initialAnimations } from "../load/anims";
import { Player } from "../entititie/player";
import { EnemyManager } from "../entititie/EnemyManager";
import { addBonus } from "../entititie/bonus";
import { InputManager } from "../component/imputManager";
import { addSounds } from "../load/importAudio";

export class Game extends Scene {
  constructor() {
    super("game");
  }

  points = 0;
  game_over_timeout;
  time_event;

  init(data) {
    this.points = data.points || 0;
  }

  create() {
    initialAnimations(this);
    addSounds(this);

    // Sounds
    this.activeSounds = [];

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

    this.inputManager = new InputManager(this);
    this.inputManager.setup();

    // añadimos Player
    this.player = new Player(this);

    // Hud
    this.scene.launch("hud", {
      points: this.points,
      playerHP: this.player.playerHP,
    });

    // añadimos Enemigos
    this.enemyManager = new EnemyManager(this);

    // Solo iniciar si no fue creado antes (por reanudación desde announcement)
    if (!this.enemyManager.enemiesCreated) {
      console.log("Paso por aquí?");
      this.enemyManager.startLevel();
    }

    this.player.createBulletSystem(this);

    // Añadir bonus
    this.time.addEvent({
      delay: Phaser.Math.Between(7000, 12000),
      loop: true,
      callback: () => {
        if (!this.bonus || !this.bonus.isAlive()) {
          this.bonus = new addBonus(this);
        }
      },
    });

    // Balas enemigas vs player
    this.physics.add.overlap(
      this.enemyBullets, // Grupo de balas enemigas
      this.player.player, // Sprite del jugador
      this.player.handlePlayerHit.bind(this.player), // Método de colisión
      null,
      this // Contexto de la escena
    );

    // Enemigos vs player
    this.physics.add.overlap(
      this.enemies,
      this.player.player,
      this.player.handlePlayerHit.bind(this.player),
      null,
      this
    );
  }

  update() {
    // Joysticks?
    this.inputManager.update(); // actualiza estado del joystick

    const movement = this.inputManager.getMovement();
    const isShooting = this.inputManager.isShooting();

    if (this.inputManager.pad) {
      this.player.playerMove(movement.x * 88); // joystick
      if (isShooting) {
        this.player.fireShoot(this, this.time.now);
      }
    } else {
      this.player.playerMove(88); // teclado
    }

    // Config Default
    this.moveParallax();
    this.player.playerMove(88);
    this.player.update();
    this.player.updateBullets(this, this.time.now);

    this.enemyManager.update();

    if (
      this.bonus &&
      this.bonus.isAlive() &&
      (this.bonus.bonusSprite.x > this.scale.width + 80 ||
        this.bonus.bonusSprite.x < -80)
    ) {
      this.bonus.bonusSprite.destroy();
      this.BonusIdle.stop();
    }
  }

  moveParallax() {
    this.parallaxLayers.forEach((layer) => {
      layer.sprite.tilePositionY -= layer.speed;
    });
  }

  pauseAllSounds() {
    console.log("NNO ---> ");
    if (!this.activeSounds) return;
    console.log("si o no? ---> ");
    this.activeSounds.forEach((sound) => {
      console.log(`sound ?? --> ${sound}`);
      if (sound.isPlaying) {
        console.log(`sound playing--> ${sound}`);
        sound.pause();
      }
    });
  }

  resumeAllSounds() {
    if (!this.activeSounds) return;
    this.activeSounds.forEach((sound) => {
      if (sound.isPaused) {
        sound.resume();
      }
    });
  }

  stopAllSounds() {
    if (!this.activeSounds) return;
    this.activeSounds.forEach((sound) => {
      if (sound.isPlaying || sound.isPaused) {
        sound.stop();
      }
    });
  }
}
