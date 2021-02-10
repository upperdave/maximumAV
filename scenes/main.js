let cursors;
let hazards;
let player;
let playerMoveX;
let score;
let scoreText;

class Main extends Phaser.Scene {

  constructor() {

    super({ key: 'main' });

    playerMoveX = 4;
    score = 0;
  }

  create() {

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(0, 16, 'Score: 0', {
      align: 'center',
      fixedWidth: this.game.config.width,
      fontSize: '15px'
    });

    scoreText.setDepth(1);

    // Hazards

    hazards = this.physics.add.group();

    this.time.addEvent({
      callback: spawnHazard,
      delay: 500,
      loop: true
    });

    // Dumpster

    this.anims.create({
      key: 'burn',
      frames: this.anims.generateFrameNumbers('dumpster'),
      frameRate: 5,
      repeat: -1
    });

    // Player

    player = this.physics.add.sprite(
      this.game.config.width / 2,
      this.game.config.height - 32 // frameHeight
    );

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
    player.setDepth(1);

    // Physics

    this.physics.add.collider(player, hazards);

    this.physics.add.overlap(player, hazards, () => {

      this.add.text(0, 50, 'Game Over', {
        align: 'center',
        color: 'white',
        fixedWidth: this.game.config.width,
        fontFamily: 'Arial',
        fontSize: 36
      });

      this.scene.pause();
    });
  }

  preload() {

    this.load.path = '/assets/';

    this.load.image('bus');
    this.load.image('car-1');
    this.load.image('car-2');
    this.load.image('car-3');
    this.load.image('line');
    this.load.image('oil');
    this.load.image('pothole');

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

    if (cursors.left.isDown) {
      // Move player left
      player.x -= playerMoveX;
    } else if (cursors.right.isDown) {
      // Move player right
      player.x += playerMoveX;
    }

    Phaser.Actions.IncY(hazards.getChildren(), 3);

    hazards.children.iterate((hazard) => {
      // Is the hazard active and off the bottom of the screen?
      if (
        hazard.active
        && hazard.y > this.game.config.height + hazard.height / 2
      ) {
        hazard.stop();
        hazards.killAndHide(hazard);
        scoreText.setText(`Score: ${++score}`);
      }
    });
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
    'bus',
    'car-1',
    'car-2',
    'car-3',
    'dumpster',
    'oil',
    'pothole',
    'semi'
  ]);

  const hazard = hazards.get(x, y);

  if (!hazard) {
    return;
  }

  hazard
    .setActive(true)
    .setTexture(key)
    .setVisible(true);

  // HACK
  if (key === 'dumpster') {
    hazard.play('burn');
  }
}

export default Main;
