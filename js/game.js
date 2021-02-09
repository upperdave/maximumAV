function preload() {

  this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });

  this.load.image('car-1', 'assets/car-1.png');
  this.load.image('car-2', 'assets/car-2.png');
  this.load.image('car-3', 'assets/car-3.png');
  this.load.spritesheet('dumpster', 'assets/dumpster.png', { frameWidth: 32, frameHeight: 32 });
  this.load.image('pothole', 'assets/pothole.png');
  this.load.image('oil', 'assets/oil.png');
  this.load.spritesheet('semi', 'assets/semi.png', { frameWidth: 32, frameHeight: 64 });
  this.load.spritesheet('bus', 'assets/bus.png', { frameWidth: 32, frameHeight: 64 });
  this.load.spritesheet('bus', 'assets/bus.png', { frameWidth: 32, frameHeight: 64 });
  this.load.spritesheet('line', 'assets/line.png', { frameWidth: 4, frameHeight: 32 });
}

const gameState = { score: 0 };

let vehicles;

function create() {

	// When gameState.active is true, the game is being played and not over. When gameState.active is false, then it's game over
	gameState.active = true;

	// When gameState.active is false, the game will listen for a pointerup event and restart when the event happens
	// this.input.on('pointerup', () => {
	// 	if (gameState.active === false) {
	// 		this.scene.restart();
	// 	}
	// })


  // player sprite
  gameState.player = this.physics.add.sprite(game.config.width / 2, 600, 'player');

  gameState.player.setCollideWorldBounds(true);

  // 
  this.physics.add.collider(gameState.player, vehicles);

  this.physics.add.overlap(gameState.player, vehicles, () => {
    this.add.text(150, 50, '      Game Over...\n  Click to play again.', { fontFamily: 'Arial', fontSize: 36, color: '#ffffff' });
    this.physics.pause();
    gameState.active = false;
  });


  // dumpster 
  this.anims.create({
    key: 'dumpster',
    frames: this.anims.generateFrameNumbers('dumpster', { start: 0, end: 6 }),
    frameRate: 5,
    repeat: -1
  });

  gameState.vehicles = this.physics.add.group();

  this.time.addEvent({
    callback: spawnVehicle,
    delay: 500, // 2 seconds
    loop: true
  });

  // score text
  gameState.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '15px', fill: '#000000' })

  // create cursors
  gameState.cursors = this.input.keyboard.createCursorKeys();

}



/**
 * Spawns a vehicle in a random lane.
 */
function spawnVehicle() {

  const lane = Phaser.Math.RND.between(1, 11);

  const x = 32 * lane + 48;
  const y = -32;

  const key = Phaser.Math.RND.pick(['car-1', 'car-2', 'car-3', 'dumpster', 'semi', 'bus', 'oil', 'pothole']);

  const vehicle = gameState.vehicles.get(x, y, key);

  if (!vehicle) {
    return;
  }

  vehicle
    .setActive(true)
    .setVisible(true);
    console.log(key);
}

function update() {

  //player speed
  gameState.playerMoveX = 8;

  //create controls

	if (gameState.active) {
		// If the game is active, then players can control the player
    if (gameState.cursors.right.isDown) {
      // player moves right
      gameState.player.x += gameState.playerMoveX;

    }  else if (gameState.cursors.left.isDown) {
      // player moves left
      gameState.player.x -= gameState.playerMoveX;
 
      // gameState.player.move;
    } else {
      // player don't move
      gameState.player.setVelocity(0, 0);
    }

		// Execute code if the spacebar key is pressed
		if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
			
		}

		// Add logic for winning condition and enemy movements below:
    
  }
  



  Phaser.Actions.IncY(gameState.vehicles.getChildren(), 3);

  gameState.vehicles.children.iterate((vehicle) => {
    // Is the vehicle off the bottom of the screen?
    if (vehicle.y > 640) {
      gameState.vehicles.killAndHide(vehicle);
      gameState.score += 1 ;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
    }
  });
}

const config = {
  backgroundColor: "77607d",
  height: 640,
  scene: { preload, create, update },
  physics: {
	    default: 'arcade',
	},
  width: 480
};

const game = new Phaser.Game(config)

