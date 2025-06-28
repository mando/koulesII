/**
 * Koules - Pixi.js Edition
 * Main game entry point
 *
 * Based on the original Koules by Jan Hubicka
 * Converted to modern JavaScript with Pixi.js
 */

import * as PIXI from "pixi.js";
import { GameEngine } from "./game/GameEngine.js";
import { MenuSystem } from "./ui/MenuSystem.js";
import { InputManager } from "./input/InputManager.js";
import { AudioManager } from "./audio/AudioManager.js";

class KoulesGame {
  constructor() {
    this.app = null;
    this.gameEngine = null;
    this.menuSystem = null;
    this.inputManager = null;
    this.audioManager = null;
    this.gameState = "loading"; // loading, menu, playing, paused
    this.currentLevel = 1;
    this.playerCount = 1;
    this.gameMode = "cooperative"; // cooperative, deathmatch

    // Game dimensions - calculate 80% of screen size
    this.calculateGameDimensions();

    this.init();
  }

  calculateGameDimensions() {
    // Get 80% of screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Target 80% of screen area
    const targetWidth = screenWidth * 0.8;
    const targetHeight = screenHeight * 0.8;

    // Maintain 4:3 aspect ratio (original was 800x600)
    const aspectRatio = 4 / 3;

    // Calculate dimensions while maintaining aspect ratio
    if (targetWidth / targetHeight > aspectRatio) {
      // Height is the limiting factor
      this.height = targetHeight;
      this.width = targetHeight * aspectRatio;
    } else {
      // Width is the limiting factor
      this.width = targetWidth;
      this.height = targetWidth / aspectRatio;
    }

    // Ensure minimum playable size
    this.width = Math.max(400, this.width);
    this.height = Math.max(300, this.height);

    // Round to integers for crisp rendering
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
  }

  async init() {
    try {
      // Initialize Pixi.js application
      this.app = new PIXI.Application({
        width: this.width,
        height: this.height,
        backgroundColor: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      // Add canvas to DOM
      const gameContainer = document.getElementById("game-container");
      gameContainer.appendChild(this.app.view);

      // Initialize managers
      this.inputManager = new InputManager();
      this.audioManager = new AudioManager();
      this.menuSystem = new MenuSystem(this);
      this.gameEngine = new GameEngine(
        this.app,
        this.inputManager,
        this.audioManager,
      );

      // Setup event listeners
      this.setupEventListeners();

      // Hide loading screen and show main menu
      document.getElementById("loading").classList.add("hidden");
      this.showMainMenu();

      console.log("Koules initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Koules:", error);
      document.getElementById("loading").textContent =
        "Failed to load game. Please refresh.";
    }
  }

  setupEventListeners() {
    // Menu button events
    document.getElementById("start-single").addEventListener("click", () => {
      this.startGame(1);
    });

    document.getElementById("start-multi").addEventListener("click", () => {
      this.startGame(2); // Default to 2 players, can be expanded
    });

    document.getElementById("show-controls").addEventListener("click", () => {
      this.showControlsMenu();
    });

    document.getElementById("back-to-menu").addEventListener("click", () => {
      this.showMainMenu();
    });

    // Window resize handler
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    // Global key events
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.handleEscapeKey();
      } else if (event.key === "r" || event.key === "R") {
        if (this.gameState === "playing") {
          this.restartLevel();
        }
      }
    });

    // Game engine events
    this.gameEngine.on("gameOver", (data) => {
      this.handleGameOver(data);
    });

    this.gameEngine.on("levelComplete", (data) => {
      this.handleLevelComplete(data);
    });

    this.gameEngine.on("scoreUpdate", (data) => {
      this.updateScore(data);
    });

