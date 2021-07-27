class GameOver extends Phaser.Scene {

  constructor() { super('GameOver'); }

  create() {

    const { height, width } = this.game.config;

    this.add.image(width / 2, height / 2, 'start-bg');

    // FIXME y-axis
    this.add.image(width / 2, 500, 'start-car');
    this.add.image(width / 2, 100, 'start-sun');

    this.add.dynamicBitmapText(width / 2, height / 2, 'PressStart', 'Game Over', 32)
      .setDepth(3)
      .setOrigin(0.5, 0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('Main');
    }, this);
  }

  preload() {

    this.load.path = '../assets/';

    // Images

    this.load.image('start-bg');
    this.load.image('start-car');
    this.load.image('start-sun');
  }
}

export default GameOver;
