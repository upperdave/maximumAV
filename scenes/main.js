class Main extends Phaser.Scene {

  constructor() { super('Main'); }

  create() {

    const { height, width } = this.game.config;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.music = this.sound.add('music')
    this.music.loop = true;
    this.music.play();

    // Background

    this.tileSprites.push(

      this.add.tileSprite(64, 0, width - 64 * 2, height, 'lines')
        .setOrigin(0),

      this.add.tileSprite(0, 0, 64, height, 'sidewalk')
        .setOrigin(0),

      this.add.tileSprite(width - 64, 0, 64, height, 'sidewalk')
        .setFlipX(true)
        .setOrigin(0),

      this.add.tileSprite(0, 0, 64, height, 'left-buildings')
        .setOrigin(0),

      this.add.tileSprite(width - 64, 0, 64, height, 'right-buildings')
        .setOrigin(0)
    );

    // Hazards

    this.hazards = this.physics.add.group();

    this.anims.create({
      key: 'burn',
      frames: this.anims.generateFrameNumbers('dumpster'),
      frameRate: 5,
      repeat: -1
    });

    this.time.addEvent({
      callback: this.spawnHazard,
      callbackScope: this,
      delay: 2000,
      loop: true
    });

    // Vehicles

    this.vehicles = this.physics.add.group();

    this.time.addEvent({
      callback: this.spawnVehicle,
      callbackScope: this,
      delay: 500,
      loop: true
    });

    // Player

    this.anims.create({
      key: 'drive',
      frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1, 2 ] }),
      frameRate: 5,
      repeat: -1
    });

    this.player = this.physics.add.sprite(
      this.game.config.width / 2,
      this.game.config.height - 32 // frameHeight
    );

    this.player
      .play('drive')
      .setDepth(2);

    // Heads-Up Display

    this.add.sprite(0, 0, 'hud')
      .setOrigin(0, 0)
      .setDepth(3);

    this.scoreText = this.add.dynamicBitmapText(width / 2, 10, 'PressStart');
    this.scoreText
      .setDepth(4)
      .setFontSize(16)
      .setOrigin(0.5, 0);

    // Physics

    this.physics.add.collider(this.player, this.hazards);
    this.physics.add.collider(this.player, this.vehicles);

    this.physics.add.overlap(this.player, this.hazards, this.gameOver, null, this);
    this.physics.add.overlap(this.player, this.vehicles, this.gameOver, null, this);
  }

  gameOver() {

    this.music.pause();
    this.scene.start('GameOver');
  }

  init() {

    this.score = 0;
    this.speed = 1;
    this.tileSprites = [];
  }

  preload() {

    this.load.path = '../assets/';

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
    this.load.image('oil');
    this.load.image('pothole');
    this.load.image('right-buildings');
    this.load.image('sidewalk');

    // Spritesheets

    this.load.spritesheet({ frameConfig: { frameWidth: 32 }, key: 'dumpster' });
    this.load.spritesheet({ frameConfig: { frameWidth: 32 }, key: 'player' });
    this.load.spritesheet({ frameConfig: { frameHeight: 64, frameWidth: 32 }, key: 'semi' });
  }

  /**
   * Spawns a hazard in a random lane.
   */
  spawnHazard() {

    const lane = Phaser.Math.RND.between(1, 11);

    const x = 32 * lane + 48;
    const y = -32;

    const key = Phaser.Math.RND.pick([
      'dumpster',
      'oil',
      'pothole'
    ]);

    const hazard = this.hazards.get(x, y);

    if (!hazard) {
      return;
    }

    hazard
      .setActive(true)
      .setDepth(0)
      .setTexture(key)
      .setVisible(true);

    switch (key) {
      case 'dumpster':
        hazard.play('burn');
        break;
    }
  }

  /**
   * Spawns a vehicle in a random lane.
   */
  spawnVehicle() {

    const lane = Phaser.Math.RND.between(1, 11);

    const x = 32 * lane + 48;
    const y = -32;

    const key = Phaser.Math.RND.pick([
      'bus',
      'car-1',
      'car-2',
      'car-3',
      'semi'
    ]);

    const vehicle = this.vehicles.get(x, y);

    if (!vehicle) {
      return;
    }

    vehicle
      .setActive(true)
      .setDepth(1)
      .setTexture(key)
      .setVisible(true);

    switch (key) {
      case 'bus':
      case 'semi':
        vehicle.body.setSize(32, 64);
        break;
      default:
        vehicle.body.setSize(32, 32);
    }
  }

  update() {

    const deltaY = 3 * this.speed;
    const { height, width } = this.game.config;

    this.hazards.children.iterate((hazard) => {
      // Is the hazard active and off the bottom of the screen?
      if (hazard.active && hazard.y > height + hazard.height / 2) {
        hazard.stop();
        this.hazards.killAndHide(hazard);
        this.score++;
      }
    });

    this.vehicles.children.iterate((vehicle) => {
      // Is the vehicle active and off the bottom of the screen?
      if (vehicle.active && vehicle.y > height + vehicle.height / 2) {
        vehicle.stop();
        this.vehicles.killAndHide(vehicle);
        this.score++;
      }
    });

    Phaser.Actions.IncY(this.hazards.getChildren(), deltaY);
    Phaser.Actions.IncY(this.vehicles.getChildren(), 2.5 * this.speed);

    for (const tileSprite of this.tileSprites) {
      tileSprite.tilePositionY -= deltaY;
    }

    if (this.input.keyboard.checkDown(this.cursors.left, 250)) {
      this.player.x -= 32;
    } else if (this.input.keyboard.checkDown(this.cursors.right, 250)) {
      this.player.x += 32;
    }

    // Prevent the player from driving off-road.
    this.player.x = Phaser.Math.Clamp(this.player.x, 80, width - 80);

    this.speed = Math.min(1 + this.score / 200, 7);

    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default Main;
