/**
 * GameEngine.js - Main game engine for Koules
 *
 * Handles game state, physics, collision detection, and rendering
 * Based on the original Koules game mechanics
 */

import * as PIXI from "pixi.js";

// Game constants (from original koules.h)
const GAME_CONSTANTS = {
  // Object types
  ROCKET: 1,
  BALL_SMALL: 2,
  BALL_LARGE: 3,
  CREATOR: 4,
  HOLE: 5,
  BBALL: 6,
  APPLE: 7,
  INSPECTOR: 8,
  EHOLE: 9,
  LUNATIC: 10,

  // Radii
  BALL_SMALL_RADIUS: 8,
  BALL_LARGE_RADIUS: 16,
  BBALL_RADIUS: 16,
  APPLE_RADIUS: 32,
  INSPECTOR_RADIUS: 14,
  LUNATIC_RADIUS: 10,
  HOLE_RADIUS: 12,
  ROCKET_RADIUS: 14,

  // Physics constants
  ROCKET_SPEED: 1.2,
  BALL_SPEED: 1.2,
  BBALL_SPEED: 1.2,
  SLOWDOWN: 0.8,
  GUMM: 20,

  // Masses
  BALL_SMALL_MASS: 3,
  BALL_LARGE_MASS: 6,
  BBALLM: 8,
  APPLEM: 34,
  INSPECTORM: 2,
  LUNATICM: 3.14,
  ROCKETM: 4,

  // Colors
  ROCKET_COLORS: [0x606060, 0xa0a0a0, 0x404040, 0x606060, 0x808080],
  BALL_SMALL_COLOR: 0x404040,
  BALL_LARGE_COLOR: 0x606060,
  BBALL_COLOR: 0x808080,
  APPLE_COLOR: 0x404040,
  HOLE_COLOR: 0x404040,
  EHOLE_COLOR: 0x808080,
};

export class GameEngine extends PIXI.utils.EventEmitter {
  constructor(app, inputManager, audioManager) {
    super();

    this.app = app;
    this.inputManager = inputManager;
    this.audioManager = audioManager;

    // Game state
    this.gameState = "stopped"; // stopped, running, paused
    this.level = 1;
    this.score = 0;
    this.lives = 3;
    this.nextLifeAt = 500; // Next life awarded at this score
    this.playerCount = 1;
    this.gameMode = "cooperative";

    // Game objects
    this.objects = [];
    this.rockets = [];
    this.balls = [];
    this.effects = [];

    // Containers
    this.gameContainer = new PIXI.Container();
    this.app.stage.addChild(this.gameContainer);

    // Game loop
    this.lastTime = 0;
    this.deltaTime = 0;

    // Physics settings
    this.gravity = 0;
    this.friction = 0.99;

    // Gravity constants
    this.GRAVITY_STRENGTH = 1000;
    this.MIN_GRAVITY_DISTANCE = 30;
    this.MAX_GRAVITY_DISTANCE = 150;

    this.init();
  }

  init() {
    // Create background
    this.createBackground();

    // Setup game loop
    this.app.ticker.add(this.gameLoop.bind(this));

    console.log("GameEngine initialized");
  }

  createBackground() {
    const bg = new PIXI.Graphics();
    bg.beginFill(0x000011);
    bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    bg.endFill();

    // Add some stars
    for (let i = 0; i < 50; i++) {
      const star = new PIXI.Graphics();
      star.beginFill(0x444444);
      star.drawCircle(0, 0, Math.random() * 2 + 1);
      star.endFill();
      star.x = Math.random() * this.app.screen.width;
      star.y = Math.random() * this.app.screen.height;
      bg.addChild(star);
    }

    this.gameContainer.addChild(bg);
  }

