// ---------- PORTAL LOGIC ----------
document.querySelectorAll(".portal").forEach(portal => {
  const canvas = portal.querySelector(".portal-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = portal.offsetWidth;
  canvas.height = portal.offsetHeight;

  const sparks = [];
  const c = canvas.width / 2;

  function spawnSpark() {
    const a = Math.random() * Math.PI * 2;
    sparks.push({
      x: c + Math.cos(a) * 140,
      y: c + Math.sin(a) * 140,
      vx: Math.cos(a) * (1.5 + Math.random() * 2),
      vy: Math.sin(a) * (1.5 + Math.random() * 2),
      life: 22
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(c, c, 140, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,160,40,0.4)";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#ff9c28";
    ctx.stroke();

    sparks.forEach((s, i) => {
      s.x += s.vx;
      s.y += s.vy;
      s.life--;
      ctx.fillStyle = `rgba(255,180,80,${s.life / 22})`;
      ctx.fillRect(s.x, s.y, 2.5, 2.5);
      if (s.life <= 0) sparks.splice(i, 1);
    });

    if (Math.random() < 0.45) spawnSpark();
    requestAnimationFrame(animate);
  }

  animate();

  portal.addEventListener("click", () => {
    // Visual transition only
    portal.style.transition = "0.9s ease";
    portal.style.transform = "scale(18)";
    portal.style.opacity = "0";

    setTimeout(() => {
      window.location.href = portal.dataset.target;
    }, 900);
  });
});
