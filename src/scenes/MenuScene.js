class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('menu_bg', 'assets/images/ui/menu_bg.png');
    }

    create() {
        // Fondo y texto
        this.add.image(400, 300, 'menu_bg')
            .setDisplaySize(800, 600);
        
        this.add.text(400, 200, '5 días con Dio', {
            fontSize: '48px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Botón de inicio (mejorado)
        const startButton = this.add.text(400, 400, 'Comenzar', {
            fontSize: '32px',
            fill: '#FFD700',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive();

        // Evento click
        startButton.on('pointerdown', () => {
            // Resetear afinidad y eliminar escenas anteriores
            this.game.registry.set('affinity', 0);
            
            // Eliminar instancias previas de BeachScene
            if (this.scene.get('BeachScene')) {
                this.scene.remove('BeachScene');
            }
            
            // Crear nueva instancia de BeachScene
            this.scene.add('BeachScene', new BeachScene(), true);
            
            // Detener GameOverScene si está activo
            if (this.scene.isActive('GameOverScene')) {
                this.scene.stop('GameOverScene');
            }
        });
    }
}