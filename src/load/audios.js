export function Sounds(scene) {
  const audioFiles = [
    // Bonus
    { key: "bonus_idle_1", path: "bonus/navegando" },
    { key: "bonus_idle_2", path: "bonus/navegando2" },
    { key: "bonus_hit", path: "bonus/hit" },
    { key: "bonus_dead", path: "bonus/bolpe" },

    // Player
    { key: "bullet_1", path: "player/bullet" },
    { key: "bullet_2", path: "player/bullet2" },
    { key: "player_dead", path: "player/explosion" },
    { key: "player_hit", path: "player/isHit" },

    // Enemy
    { key: "enemy_move_1", path: "enemy/move1" },
    { key: "enemy_move_2", path: "enemy/move2" },
    { key: "enemy_move_3", path: "enemy/move3" },
    { key: "enemy_move_4", path: "enemy/move4" },
    { key: "enemy_dead", path: "enemy/dead" },
    { key: "enemy_hit", path: "enemy/ishit" },

    // Boss
    { key: "boss_appear_1", path: "boss/appear" },
    { key: "boss_appear_2", path: "boss/appear2" },
    { key: "boss_damage", path: "boss/damage" },
    { key: "boss_dead_1", path: "boss/dead" },
    { key: "boss_dead_2", path: "boss/dead2" },
    { key: "boss_move", path: "boss/move" },
    { key: "boss_bullet", path: "boss/shoot" },
  ];

  audioFiles.forEach(({ key, path }) => {
    // Carga con compatibilidad
    scene.load.audio(key, [`/assets/audio/${path}.wav`]);
  });

  // Manejo de errores de carga de audio
  scene.load.on("fileerror", (file) => {
    console.error(`Error loading file: ${file.src}`);
  });
}
