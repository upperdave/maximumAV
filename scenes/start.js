class Start extends Phaser.Scene {

  constructor() {

    super();
  }

  create() {

    const { height, width } = this.game.config;

    this.add.image(width / 2, height / 2, 'start-bg');

    // FIXME y-axis
    this.add.image(width / 2, 500, 'start-car');
    this.add.image(width / 2, 100, 'start-sun');
    this.add.image(width / 2, 200, 'logo');

    this.input.once('pointerdown', () => {
      this.scene.switch('main');
    }, this);
  }

  preload() {

    this.load.path = '../assets/';

    this.load.image('logo');
    this.load.image('start-bg');
    this.load.image('start-car');
    this.load.image('start-sun');
  }

  update() {}
}

export default Start;
