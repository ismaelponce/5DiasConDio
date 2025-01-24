class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('menu_bg', 'assets/images/ui/menu_bg.png');
        this.load.spritesheet('waves', 'assets/images/ui/waves_spritesheet.png', {
            frameWidth: 600,
            frameHeight: 600,
            endFrame: 9
        });
        this.load.image('palm', 'assets/images/ui/palm_tree.png');
    }

    create() {
        // Configurar escalado
        const { width, height } = this.scale;
        const gameWidth = 800;
        const gameHeight = 600;
        
        // Centrar elementos en el área visible
        const centerX = width / 2;
        const centerY = height / 2;
        const scaleRatio = Math.min(width / gameWidth, height / gameHeight);

        // Fondo estático
        this.background = this.add.image(centerX, centerY, 'menu_bg')
            .setScale(scaleRatio)
            .setScrollFactor(0);

        // Animación de olas
        this.waves = this.add.sprite(centerX, centerY, 'waves')
            .setScale(scaleRatio)
            .setScrollFactor(0);

        this.anims.create({
            key: 'wave_anim',
            frames: this.anims.generateFrameNumbers('waves', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });
        this.waves.play('wave_anim');

        // Elementos decorativos
        this.add.image(centerX + 300 * scaleRatio, centerY - 200 * scaleRatio, 'palm')
            .setScale(0.5 * scaleRatio)
            .setAngle(-10)
            .setScrollFactor(0);

        this.add.image(centerX - 300 * scaleRatio, centerY + 200 * scaleRatio, 'palm')
            .setScale(0.4 * scaleRatio)
            .setAngle(15)
            .setFlipX(true)
            .setScrollFactor(0);

        // Título
        const title = this.add.text(
            centerX,
            centerY - 150 * scaleRatio,
            '5 días con Dio', 
            {
                fontFamily: 'PixelFont',
                fontSize: `${48 * scaleRatio}px`,
                color: '#FFFFFF'
            }
        ).setOrigin(0.5);

        // Animación de título
        this.tweens.add({
            targets: title,
            y: centerY - 170 * scaleRatio,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Botón de inicio
        const startButton = this.add.text(
            centerX,
            centerY + 100 * scaleRatio,
            '> COMENZAR <', 
            {
                fontFamily: 'PixelFont',
                fontSize: `${32 * scaleRatio}px`,
                color: '#FFD700'
            }
        ).setOrigin(0.5);

        // Interactividad del botón
        startButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this.tweens.add({
                    targets: startButton,
                    scale: 1.2,
                    duration: 200
                });
            })
            .on('pointerout', () => {
                this.tweens.add({
                    targets: startButton,
                    scale: 1,
                    duration: 200
                });
            })
            .on('pointerdown', () => {
                this.startGame();
            });

        // Créditos
        this.add.text(
            centerX,
            height - 50 * scaleRatio,
            '© 2025 PixelNamer Studios', 
            {
                fontFamily: 'PixelFont',
                fontSize: `${16 * scaleRatio}px`,
                color: '#FFFFFF'
            }
        ).setOrigin(0.5);
    }

    startGame() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
            this.game.registry.set('affinity', 0);
            this.scene.start('BeachScene');
        });
    }
}