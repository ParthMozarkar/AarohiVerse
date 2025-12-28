document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------
// TYPEWRITER ANIMATION (LOOP)
// ---------------------------

const title = document.getElementById("title");
const countdownEl = document.getElementById("countdown");

const text = "This is your world.";
let index = 0;
let typingForward = true;
let countdownShownOnce = false;

function typeLoop() {
  if (typingForward) {
    title.textContent = text.substring(0, index);
    index++;

    if (index === text.length + 1) {
      // countdown appears ONLY on first finish
      if (!countdownShownOnce) {
        countdownEl.style.opacity = 1;
        countdownShownOnce = true;
      }

      // pause before deleting
      setTimeout(() => {
        typingForward = false;
      }, 1500);
    }

  } else {
    title.textContent = text.substring(0, index);
    index--;

    if (index === 0) {
      typingForward = true;
    }
  }

  setTimeout(typeLoop, typingForward ? 95 : 45);
}

typeLoop();

  
  
  
    // ---------------------------
    // COUNTDOWN + UNLOCK LOGIC
    // ---------------------------
  
    const targetDate = new Date("January 17, 2026 00:00:00").getTime();
  
    const message = document.getElementById("message");
    const button = document.getElementById("enterBtn");
    const notYet = document.getElementById("notYet");
  
    // Early click message
    button.addEventListener("click", () => {
      if (button.disabled) {
        notYet.style.opacity = 1;
  
        setTimeout(() => {
          notYet.style.opacity = 0;
        }, 1500);
      }
    });
  
    function updateCountdown() {
      const now = Date.now();
      const distance = targetDate - now;
  
      if (distance <= 0) {
        // Unlock
        message.innerHTML = "Welcome, Piyu 🌙";
        countdownEl.innerHTML = "The world is ready.";
        button.disabled = false;
        button.classList.add("enabled");
        button.style.cursor = "pointer";
  
        button.onclick = () => {
          window.location.href = "world.html";
        };
  
        return;
      }
  
      // Time math
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);
  
      message.innerHTML = "Only Piyu can unlock this.";
  
      countdownEl.innerHTML =
        `${days} days • ` +
        `${hours.toString().padStart(2, "0")} hours • ` +
        `${minutes.toString().padStart(2, "0")} minutes • ` +
        `${seconds.toString().padStart(2, "0")} seconds`;
    }
  
    updateCountdown();
    setInterval(updateCountdown, 1000);
  
  });
  