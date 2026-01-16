// Music toggle for Melody world
const musicToggle = document.getElementById("music-toggle");
let isPlaying = false;

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    isPlaying = !isPlaying;
    musicToggle.textContent = isPlaying ? "🔊" : "🔇";
    // Add music playback logic here when you have music files
  });
}


