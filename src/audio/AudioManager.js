/**
 * AudioManager.js - Handles audio for the Koules game
 *
 * Manages sound effects and background music
 * Uses Web Audio API for better performance and control
 */

export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.enabled = true;
        this.volume = 0.7;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.5;

        // Sound definitions - we'll generate these programmatically
        this.soundDefinitions = {
            collision: { type: 'noise', duration: 0.1, frequency: 150 },
            ballInHole: { type: 'tone', duration: 0.3, frequency: 440 },
            rocketThrust: { type: 'noise', duration: 0.05, frequency: 100 },
            gameStart: { type: 'tone', duration: 0.5, frequency: 523.25 },
            gameOver: { type: 'tone', duration: 1.0, frequency: 220 },
            levelComplete: { type: 'melody', duration: 1.5, frequencies: [523.25, 659.25, 783.99] },
            menuSelect: { type: 'tone', duration: 0.1, frequency: 800 },
            menuMove: { type: 'tone', duration: 0.05, frequency: 600 }
        };

        this.init();
    }

    async init() {
        try {
            // Initialize Web Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

            // Pre-generate sounds
            this.generateSounds();

            console.log('AudioManager initialized');
        } catch (error) {
            console.warn('AudioManager failed to initialize:', error);
            this.enabled = false;
        }
    }

    generateSounds() {
        // Generate simple procedural sounds for the game
        Object.entries(this.soundDefinitions).forEach(([name, definition]) => {
            this.sounds.set(name, definition);
        });
    }

    playSound(soundName, volume = 1.0) {
        if (!this.enabled || !this.audioContext) return;

        const soundDef = this.sounds.get(soundName);
        if (!soundDef) {
            console.warn(`Sound '${soundName}' not found`);
            return;
        }

        // Resume audio context if suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        try {
            switch (soundDef.type) {
                case 'tone':
                    this.playTone(soundDef.frequency, soundDef.duration, volume);
                    break;
                case 'noise':
                    this.playNoise(soundDef.frequency, soundDef.duration, volume);
                    break;
                case 'melody':
                    this.playMelody(soundDef.frequencies, soundDef.duration, volume);
                    break;
            }
        } catch (error) {
            console.warn(`Failed to play sound '${soundName}':`, error);
        }
    }

    playTone(frequency, duration, volume = 1.0) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'square';

        // Create envelope
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume * this.sfxVolume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    playNoise(filterFrequency, duration, volume = 1.0) {
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * volume * this.sfxVolume;
        }

        const source = this.audioContext.createBufferSource();
        const filter = this.audioContext.createBiquadFilter();
        const gainNode = this.audioContext.createGain();

        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFrequency, this.audioContext.currentTime);

        // Create envelope
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(volume * this.sfxVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        source.start(now);
    }

    playMelody(frequencies, totalDuration, volume = 1.0) {
        const noteDuration = totalDuration / frequencies.length;

        frequencies.forEach((frequency, index) => {
            setTimeout(() => {
                this.playTone(frequency, noteDuration * 0.8, volume);
            }, index * noteDuration * 1000);
        });
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled && this.audioContext) {
            this.audioContext.suspend();
        } else if (enabled && this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    getVolume() {
        return this.volume;
    }

    isEnabled() {
        return this.enabled;
    }

    // Method to play continuous sounds (like rocket thrust)
    startContinuousSound(soundName) {
        if (!this.enabled || !this.audioContext) return null;

        const soundDef = this.sounds.get(soundName);
        if (!soundDef) return null;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            oscillator.frequency.setValueAtTime(soundDef.frequency, this.audioContext.currentTime);
            oscillator.type = 'sawtooth';

            gainNode.gain.setValueAtTime(0.3 * this.sfxVolume, this.audioContext.currentTime);

            oscillator.start();

            return {
                stop: () => {
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                },
                setFrequency: (freq) => {
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                }
            };
        } catch (error) {
            console.warn(`Failed to start continuous sound '${soundName}':`, error);
            return null;
        }
    }

    // Method to create ambient background noise/music
    playAmbientSound() {
        if (!this.enabled || !this.audioContext) return;

        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator1.frequency.setValueAtTime(80, this.audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(120, this.audioContext.currentTime);
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';

        gainNode.gain.setValueAtTime(0.1 * this.musicVolume, this.audioContext.currentTime);

        oscillator1.start();
        oscillator2.start();

        // Slowly modulate the frequencies for ambient effect
        const modulation = setInterval(() => {
            if (this.audioContext.state !== 'running') {
                clearInterval(modulation);
                return;
            }

            const time = this.audioContext.currentTime;
            oscillator1.frequency.setValueAtTime(80 + Math.sin(time * 0.1) * 10, time);
            oscillator2.frequency.setValueAtTime(120 + Math.cos(time * 0.15) * 15, time);
        }, 100);

        return {
            stop: () => {
                clearInterval(modulation);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
                oscillator1.stop(this.audioContext.currentTime + 1.0);
                oscillator2.stop(this.audioContext.currentTime + 1.0);
            }
        };
    }

    // Cleanup method
    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.sounds.clear();
    }
}
