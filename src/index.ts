import 'phaser'
import GameScene from './ui/GameScene'
import Connect4Game from './ui/Connect4Game'

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: 200,
    height: 150,
    parent: 'game',
    backgroundColor: '#ffffff',
    zoom: 4,
    scene: [GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'impact',
        impact: {
            debug: false,
            gravity: 80,
            maxVelocity: 800,
        }
    }
};

new Connect4Game(config);