function preload() {

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

  // create enemy group
  group = this.add.group({
    defaultKey: 'alien',
    maxSize: 100,
    createCallback: function (alien) {
        alien.setName('alien' + this.getLength());
        console.log('Created', alien.name);
    },
    removeCallback: function (alien) {
        console.log('Removed', alien.name);
    }
  });

  // You could also fill the group first:
  // group.createMultiple({
  //     active: false,
  //     key: group.defaultKey,
  //     repeat: group.maxSize - 1
  // });

  this.time.addEvent({
      delay: 500,
      loop: true,
      callback: addAlien
  });

  // score text
  gameState.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '15px', fill: '#000000' })


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

  // alien movement
  Phaser.Actions.IncY(group.getChildren(), 3);

  group.children.iterate(function (alien) {
      if (alien.y > 800) {
          group.killAndHide(alien);
          gameState.score += 1;
          gameState.scoreText.setText(`Score: ${gameState.score}`);
      }
  });


}

// activate aliens 
function activateAlien (alien) {
  alien
  .setActive(true)
  .setVisible(true)
  .setTint(Phaser.Display.Color.RandomRGB().color)
  .play('idle');
}

function addAlien () {
  // generate a random # between # of lanes (11)


  // Random position above screen
  const x = Phaser.Math.Between(64, 416);
  const y = Phaser.Math.Between(-64, 0);

  // Find first inactive sprite in group or add new sprite, and set position
  const alien = group.get(x, y);

  // None free or already at maximum amount of sprites in group
  if (!alien) return;

  activateAlien(alien);
}


const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 800,
  backgroundColor: "77607d",
  physics: {
    default: 'arcade',
  },
  scene: {
    preload,
    create,
    update
  }
}

const game = new Phaser.Game(config)
