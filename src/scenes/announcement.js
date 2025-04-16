import { Scene } from "phaser";
import { AnimsAnnucement } from "../load/anims-annunce";

export class Announcement extends Scene {
  constructor() {
    super("announcement");
  }

  init(data) {
    this.nextLevel = data.nextLevel;
    this.isBossLevel = data.isBossLevel;
    this.cameras.main.fadeIn(1200, 0, 0, 0);
  }

  create() {
    const { width, height } = this.scale;

    this.back = this.add
      .sprite(width * 0.5, height * 0.5, "layer1")
      .setAlpha(1);

    AnimsAnnucement(this);
    // Elegimos la animación según si es un nivel de jefe o no
    const animationKey = this.isBossLevel ? "announcement1" : "announcement2";

    // Creamos el sprite en el centro
    const animSprite = this.add.sprite(width / 2, height / 2, ""); // Usa el atlas o sprite adecuado
    animSprite.play(animationKey);

    // Cuando termine la animación:
    animSprite.on("animationcomplete", () => {
      this.time.delayedCall(200, () => {
        this.back.setAlpha(0);
        this.scene.resume(this.nextLevel);
        this.scene.get("game").enemyManager.startLevel();
      });
    });
  }
}
