import { Boot } from "./load/boot";
import { Preload } from "./load/preload";
import { Game } from "./scenes/game";
import { Hud } from "./scenes/hud";
import { MainMenu } from "./scenes/menu";

const config = {
  type: Phaser.AUTO,
  width: 288,
  height: 240,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  backgroundColor: "#262626", // 000000  o Negro o Gris
  scene: [Boot, Preload, MainMenu, Game, Hud],
};

// Create one display
export default new Phaser.Game(config);
