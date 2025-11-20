const INTRO_DURATION = 4200; // ms

function setupAppTransition() {
  const root = document.documentElement;

  setTimeout(() => {
    root.classList.add("app-show-card");
  }, INTRO_DURATION);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createEmbers() {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("embers-canvas"));
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = canvas.clientWidth;
  let height = canvas.clientHeight;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  const emberCount = 60;
  const embers = [];

  for (let i = 0; i < emberCount; i++) {
    embers.push({
      x: rand(0, width),
      y: rand(height * 0.4, height),
      size: rand(2, 4),
      speedY: rand(24, 60),
      drift: rand(-12, 12),
      life: rand(2, 6),
      age: rand(0, 6),
      brightness: rand(0.7, 1),
    });
  }

  let lastTime = 0;

  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    for (const e of embers) {
      e.age += delta;
      if (e.age > e.life) {
        e.x = rand(0, width);
        e.y = rand(height * 0.5, height * 1.05);
        e.size = rand(2, 4);
        e.speedY = rand(30, 70);
        e.drift = rand(-14, 14);
        e.life = rand(2, 6);
        e.age = 0;
        e.brightness = rand(0.7, 1);
      }

      e.y -= e.speedY * delta;
      e.x += e.drift * delta;

      const progress = e.age / e.life;
      const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

      const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 3);
      gradient.addColorStop(0, `rgba(255, 240, 200, ${0.8 * alpha * e.brightness})`);
      gradient.addColorStop(0.25, `rgba(255, 180, 90, ${0.6 * alpha * e.brightness})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

document.addEventListener("DOMContentLoaded", () => {
  setupAppTransition();
  createEmbers();
});

