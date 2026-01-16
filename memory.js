// PREMIUM NEURAL LINK REVEAL
class NeuralLink {
  constructor() {
    this.overlay = document.getElementById('neural-overlay');
    this.progressFill = document.querySelector('.progress-fill');
    this.mainContainer = document.getElementById('memory-container');

    this.syncProgress = 0;
    this.isSyncing = false;
    this.isUnlocked = false;

    this.init();
  }

  init() {
    if (!this.overlay) return;

    // Interaction events
    const startSync = (e) => this.handleStart(e);
    const endSync = () => this.handleEnd();

    this.overlay.addEventListener('mousedown', startSync);
    this.overlay.addEventListener('touchstart', startSync);
    window.addEventListener('mouseup', endSync);
    window.addEventListener('touchend', endSync);

    this.updateLoop();
  }

  handleStart(e) {
    if (this.isUnlocked) return;
    this.isSyncing = true;
    this.overlay.classList.add('syncing');

    // Start music on first interaction
    if (window.piyuMusic) {
      window.piyuMusic.play();
    }
  }

  handleEnd() {
    this.isSyncing = false;
    this.overlay.classList.remove('syncing');
  }

  updateLoop() {
    if (this.isUnlocked) return;

    if (this.isSyncing) {
      this.syncProgress += 0.8; // Synchronization speed
    } else {
      this.syncProgress = Math.max(0, this.syncProgress - 1.5); // Decay speed
    }

    this.progressFill.style.width = `${Math.min(100, this.syncProgress)}%`;

    if (this.syncProgress >= 100) {
      this.unlock();
    }

    requestAnimationFrame(() => this.updateLoop());
  }

  unlock() {
    this.isUnlocked = true;
    this.isSyncing = false;

    this.overlay.classList.add('unlocked');
    this.mainContainer.classList.add('visible');

    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 1500);
  }
}

// Initialize reveal
document.addEventListener('DOMContentLoaded', () => {
  new NeuralLink();
  renderGallery();
});

// Memory stars interaction
const memoryStars = document.querySelectorAll(".memory-star");
const memoryMessage = document.getElementById("memory-message");
const memoryText = document.getElementById("memory-text");

const memories = {
  1: "You remember when we used to make plans to order from zomato on saturday nights? I miss those days 😁",
  2: "Your voice makes every room brighter. Never Stop Singing Piyu! 🎤",
  3: "Your sketches are amazing. Never stop creating! 🎨",
  4: "12 years of being awesome. Here's to many more! 🎂",
  5: "You're not just my sister, you're my best friend. 💫",
  6: "This world was built because someone loves you enough to protect your magic. ✨"
};

function renderGallery() {
  memoryStars.forEach((star, index) => {
    star.addEventListener("click", () => {
      const memoryNum = star.getAttribute("data-memory");
      const memory = memories[memoryNum] || "A special memory just for you! 🌟";

      memoryText.textContent = memory;
      memoryMessage.classList.remove("hidden");

      star.style.animation = "none";
      setTimeout(() => {
        star.style.animation = "";
      }, 10);
    });
  });
}
