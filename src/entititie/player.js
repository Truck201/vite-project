export class Player {
  playerIsMoving = false;
  currentDirection = null;
  playerHP = 3;

  constructor(scene) {
    this.scene = scene;
    this.playerHP = 3;
    const x = this.scene.scale.width;
    const y = this.scene.scale.height;

    // add player
    this.player = this.scene.physics.add
      .sprite(x * 0.5, y * 0.82, "ship")
      .setOffset(0.5);

    this.player.body.setAllowGravity(false);
    this.player.setCollideWorldBounds(true).setDepth(8);
    this.player.anims.play("idle", true);

    // Flares
    this.flares = this.scene.physics.add.sprite(this.player.x, 180, "flar");
    this.flares.setImmovable;
    this.flares.setOrigin(0.5);
    this.flares.body.allowGravity = false;
    this.flares.play("flaires", true);

    this.cursor = this.scene.input.keyboard.createCursorKeys();
  }

  playerMove(speed) {
    if (this.cursor.left.isDown && this.currentDirection !== "left") {
      this.player.body.setVelocityX(-speed);

      if (!this.playerIsMoving) {
        this.player.anims.play("left", true);
        this.playerIsMoving = true;
        this.currentDirection = "left";
      }
    } else if (this.cursor.right.isDown && this.currentDirection !== "right") {
      this.player.body.setVelocityX(+speed);

      if (!this.playerIsMoving) {
        this.player.anims.play("right", true);
        this.playerIsMoving = true;
        this.currentDirection = "right";
      }
    } else if (!this.cursor.left.isDown && !this.cursor.right.isDown) {
      this.player.body.setVelocityX(0);

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
    console.log(healt);
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
      }
    );
  }

  updateBullets(scene, time) {
    // Disparo (con enfriamiento)
    if (this.spaceKey.isDown && time > this.lastFired + 350) {
      const bullet = this.scene.bullets.create(
        this.player.x,
        this.player.y - 9,
        "bullet"
      );
      bullet.setDepth(5).setScale(0.6);
      bullet.body.setVelocityY(-300);
      bullet.body.setCollideWorldBounds(false);
      this.lastFired = time;
    }

    // Destruir balas que salen de pantalla
    this.scene.bullets.children.each((b) => {
      if (b.y < 0) {
        b.destroy();
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

  update() {
    if (this.flares) {
      this.flares.x = this.player.x;
      this.flares.y = this.player.y + 10.5; // ajustá el valor si necesitás que esté debajo
    }
  }
}
