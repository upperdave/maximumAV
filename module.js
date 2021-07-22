import Main from './scenes/main.js';
import Start from './scenes/start.js';

const config = {
  backgroundColor: '77607d',
  height: 640,
  physics: {
    // arcade: { debug: true },
    default: 'arcade'
  },
  scene: [ Start, Main ],
  width: 480
};

new Phaser.Game(config);