  async startGame(config) {
    this.playerCount = config.playerCount || 1;
    this.level = config.level || 1;
    this.gameMode = config.gameMode || "cooperative";
    this.score = 0;
    this.lives = 3;
    this.nextLifeAt = 500; // Reset life threshold

    // Clear existing objects
    this.clearGame();

    // Initialize level
    this.initLevel();

    // Start game loop
    this.gameState = "running";

    this.emit("gameStarted", {
      level: this.level,
      playerCount: this.playerCount,
      gameMode: this.gameMode,
    });

    console.log(
      `Game started - Level: ${this.level}, Players: ${this.playerCount}`,
    );
  }

  clearGame() {
    // Remove all game objects
    this.objects.forEach((obj) => {
      if (obj.sprite && obj.sprite.parent) {
        obj.sprite.parent.removeChild(obj.sprite);
      }
    });

    this.objects = [];
    this.rockets = [];
    this.balls = [];
    this.effects = [];
  }

  initLevel() {
    // Create rockets (players)
    this.createRockets();

    // Create balls based on level
    this.createBalls();

    // Create special objects
    if (this.level > 1) {
      this.createSpecialObjects();
    }
  }

  createRockets() {
    // Calculate proportional positions based on screen size
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    const rocketPositions = [
      { x: screenWidth * 0.125, y: screenHeight * 0.5 }, // Left side, center
      { x: screenWidth * 0.875, y: screenHeight * 0.5 }, // Right side, center
      { x: screenWidth * 0.5, y: screenHeight * 0.167 }, // Top center
      { x: screenWidth * 0.5, y: screenHeight * 0.833 }, // Bottom center
      { x: screenWidth * 0.25, y: screenHeight * 0.333 }, // Left upper
    ];

    for (let i = 0; i < this.playerCount; i++) {
      const safePosition = this.findSafeSpawnPosition(rocketPositions[i]);

      const rocket = this.createGameObject({
        type: GAME_CONSTANTS.ROCKET,
        x: safePosition.x,
        y: safePosition.y,
        playerId: i,
        color: GAME_CONSTANTS.ROCKET_COLORS[i],
      });

      this.rockets.push(rocket);
    }
  }

  createBalls() {
    const ballCount = Math.min(8 + this.level, 15);

    for (let i = 0; i < ballCount; i++) {
      // Create mix of small and large balls (75% small, 25% large)
      const isLarge = Math.random() < 0.25;
      const ballType = isLarge
        ? GAME_CONSTANTS.BALL_LARGE
        : GAME_CONSTANTS.BALL_SMALL;
      const ballColor = isLarge
        ? GAME_CONSTANTS.BALL_LARGE_COLOR
        : GAME_CONSTANTS.BALL_SMALL_COLOR;

      const ball = this.createGameObject({
        type: ballType,
        x: Math.random() * (this.app.screen.width - 100) + 50,
        y: Math.random() * (this.app.screen.height - 100) + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: ballColor,
      });

      this.balls.push(ball);
    }
  }

  createSpecialObjects() {
    // Add holes
    if (this.level > 2) {
      for (let i = 0; i < Math.min(this.level - 2, 3); i++) {
        this.createGameObject({
          type: GAME_CONSTANTS.HOLE,
          x: Math.random() * this.app.screen.width,
          y: Math.random() * this.app.screen.height,
          color: GAME_CONSTANTS.HOLE_COLOR,
        });
      }
    }

    // Add big balls
    if (this.level > 3) {
      for (let i = 0; i < Math.min(this.level - 3, 2); i++) {
        this.createGameObject({
          type: GAME_CONSTANTS.BBALL,
          x: Math.random() * this.app.screen.width,
          y: Math.random() * this.app.screen.height,
          vx: Math.random() - 0.5,
          vy: Math.random() - 0.5,
          color: GAME_CONSTANTS.BBALL_COLOR,
        });
      }
    }
  }

