export function Addenemies(scene, x, y, tipo = "skull") {
  // Crear el grupo si no existe
  if (!scene.enemies) {
    scene.enemies = scene.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
  }

  if (scene.shouldMoveDown === undefined) {
    scene.shouldMoveDown = false;
  }

  if (scene.baseSpeed === undefined) {
    scene.baseSpeed = 0.5;
    scene.enemieSpeed = scene.baseSpeed;
  }

  const columns = 7;
  const spacingX = 16;
  const spacingY = 14;
  const startX = x * 0.165;

  // Posición base de los skulls
  let startY = y * 0.5;

  // Ajustar la posición vertical según el tipo
  if (tipo === "octopus") {
    startY -= spacingY * 2;
  } else if (tipo === "marciano") {
    startY += spacingY * 2;
  }

  for (let i = 0; i < 14; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    const posX = startX + col * spacingX;
    const posY = startY + row * spacingY;

    const alien = scene.enemies
      .create(posX, posY, tipo)
      .setDepth(20)
      .setOrigin(0.5)
      .setCollideWorldBounds(true);

    alien.body.setImmovable(true);
    alien.body.allowGravity = false;

    alien.anims.play(tipo + "er", true); // anima: skuller, octopuser, marcianoer
  }

  // Variables de movimiento si no existen
  if (scene.alienDirection === undefined) {
    scene.alienDirection = 1;
    scene.enemieSpeed = 10;

    scene.moveTimer = scene.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => moveenemies(scene),
    });
  }
}

// 🔁 Mueve todos los enemies en grupo
function moveenemies(scene) {
  const enemiesRemaining = scene.enemies.countActive(true);

  // Ajustar velocidad dinámicamente
  if (enemiesRemaining <= 5 && enemiesRemaining > 0) {
    const power = 6.2 - enemiesRemaining;
    scene.enemieSpeed = scene.baseSpeed * Math.pow(2, power);
  } else {
    scene.enemieSpeed = scene.baseSpeed; // velocidad normal si hay más de 5
  }

  if (scene.shouldMoveDown) {
    scene.enemies.children.iterate((alien) => {
      if (!alien) return;
      alien.y += 10;
    });
    scene.shouldMoveDown = false;
    return;
  }

  let reachedEdge = false;

  scene.enemies.children.iterate((alien) => {
    if (!alien) return;
    const nextX = alien.x + scene.enemieSpeed * scene.alienDirection;
    if (nextX >= scene.scale.width - 10 || nextX <= 10) {
      reachedEdge = true;
    }
  });

  if (reachedEdge) {
    // Cambia dirección y marca que deben bajar en el próximo paso
    scene.alienDirection *= -1;
    scene.shouldMoveDown = true;
    return; // No mover horizontalmente en este ciclo
  }

  // Movimiento horizontal normal
  scene.enemies.children.iterate((alien) => {
    if (!alien) return;
    alien.x += scene.enemieSpeed * scene.alienDirection;
  });
}

export function setupEnemyBullets(scene) {
  scene.enemyBullets = scene.physics.add.group({
    classType: Phaser.Physics.Arcade.Image,
    runChildUpdate: true,
  });

  // Disparo cada cierto tiempo
  scene.time.addEvent({
    delay: Phaser.Math.Between(750, 1400), // intenta disparar random
    loop: true,
    callback: () => {
      const shooters = scene.enemies.getChildren().filter((e) => e.active);
      if (shooters.length === 0) return;

      // Elegir un enemigo aleatorio para disparar
      const shooter = Phaser.Utils.Array.GetRandom(shooters);
      const bullet = scene.enemyBullets.get(shooter.x, shooter.y + 8, "bullet"); // usa tu sprite de bala
      if (bullet) {
        bullet.setActive(true).setVisible(true);
        bullet.body.allowGravity = false;
        bullet.setVelocityY(120); // velocidad hacia abajo
        bullet.setDepth(5).setScale(0.74);
      }
    },
  });
}
