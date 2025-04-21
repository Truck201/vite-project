import { Scene } from "phaser";

export class Hud extends Scene {
  level = 0;
  constructor() {
    super("hud");
  }

  init(data) {
    this.cameras.main.fadeIn(1200, 0, 0, 0);
    this.points = data.points || 0;
    this.playerHP = data.playerHP || 3;
    this.arrayHP = [];
  }

  preload() {}

  create() {
    const x = this.scale.width;
    const y = this.scale.height;

    this.points_text = this.add
      .text(
        x * 0.23,
        y * 0.06,
        `Puntos ${this.points.toString().padStart(2, "0")}`,
        {
          fontSize: "6px",
          fontFamily: "'Press Start 2P'",
          color: "#fff",
        }
      )
      .setOrigin(0.5)
      .setDepth(10);

    const HpStepsX = 18;
    let positionHP = x * 0.2;

    for (let i = 0; i < this.playerHP; i++) {
      this.arrayHP.push(
        this.add.sprite(positionHP, y * 0.95, "ship-sprite").setDepth(20)
      );
      positionHP += HpStepsX;
    }

    this.levelText = this.add
      .text(x * 0.85, y * 0.08, `Level 1`, {
        fontSize: "12px",
        fontFamily: "'Press Start 2P'",
        fill: "#00f",
      })
      .setOrigin(0.5)
      .setDepth(20);

    this.tweens.add({
      targets: this.levelText,
      alpha: 0,
      duration: 1500,
      ease: "Power2",
      delay: 1500,
      onComplete: () => {
        this.levelText.setAlpha(0); // Lo "oculta" pero no lo destruye
      },
    });
  }

  update_points(points) {
    this.points += points;
    this.points_text.setText(
      `Puntos ${this.points.toString().padStart(2, "0")}`
    );
  }

  get_level() {
    return this.level;
  }

  damage_player() {
    this.playerHP--;
    return this.playerHP;
  }

  player_hp() {
    return this.playerHP;
  }

  update_hp(playerHP) {
    if (playerHP >= 0) {
      const life = this.arrayHP.pop();
      life.destroy();
    }

    if (playerHP <= 0) {
      const gameScene = this.scene.get("game"); // Accede a la escena principal

      // Pausa físicas
      gameScene.physics.pause();
      gameScene.player.destroy_player(gameScene);

      this.points_text.destroy();

      if (gameScene.moveTimer?.destroy) {
        gameScene.moveTimer.destroy();
      }

      if (gameScene.enemyManager.timerEnemyAttack?.destroy) {
        gameScene.enemyManager.timerEnemyAttack.destroy();
      }

      if (gameScene.enemyManager.bossTimer?.destroy) {
        gameScene.enemyManager.bossTimer.destroy();
      }

      if (gameScene.BonusIdle) {
        gameScene.BonusIdle.stop();
      }

      if (gameScene.BonusIdle) {
        gameScene.BonusIdle.stop();
      }

      if (gameScene.alienSounds) {
        gameScene.alienSounds = [];
      }

      // ✅ Detener los timers de disparo de cada boss
      if (gameScene.bossGroup?.remove) {
        gameScene.bossGroup.getChildren().forEach((boss) => {
          if (boss.shootTimer) {
            boss.shootTimer.remove();
            boss.shootTimer = null;
          }
        });
      }

      this.time.delayedCall(900, () => {
        this.scene.launch("game-over", { points: this.points });
      });
    }
  }

  update_level(isBossLevel) {
    console.log(`Level actual ${this.level}`);
    this.level++;

    if (this.levelText) {
      this.levelText.setAlpha(1); // Reinicia visibilidads

      if (isBossLevel) {
        this.levelText.setText("¡Jefe!");
      } else if (!isBossLevel) {
        this.levelText.setText(`Nivel ${this.level}`);
      }
      // Animación de aparición del nuevo nivel

      this.tweens.add({
        targets: this.levelText,
        alpha: 0,
        duration: 1500,
        ease: "Power2",
        delay: 1500,
        onComplete: () => {
          this.levelText.setAlpha(0); // Lo "oculta" pero no lo destruye
        },
      });
    }
  }
}