  // Find a safe spawn position that's not within gravitational pull of black holes
  findSafeSpawnPosition(preferredPosition) {
    // Check if preferred position is safe
    if (
      this.isPositionSafeFromGravity(preferredPosition.x, preferredPosition.y)
    ) {
      return preferredPosition;
    }

    // If not safe, try to find a safe position nearby
    const maxAttempts = 50;
    const minDistanceFromHole = this.MAX_GRAVITY_DISTANCE + 20; // Add buffer

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Try positions in expanding circles around preferred position
      const angle = (attempt * 137.5 * Math.PI) / 180; // Golden angle for good distribution
      const radius = 50 + attempt * 10; // Expanding radius

      const testX = preferredPosition.x + Math.cos(angle) * radius;
      const testY = preferredPosition.y + Math.sin(angle) * radius;

      // Keep within screen bounds
      const clampedX = Math.max(
        50,
        Math.min(this.app.screen.width - 50, testX),
      );
      const clampedY = Math.max(
        50,
        Math.min(this.app.screen.height - 50, testY),
      );

      if (this.isPositionSafeFromGravity(clampedX, clampedY)) {
        return { x: clampedX, y: clampedY };
      }
    }

    // If no safe position found, use a fallback position far from holes
    console.warn("Could not find safe spawn position, using fallback");
    return this.getFallbackSpawnPosition();
  }

  // Check if a position is safe from gravitational pull of all holes
  isPositionSafeFromGravity(x, y) {
    for (const obj of this.objects) {
      if (obj.type === GAME_CONSTANTS.HOLE && obj.live) {
        const dx = obj.x - x;
        const dy = obj.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Position is unsafe if within gravitational range
        if (distance < this.MAX_GRAVITY_DISTANCE) {
          return false;
        }
      }
    }
    return true;
  }

  // Get a fallback spawn position in the center of the screen
  getFallbackSpawnPosition() {
    return {
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 2,
    };
  }

  createGameObject(config) {
    const obj = {
      type: config.type,
      x: config.x || 0,
      y: config.y || 0,
      vx: config.vx || 0,
      vy: config.vy || 0,
      fx: 0, // forces
      fy: 0,
      rotation: config.rotation || 0,
      angularVelocity: 0,
      radius: this.getRadius(config.type),
      mass: this.getMass(config.type),
      live: true,
      playerId: config.playerId || -1,
      color: config.color || 0xffffff,
      sprite: null,
      fx: 0,
      fy: 0,
    };

    // Create sprite
    obj.sprite = this.createSprite(obj);
    this.gameContainer.addChild(obj.sprite);

    this.objects.push(obj);
    return obj;
  }

  createSprite(obj) {
    const graphics = new PIXI.Graphics();

    switch (obj.type) {
      case GAME_CONSTANTS.ROCKET:
        // Draw rocket as triangle
        graphics.beginFill(obj.color);
        graphics.moveTo(0, -obj.radius);
        graphics.lineTo(-obj.radius * 0.7, obj.radius * 0.7);
        graphics.lineTo(obj.radius * 0.7, obj.radius * 0.7);
        graphics.closePath();
        graphics.endFill();

        // Add thrust indicator
        graphics.lineStyle(2, 0x00ffff);
        graphics.moveTo(0, obj.radius * 0.7);
        graphics.lineTo(0, obj.radius * 1.2);
        break;

      case GAME_CONSTANTS.BALL_SMALL:
      case GAME_CONSTANTS.BALL_LARGE:
        graphics.beginFill(obj.color);
        graphics.drawCircle(0, 0, obj.radius);
        graphics.endFill();
        graphics.lineStyle(1, 0xffffff, 0.5);
        graphics.drawCircle(0, 0, obj.radius);
        break;

      case GAME_CONSTANTS.BBALL:
        graphics.beginFill(obj.color);
        graphics.drawCircle(0, 0, obj.radius);
        graphics.endFill();
        graphics.lineStyle(2, 0xaaaaaa);
        graphics.drawCircle(0, 0, obj.radius);
        // Add pattern
        graphics.lineStyle(1, 0x666666);
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          graphics.moveTo(0, 0);
          graphics.lineTo(
            Math.cos(angle) * obj.radius,
            Math.sin(angle) * obj.radius,
          );
        }
        break;

      case GAME_CONSTANTS.HOLE:
        // Draw gravity field visualization (faint rings)
        graphics.lineStyle(1, 0x333333, 0.3);
        graphics.drawCircle(0, 0, this.MIN_GRAVITY_DISTANCE);
        graphics.lineStyle(1, 0x222222, 0.2);
        graphics.drawCircle(0, 0, this.MIN_GRAVITY_DISTANCE + 30);
        graphics.lineStyle(1, 0x111111, 0.1);
        graphics.drawCircle(0, 0, this.MIN_GRAVITY_DISTANCE + 60);

        // Draw the hole itself
        graphics.beginFill(0x000000);
        graphics.drawCircle(0, 0, obj.radius);
        graphics.endFill();
        graphics.lineStyle(2, obj.color);
        graphics.drawCircle(0, 0, obj.radius);
        break;

      case GAME_CONSTANTS.APPLE:
        graphics.beginFill(0xff4444);
        graphics.drawCircle(0, 0, obj.radius);
        graphics.endFill();
        graphics.lineStyle(1, 0xff8888);
        graphics.drawCircle(0, 0, obj.radius);
        break;

      default:
        graphics.beginFill(obj.color);
        graphics.drawCircle(0, 0, obj.radius);
        graphics.endFill();
    }

    graphics.x = obj.x;
    graphics.y = obj.y;
    graphics.rotation = obj.rotation;

    return graphics;
  }

  getRadius(type) {
    switch (type) {
      case GAME_CONSTANTS.ROCKET:
        return GAME_CONSTANTS.ROCKET_RADIUS;
      case GAME_CONSTANTS.BALL_SMALL:
        return GAME_CONSTANTS.BALL_SMALL_RADIUS;
      case GAME_CONSTANTS.BALL_LARGE:
        return GAME_CONSTANTS.BALL_LARGE_RADIUS;
      case GAME_CONSTANTS.BBALL:
        return GAME_CONSTANTS.BBALL_RADIUS;
      case GAME_CONSTANTS.HOLE:
        return GAME_CONSTANTS.HOLE_RADIUS;
      case GAME_CONSTANTS.APPLE:
        return GAME_CONSTANTS.APPLE_RADIUS;
      case GAME_CONSTANTS.INSPECTOR:
        return GAME_CONSTANTS.INSPECTOR_RADIUS;
      case GAME_CONSTANTS.LUNATIC:
        return GAME_CONSTANTS.LUNATIC_RADIUS;
      default:
        return 10;
    }
  }

  getMass(type) {
    switch (type) {
      case GAME_CONSTANTS.ROCKET:
        return GAME_CONSTANTS.ROCKETM;
      case GAME_CONSTANTS.BALL_SMALL:
        return GAME_CONSTANTS.BALL_SMALL_MASS;
      case GAME_CONSTANTS.BALL_LARGE:
        return GAME_CONSTANTS.BALL_LARGE_MASS;
      case GAME_CONSTANTS.BBALL:
        return GAME_CONSTANTS.BBALLM;
      case GAME_CONSTANTS.APPLE:
        return GAME_CONSTANTS.APPLEM;
      case GAME_CONSTANTS.INSPECTOR:
        return GAME_CONSTANTS.INSPECTORM;
      case GAME_CONSTANTS.LUNATIC:
        return GAME_CONSTANTS.LUNATICM;
      default:
        return 1;
    }
  }

  gameLoop(delta) {
    if (this.gameState !== "running") return;

    this.deltaTime = delta / 60; // Convert to seconds

    // Process input
    this.processInput();

    // Update physics
    this.updatePhysics();

    // Check collisions
    this.checkCollisions();

    // Update objects
    this.updateObjects();

    // Check win/lose conditions
    this.checkGameState();

    // Update gravity effects
    this.updateGravityEffects();

    // Update score display
    this.emit("scoreUpdate", {
      score: this.score,
      level: this.level,
      lives: this.lives,
    });
  }

  processInput() {
    this.rockets.forEach((rocket, index) => {
      if (!rocket.live) return;

      const controls = this.inputManager.getPlayerControls(index);

      // Reset forces
      rocket.fx = 0;
      rocket.fy = 0;

      // Apply thrust forces based on input
      const thrustForce = 0.8;
      const brakeForce = 0.95;

      if (controls.up) {
        rocket.fy -= thrustForce;
      }
      if (controls.down) {
        rocket.fy += thrustForce;
      }
      if (controls.left) {
        rocket.fx -= thrustForce;
      }
      if (controls.right) {
        rocket.fx += thrustForce;
      }

      // Brake - apply counter-force and direct velocity reduction
      if (controls.brake) {
        rocket.fx -= rocket.vx * 0.1;
        rocket.fy -= rocket.vy * 0.1;
        rocket.vx *= brakeForce;
        rocket.vy *= brakeForce;
      }
    });
  }

  updatePhysics() {
    this.objects.forEach((obj) => {
      if (!obj.live) return;

      // Apply gravitational forces from holes
      this.applyGravity(obj);

      // Apply forces to acceleration (F = ma, so a = F/m)
      if (obj.fx !== undefined && obj.fy !== undefined) {
        const ax = obj.fx / obj.mass;
        const ay = obj.fy / obj.mass;

        // Update velocity with acceleration
        obj.vx += ax * this.deltaTime;
        obj.vy += ay * this.deltaTime;
      }

      // Apply friction (different for rockets vs other objects)
      const friction = obj.type === GAME_CONSTANTS.ROCKET ? 0.98 : 0.995;
      obj.vx *= friction;
      obj.vy *= friction;

      // Cap maximum velocity to prevent runaway speeds
      const maxVel = obj.type === GAME_CONSTANTS.ROCKET ? 8 : 6;
      const vel = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy);
      if (vel > maxVel) {
        obj.vx = (obj.vx / vel) * maxVel;
        obj.vy = (obj.vy / vel) * maxVel;
      }

      // Update position
      obj.x += obj.vx;
      obj.y += obj.vy;

      // Update rotation for rockets based on thrust direction
      if (obj.type === GAME_CONSTANTS.ROCKET) {
        if (obj.fx !== 0 || obj.fy !== 0) {
          obj.rotation = Math.atan2(obj.fy, obj.fx) + Math.PI / 2;
        }
      }

      // Keep objects within bounds
      this.keepInBounds(obj);
    });
  }

  keepInBounds(obj) {
    const margin = obj.radius;

    // Check for boundary collision
    const hitLeft = obj.x < margin;
    const hitRight = obj.x > this.app.screen.width - margin;
    const hitTop = obj.y < margin;
    const hitBottom = obj.y > this.app.screen.height - margin;

    if (hitLeft || hitRight || hitTop || hitBottom) {
      // Skip holes - they don't move and shouldn't die
      if (obj.type === GAME_CONSTANTS.HOLE) {
        return;
      }

      // All movable objects die when hitting walls
      obj.live = false;

      // Award points for destroying balls
      if (obj.type === GAME_CONSTANTS.BALL_SMALL) {
        this.score += 5; // 5 points for small ball wall destruction
        this.checkExtraLife();
      } else if (obj.type === GAME_CONSTANTS.BALL_LARGE) {
        this.score += 10; // 10 points for large ball wall destruction (2x small)
        this.checkExtraLife();
      }

      // Play appropriate death sound
      if (obj.type === GAME_CONSTANTS.ROCKET) {
        this.audioManager.playSound("rocketDeath");
      } else {
        this.audioManager.playSound("objectDeath");
      }

      // Add explosion effect with color based on object type
      const explosionColor =
        obj.type === GAME_CONSTANTS.ROCKET ? 0xff4444 : 0xffaa44;
      this.createExplosion(obj.x, obj.y, explosionColor);
    }
  }

  checkCollisions() {
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const obj1 = this.objects[i];
        const obj2 = this.objects[j];

        if (!obj1.live || !obj2.live) continue;

        const dx = obj2.x - obj1.x;
        const dy = obj2.y - obj1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = obj1.radius + obj2.radius;

        if (distance < minDistance) {
          this.handleCollision(obj1, obj2, dx, dy, distance);
        }
      }
    }
  }

  handleCollision(obj1, obj2, dx, dy, distance) {
    // Normalize collision vector
    const nx = dx / distance;
    const ny = dy / distance;

    // Separate objects
    const overlap = (obj1.radius + obj2.radius - distance) / 2;
    obj1.x -= nx * overlap;
    obj1.y -= ny * overlap;
    obj2.x += nx * overlap;
    obj2.y += ny * overlap;

    // Calculate relative velocity
    const dvx = obj2.vx - obj1.vx;
    const dvy = obj2.vy - obj1.vy;
    const dvn = dvx * nx + dvy * ny;

    // Don't resolve if velocities are separating
    if (dvn > 0) return;

    // Calculate collision impulse
    const impulse = (2 * dvn) / (obj1.mass + obj2.mass);

    // Apply impulse
    obj1.vx += impulse * obj2.mass * nx;
    obj1.vy += impulse * obj2.mass * ny;
    obj2.vx -= impulse * obj1.mass * nx;
    obj2.vy -= impulse * obj1.mass * ny;

    // Handle special collision cases
    this.handleSpecialCollisions(obj1, obj2);

    // Play collision sound
    this.audioManager.playSound("collision");
  }

  handleSpecialCollisions(obj1, obj2) {
    // Ball into hole (scoring)
    if (
      ((obj1.type === GAME_CONSTANTS.BALL_SMALL ||
        obj1.type === GAME_CONSTANTS.BALL_LARGE) &&
        obj2.type === GAME_CONSTANTS.HOLE) ||
      ((obj2.type === GAME_CONSTANTS.BALL_SMALL ||
        obj2.type === GAME_CONSTANTS.BALL_LARGE) &&
        obj1.type === GAME_CONSTANTS.HOLE)
    ) {
      const ball =
        obj1.type === GAME_CONSTANTS.BALL_SMALL ||
        obj1.type === GAME_CONSTANTS.BALL_LARGE
          ? obj1
          : obj2;
      ball.live = false;
      // Award points based on ball size
      if (ball.type === GAME_CONSTANTS.BALL_SMALL) {
        this.score += 10; // 10 points for small ball hole scoring
      } else if (ball.type === GAME_CONSTANTS.BALL_LARGE) {
        this.score += 20; // 20 points for large ball hole scoring (2x small)
      }
      this.checkExtraLife();
      this.audioManager.playSound("ballInHole");
      return;
    }

    // Rocket into hole (death)
    if (
      (obj1.type === GAME_CONSTANTS.ROCKET &&
        obj2.type === GAME_CONSTANTS.HOLE) ||
      (obj2.type === GAME_CONSTANTS.ROCKET && obj1.type === GAME_CONSTANTS.HOLE)
    ) {
      const rocket = obj1.type === GAME_CONSTANTS.ROCKET ? obj1 : obj2;
      const hole = obj1.type === GAME_CONSTANTS.HOLE ? obj1 : obj2;

      rocket.live = false;
      this.audioManager.playSound("rocketDeath");
      this.createExplosion(rocket.x, rocket.y, 0xff4444);
      return;
    }

    // Rocket collision damage
    if (
      obj1.type === GAME_CONSTANTS.ROCKET ||
      obj2.type === GAME_CONSTANTS.ROCKET
    ) {
      // Handle rocket damage logic here
    }
  }

  updateObjects() {
    this.objects.forEach((obj) => {
      if (obj.sprite) {
        obj.sprite.x = obj.x;
        obj.sprite.y = obj.y;
        obj.sprite.rotation = obj.rotation;

        // Hide dead objects
        obj.sprite.visible = obj.live;
      }
    });

    // Remove dead objects
    this.objects = this.objects.filter((obj) => {
      if (!obj.live && obj.sprite) {
        this.gameContainer.removeChild(obj.sprite);
        return false;
      }
      return true;
    });
  }

  checkGameState() {
    // Check if all balls are destroyed
    const aliveBalls = this.objects.filter(
      (obj) =>
        obj.live &&
        (obj.type === GAME_CONSTANTS.BALL_SMALL ||
          obj.type === GAME_CONSTANTS.BALL_LARGE),
    );

    if (aliveBalls.length === 0) {
      this.emit("levelComplete", {
        level: this.level,
        score: this.score,
      });
    }

    // Check if all rockets are destroyed
    const aliveRockets = this.rockets.filter((rocket) => rocket.live);
    if (aliveRockets.length === 0) {
      this.lives--;
      if (this.lives <= 0) {
        this.emit("gameOver", {
          score: this.score,
          level: this.level,
        });
      } else {
        this.restartLevel();
      }
    }
  }

  pause() {
    this.gameState = "paused";
  }

  resume() {
    this.gameState = "running";
  }

  restartLevel() {
    this.clearGame();
    this.initLevel();
    this.gameState = "running";
  }

  applyGravity(obj) {
    // Skip holes - they don't get affected by gravity
    if (obj.type === GAME_CONSTANTS.HOLE) return;

    // Apply gravitational pull from all holes
    this.objects.forEach((hole) => {
      if (!hole.live || hole.type !== GAME_CONSTANTS.HOLE) return;

      const dx = hole.x - obj.x;
      const dy = hole.y - obj.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only apply gravity if within range and not too close
      if (
        distance < this.MAX_GRAVITY_DISTANCE &&
        distance > this.MIN_GRAVITY_DISTANCE
      ) {
        // Calculate gravitational force (simplified physics)
        const gravityForce = this.GRAVITY_STRENGTH / (distance * distance);

        // Normalize direction vector
        const nx = dx / distance;
        const ny = dy / distance;

        // Apply gravity force (add to existing forces)
        obj.fx += nx * gravityForce;
        obj.fy += ny * gravityForce;
      }
    });
  }

  updateGravityEffects() {
    // Add subtle pulsing effect to holes to show they're active
    this.objects.forEach((obj) => {
      if (!obj.live || obj.type !== GAME_CONSTANTS.HOLE) return;

      const time = Date.now() * 0.003;
      const pulse = 0.8 + 0.2 * Math.sin(time);
      if (obj.sprite) {
        obj.sprite.alpha = pulse;
      }
    });
  }

  createExplosion(x, y, color = 0xff4444) {
    // Create simple explosion effect with particles
    for (let i = 0; i < 8; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(color);
      particle.drawCircle(0, 0, 2);
      particle.endFill();

      particle.x = x;
      particle.y = y;

      const angle = (i / 8) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.life = 30; // frames to live

      this.gameContainer.addChild(particle);

      // Animate particle
      const animateParticle = () => {
        particle.life--;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        particle.alpha = particle.life / 30;

        if (particle.life <= 0) {
          this.gameContainer.removeChild(particle);
        } else {
          requestAnimationFrame(animateParticle);
        }
      };
      animateParticle();
    }
  }

  // Check if player earned an extra life
  checkExtraLife() {
    if (this.score >= this.nextLifeAt) {
      this.lives++;
      this.nextLifeAt += 500; // Next life in another 500 points

      // Play extra life sound and show feedback
      this.audioManager.playSound("levelComplete"); // Use happy sound for extra life

      this.emit("extraLife", {
        score: this.score,
        level: this.level,
        lives: this.lives,
        nextLifeAt: this.nextLifeAt,
      });
    }

    // Always emit score update
    this.emit("scoreUpdate", {
      score: this.score,
      level: this.level,
      lives: this.lives,
    });
  }

  stop() {
    this.gameState = "stopped";
  }
}
