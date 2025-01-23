# Beach Dialogue Game

A visual novel-style dialogue game built with Phaser 3, featuring various scenes with dynamic character interactions, minigames and multiple dialogue choices.

## Description

In this game, players interact with a character named Dio on different settings. The game features:
- Multiple dialogue choices that affect character affinity
- Dynamic character expressions
- Fluid character movement and animations
- Choice-based narrative progression
- Minigames
- Different endings depending on the player's choices

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ismaelponce/5DiasConDio.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm start
```

## Project Structure

```
├── src/
│   ├── scenes/
│   │   ├── BeachScene.js    # Main gameplay scene
│   │   ├── GameOverScene.js # End game scene
│   │   └── MenuScene.js     # Starting menu
│   ├── entities/
│   │   └── Character.js     # Character entity logic
│   └── main.js              # Game initialization
└── index.html               # Entry point
```

## Gameplay

- Use arrow keys to move your character
- Approach Dio and other characters to initiate dialogue
- Select dialogue options to progress the story and choose carefully
- Your choices affect the character's affinity towards you
- Different responses trigger various character expressions
- Have fun!

## Technical Details

Built with:
- Phaser 3 Game Framework
- JavaScript (ES6+)
- HTML5

## Development

To contribute to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.