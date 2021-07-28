import GameOver from './scenes/GameOver';
import Main from './scenes/main';
import Preload from './scenes/Preload';
import Title from './scenes/Title';

const config = {
  backgroundColor: '77607d',
  height: 640,
  physics: {
    // arcade: { debug: true },
    default: 'arcade'
  },
  scene: [ Preload, Title, Main, GameOver ],
  width: 480
};

new Phaser.Game(config);
