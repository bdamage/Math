// Sound Manager for Math Quest
// Handles all sound effects with Web Audio API fallback to HTML5 Audio

type SoundName =
  | "correct"
  | "incorrect"
  | "achievement"
  | "click"
  | "confetti"
  | "coin";

class SoundManager {
  private enabled: boolean;
  private sounds: Map<SoundName, HTMLAudioElement>;
  private volume: number = 0.5;
  private activeSounds: number = 0;
  private maxConcurrentSounds: number = 5;
  private audioContext: AudioContext | null = null;
  private pendingCleanups: number[] = [];

  constructor() {
    this.enabled = this.getSoundSetting();
    this.sounds = new Map();
    this.initializeSounds();
  }

  private getSoundSetting(): boolean {
    const saved = localStorage.getItem("soundEnabled");
    return saved === null ? true : saved === "true";
  }

  private initializeSounds() {
    // Using simple frequency-based sounds via Web Audio API
    // These don't require external audio files
    const soundConfigs: Record<
      SoundName,
      {frequency: number; duration: number; type?: OscillatorType}
    > = {
      correct: {frequency: 523.25, duration: 0.15, type: "sine"}, // C5 - success
      incorrect: {frequency: 220, duration: 0.2, type: "sawtooth"}, // A3 - try again
      achievement: {frequency: 659.25, duration: 0.3, type: "sine"}, // E5 - badge unlocked
      click: {frequency: 440, duration: 0.05, type: "sine"}, // A4 - button click
      confetti: {frequency: 880, duration: 0.2, type: "square"}, // A5 - celebration
      coin: {frequency: 587.33, duration: 0.1, type: "triangle"}, // D5 - coin earned
    };

    // Pre-create audio contexts for better performance
    Object.entries(soundConfigs).forEach(([name, config]) => {
      // Store config for later use
      (this.sounds as any)[`${name}_config`] = config;
    });
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === "closed") {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine"
  ) {
    if (!this.enabled) return;

    // Prevent too many concurrent sounds to avoid performance issues
    if (this.activeSounds >= this.maxConcurrentSounds) return;

    try {
      this.activeSounds++;

      const audioContext = this.getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      // Clean up oscillator nodes
      const cleanupId = window.setTimeout(() => {
        oscillator.disconnect();
        gainNode.disconnect();
        this.activeSounds--;

        // Remove this cleanup from pending list
        const index = this.pendingCleanups.indexOf(cleanupId);
        if (index > -1) {
          this.pendingCleanups.splice(index, 1);
        }
      }, duration * 1000 + 100);

      this.pendingCleanups.push(cleanupId);
    } catch (error) {
      this.activeSounds--;
      console.warn("Sound playback failed:", error);
    }
  }

  play(soundName: SoundName) {
    if (!this.enabled) return;

    const config = (this.sounds as any)[`${soundName}_config`];
    if (!config) return;

    this.playTone(config.frequency, config.duration, config.type);
  }

  // Play a sequence of sounds
  playSequence(sounds: SoundName[], interval: number = 100) {
    if (!this.enabled) return;

    sounds.forEach((sound, index) => {
      setTimeout(() => this.play(sound), index * interval);
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem("soundEnabled", String(enabled));
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Play celebration sound
  celebrate() {
    this.playSequence(["confetti", "achievement", "coin"], 150);
  }

  // Clean up all pending sounds and audio context
  cleanup() {
    this.pendingCleanups.forEach((id) => clearTimeout(id));
    this.pendingCleanups = [];
    this.activeSounds = 0;

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    soundManager.cleanup();
  });
}
