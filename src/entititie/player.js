export class Player {
  playerIsMoving = false;
  currentDirection = null;

  constructor(scene, inputManager) {
    this.scene = scene;
    this.inputManager = inputManager;
    const x = this.scene.scale.width;
    const y = this.scene.scale.height;

    this.isDestroyed = false;

    // add player
    this.player = this.scene.physics.add
      .sprite(x * 0.5, y * 0.82, "ship-sprite")
      .setAlpha(1);

    this.player.body.setAllowGravity(false);
    this.player.body.setSize(this.player.width * 0.3, this.player.height * 0.9);
    this.player.setCollideWorldBounds(true).setDepth(8);

    // vidas
    this.playerHP = 3;
    this.player.anims.play("idle", true);

    // Velocidad Multiplicada
    this.speedMultiplier = 1;

    // Flares
    this.flares = this.scene.physics.add
      .sprite(this.player.x, 180, "flar")
      .setAlpha(1);
    this.flares.setImmovable;
    this.flares.setOrigin(0.5);
    this.flares.body.allowGravity = false;
    this.flares.play("flaires", true);

    this.cursor = this.scene.input.keyboard.createCursorKeys();
  }

  playerMove(speed) {
    if (this.isDestroyed) return;

    const finalSpeed = speed * this.speedMultiplier;
    let moveX = 0;

    // Prioridad al gamepad
    if (this.inputManager && this.inputManager.pad) {
      const gamepadMove = this.inputManager.getMovement();
      // moveX = gamepadMove.x;
      if (gamepadMove.x < 0) moveX = -1;
      else if (gamepadMove.x > 0) moveX = 1;
      console.log(moveX);
    } else {
      // Fallback a teclado
      if (this.cursor.left.isDown) moveX = -1;
      else if (this.cursor.right.isDown) moveX = 1;
    }

    this.player.body.setVelocityX(moveX * finalSpeed);
    let moveSpeed = finalSpeed * moveX;
    console.log(`Total moveSpeed = ${moveSpeed}`);
    console.log(`FinalSpeed = ${finalSpeed}, MoveX = ${moveX}`);

    // Animaciones
    if (moveX < -0.1 && this.currentDirection !== "left") {
      this.player.anims.play("left", true);
      this.playerIsMoving = true;
      this.currentDirection = "left";
    } else if (moveX > 0.1 && this.currentDirection !== "right") {
      this.player.anims.play("right", true);
      this.playerIsMoving = true;
      this.currentDirection = "right";
    } else if (Math.abs(moveX) < 0.1) {
      if (this.player.anims.getName() !== "idle") {
        this.player.anims.play("idle", true);
        this.currentDirection = null;
        this.playerIsMoving = false;
      }
    }
  }

  handlePlayerHit(player, bullet) {
    bullet.destroy();

    let healt = this.scene.scene.get("hud").damage_player();
    this.scene.scene.get("hud").update_hp(healt);

    // Efecto de daño visual
    this.scene.tweens.add({
      targets: this.player,
      alpha: 0.3,
      yoyo: true,
      duration: 100,
      repeat: 3,
      onComplete: () => {
        this.player.setAlpha(1);
      },
    });

    this.scene.PlayerHit.play();
  }

  createBulletSystem(scene) {
    // Grupo de balas
    this.scene.bullets = scene.physics.add.group({
      classType: Phaser.GameObjects.Image,
      runChildUpdate: true,
      immovable: true,
      allowGravity: false,
    });

    // Evento de disparo
    this.spaceKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.lastFired = 0;

    // Colisiones entre balas y enemigos
    scene.physics.add.overlap(
      this.scene.bullets,
      scene.enemies,
      (bullet, enemy) => {
        bullet.destroy();
        enemy.destroy();

        let explotion = scene.add
          .sprite(enemy.x, enemy.y, "explosion")
          .setScale(1)
          .setDepth(20);

        scene.time.addEvent({
          delay: 100,
          callback: () => {
            explotion.destroy();
          },
        });

        // update 10 points
        scene.scene.get("hud").update_points(10);

        scene.EnemyDead.play();
        scene.activeSounds.push(scene.EnemyDead);
      }
    );
  }

  updateBullets(scene, time) {
    if (this.isDestroyed) return;

    // Disparo (con enfriamiento)
    if (
      (this.spaceKey.isDown && time > this.lastFired + 350) ||
      (this.inputManager.isShooting() && time > this.lastFired + 350)
    ) {
      const bullet = this.scene.bullets.create(
        this.player.x,
        this.player.y - 9,
        "bullet"
      );
      bullet.setDepth(5).setScale(0.6);
      bullet.body.setVelocityY(-300);
      bullet.body.setCollideWorldBounds(false);
      this.lastFired = time;

      this.scene.PlayerBullet_1.play();
    }

    // Destruir balas que salen de pantalla
    this.scene.bullets.children.each((b) => {
      if (b.y <= 12) {
        b.setTexture("bulletFinal").setScale(1);
        b.body.setVelocityY(0); // detenerla si es necesario
        scene.time.addEvent({
          delay: 200,
          callback: () => {
            b.destroy();
          },
        });
      } else {
        const ratio = Phaser.Math.Clamp(
          1 - b.y / this.scene.scale.height,
          0,
          1
        );

        const red = 255;
        const greenBlue = Math.floor(255 * (1 - ratio)); // disminuye hacia 0

        // Color hexadecimal en formato 0xRRGGBB
        const color = (red << 16) | (greenBlue << 8) | greenBlue;
        b.setTint(color);
      }
    });
  }

  destroy_player(scene) {
    this.explotion = scene.add
      .sprite(this.player.x, this.player.y, "explotion")
      .setScale(1.5)
      .setDepth(25);
    this.explotion.anims.play("destroy", true);

    scene.player.player.body.setVelocity(0, 0);
    scene.player.player.body.enable = false;
    scene.player.flares.body.enable = false;

    this.explotion.on("animationcomplete", () => {
      this.explotion.destroy();

      scene.player.player.anims.stop();
      scene.player.player.setVisible(false);
      scene.player.flares.setVisible(false);

      // Marcamos como destruido
      this.isDestroyed = true;
    });

    this.scene.cameras.main.shake(150, 0.01); // sacudida

    this.scene.PlayerHit.play();
    this.scene.PlayerDead.play();
  }

  update() {
    if (this.isDestroyed) return;
    if (this.flares) {
      this.flares.x = this.player.x;
      this.flares.y = this.player.y + 10.5; // ajustá el valor si necesitás que esté debajo
    }
  }
}
