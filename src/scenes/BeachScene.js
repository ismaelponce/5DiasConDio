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
        this.lastKeyPressTime = 0; // Nueva propiedad para control de tiempo
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
        this.createPortrait('neutral');

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
            {
                text: "Dio:\n¿Crees que el arte debe\nreflejar la realidad o escapar de ella?",
                options: [
                    { 
                        text: "Reflejar la realidad", 
                        affinity: +2,
                        response: "Dio:\nLa crudeza de la verdad siempre inspira arte poderoso...",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "Ofrecer escapismo", 
                        affinity: +1,
                        response: "Dio:\nLos mundos imaginarios son refugios necesarios...",
                        expression: 'neutral'
                    },
                    { 
                        text: "Ambos son válidos", 
                        affinity: +3,
                        response: "Dio:\nEquilibrio perfecto... como un haiku bien estructurado.",
                        expression: 'smile'
                    },
                    { 
                        text: "El arte no tiene propósito", 
                        affinity: -4,
                        response: "Dio:\n¡Qué afirmación vacía! *cierra bruscamente su cuaderno*",
                        expression: 'angry'
                    },
                    { 
                        text: "No tengo opinión", 
                        affinity: 0,
                        response: "Dio:\nLa indiferencia también es una forma de arte, ¿no crees?",
                        expression: 'smirk'
                    }
                ]
            },
            {
                text: "Dio:\n¿Qué opinas de las\nrelaciones a distancia?",
                options: [
                    { 
                        text: "Demuestran amor verdadero", 
                        affinity: +4,
                        response: "Dio:\nEl amor que trasciende el espacio... pura poesía.",
                        expression: 'smile'
                    },
                    { 
                        text: "Son difíciles de mantener", 
                        affinity: +1,
                        response: "Dio:\nLa constancia es el verdadero desafío, ¿cierto?",
                        expression: 'neutral'
                    },
                    { 
                        text: "No funcionan a largo plazo", 
                        affinity: -2,
                        response: "Dio:\nCínico... pero quizás realista.",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "Son una pérdida de tiempo", 
                        affinity: -3,
                        response: "Dio:\n*Arroja arena al mar* ¡Qué visión más pragmática!",
                        expression: 'angry'
                    },
                    { 
                        text: "Depende de cada caso", 
                        expression: 'smirk',
                        affinity: 0,
                        response: "Dio:\nRespuesta diplomática... interesante postura."
                    }
                ]
            },
            {
                text: "Dio:\nCuando miras al mar,\n¿en qué piensas?",
                options: [
                    { 
                        text: "En lo vasto del universo", 
                        affinity: +3,
                        response: "Dio:\nSomos motas de polvo cósmico... sublime perspectiva.",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "En la belleza natural", 
                        affinity: +2,
                        response: "Dio:\nLa naturaleza es el mejor poema no escrito.",
                        expression: 'smile'
                    },
                    { 
                        text: "En nada en particular", 
                        affinity: 0,
                        response: "Dio:\nLa mente en blanco puede ser un refugio...",
                        expression: 'neutral'
                    },
                    { 
                        text: "En lo insignificante que somos", 
                        affinity: -2,
                        response: "Dio:\nExistencialismo puro... fascinante y aterrador.",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "Solo disfruto el momento", 
                        affinity: +1,
                        response: "Dio:\nCarpe diem... filosofía admirablemente simple.",
                        expression: 'smirk'
                    }
                ]
            },
            {
                text: "Dio:\n¿Prefieres el amanecer\n o el atardecer?",
                options: [
                    { 
                        text: "Amanecer - nuevos comienzos", 
                        affinity: +2,
                        response: "Dio:\nEl lienzo en blanco de cada mañana... esperanza pura.",
                        expression: 'smile'
                    },
                    { 
                        text: "Atardecer - reflexión", 
                        affinity: +3,
                        response: "Dio:\nEl crepúsculo inspira mis versos más íntimos...",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "Ambos tienen su encanto", 
                        affinity: +1,
                        response: "Dio:\nEquilibrado como un soneto perfecto.",
                        expression: 'neutral'
                    },
                    { 
                        text: "Odio ambos por igual", 
                        affinity: -3,
                        response: "Dio:\n*Rompe una ola con el pie* ¡Qué declaración tan visceral!",
                        expression: 'angry'
                    },
                    { 
                        text: "Cualquier hora es buena", 
                        affinity: 0,
                        response: "Dio:\nFlexibilidad... virtud subestimada.",
                        expression: 'smirk'
                    }
                ]
            },
            {
                text: "Dio:\n¿Qué cualidad valoras más\nen una persona?",
                options: [
                    { 
                        text: "Honestidad", 
                        affinity: +4,
                        response: "Dio:\nLa verdad, aunque duela... cualidad de almas fuertes.",
                        expression: 'smile'
                    },
                    { 
                        text: "Lealtad", 
                        affinity: +3,
                        response: "Dio:\nRara joya en este mundo cambiante...",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "Empatía", 
                        affinity: +3,
                        response: "Dio:\nEntender el dolor ajeno... don de poetas.",
                        expression: 'neutral'
                    },
                    { 
                        text: "Ninguna tiene valor", 
                        affinity: -4,
                        response: "Dio:\n*Ríe amargamente* ¡Qué nihilismo más refrescante!",
                        expression: 'angry'
                    },
                    { 
                        text: "Todas son importantes", 
                        affinity: +1,
                        response: "Dio:\nVisión holística... perspectiva interesante.",
                        expression: 'smirk'
                    }
                ]
            },
            {
                text: "Dio:\n¿Crees en el amor\na primera vista?",
                options: [
                    { 
                        text: "Absolutamente", 
                        affinity: +2,
                        response: "Dio:\nRomántico incorregible... ¿has leído mucho a Neruda?",
                        expression: 'smile'
                    },
                    { 
                        text: "Es solo atracción física", 
                        affinity: -1,
                        response: "Dio:\nCientífico enfoque... ¿nunca te ha traicionado el corazón?",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "Depende de la conexión", 
                        affinity: +3,
                        response: "Dio:\nAlquimia de almas... hermosa metáfora.",
                        expression: 'neutral'
                    },
                    { 
                        text: "El amor no existe", 
                        affinity: -4,
                        response: "Dio:\n*Rompe una pluma imaginaria* ¡Qué declaración más triste!",
                        expression: 'angry'
                    },
                    { 
                        text: "No lo he pensado", 
                        affinity: 0,
                        response: "Dio:\nLa indiferencia también tiene su encanto...",
                        expression: 'smirk'
                    }
                ]
            },
            {
                text: "Dio:\n¿Qué harías si tuvieras\nsolo un día de vida?",
                options: [
                    { 
                        text: "Pasar tiempo con seres queridos", 
                        affinity: +4,
                        response: "Dio:\nLos lazos humanos... único legado que perdura.",
                        expression: 'smile'
                    },
                    { 
                        text: "Vivir una aventura", 
                        affinity: +2,
                        response: "Dio:\n¡Carpe diem en estado puro! Espíritu valiente...",
                        expression: 'neutral'
                    },
                    { 
                        text: "Reflexionar en soledad", 
                        affinity: +1,
                        response: "Dio:\nEl autoconocimiento como epílogo... profundo.",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "Destruir algo importante", 
                        affinity: -5,
                        response: "Dio:\n*Sonríe siniestramente* ¡Qué final más dramático!",
                        expression: 'angry'
                    },
                    { 
                        text: "Seguir mi rutina normal", 
                        affinity: 0,
                        response: "Dio:\nEstabilidad hasta el final... enfoque práctico.",
                        expression: 'smirk'
                    }
                ]
            },
            {
                text: "Dio:\n¿Crees que nuestros\ndestinos están escritos?",
                options: [
                    { 
                        text: "Sí, todo está predeterminado", 
                        affinity: +1,
                        response: "Dio:\nFatalista... ¿y el libre albedrío? *hojea su libro*",
                        expression: 'thoughtful'
                    },
                    { 
                        text: "No, forjamos nuestro camino", 
                        affinity: +3,
                        response: "Dio:\n¡Voluntad inquebrantable! Admirable convicción.",
                        expression: 'smile'
                    },
                    { 
                        text: "Depende de las decisiones", 
                        affinity: +2,
                        response: "Dio:\nEquilibrio entre caos y orden... sabia perspectiva.",
                        expression: 'neutral'
                    },
                    { 
                        text: "El destino es una mentira", 
                        affinity: -3,
                        response: "Dio:\nRebelde contra el cosmos... posición interesante.",
                        expression: 'smirk'
                    },
                    { 
                        text: "Prefiero no responder", 
                        affinity: 0,
                        response: "Dio:\nEl misterio... a veces la mejor respuesta.",
                        expression: 'thoughtful'
                    }
                ]
            }
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
        const controlsHintHeight = 25;
        const totalHeight = textHeight + optionHeight + padding + controlsHintHeight;

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

        // Hint de controles
        const controlsHint = this.add.text(270, 200 + textHeight + optionHeight + 30, 
            'Usa ↑/↓ para navegar, ESPACIO/ENTER para seleccionar', {
                fontSize: '16px',
                fill: '#AAAAAA',
                fontStyle: 'italic'
            }).setDepth(13);
        this.dialogueElements.push(controlsHint);

        this.optionStartY = 200 + textHeight + 20;

        this.isTextTyping = true;
        this.typeText();

        this.input.keyboard.on('keydown-SPACE', this.skipTyping, this);
        this.input.on('pointerdown', this.skipTyping, this);
    }

    createPortrait(expression = 'neutral') {
        this.dialogueElements.forEach((element, index) => {
            if(element.texture && element.texture.key.startsWith('dio_')) {
                element.destroy();
                this.dialogueElements.splice(index, 1);
            }
        });

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
        this.currentOptions = options;
        this.selectedOptionIndex = 0;
        this.lastKeyPressTime = 0; // Resetear temporizador

        // Eliminar listeners antiguos
        this.input.keyboard.off('keydown-UP');
        this.input.keyboard.off('keydown-DOWN');

        // Crear botones
        this.optionButtons = options.map((option, index) => {
            const btn = this.add.text(270, this.optionStartY + (index * optionHeight), `➤ ${option.text}`, {
                fontSize: '18px',
                fill: '#FFD700',
                fontFamily: 'Arial',
                backgroundColor: '#2d2d2d',
                padding: { x: 10, y: 5 },
                wordWrap: { width: 460 }
            })
            .setInteractive()
            .on('pointerover', () => this.hoverOption(index))
            .on('pointerout', () => this.resetOptionStyle(index))
            .on('pointerdown', () => this.handleOptionSelection(option))
            .setDepth(13);
            
            this.dialogueElements.push(btn);
            return btn;
        });

        this.hoverOption(0);
        
        // Nuevo sistema de navegación con throttling
        this.input.keyboard.on('keydown-UP', () => {
            if (Date.now() - this.lastKeyPressTime < 150) return;
            this.handleKeyUp();
            this.lastKeyPressTime = Date.now();
        });

        this.input.keyboard.on('keydown-DOWN', () => {
            if (Date.now() - this.lastKeyPressTime < 150) return;
            this.handleKeyDown();
            this.lastKeyPressTime = Date.now();
        });

        this.input.keyboard.on('keydown-ENTER', () => this.handleKeyEnter());
        this.input.keyboard.on('keydown-SPACE', () => this.handleKeyEnter());
    }

    hoverOption(index) {
        this.optionButtons.forEach((btn, i) => {
            btn.setBackgroundColor(i === index ? '#3d3d3d' : '#2d2d2d');
            btn.setStyle({ fill: i === index ? '#FFA500' : '#FFD700' });
        });
        this.selectedOptionIndex = index;
    }

    resetOptionStyle(index) {
        if (index === this.selectedOptionIndex) return;
        this.optionButtons[index].setBackgroundColor('#2d2d2d');
        this.optionButtons[index].setStyle({ fill: '#FFD700' });
    }

    handleKeyUp() {
        const newIndex = Phaser.Math.Clamp(
            this.selectedOptionIndex - 1, 
            0, 
            this.currentOptions.length - 1
        );
        
        if (newIndex !== this.selectedOptionIndex) {
            this.selectedOptionIndex = newIndex;
            this.hoverOption(this.selectedOptionIndex);
        }
    }

    handleKeyDown() {
        const newIndex = Phaser.Math.Clamp(
            this.selectedOptionIndex + 1, 
            0, 
            this.currentOptions.length - 1
        );
        
        if (newIndex !== this.selectedOptionIndex) {
            this.selectedOptionIndex = newIndex;
            this.hoverOption(this.selectedOptionIndex);
        }
    }

    handleKeyEnter() {
        this.handleOptionSelection(this.currentOptions[this.selectedOptionIndex]);
    }

    handleOptionSelection(option) {
        this.input.keyboard.off('keydown-UP', this.handleKeyUp, this);
        this.input.keyboard.off('keydown-DOWN', this.handleKeyDown, this);
        this.input.keyboard.off('keydown-ENTER', this.handleKeyEnter, this);
        this.input.keyboard.off('keydown-SPACE', this.handleKeyEnter, this);
        
        this.affinity += option.affinity;
        this.showDioResponse(option);
    }

    showDioResponse(option) {
        this.clearDialogueElements();
        this.createDialogueOverlay();
        this.createPortrait(option.expression);

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
        this.input.keyboard.off('keydown-UP', this.handleKeyUp, this);
        this.input.keyboard.off('keydown-DOWN', this.handleKeyDown, this);
        this.input.keyboard.off('keydown-ENTER', this.handleKeyEnter, this);
        this.input.keyboard.off('keydown-SPACE', this.handleKeyEnter, this);
        
        this.dialogueElements.forEach(element => element.destroy());
        this.dialogueElements = [];
        this.optionButtons = [];
        this.currentOptions = null;
    }

    createDialogueOverlay() {
        const overlay = this.add.graphics()
            .fillStyle(0x000000, 0.6)
            .fillRect(0, 0, 800, 600)
            .setDepth(10);
        this.dialogueElements.push(overlay);
    }

    clearDialogueElements() {
        // Limpiar todos los listeners de teclado
        this.input.keyboard.off('keydown-UP');
        this.input.keyboard.off('keydown-DOWN');
        this.input.keyboard.off('keydown-ENTER');
        this.input.keyboard.off('keydown-SPACE');
        
        this.dialogueElements.forEach(element => element.destroy());
        this.dialogueElements = [];
        this.optionButtons = [];
        this.currentOptions = null;
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