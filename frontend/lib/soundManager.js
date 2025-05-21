// lib/soundManager.js
export class SoundManager {
    constructor() {
        this.sounds = {};
        this.loadSounds();
    }
  
    loadSounds() {
        // Define sounds with their paths
        const soundPaths = {
            hitmarker: '/sounds/hitmarker.mp3',
            airhorn: '/sounds/airhorn.mp3', 
            wasted: '/sounds/wasted.mp3',
            thomas: '/sounds/thomas.mp3',
            intervention: '/sounds/intervention.mp3',
            applause: '/sounds/applause.mp3',    
            ohmygod: '/sounds/ohmygod.mp3',
            damnson: '/sounds/damnson.mp3',
            triple: '/sounds/triple.mp3',
            jackpot: '/sounds/jackpot.mp3'
        };
        
        // Preload sounds
        Object.entries(soundPaths).forEach(([name, path]) => {
            this.sounds[name] = this.createSound(path);
        });
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
        // If sound exists in our cache, use it
        if (this.sounds[soundName]) {
            try {
                // Create a clone for overlapping sounds
                const sound = this.sounds[soundName].cloneNode();
                sound.volume = 0.3;
                sound.play().catch(e => {
                    console.log(`Could not play ${soundName}:`, e);
                });
            } catch (error) {
                console.log(`Error playing ${soundName}:`, error);
                
                // Fallback: create a new instance if the cached one fails
                try {
                    const fallbackSound = new Audio(`/sounds/${soundName}.mp3`);
                    fallbackSound.volume = 0.3;
                    fallbackSound.play().catch(() => {});
                } catch (e) {
                    // Silent failure for audio
                }
            }
        } else {
            // Fallback for sounds not in the predefined list
            try {
                const fallbackSound = new Audio(`/sounds/${soundName}.mp3`);
                fallbackSound.volume = 0.3;
                fallbackSound.play().catch(() => {});
            } catch (e) {
                // Silent failure for audio
            }
        }
    }
}

// Create a singleton instance
export const soundManager = new SoundManager();