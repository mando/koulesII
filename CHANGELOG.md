# Changelog

All notable changes to KoulesII are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2025-07-01]

### Added
- Mass transfer system between objects
- Black hole mass accumulation when objects collide with them
- Debug mode with '?' key toggle for displaying game statistics
- Mass and velocity display in debug mode
- Black hole mass display in debug mode
- Scoring system with points for destroying balls and completing levels
- Extra life system (awarded at 500 points)
- Level completion bonus (100 points per level)
- Different point values for large vs small balls
- Mixed ball sizes (large and small) for varied gameplay
- Mass persistence across levels for rockets

### Changed
- Removed velocity cap for faster gameplay ("mama im going fast")
- Improved extra life notification system
- Enhanced mass transfer logic with better debugging
- Thrust force scaling to maintain constant acceleration regardless of mass
- Mass transfer now occurs before velocity changes for more accurate physics
- Debug stats are now hidden by default
- Larger playing canvas for better gameplay experience
- Better spawn positioning to reduce cheap deaths near black holes

### Fixed
- Mass transfer timing issues
- Cleaner mass transfer logic implementation

## [2025-06-27]

### Added
- GitHub Pages deployment support
- Symlink configuration for web hosting
- Centered div styling improvements

### Changed
- Project renamed from "koulespixi" to "koulesII"

## [2025-06-18 to 2025-06-20]

### Added
- Initial game implementation
- Player death on wall collision
- Universal wall collision death (all objects die when hitting walls)
- Black hole gravity system
- Black hole collision death for players
- Basic game physics and rendering
- Multi-player support
- Core game mechanics

### Features Implemented
- Acceleration-based rocket controls
- Deadly environment (walls kill everything)
- Gravitational black holes
- Ball physics and collision detection
- Multi-player input system (up to 5 players)
- Pixi.js rendering engine integration
- Web Audio API sound system
- Menu system
- Level progression

### Technical Achievements
- Modern JavaScript ES6+ implementation
- Hardware-accelerated 2D graphics
- Real-time physics simulation
- Cross-platform browser compatibility
- Responsive design scaling

---

## Release History Summary

- **2025-06-18 to 2025-06-20**: Initial release with core gameplay mechanics
- **2025-06-27**: Project rebranding and deployment setup  
- **2025-07-01**: Major gameplay enhancements with mass system, scoring, and improved physics

## Development Notes

The game has evolved from a basic physics implementation to a sophisticated system featuring:
- Dynamic mass transfer between objects
- Realistic gravitational physics
- Advanced scoring and progression systems
- Enhanced debugging capabilities
- Improved player experience through better spawn mechanics and notifications

Each update has focused on making the game more challenging and physically accurate while maintaining the fast-paced, precision-based gameplay that defines the Koules experience.