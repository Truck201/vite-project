import { Boot } from "./load/boot";
import { Preload } from "./load/preload";
import { Game } from "./scenes/game";
import { Hud } from "./scenes/hud";
import { MainMenu } from "./scenes/menu";
import { Announcement } from "./scenes/announcement";
import { GameOver } from "./scenes/gameOver";

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
  input: {
    gamepad: true,
  },
  backgroundColor: "#000000", // 000000  o Negro o Gris  212121
  scene: [Boot, Preload, MainMenu, Game, GameOver, Hud, Announcement],
};

// Create one display
export default new Phaser.Game(config);
