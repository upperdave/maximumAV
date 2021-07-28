class Title extends Phaser.Scene {

  constructor() { super('Title'); }

  create() {

    const { width } = this.game.config;

    this.add.image(0, 0, 'start-bg').setOrigin(0);

    // FIXME y-axis
    this.add.image(width / 2, 500, 'start-car');
    this.add.image(width / 2, 100, 'start-sun');
    this.add.image(width / 2, 200, 'logo');

    this.input.once('pointerdown', () => {
      this.scene.start('Main');
    }, this);
  }
}

export default Title;
