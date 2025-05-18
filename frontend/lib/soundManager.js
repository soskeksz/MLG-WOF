// Utility for playing sounds with fallbacks
export class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }
  
    loadSounds() {
    // Preload sounds
        this.sounds = {
            hitmarker: this.createSound('/sounds/hitmarker.mp3'),
            airhorn: this.createSound('/sounds/airhorn.mp3'), 
            wasted: this.createSound('/sounds/wasted.mp3'),
            thomas: this.createSound('/sounds/thomas.mp3'),
            intervention: this.createSound('/sounds/intervention.mp3'),
            applause: this.createSound('/sounds/applause.mp3'),    
            ohmygod: this.createSound('/sounds/ohmygod.mp3'),
            damnson: this.createSound('/sounds/damnson.mp3'),
        };
    }
  
    createSound(src) {
        try {
            const audio = new Audio(src);
            audio.volume = 0.3;
            // Preload the audio
            audio.preload = 'auto';
            return audio;
        } catch (error) {
            console.log(`Could not load sound: ${src}`);
            return null;
        }
    }
  
    play(soundName) {
        if (this.sounds[soundName]) {
            try {
                // Reset audio to beginning
                this.sounds[soundName].currentTime = 0;
                this.sounds[soundName].play().catch(e => 
                console.log(`Could not play ${soundName}:`, e)
                );
            } catch (error) {
                console.log(`Error playing ${soundName}:`, error);
            }
        }
    }
}

// Create a singleton instance
export const soundManager = new SoundManager();