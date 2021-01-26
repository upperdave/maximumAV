function preload() {
  this.load.image('car1', 'assets/car-1.gif')
  this.load.image('car2', 'assets/car-2.gif')
  this.load.image('car3', 'assets/car-3.gif')
  this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });
  this.load.image('bottom', 'assets/bottom.gif')
}

const gameState = { score: 0 };

function create() {
  // player sprite
  gameState.player = this.physics.add.sprite(480/2, 774, 'player');

  gameState.player.setCollideWorldBounds(true);

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

  // enemies speed
  gameState.enemyVelocity = 1;

  // create enemies
  const cars = this.physics.add.group();

  function enemiesGen () {
    const xCoord = Phaser.Math.Between(this.game.config.width);
    cars.create(xCoord, -64, 'car1');
  }

  // enemy spawner loop
  const enemiesGenLoop = this.time.addEvent({
    delay: 500,
    callback: enemiesGen,
    callbackScope: this,
    loop: true
  });

  gameState.enemies = this.physics.add.group();
	  for(let yVal = 1; yVal < 4; yVal++){
    for(let xVal = 1; xVal <9; xVal++){
        gameState.enemies.create(50 * xVal, 50 * yVal, 'car1').setGravityY(0)
      }
  }


  // score text
  gameState.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '15px', fill: '#000000' })

  // collison counter 
  const bottom = this.physics.add.staticGroup();
  bottom.create(240, 840, 'bottom');

  // score recorded when cars hit bottom bar
  this.physics.add.collider(cars, bottom, function () {
    gameState.score += 1;
    gameState.scoreText.setText(`Score: ${gameState.score}`);
  });

  // car collider 
  this.physics.add.collider(gameState.player, cars, () => {
    enemiesGenLoop.destroy();
    this.physics.pause();
    this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
    this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
    
		// restart
    this.input.on('pointerup', () =>{
      gameState.score = 0;
    	this.scene.restart();
    });
  });

}

function update() {
  //create controls
  if(gameState.cursors.left.isDown) {
    gameState.player.setVelocityX(-160);
    gameState.player.anims.play('idle', true);
    } else if (gameState.cursors.right.isDown) {
      gameState.player.setVelocityX(160);
      gameState.player.anims.play('idle', true);
    } else {
      gameState.player.setVelocityX(0);
      gameState.player.anims.play('idle', true);
    };

}

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 800,
  backgroundColor: "77607d",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 100 },
      enableBody: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

const game = new Phaser.Game(config)
