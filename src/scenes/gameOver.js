import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("game-over");
  }

  init(data) {
    this.mainScene = data.scene || null;
    this.points = data.points || 0;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const centerX = width / 2;
    const centerY = height / 2;

    if (this.scene.get("game").BonusIdle) {
      this.scene.get("game").BonusIdle.pause();
    }

    this.add
      .text(centerX, centerY - 70, "💀 GAME OVER 💀", {
        fontSize: "18px",
        fill: "#f00",
        fontFamily: "'Press Start 2P'",
      })
      .setOrigin(0.5);

    const recordData = JSON.parse(localStorage.getItem("highScore")) || {
      name: "Non Name",
      score: 0,
    };

    // Si se superó el highscore, mostrar input
    if (this.points > recordData.score) {
      const playerName = prompt("Ingresa tu nombre");

      if (playerName) {
        // Guardar el nuevo récord en localStorage
        recordData.name = playerName;
        recordData.score = this.points;
        localStorage.setItem("highScore", JSON.stringify(recordData));
      }
    }

    this.text1 = this.add
      .text(centerX, centerY, `Name: ${recordData.name}`, {
        fontSize: "14px",
        fill: "#0f0",
        fontFamily: "'Press Start 2P'",
      })
      .setOrigin(0.5)
      .setDepth(45);

    this.text2 = this.add
      .text(centerX, centerY + 20, `HighScore: ${recordData.score}`, {
        fontSize: "14px",
        fill: "#0f0",
        fontFamily: "'Press Start 2P'",
      })
      .setOrigin(0.5)
      .setDepth(45);

    this.text3 = this.add
      .text(centerX, centerY + 80, `Your Record is ${this.points}`, {
        fontSize: "12px",
        fill: "#0f0",
        fontFamily: "'Press Start 2P'",
      })
      .setOrigin(0.5)
      .setDepth(45);

    // Si el usuario hace click en cualquier lado, también reinicia
    this.input.once("pointerdown", () => {
      this.endGame();
    });
  }

  endGame() {
    this.scene.stop(this.mainScene);
    this.scene.stop("game");
    this.scene.stop("game-over");
    this.scene.start("Boot");
    location.reload();
  }
}
