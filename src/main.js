import { Boot } from "./load/boot";
import { Preload } from "./load/preload";
import { Game } from "./scenes/game";
import { Hud } from "./scenes/hud";

const config = {
  type: Phaser.AUTO,
  width: 160,
  height: 206,

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
  scene: [Boot, Preload, Game, Hud],
};

// Create one display
export default new Phaser.Game(config);
