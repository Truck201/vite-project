import { Scene } from "phaser";

export class Hud extends Scene {
  constructor() {
    super("hud");
  }

  init(data) {
    this.cameras.main.fadeIn(1200, 0, 0, 0);
    this.points = data.points || 0;
    this.playerHP = data.playerHP || 3;
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

    this.hpText = this.add
      .text(x * 0.8, y * 0.95, `HP: ${this.playerHP}`, {
        fontSize: "8px",
        fontFamily: "'Press Start 2P'",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setDepth(40);
  }

  update_points(points) {
    this.points += points;
    this.points_text.setText(
      `Puntos ${this.points.toString().padStart(2, "0")}`
    );
  }

  getHitPoints() {
    this.playerHP--;
    return this.playerHP;
  }

  update_hp(playerHP) {
    this.hpText.setText(`Hp: ${playerHP}`);

    if (playerHP <= 0) {
      this.scene.pause("game");
      this.add
        .text(this.scale.width / 2, this.scale.height / 2, "💀 GAME OVER 💀", {
          fontSize: "15px",
          fill: "#f00",
        })
        .setOrigin(0.5)
        .setDepth(200);

      this.input.once("pointerdown", () => {
        this.scene.stop("game");
        this.scene.start("Boot");
        location.reload();
      });
    }
  }
}
