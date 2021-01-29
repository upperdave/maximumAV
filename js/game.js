function preload() {

  this.load.image('car-1', 'assets/car-1.gif');
  this.load.image('car-2', 'assets/car-2.gif');
  this.load.image('car-3', 'assets/car-3.gif');
  this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('dumpster', 'assets/dumpster.png', { frameWidth: 32, frameHeight: 32 });

}

const gameState = { score: 0 };

let vehicles;

function create() {

  vehicles = this.add.group();

  this.time.addEvent({
    callback: spawnVehicle,
    delay: 2000, // 2 seconds
    loop: true
  });

  // player sprite
  gameState.player = this.add.sprite(480/2, 600, 'player');

  // create cursors
  gameState.cursors = this.input.keyboard.createCursorKeys();

  // player animations
  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'boost',
    frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
    frameRate: 5,
    repeat: -1
  });

  // dumpster 
  this.anims.create({
    key: 'dumpster',
    frames: this.anims.generateFrameNumbers('dumpster', { start: 0, end: 6 }),
    frameRate: 5,
    repeat: -1
  });

  // score text
  gameState.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '15px', fill: '#000000' })

}



/**
 * Spawns a vehicle in a random lane.
 */
function spawnVehicle() {

  const lane = Phaser.Math.RND.between(1, 11);

  const x = 32 * lane + 48;
  const y = -32;

  const key = Phaser.Math.RND.pick(['car-1', 'car-2', 'car-3', 'dumpster']);

  const vehicle = vehicles.get(x, y, key);

  if (!vehicle) {
    return;
  }

  vehicle
    .setActive(true)
    .setVisible(true);
}

function update() {

  //create controls
	if (gameState.active) {
		// If the game is active, then players can control Codey
		if (gameState.cursors.left.isDown) {
			gameState.player.setVelocityX(-160);
		} else if (gameState.cursors.right.isDown) {
			gameState.player.setVelocityX(160);
		} else {
			gameState.player.setVelocityX(0);
		}

    
  }

  Phaser.Actions.IncY(vehicles.getChildren(), 2);

  vehicles.children.iterate((vehicle) => {
    // Is the vehicle off the bottom of the screen?
    if (vehicle.y > 640) {
      vehicles.killAndHide(vehicle);
      gameState.score -+1 ;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
    }
  });
}

const config = {
  backgroundColor: "77607d",
  height: 640,
  scene: { preload, create, update },
  width: 480
};

const game = new Phaser.Game(config)

