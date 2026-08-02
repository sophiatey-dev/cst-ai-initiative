const canvas = document.querySelector("#hero-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let nodes = [];
let arcs = [];
let pointer = { x: 0, y: 0, active: false };

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(46, Math.floor((width * height) / 24000));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    radius: index % 8 === 0 ? 2.4 : 1.2,
    pulse: Math.random() * Math.PI * 2,
  }));
  arcs = Array.from({ length: 7 }, () => ({
    x: width * (0.52 + Math.random() * 0.36),
    y: height * (0.24 + Math.random() * 0.5),
    radius: 70 + Math.random() * 190,
    start: Math.random() * Math.PI,
    length: 0.42 + Math.random() * 0.85,
    speed: 0.00008 + Math.random() * 0.00012,
  }));
}

function draw(time) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(5, 8, 20, 0.18)";
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.lineWidth = 1;
  arcs.forEach((arc) => {
    const start = arc.start + time * arc.speed;
    ctx.strokeStyle = "rgba(244, 247, 251, 0.13)";
    ctx.beginPath();
    ctx.arc(arc.x, arc.y, arc.radius, start, start + arc.length);
    ctx.stroke();

    ctx.strokeStyle = "rgba(216, 140, 57, 0.28)";
    ctx.beginPath();
    ctx.arc(arc.x, arc.y, arc.radius * 0.72, start + 0.38, start + arc.length * 0.72);
    ctx.stroke();
  });
  ctx.restore();

  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;
    node.pulse += 0.018;

    if (node.x < -20) node.x = width + 20;
    if (node.x > width + 20) node.x = -20;
    if (node.y < -20) node.y = height + 20;
    if (node.y > height + 20) node.y = -20;
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 118) {
        const opacity = (1 - distance / 118) * 0.1;
        ctx.strokeStyle = `rgba(24, 215, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  if (pointer.active) {
    const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 240);
    glow.addColorStop(0, "rgba(216, 140, 57, 0.18)");
    glow.addColorStop(1, "rgba(216, 140, 57, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, 240, 0, Math.PI * 2);
    ctx.fill();
  }

  nodes.forEach((node) => {
    const glow = 0.34 + Math.sin(node.pulse + time * 0.001) * 0.24;
    ctx.fillStyle = `rgba(244, 247, 251, ${glow})`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, active: true };
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resize();
requestAnimationFrame(draw);

const languageButtons = document.querySelectorAll("[data-lang]");
const bilingualNodes = document.querySelectorAll("[data-en][data-zh]");

function setLanguage(language) {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  bilingualNodes.forEach((node) => {
    node.textContent = node.dataset[language];
  });
  languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === language);
  });
  window.localStorage.setItem("kaku-language", language);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

setLanguage(window.localStorage.getItem("kaku-language") === "zh" ? "zh" : "en");
