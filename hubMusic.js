// -----------------------------------------------------
// HUB MUSIC CONTROLLER
// -----------------------------------------------------

let backgroundMusic = null;
let isPlaying = false;
const musicToggle = document.getElementById("music-toggle");

// Initialize music (you can add your music file URL here)
function initMusic() {
  // Replace with your actual music file path
  // backgroundMusic = new Audio("assets/music/hub-ambient.mp3");
  // backgroundMusic.loop = true;
  // backgroundMusic.volume = 0.4;
  
  // For now, using a placeholder - you can add your music file later
  // Uncomment the lines above and add your music file to assets/music/
  
  updateMusicIcon();
}

// Toggle music playback
function toggleMusic() {
  if (!backgroundMusic) {
    // If no music file is loaded, just toggle the icon
    isPlaying = !isPlaying;
    updateMusicIcon();
    return;
  }
  
  if (isPlaying) {
    backgroundMusic.pause();
    isPlaying = false;
  } else {
    backgroundMusic.play().catch(err => {
      console.log("Music play failed:", err);
      // Some browsers require user interaction first
    });
    isPlaying = true;
  }
  
  updateMusicIcon();
}

// Update the music icon based on state
function updateMusicIcon() {
  if (isPlaying) {
    musicToggle.textContent = "🔊";
    musicToggle.title = "Music: On";
  } else {
    musicToggle.textContent = "🔇";
    musicToggle.title = "Music: Off";
  }
}

// Event listener for music toggle button
if (musicToggle) {
  musicToggle.addEventListener("click", toggleMusic);
  
  // Initialize on page load
  document.addEventListener("DOMContentLoaded", () => {
    initMusic();
  });
  
  // Also try to initialize if DOM is already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMusic);
  } else {
    initMusic();
  }
}

// Handle page visibility (pause when tab is hidden)
document.addEventListener("visibilitychange", () => {
  if (backgroundMusic && document.hidden && isPlaying) {
    backgroundMusic.pause();
  } else if (backgroundMusic && !document.hidden && isPlaying) {
    backgroundMusic.play().catch(() => {});
  }
});
