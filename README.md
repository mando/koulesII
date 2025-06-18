# Koules - Pixi.js Edition

A modern JavaScript/Pixi.js implementation of the classic Koules game, originally created by Jan Hubicka in 1995.

## About Koules

Koules is a fast-paced physics-based space game where players control rockets to push balls into holes while avoiding collisions. The game features:

- Real-time physics simulation
- Multi-player support (up to 5 players)
- Progressive difficulty levels
- Retro-style graphics and sound effects

## Features

### Game Mechanics
- **Rocket Control**: Navigate your rocket using thrust in any direction
- **Physics Simulation**: Realistic collision detection and momentum physics
- **Ball Management**: Push balls into holes to score points
- **Progressive Levels**: Increasing difficulty with more balls and obstacles
- **Multi-player**: Support for 1-5 players simultaneously

### Technical Features
- **Modern JavaScript**: ES6+ modules and async/await
- **Pixi.js Rendering**: Hardware-accelerated 2D graphics
- **Web Audio API**: Dynamic sound generation
- **Responsive Design**: Scales to different screen sizes
- **Cross-platform**: Runs in any modern web browser

## Controls

### Player 1
- **Arrow Keys**: Move rocket
- **Spacebar**: Brake/Reverse thrust

### Player 2
- **WASD**: Move rocket
- **Left Shift**: Brake/Reverse thrust

### Player 3
- **IJKL**: Move rocket
- **U**: Brake/Reverse thrust

### Player 4
- **Numpad 8,4,6,2**: Move rocket
- **Numpad 0**: Brake/Reverse thrust

### Player 5
- **TFGH**: Move rocket
- **R**: Brake/Reverse thrust

### Global Controls
- **ESC**: Pause/Menu
- **R**: Restart level (during gameplay)

## Installation

### Prerequisites
- Node.js 14+ and npm

### Setup
1. Navigate to the project directory:
   ```bash
   cd mac-koules/koules-pixijs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Game Objects

### Rockets
- **Color**: Different colors for each player
- **Physics**: Low mass, high maneuverability
- **Controls**: Thrust-based movement with momentum

### Balls
- **Regular Balls**: Standard targets to push into holes
- **Big Balls**: Larger, heavier balls (appear in higher levels)
- **Letter Balls**: Special balls with power-ups (future feature)

### Holes
- **Regular Holes**: Target destinations for balls
- **Energy Holes**: Special holes with different properties (future feature)

### Special Objects (Higher Levels)
- **Apples**: Bonus objects
- **Inspectors**: Moving obstacles
- **Lunatics**: Unpredictable moving objects

## Game Modes

### Cooperative Mode
- All players work together to clear levels
- Shared score and lives
- Progress through increasingly difficult levels

### Deathmatch Mode (Future Feature)
- Players compete against each other
- Last player standing wins
- Collision damage enabled

## Technical Architecture

### Core Components

#### GameEngine
- Main game loop and state management
- Physics simulation and collision detection
- Object lifecycle management
- Win/lose condition checking

#### InputManager
- Multi-player keyboard input handling
- Configurable control schemes
- Real-time input processing

#### AudioManager
- Web Audio API sound generation
- Dynamic sound effects
- Volume and settings management

#### MenuSystem
- Game state navigation
- UI interaction handling
- Settings management

### Physics System
- **Collision Detection**: Circle-based collision detection
- **Momentum Conservation**: Realistic physics interactions
- **Boundary Handling**: Screen edge collision and wrapping
- **Force Application**: Thrust-based movement system

### Rendering Pipeline
- **Pixi.js Graphics**: Hardware-accelerated sprite rendering
- **Dynamic Objects**: Real-time sprite generation
- **Visual Effects**: Particle systems and animations
- **UI Overlay**: HTML/CSS-based interface

## Development

### Project Structure
```
src/
├── main.js              # Entry point
├── game/
│   └── GameEngine.js    # Core game logic
├── input/
│   └── InputManager.js  # Input handling
├── audio/
│   └── AudioManager.js  # Sound management
└── ui/
    └── MenuSystem.js    # Menu navigation
```

### Key Features Implemented
- ✅ Basic game physics
- ✅ Multi-player input
- ✅ Collision detection
- ✅ Sound effects
- ✅ Menu system
- ✅ Level progression

### Future Enhancements
- 🔄 Network multiplayer
- 🔄 Advanced AI opponents
- 🔄 Custom level editor
- 🔄 Power-up system
- 🔄 Particle effects
- 🔄 Mobile touch controls

## Performance

The game is optimized for:
- **60 FPS gameplay** on modern browsers
- **Low memory usage** with object pooling
- **Smooth physics** with fixed timestep
- **Responsive input** with minimal latency

## Browser Compatibility

- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11+)
- **Edge**: Full support

## Credits

### Original Game
- **Original Author**: Jan Hubicka (1995)
- **Graphics**: Jan Hubicka and Kamil Toman
- **Sounds**: Jan Hubicka

### Pixi.js Edition
- **Conversion**: Modern JavaScript implementation
- **Framework**: Pixi.js for rendering
- **Audio**: Web Audio API implementation

## License

This project maintains the original GPL-2.0 license from the original Koules game.

## Acknowledgments

Special thanks to Jan Hubicka for creating the original Koules game and making it freely available. This modern implementation aims to preserve the fun and challenge of the original while bringing it to modern web browsers.

The original game inspired a generation of indie game developers and remains a classic example of physics-based gameplay done right.