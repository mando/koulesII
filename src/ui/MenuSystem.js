/**
 * MenuSystem.js - Handles menu UI and navigation for Koules
 *
 * Manages the visual menu system and user interactions
 */

export class MenuSystem {
    constructor(game) {
        this.game = game;
        this.currentMenu = null;
        this.menuItems = [];
        this.selectedIndex = 0;
        this.visible = false;

        this.init();
    }

    init() {
        // Menu will be handled by HTML/CSS for simplicity
        // This class manages the state and interactions
        console.log('MenuSystem initialized');
    }

    showMainMenu() {
        this.currentMenu = 'main';
        this.visible = true;
        this.selectedIndex = 0;

        // Play menu music if available
        if (this.game.audioManager) {
            this.game.audioManager.playSound('menuSelect');
        }
    }

    hideMenu() {
        this.visible = false;
        this.currentMenu = null;
    }

    selectMenuItem(index) {
        if (this.game.audioManager) {
            this.game.audioManager.playSound('menuMove');
        }

        this.selectedIndex = index;
    }

    activateMenuItem() {
        if (this.game.audioManager) {
            this.game.audioManager.playSound('menuSelect');
        }

        switch (this.currentMenu) {
            case 'main':
                this.handleMainMenuSelection();
                break;
            case 'controls':
                this.handleControlsMenuSelection();
                break;
        }
    }

    handleMainMenuSelection() {
        switch (this.selectedIndex) {
            case 0: // Start Single Player
                this.game.startGame(1);
                break;
            case 1: // Start Multi Player
                this.game.startGame(2);
                break;
            case 2: // Show Controls
                this.showControlsMenu();
                break;
        }
    }

    handleControlsMenuSelection() {
        switch (this.selectedIndex) {
            case 0: // Back to Main Menu
                this.showMainMenu();
                break;
        }
    }

    showControlsMenu() {
        this.currentMenu = 'controls';
        this.selectedIndex = 0;
    }

    // Handle keyboard navigation
    handleKeyPress(key) {
        if (!this.visible) return false;

        switch (key) {
            case 'ArrowUp':
                this.selectMenuItem(Math.max(0, this.selectedIndex - 1));
                return true;
            case 'ArrowDown':
                this.selectMenuItem(Math.min(this.getMenuItemCount() - 1, this.selectedIndex + 1));
                return true;
            case 'Enter':
            case ' ':
                this.activateMenuItem();
                return true;
            case 'Escape':
                if (this.currentMenu === 'controls') {
                    this.showMainMenu();
                } else {
                    this.hideMenu();
                }
                return true;
        }

        return false;
    }

    getMenuItemCount() {
        switch (this.currentMenu) {
            case 'main':
                return 3;
            case 'controls':
                return 1;
            default:
                return 0;
        }
    }

    isVisible() {
        return this.visible;
    }

    getCurrentMenu() {
        return this.currentMenu;
    }

    getSelectedIndex() {
        return this.selectedIndex;
    }
}
