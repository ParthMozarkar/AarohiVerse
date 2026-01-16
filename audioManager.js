/**
 * Global Music Manager for Piyuverse
 * Handles background tracks and state across pages
 */

const tracks = {
    world: "https://www.chosic.com/wp-content/uploads/2021/11/Dragon-Castle(chosic.com).mp3", // Mystical Fantasy Orchestral
    memory: "https://archive.org/download/maroon5memories_202001/Maroon%205%20Memories.mp3", // Requested: Memories Bring Back (Maroon 5)
    gallery: "Assests/Chaandaniya.mp3", // Requested: Chaandaniya (2 States)
    melody: null, // No background music for Playlist page (Spotify is there)
    art: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Creative
};

class MusicManager {
    constructor() {
        this.audio = null;
        // STRONG DEFAULT: Always true unless the user manually clicked MUTE in this session
        const storedValue = localStorage.getItem('musicEnabled');
        this.isPlaying = (storedValue === null || storedValue === 'true');

        this.trackName = this.getCurrentTrackName();

        this.icons = {
            unmuted: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
            muted: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15" stroke="red"></line><line x1="17" y1="9" x2="23" y2="15" stroke="red"></line></svg>`
        };

        this.init();
    }

    getCurrentTrackName() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('memory')) return 'memory';
        if (path.includes('gallery')) return 'gallery';
        if (path.includes('melody')) return 'melody';
        if (path.includes('art')) return 'art';
        return 'world';
    }

    init() {
        const trackUrl = tracks[this.trackName];
        if (!trackUrl) {
            console.log("No background track for this page.");
            return;
        }

        this.audio = new Audio(trackUrl);
        this.audio.loop = true;
        this.audio.volume = 0.4;

        this.createToggle();

        if (this.isPlaying) {
            this.play();
        }

        // AUTO-RESUME: Many browsers block auto-play. 
        // We'll try to resume on the FIRST interaction with the page.
        const resumeAudio = () => {
            if (this.isPlaying && this.audio.paused) {
                this.play();
            }
            // Once they interact, we can remove these listeners
            window.removeEventListener('click', resumeAudio);
            window.removeEventListener('touchstart', resumeAudio);
            window.removeEventListener('scroll', resumeAudio);
        };

        window.addEventListener('click', resumeAudio);
        window.addEventListener('touchstart', resumeAudio);
        window.addEventListener('scroll', resumeAudio);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden && this.isPlaying) {
                this.audio.pause();
            } else if (!document.hidden && this.isPlaying) {
                this.audio.play().catch(() => { });
            }
        });
    }

    createToggle() {
        if (!this.audio) return; // Don't show button if no music

        const btn = document.createElement('button');
        btn.id = 'global-music-toggle';
        btn.innerHTML = this.isPlaying ? this.icons.unmuted : this.icons.muted;
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            backdrop-filter: blur(10px);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;

        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
            btn.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        };

        btn.onclick = () => this.toggle();
        this.toggleBtn = btn;
        document.body.appendChild(btn);
    }

    updateIcon() {
        this.toggleBtn.innerHTML = this.isPlaying ? this.icons.unmuted : this.icons.muted;
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        localStorage.setItem('musicEnabled', this.isPlaying);
        this.updateIcon();
    }

    play() {
        if (!this.audio) return;
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateIcon();
        }).catch(err => {
            console.log("Audio play blocked - needs interaction");
            this.isPlaying = false;
            this.updateIcon();
        });
    }

    pause() {
        if (!this.audio) return;
        this.audio.pause();
        this.isPlaying = false;
        this.updateIcon();
    }
}

// Start manager when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.piyuMusic = new MusicManager();
});
