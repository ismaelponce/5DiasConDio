const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'body',
    pixelArt: true,
    scene: [MenuScene, BeachScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    audio: {
        disableWebAudio: true
    }
};

const game = new Phaser.Game(config);