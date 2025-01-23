class BeachScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BeachScene' });
        this.dialogueActive = false;
        this.currentDialogueStep = 0;
        this.affinity = 0;
        this.dialogueElements = [];
        this.isTextTyping = false;
        this.currentText = null;
        this.typedText = null;
        this.dialogueConfig = this.createDialogueConfig();
    }

    preload() {
        this.load.spritesheet('dio', 'assets/images/characters/dio.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        
        this.load.spritesheet('player', 'assets/images/characters/player.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.image('beach_bg', 'assets/images/tiles/beach_tileset.png');
        this.load.image('dio_neutral', 'assets/images/characters/dio_neutral.png');
        this.load.image('dio_smile', 'assets/images/characters/dio_smile.png');
        this.load.image('dio_angry', 'assets/images/characters/dio_angry.png');
        this.load.image('dio_thoughtful', 'assets/images/characters/dio_thoughtful.png');
        this.load.image('dio_smirk', 'assets/images/characters/dio_smirk.png');
    }

    create() {
        this.add.image(400, 300, 'beach_bg').setDisplaySize(800, 600);
        this.createAnimations();
        this.physics.world.resume();

        this.dio = this.physics.add.sprite(600, 400, 'dio')
            .play('dio_idle')
            .setCollideWorldBounds(true);

        this.player = this.physics.add.sprite(100, 400, 'player')
            .play('player_idle')
            .setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createAnimations() {
        this.anims.create({
            key: 'dio_idle',
            frames: this.anims.generateFrameNumbers('dio', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'player_walk',
            frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
    }

    update() {
        if (!this.dialogueActive) {
            const speed = 200;
            this.player.setVelocity(0);

            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-speed);
                this.player.flipX = true;
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(speed);
                this.player.flipX = false;
            }

            this.player.body.velocity.x !== 0 
                ? this.player.play('player_walk', true) 
                : this.player.play('player_idle', true);
        }

        if (!this.dialogueActive) {
            this.physics.overlap(this.player, this.dio, () => this.startDialogue());
        }
    }

    startDialogue() {
        this.dialogueActive = true;
        this.currentDialogueStep = 0;
        this.player.setVelocity(0);
        this.player.play('player_idle', true);
        this.showDialogueStep();
    }

    showDialogueStep() {
        this.clearDialogueElements();
        this.createDialogueOverlay();
        this.createPortrait('neutral'); // Expresión neutral por defecto

        const currentStep = this.dialogueConfig[this.currentDialogueStep];
        this.createDialogueBox(currentStep.text, currentStep.options.length);
    }

    createDialogueConfig() {
        return [
            {
                text: "Dio:\nEl sonido constante de las olas...\n¿Qué te parece?",
                options: [
                    { 
                        text: "Me relaja el alma", 
                        affinity: +3,
                        response: "Dio:\nLa serenidad del mar siempre me inspira...",
                        expression: 'smile'
                    },
                    { 
                        text: "Me desconcentra", 
                        affinity: -2,
                        response: "Dio:\nCurioso... a mí me ayuda a concentrarme.",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "Me hace pensar en el tiempo", 
                        affinity: +1,
                        response: "Dio:\nEl tiempo... sí, es un compañero implacable.",
                        expression: 'neutral'
                    },
                    { 
                        text: "Me resulta molesto", 
                        affinity: -4,
                        response: "Dio:\n*Suspira* Parece que no compartimos perspectivas...",
                        expression: 'angry'
                    },
                    { 
                        text: "No le presto atención", 
                        affinity: 0,
                        response: "Dio:\nInteresante... ¿en qué sueles concentrarte entonces?",
                        expression: 'smirk'
                    }
                ]
            },
            {
                text: "Dio:\nSuelo venir aquí a escribir.\n¿Qué arte prefieres?",
                options: [
                    { 
                        text: "Poesía", 
                        affinity: +4,
                        response: "Dio:\nLas palabras pueden capturar el alma del mundo...",
                        expression: 'smile'
                    },
                    { 
                        text: "Música", 
                        affinity: +2,
                        response: "Dio:\nLos ritmos del mar siempre inspiran melodías...",
                        expression: 'neutral'
                    },
                    { 
                        text: "Pintura", 
                        affinity: +1,
                        response: "Dio:\nLos colores del atardecer son mi paleta...",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "El arte es inútil", 
                        affinity: -3,
                        response: "Dio:\n*Frunce el ceño* Qué visión tan limitada...",
                        expression: 'angry'
                    },
                    { 
                        text: "Cualquiera está bien", 
                        affinity: 0,
                        response: "Dio:\nLa diversidad artística tiene su valor...",
                        expression: 'smirk'
                    }
                ]
            },
            // ... (Añadir el resto de diálogos con expresiones siguiendo el mismo patrón)
        ];
    }

    createDialogueBox(text, optionCount) {
        const tempText = this.add.text(270, 200, text, {
            fontSize: '20px',
            fontFamily: 'Arial',
            lineSpacing: 10,
            wordWrap: { width: 460 }
        }).setVisible(false);
        
        const textHeight = tempText.height;
        tempText.destroy();

        const optionHeight = 35 * optionCount;
        const padding = 40;
        const totalHeight = textHeight + optionHeight + padding;

        const dialogueBox = this.add.graphics()
            .fillStyle(0x1a1a1a, 0.95)
            .fillRoundedRect(250, 180, 500, totalHeight, 15)
            .setDepth(12);
        this.dialogueElements.push(dialogueBox);

        this.currentText = text;
        this.typedText = this.add.text(270, 200, '', {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            lineSpacing: 10,
            wordWrap: { width: 460 }
        }).setDepth(13);
        this.dialogueElements.push(this.typedText);

        this.optionStartY = 200 + textHeight + 20;

        this.isTextTyping = true;
        this.typeText();

        this.input.keyboard.on('keydown-SPACE', this.skipTyping, this);
        this.input.on('pointerdown', this.skipTyping, this);
    }

    createPortrait(expression = 'neutral') {
        // Eliminar retratos anteriores
        this.dialogueElements.forEach((element, index) => {
            if(element.texture && element.texture.key.startsWith('dio_')) {
                element.destroy();
                this.dialogueElements.splice(index, 1);
            }
        });

        // Mapeo de expresiones
        const expressions = {
            neutral: 'dio_neutral',
            smile: 'dio_smile',
            angry: 'dio_angry',
            thoughtful: 'dio_thoughtful',
            smirk: 'dio_smirk'
        };

        const portrait = this.add.image(150, 300, expressions[expression])
            .setScale(0.7)
            .setDepth(11);
        
        this.dialogueElements.push(portrait);
    }

    typeText() {
        const length = this.typedText.text.length;
        if (length < this.currentText.length) {
            this.typedText.setText(this.currentText.substr(0, length + 1));
            this.time.delayedCall(40, this.typeText, [], this);
        } else {
            this.isTextTyping = false;
            this.createOptionsAfterText();
        }
    }

    skipTyping() {
        if (!this.isTextTyping) return;
        
        this.typedText.setText(this.currentText);
        this.time.removeAllEvents();
        this.isTextTyping = false;
        this.createOptionsAfterText();
    }

    createOptionsAfterText() {
        const currentOptions = this.dialogueConfig[this.currentDialogueStep].options;
        this.createOptions(currentOptions);
        
        this.input.keyboard.off('keydown-SPACE', this.skipTyping, this);
        this.input.off('pointerdown', this.skipTyping, this);
    }

    createOptions(options) {
        const optionHeight = 35;
        options.forEach((option, index) => {
            const btn = this.add.text(270, this.optionStartY + (index * optionHeight), `➤ ${option.text}`, {
                fontSize: '18px',
                fill: '#FFD700',
                fontFamily: 'Arial',
                backgroundColor: '#2d2d2d',
                padding: { x: 10, y: 5 },
                wordWrap: { width: 460 }
            })
            .setInteractive()
            .on('pointerover', () => btn.setBackgroundColor('#3d3d3d'))
            .on('pointerout', () => btn.setBackgroundColor('#2d2d2d'))
            .on('pointerdown', () => this.handleOptionSelection(option))
            .setDepth(13);
            
            this.dialogueElements.push(btn);
        });
    }

    handleOptionSelection(option) {
        this.affinity += option.affinity;
        this.showDioResponse(option);
    }

    showDioResponse(option) {
        this.clearDialogueElements();
        this.createDialogueOverlay();
        this.createPortrait(option.expression); // Actualizar expresión

        const tempText = this.add.text(270, 200, option.response, {
            fontSize: '20px',
            fontFamily: 'Arial',
            lineSpacing: 10,
            wordWrap: { width: 460 }
        }).setVisible(false);
        
        const textHeight = tempText.height;
        tempText.destroy();

        const responseBox = this.add.graphics()
            .fillStyle(0x1a1a1a, 0.95)
            .fillRoundedRect(250, 180, 500, textHeight + 60, 15)
            .setDepth(12);
        this.dialogueElements.push(responseBox);

        const response = this.add.text(270, 200, option.response, {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial',
            lineSpacing: 10,
            wordWrap: { width: 460 }
        }).setDepth(13);
        this.dialogueElements.push(response);

        const continueText = this.add.text(670, 200 + textHeight + 10, '[Continuar]', {
            fontSize: '16px',
            fill: '#FFD700',
            fontStyle: 'italic'
        })
        .setInteractive()
        .on('pointerdown', () => this.continueDialogue())
        .setDepth(13);
        this.dialogueElements.push(continueText);

        this.input.keyboard.once('keydown-SPACE', () => this.continueDialogue());
    }

    continueDialogue() {
        this.currentDialogueStep++;
        if(this.currentDialogueStep < 10) {
            this.showDialogueStep();
        } else {
            this.endDialogue();
        }
    }

    endDialogue() {
        this.clearDialogueElements();
        this.dialogueActive = true;
        this.game.registry.set('affinity', this.affinity);
        this.physics.pause();
        this.player.setVelocity(0);
        
        this.input.keyboard.off('keydown-SPACE', this.skipTyping, this);
        this.input.off('pointerdown', this.skipTyping, this);
        
        this.scene.start('GameOverScene');
        this.scene.stop();
    }

    clearDialogueElements() {
        this.dialogueElements.forEach(element => element.destroy());
        this.dialogueElements = [];
    }

    createDialogueOverlay() {
        const overlay = this.add.graphics()
            .fillStyle(0x000000, 0.6)
            .fillRect(0, 0, 800, 600)
            .setDepth(10);
        this.dialogueElements.push(overlay);
    }

    shutdown() {
        this.dialogueActive = false;
        this.currentDialogueStep = 0;
        this.affinity = 0;
        this.dialogueElements = [];
        
        if (this.player) this.player.destroy();
        if (this.dio) this.dio.destroy();
        
        this.physics.world.resume();
    }
}