    this.gameEngine.on("extraLife", (data) => {
      this.handleExtraLife(data);
    });
  }

  showMainMenu() {
    this.gameState = "menu";
    document.getElementById("main-menu").classList.remove("hidden");
    document.getElementById("controls-menu").classList.add("hidden");
    document.getElementById("ui-overlay").classList.add("hidden");
    document.getElementById("controls-info").classList.add("hidden");

    if (this.gameEngine) {
      this.gameEngine.pause();
    }
  }

  showControlsMenu() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("controls-menu").classList.remove("hidden");
  }

  async startGame(playerCount) {
    this.playerCount = playerCount;
    this.gameState = "playing";

    // Hide menus
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("controls-menu").classList.add("hidden");

    // Show game UI
    document.getElementById("ui-overlay").classList.remove("hidden");
    document.getElementById("controls-info").classList.remove("hidden");

    // Initialize game
    await this.gameEngine.startGame({
      playerCount: this.playerCount,
      level: this.currentLevel,
      gameMode: this.gameMode,
    });

    // Update UI
    this.updateUI();
  }

  handleEscapeKey() {
    switch (this.gameState) {
      case "playing":
        this.pauseGame();
        break;
      case "paused":
        this.resumeGame();
        break;
      case "menu":
        // Already in menu
        break;
    }
  }

  pauseGame() {
    if (this.gameState === "playing") {
      this.gameState = "paused";
      this.gameEngine.pause();
      this.showMainMenu();
    }
  }

  resumeGame() {
    if (this.gameState === "paused") {
      this.gameState = "playing";
      this.gameEngine.resume();

      // Hide menus and show game UI
      document.getElementById("main-menu").classList.add("hidden");
      document.getElementById("controls-menu").classList.add("hidden");
      document.getElementById("ui-overlay").classList.remove("hidden");
      document.getElementById("controls-info").classList.remove("hidden");
    }
  }

  restartLevel() {
    if (this.gameEngine) {
      this.gameEngine.restartLevel();
    }
  }

  handleGameOver(data) {
    console.log("Game Over:", data);
    this.gameState = "menu";

    // Show game over message
    setTimeout(() => {
      alert(`Game Over! Final Score: ${data.score}`);
      this.showMainMenu();
    }, 1000);
  }

  handleLevelComplete(data) {
    console.log("Level Complete:", data);
    this.currentLevel++;

    // Show level complete message
    setTimeout(() => {
      alert(`Level ${data.level} Complete! Score: ${data.score}`);
      this.startGame(this.playerCount);
    }, 1000);
  }

  updateScore(data) {
    const scoreElement = document.getElementById("score");
    const levelElement = document.getElementById("level");
    const livesElement = document.getElementById("lives");

    if (scoreElement) scoreElement.textContent = `Score: ${data.score}`;
    if (levelElement) levelElement.textContent = `Level: ${data.level}`;
    if (livesElement) livesElement.textContent = `Lives: ${data.lives}`;
  }

  handleExtraLife(data) {
    // Update UI immediately
    this.updateScore(data);

    // Show extra life notification in UI
    this.showExtraLifeNotification(data.lives, data.nextLifeAt);
  }

  showExtraLifeNotification(lives, nextLifeAt) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById("extra-life-notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "extra-life-notification";
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 255, 255, 0.9);
        color: #000;
        padding: 20px;
        border: 2px solid #00ffff;
        border-radius: 10px;
        font-family: 'Courier New', monospace;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
        display: none;
      `;
      document.body.appendChild(notification);
    }

    // Update notification content
    notification.innerHTML = `
      🎉 EXTRA LIFE! 🎉<br>
      You now have ${lives} lives<br>
      Next life at ${nextLifeAt} points
    `;

    // Show notification with fade-in effect
    notification.style.display = "block";
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease-in";

    setTimeout(() => {
      notification.style.opacity = "1";
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        notification.style.display = "none";
      }, 300);
    }, 3000);
  }

  updateUI() {
    // Update players info
    const playersInfo = document.getElementById("players-info");
    if (playersInfo) {
      let html = "";
      for (let i = 0; i < this.playerCount; i++) {
        html += `<div>Player ${i + 1}: Ready</div>`;
      }
      playersInfo.innerHTML = html;
    }
  }

  // Public methods for external access
  getApp() {
    return this.app;
  }

  getGameEngine() {
    return this.gameEngine;
  }

  getInputManager() {
    return this.inputManager;
  }

  getAudioManager() {
    return this.audioManager;
  }

  handleResize() {
    // Recalculate dimensions
    this.calculateGameDimensions();

    // Only resize if game is not actively playing to avoid disruption
    if (this.gameState !== "playing") {
      this.app.renderer.resize(this.width, this.height);
    }
  }
}

// Initialize the game when the page loads
window.addEventListener("DOMContentLoaded", () => {
  window.koulesGame = new KoulesGame();
});

export { KoulesGame };
