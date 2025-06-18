/**
 * InputManager.js - Handles keyboard input for the Koules game
 *
 * Manages keyboard input for multiple players with different control schemes
 * Based on the original Koules control system
 */

export class InputManager {
  constructor() {
    this.keys = {};
    this.playerControls = [];

    // Define control schemes for different players
    this.controlSchemes = [
      // Player 1 - Arrow keys
      {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        brake: " ", // Space bar
      },
      // Player 2 - WASD
      {
        up: "w",
        down: "s",
        left: "a",
        right: "d",
        brake: "Shift", // Left Shift
      },
      // Player 3 - IJKL
      {
        up: "i",
        down: "k",
        left: "j",
        right: "l",
        brake: "u",
      },
      // Player 4 - Numpad
      {
        up: "8",
        down: "2",
        left: "4",
        right: "6",
        brake: "0",
      },
      // Player 5 - TFGH
      {
        up: "t",
        down: "g",
        left: "f",
        right: "h",
        brake: "r",
      },
    ];

    this.init();
  }

  init() {
    // Initialize player controls
    for (let i = 0; i < 5; i++) {
      this.playerControls[i] = {
        up: false,
        down: false,
        left: false,
        right: false,
        brake: false,
      };
    }

    // Set up event listeners
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));

    // Prevent default behavior for game keys
    document.addEventListener("keydown", (event) => {
      if (this.isGameKey(event.key)) {
        event.preventDefault();
      }
    });

    console.log("InputManager initialized");
  }

  handleKeyDown(event) {
    const key = event.key;
    this.keys[key] = true;

    // Update player controls
    this.updatePlayerControls();

    // Handle special keys
    if (key === "Escape") {
      // Let the main game handle escape
      return;
    }
  }

  handleKeyUp(event) {
    const key = event.key;
    this.keys[key] = false;

    // Update player controls
    this.updatePlayerControls();
  }

  updatePlayerControls() {
    if (this.disabled) {
      return;
    }

    for (let i = 0; i < this.controlSchemes.length; i++) {
      const scheme = this.controlSchemes[i];
      const controls = this.playerControls[i];

      controls.up = this.keys[scheme.up] || false;
      controls.down = this.keys[scheme.down] || false;
      controls.left = this.keys[scheme.left] || false;
      controls.right = this.keys[scheme.right] || false;
      controls.brake = this.keys[scheme.brake] || false;
    }
  }

  isGameKey(key) {
    // Check if the key is used by any player
    for (const scheme of this.controlSchemes) {
      if (Object.values(scheme).includes(key)) {
        return true;
      }
    }
    return false;
  }

  getPlayerControls(playerId) {
    if (playerId < 0 || playerId >= this.playerControls.length) {
      return {
        up: false,
        down: false,
        left: false,
        right: false,
        brake: false,
      };
    }
    return this.playerControls[playerId];
  }

  isKeyPressed(key) {
    return this.keys[key] || false;
  }

  // Method to check if any movement key is pressed for a player
  isPlayerMoving(playerId) {
    const controls = this.getPlayerControls(playerId);
    return controls.up || controls.down || controls.left || controls.right;
  }

  // Method to get movement vector for a player
  getPlayerMovementVector(playerId) {
    const controls = this.getPlayerControls(playerId);
    let x = 0;
    let y = 0;

    if (controls.left) x -= 1;
    if (controls.right) x += 1;
    if (controls.up) y -= 1;
    if (controls.down) y += 1;

    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      const length = Math.sqrt(x * x + y * y);
      x /= length;
      y /= length;
    }

    return { x, y };
  }

  // Method to customize controls for a player
  setPlayerControls(playerId, controlScheme) {
    if (playerId >= 0 && playerId < this.controlSchemes.length) {
      this.controlSchemes[playerId] = { ...controlScheme };
    }
  }

  // Method to get current control scheme for a player
  getPlayerControlScheme(playerId) {
    if (playerId >= 0 && playerId < this.controlSchemes.length) {
      return { ...this.controlSchemes[playerId] };
    }
    return null;
  }

  // Method to reset all keys (useful for game state changes)
  resetKeys() {
    this.keys = {};
    for (let i = 0; i < this.playerControls.length; i++) {
      this.playerControls[i] = {
        up: false,
        down: false,
        left: false,
        right: false,
        brake: false,
      };
    }
  }

  // Method to temporarily disable input (useful for menus)
  disable() {
    this.disabled = true;
    this.resetKeys();
  }

  // Method to re-enable input
  enable() {
    this.disabled = false;
  }
}
