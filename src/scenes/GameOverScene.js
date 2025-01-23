class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        // Detener BeachScene si está activa
        if (this.scene.isActive('BeachScene')) {
            this.scene.stop('BeachScene');
        }

        const affinity = this.game.registry.get('affinity');
        
        // Fondos según afinidad
        let bgColor, titleText, bodyText;
        
        if (affinity >= 5) {
            bgColor = 0x4a752c; // Verde esperanzador
            titleText = 'Final Bueno';
            bodyText = 'Dio te entrega un poema:\n"En tus ojos encontré\nel ritmo que el mar me negó..."';
        } else if (affinity >= 0) {
            bgColor = 0x808080; // Gris neutral
            titleText = 'Final Neutral';
            bodyText = 'Dio asiente con una sonrisa tímida.\n"Gracias por caminar conmigo..."';
        } else {
            bgColor = 0x8b0000; // Rojo dramático
            titleText = 'Final Malo';
            bodyText = 'Dio cierra su libro bruscamente.\n"Creo que deberíamos terminar esto aquí."';
        }

        // Diseño del final
        this.add.graphics()
            .fillStyle(bgColor, 1)
            .fillRect(0, 0, 800, 600);

        this.add.text(400, 200, titleText, {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(400, 300, bodyText, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            lineSpacing: 15,
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        // Botón para reiniciar (mejorado)
        const restartButton = this.add.text(400, 500, 'Volver a empezar', {
            fontSize: '32px',
            fill: '#FFD700',
            fontFamily: 'Arial',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        })
        .setInteractive()
        .setOrigin(0.5)
        .on('pointerdown', () => {
            // Eliminar instancias de escenas
            if (this.scene.get('BeachScene')) {
                this.scene.remove('BeachScene');
            }
            
            // Resetear registros y cargar menú
            this.game.registry.set('affinity', 0);
            this.scene.start('MenuScene');
        });
    }
}