class Preload extends Phaser.Scene {

  constructor() { super(); }

  create() { this.scene.start('Title'); }

  preload() {

    this.load.path = './assets/';

    // Audio

    this.load.audio('music', ['MaximumAV.mp3', 'MaximumAV.ogg']);

    // Bitmap Fonts

    this.load.bitmapFont('PressStart');

    // Images

    this.load.image('bus');
    this.load.image('car-1');
    this.load.image('car-2');
    this.load.image('car-3');
    this.load.image('hud');
    this.load.image('left-buildings');
    this.load.image('lines');
    this.load.image('logo');
    this.load.image('oil');
    this.load.image('pothole');
    this.load.image('right-buildings');
    this.load.image('sidewalk');
    this.load.image('start-bg');
    this.load.image('start-car');
    this.load.image('start-sun');

    // Spritesheets

    this.load.spritesheet({ frameConfig: { frameWidth: 32 }, key: 'dumpster' });
    this.load.spritesheet({ frameConfig: { frameWidth: 32 }, key: 'player' });
    this.load.spritesheet({ frameConfig: { frameHeight: 64, frameWidth: 32 }, key: 'semi' });
  }
}

export default Preload;
