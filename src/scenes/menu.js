import { Scene } from "phaser";
import { InputManager } from "../component/imputManager";
export class MainMenu extends Scene {
  constructor() {
    super("main-menu");
  }

  create() {
    const x = this.scale.width;
    const y = this.scale.height;

    // Encender cámaras al iniciar el menú
    this.cameras.main.fadeIn(900, 0, 0, 0);

    this.portada = this.add.sprite(x * 0.5, y * 0.4, "portada").setDepth(5);
    // Fondo parallax
    this.asteroids = this.add
      .tileSprite(x * 0.5, y * 0.5, 0, 0, "asteroid")
      .setDepth(1);

    this.asteroids2 = this.add
      .tileSprite(x * 0.5, y * 0.5, 0, 0, "asteroid2")
      .setDepth(2);

    this.stars = this.add
      .tileSprite(x * 0.5, y * 0.5, 0, 0, "background")
      .setDepth(0);

    this.parallaxLayers = [
      {
        speed: 0.4,
        sprite: this.asteroids,
      },
      {
        speed: 0.115,
        sprite: this.stars,
      },
      {
        speed: 0.6,
        sprite: this.asteroids2,
      },
    ];

    let elapsedTime = 0;
    this.time.addEvent({
      delay: 400, // Cada 200ms
      loop: true, // Hacer que sea continuo
      callback: () => {
        // Alterna entre alpha 0 y 1
        this.portada.alpha = this.portada.alpha === 1 ? 0.8 : 1;
        elapsedTime += 1500;
      },
    });

    // Opciones del menú
    this.options = ["Play", "Options"];
    this.currentSelection = 0; // Índice de la opción seleccionada

    // Texto de las opciones
    this.optionTexts = this.options.map((option, index) => {
      return this.add
        .text(x * 0.5, y * 0.8 + index * 25, option, {
          fontSize: "10px",
          fontFamily: "'Press Start 2P'",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setDepth(10);
    });

    // Sprite de selección (nave del jugador)
    this.selectionSprite = this.add
      .sprite(x * 0.38, y * 0.8, "ship") // Usa tu sprite de nave aquí
      .setScale(1)
      .setDepth(10)
      .setOrigin(0.55);

    // Cursor para mover entre opciones
    this.cursor = this.input.keyboard.createCursorKeys();

    // Espaciadora para seleccionar
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.enterKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    this.inputManager = new InputManager(this);
    this.inputManager.setup();
  }

  update() {
    this.moveParallax();

    // Joysticks Input
    this.inputManager.update();
    const direction = this.inputManager.getMenuNavigation();

    if (direction === "up") {
      this.currentSelection =
        (this.currentSelection - 1 + this.options.length) % this.options.length;
      this.updateSelection();
    } else if (direction === "down") {
      this.currentSelection = (this.currentSelection + 1) % this.options.length;
      this.updateSelection();
    }

    // Default Configs
    // Navegación del menú con flechas
    if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
      this.currentSelection =
        (this.currentSelection - 1 + this.options.length) % this.options.length;
      this.updateSelection();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
      this.currentSelection = (this.currentSelection + 1) % this.options.length;
      this.updateSelection();
    }

    // Seleccionar opción con la barra espaciadora
    const shootPressed =
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      Phaser.Input.Keyboard.JustDown(this.enterKey) ||
      this.inputManager.isShooting();

    if (shootPressed) {
      this.selectOption();
    }
  }

  moveParallax() {
    this.parallaxLayers.forEach((layer) => {
      layer.sprite.tilePositionY -= layer.speed;
    });
  }

  updateSelection() {
    // Actualizar posición del sprite de selección
    const selectedText = this.optionTexts[this.currentSelection];

    const selectedOption = this.options[this.currentSelection];
    if (selectedOption === "Play") {
      let offset = 35;
      this.selectionSprite.setPosition(
        selectedText.x - offset, // Ajusta la posición horizontal
        selectedText.y
      );
    } else if (selectedOption === "Options") {
      let offset = 50;
      this.selectionSprite.setPosition(
        selectedText.x - offset, // Ajusta la posición horizontal
        selectedText.y
      );
    }

    // Resaltar opción seleccionada
    this.optionTexts.forEach((text, index) => {
      text.setColor(index === this.currentSelection ? "#ffff00" : "#ffffff");
    });
  }

  selectOption() {
    const selectedOption = this.options[this.currentSelection];
    if (selectedOption === "Play") {
      this.scene.start("game"); // Ir a la escena del juego
    } else if (selectedOption === "Options") {
      console.log("Opciones seleccionadas"); // Placeholder para pantalla de opciones
    }
  }
}
