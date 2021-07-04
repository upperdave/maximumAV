let bgSpeed;
let buildingsLeft;
let buildingsRight;
let cursors;
let hazards;
let hud;
let player;
let playerMoveX;
let playerSpeed;
let score;
let scoreText;
let sidewalkLeft;
let sidewalkRight;
let lines;
let music;
let vehicles;

class Main extends Phaser.Scene {

  constructor() {

    super({ key: 'main' });

    playerMoveX = 32; // lane width
    score = 0;
  }

  create() {

    cursors = this.input.keyboard.createCursorKeys();

    // buildings speed

    bgSpeed = -2.5;

    // Heads-up-display

    hud = this.add.sprite(0, 0, 'hud');
    hud.setOrigin(0, 0);
    hud.setDepth(2);

    // Score text

    scoreText = this.add.dynamicBitmapText(180, 10, 'Press Start 2P', 'Score: 0', 16,) ;
    scoreText.setDepth(3);

    // Hazards

    hazards = this.physics.add.group();

    this.time.addEvent({
      callback: spawnHazard,
      delay: 1000,
      loop: true
    });

    // Dumpster

    this.anims.create({
      key: 'burn',
      frames: this.anims.generateFrameNumbers('dumpster'),
      frameRate: 5,
      repeat: -1
    });

    // Vehicles

    vehicles = this.physics.add.group();

    this.time.addEvent({
      callback: spawnVehicle,
      delay: 500,
      loop: true
    });

    // Player

    player = this.physics.add.sprite(
      this.game.config.width / 2,
      this.game.config.height - 32 // frameHeight
    );
    playerSpeed = 1;

    this.anims.create({
      key: 'drive',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [ 0, 1, 2 ]
      }),
      frameRate: 5,
      repeat: -1
    });

    player.play('drive');
    player.setCollideWorldBounds(true);
    player.setDepth(2);

    // Buildings

    buildingsLeft = this.add.tileSprite(0, 0, 64, 640, 'left-buildings');
    buildingsLeft.setScrollFactor(0, 300);

    buildingsLeft.setOrigin(0);
    buildingsLeft.setDepth(1);

    buildingsRight = this.add.tileSprite(416, 0, 64, 640, 'right-buildings');
    buildingsRight.setOrigin(0,0);
    buildingsRight.setDepth(1);

    // Sidewalk

    sidewalkLeft = this.add.tileSprite(0, 0, 64, 640, 'sidewalk');
    sidewalkLeft.setOrigin(0, 0,);

    sidewalkRight = this.add.tileSprite(416, 0, 64, 640, 'sidewalk');
    sidewalkRight.setOrigin(0, 0);
    sidewalkRight.flipX = true;

    // Road lines

    lines = this.add.tileSprite(64, 0, 640, 640, 'lines');
    lines.setOrigin(0, 0);

    // Music

    music = this.sound.add('music')
    music.loop = true;
    music.play();

    // Physics

    this.physics.add.collider(player, hazards);
    this.physics.add.collider(player, vehicles);

    this.physics.add.overlap(player, hazards, () => {

      this.add.dynamicBitmapText(170, 200, 'Press Start 2P', 'Game Over', 16,);

      this.scene.pause();
      music.pause();
    });

    this.physics.add.overlap(player, vehicles, () => {

      this.add.dynamicBitmapText(170, 200, 'Press Start 2P', 'Game Over', 16,);

      this.scene.pause();
      music.pause();
    });
  }

  preload() {

    this.load.bitmapFont('Press Start 2P', '/assets/PressStart.png', '/assets/PressStart.xml');
    this.load.audio('music', '/assets/MaximumAV.mp3', '/assets/MaximumAV.ogg' );

    this.load.path = '/assets/';

    this.load.image('bus');
    this.load.image('car-1');
    this.load.image('car-2');
    this.load.image('car-3');
    this.load.image('hud');
    this.load.image('left-buildings')
    this.load.image('lines');
    this.load.image('oil');
    this.load.image('pothole');
    this.load.image('right-buildings')
    this.load.image('sidewalk');

    this.load.spritesheet({
      key: 'dumpster',
      frameConfig: {
        frameWidth: 32,
        frameHeight: 32
      }
    });

    this.load.spritesheet({
      key: 'player',
      frameConfig: { frameWidth: 32 }
    });

    this.load.spritesheet({
      key: 'semi',
      frameConfig: {
        frameWidth: 32,
        frameHeight: 64
      }
    });
  }

  update() {

    const deltaY = bgSpeed * playerSpeed;

    buildingsLeft.tilePositionY += deltaY;
    buildingsRight.tilePositionY += deltaY;
    sidewalkLeft.tilePositionY += deltaY;
    sidewalkRight.tilePositionY += deltaY;
    lines.tilePositionY += deltaY;

    if (this.input.keyboard.checkDown(cursors.left, 250)) {
      // Move player left
      player.x -= playerMoveX;
    } else if (this.input.keyboard.checkDown(cursors.right, 250)) {
      // Move player right
      player.x += playerMoveX;
    }

    // Prevent the player from driving off-road.
    player.x = Phaser.Math.Clamp(player.x, 80, this.game.config.width - 80);

    Phaser.Actions.IncY(hazards.getChildren(), -deltaY);
    Phaser.Actions.IncY(vehicles.getChildren(), 2 * playerSpeed);

    hazards.children.iterate((hazard) => {
      // Is the hazard active and off the bottom of the screen?
      if (
        hazard.active
        && hazard.y > this.game.config.height + hazard.height / 2
      ) {
        hazard.stop();
        hazards.killAndHide(hazard);
        score++;
      }
    });

    vehicles.children.iterate((vehicle) => {
      // Is the vehicle active and off the bottom of the screen?
      if (
        vehicle.active
        && vehicle.y > this.game.config.height + vehicle.height / 2
      ) {
        vehicle.stop();
        vehicles.killAndHide(vehicle);
        score++;
      }
    });

    playerSpeed = Phaser.Math.Clamp(score / 100, 1, 10);
    scoreText.setText(`Score: ${score}`);
  }
}

/**
 * Spawns a hazard in a random lane.
 */
function spawnHazard() {

  const lane = Phaser.Math.RND.between(1, 11);

  const x = 32 * lane + 48;
  const y = -32;

  const key = Phaser.Math.RND.pick([
    'dumpster',
    'oil',
    'pothole'
  ]);

  const hazard = hazards.get(x, y);

  if (!hazard) {
    return;
  }

  hazard
    .setActive(true)
    .setDepth(0)
    .setTexture(key)
    .setVisible(true);

  // HACK
  if (key === 'dumpster') {
    hazard.play('burn');
  }
}

function spawnVehicle() {

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

  const vehicle = vehicles.get(x, y);

  if (!vehicle) {
    return;
  }

  vehicle
    .setActive(true)
    .setDepth(1)
    .setTexture(key)
    .setVisible(true);
}

export default Main;
