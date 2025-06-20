# KoulesII - Enhanced Physics Space Game

A modern JavaScript/Pixi.js evolution of the classic Koules game, originally created by Jan Hubicka in 1995. KoulesII features enhanced physics, deadly walls, and gravitational black holes for an extremely challenging space piloting experience.

## About KoulesII

KoulesII is an enhanced version of the classic fast-paced physics-based space game where players control rockets to push balls into holes while surviving in an extremely dangerous environment. The game features:

- **Acceleration-based controls** with realistic momentum and inertia
- **Deadly walls** that destroy any object on contact
- **Gravitational black holes** that pull objects toward them
- **Instant death mechanics** for maximum challenge
- Real-time physics simulation with enhanced collision detection
- Multi-player support (up to 5 players)
- Progressive difficulty levels
- Retro-style graphics and procedural sound effects

## Features

### Enhanced Game Mechanics
- **Acceleration-Based Control**: Navigate your rocket using realistic thrust physics with momentum and inertia
- **Deadly Environment**: All walls instantly destroy any object that touches them
- **Gravitational Black Holes**: Holes pull nearby objects toward them - helpful for balls, deadly for rockets
- **Enhanced Physics**: Realistic collision detection with mass-based interactions
- **Ball Management**: Push balls into holes to score points without getting your rocket killed
- **Extreme Challenge**: Every movement requires precision and planning
- **Progressive Levels**: Increasing difficulty with more balls, obstacles, and gravitational hazards
- **Multi-player**: Support for 1-5 players simultaneously in the ultimate survival challenge

### Technical Features
- **Modern JavaScript**: ES6+ modules and async/await
- **Pixi.js Rendering**: Hardware-accelerated 2D graphics with particle effects
- **Web Audio API**: Procedural sound generation with multiple sound types
- **Enhanced Physics**: Force-based movement with gravitational calculations
- **Responsive Design**: Scales to different screen sizes
- **Cross-platform**: Runs in any modern web browser
- **Real-time Effects**: Gravitational field visualization and explosion particles

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

### Quick Play
For immediate gameplay, open `koules-standalone.html` directly in your browser - no installation required!

### Build for Production
```bash
npm run build
```

## Game Objects

### Rockets
- **Color**: Different colors for each player (blue, red, green, yellow, magenta)
- **Enhanced Physics**: Acceleration-based movement with realistic momentum and inertia
- **Deadly Vulnerability**: Instantly destroyed by wall contact or black hole collision
- **Controls**: Force-based thrust system requiring precision and planning
- **Gravity Resistance**: Must fight against black hole gravitational pull

### Balls
- **Regular Balls**: Standard targets to push into holes - die instantly if they hit walls
- **Big Balls**: Larger, heavier balls with more mass (appear in higher levels) - also die on wall contact
- **Letter Balls**: Special balls with power-ups (future feature)

### Black Holes
- **Gravitational Pull**: Holes now attract all nearby objects with realistic physics
- **Dual Nature**: Help guide balls to scoring positions but deadly to rockets
- **Visual Effects**: Pulsing animation and gravity field indicators show active gravitational zones
- **Strategic Elements**: Create risk/reward positioning challenges

### Special Objects (Higher Levels)
- **Apples**: Bonus objects
- **Inspectors**: Moving obstacles
- **Lunatics**: Unpredictable moving objects

## Game Modes

### Cooperative Mode
- All players work together to clear levels while surviving the deadly environment
- Shared score and lives
- Progress through increasingly difficult levels with more hazards
- **Extreme Challenge**: Requires teamwork and precision to survive

### Deathmatch Mode (Future Feature)
- Players compete against each other in the hazardous environment
- Last player standing wins
- Wall and black hole deaths still apply
- Environmental hazards become weapons

## Technical Architecture

### Core Components

#### GameEngine
- Main game loop and state management
- Enhanced physics simulation with gravitational forces
- Acceleration-based movement system
- Advanced collision detection with death mechanics
- Object lifecycle management
- Win/lose condition checking
- Particle effect system

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

### Enhanced Physics System
- **Acceleration-Based Movement**: Force integration with realistic momentum
- **Gravitational Fields**: Black holes apply inverse-square law attraction forces
- **Collision Detection**: Circle-based collision detection with death mechanics
- **Momentum Conservation**: Mass-based realistic physics interactions
- **Deadly Boundaries**: Screen edges instantly destroy all objects
- **Force Application**: Multi-source force system (thrust + gravity)
- **Velocity Limiting**: Maximum speed caps prevent runaway acceleration

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
- ✅ Enhanced acceleration-based physics
- ✅ Deadly wall collision system
- ✅ Gravitational black hole mechanics
- ✅ Multi-player input with 5-player support
- ✅ Advanced collision detection with death mechanics
- ✅ Procedural sound effects with multiple audio types
- ✅ Particle explosion effects
- ✅ Visual gravity field indicators
- ✅ Menu system with detailed controls
- ✅ Level progression with increasing difficulty

### Future Enhancements
- 🔄 Network multiplayer with synchronized deadly physics
- 🔄 Advanced AI opponents that understand gravity and death mechanics
- 🔄 Custom level editor with configurable gravity and death zones
- 🔄 Power-up system (gravity shields, wall protection, etc.)
- 🔄 Enhanced particle effects and visual feedback
- 🔄 Mobile touch controls adapted for precision physics
- 🔄 Difficulty modifiers (gravity strength, wall leniency)
- 🔄 Spectator mode for watching the carnage

## Performance

The game is optimized for:
- **60 FPS gameplay** with complex physics calculations on modern browsers
- **Low memory usage** with efficient object pooling and particle cleanup
- **Smooth physics** with fixed timestep gravitational calculations
- **Responsive input** with minimal latency for precision control
- **Efficient particle systems** for explosion and gravity effects
- **Optimized collision detection** for deadly environment mechanics

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

### KoulesII Enhancement
- **Enhanced Implementation**: Modern JavaScript with advanced physics
- **Framework**: Pixi.js for hardware-accelerated rendering
- **Audio**: Web Audio API with procedural sound generation
- **Physics**: Acceleration-based movement with gravitational mechanics
- **Death Systems**: Comprehensive collision-based destruction mechanics
- **Visual Effects**: Particle explosions and gravity field visualization

## License

This project maintains the original GPL-2.0 license from the original Koules game.

## Acknowledgments

Special thanks to Jan Hubicka for creating the original Koules game and making it freely available. KoulesII builds upon the brilliant foundation of the original while adding extreme challenges and enhanced physics that push the gameplay to new levels of difficulty.

The original game inspired a generation of indie game developers and remains a classic example of physics-based gameplay done right. KoulesII honors that legacy while creating an almost impossibly challenging experience that demands absolute precision and strategic thinking.

**Warning**: KoulesII is significantly more difficult than the original Koules. The combination of deadly walls, gravitational black holes, and acceleration-based controls creates an extremely punishing but rewarding gameplay experience.