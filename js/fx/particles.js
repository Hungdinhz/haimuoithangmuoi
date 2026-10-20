// Hệ thống hạt dùng chung: đom đóm, cánh hoa rơi, tim, pháo hoa.
import { rand, pick, fitCanvas, reducedMotion } from "../utils.js";

const PETAL_COLORS = ["#ffb4c6", "#ff8fab", "#ffc1d6", "#ffd6e0", "#ff6f91", "#fff0f5"];
const SPARK_COLORS = ["#ffd54f", "#ff6f91", "#ff8fab", "#ffffff", "#f7c873", "#ce93d8", "#80deea"];

let canvas, ctx, W = 0, H = 0;
const parts = [];
const modes = { fireflies: false, petals: 0 };
let last = 0;

function resize() {
  ({ ctx, w: W, h: H } = fitCanvas(canvas));
}

function spawnFirefly() {
  parts.push({
    kind: "firefly", x: rand(0, W), y: rand(H * 0.2, H), vx: rand(-0.15, 0.15), vy: rand(-0.3, -0.05),
    size: rand(1.2, 2.8), life: 0, max: rand(5, 10), phase: rand(0, 6.28),
  });
}

function spawnPetal(x = rand(-20, W), y = -20, vx = rand(-0.3, 0.6), vy = rand(0.6, 1.4)) {
  parts.push({
    kind: "petal", x, y, vx, vy, size: rand(6, 12), rot: rand(0, 6.28), vr: rand(-0.04, 0.04),
    sway: rand(0.5, 1.5), phase: rand(0, 6.28), color: pick(PETAL_COLORS), life: 0, max: 45,
  });
}

function drawHeart(c, s) {
  c.beginPath();
  c.moveTo(0, s * 0.3);
  c.bezierCurveTo(-s, -s * 0.4, -s * 0.5, -s * 1.1, 0, -s * 0.5);
  c.bezierCurveTo(s * 0.5, -s * 1.1, s, -s * 0.4, 0, s * 0.3);
  c.fill();
}

function update(dt) {
  if (modes.fireflies && parts.filter((p) => p.kind === "firefly").length < Math.min(60, W / 18)) spawnFirefly();
  if (modes.petals && Math.random() < modes.petals * dt * 60) spawnPetal();

  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life += dt;
    switch (p.kind) {
      case "firefly":
        p.x += p.vx + Math.sin(p.life * 0.8 + p.phase) * 0.2;
        p.y += p.vy;
        if (!modes.fireflies) p.max = Math.min(p.max, p.life + 1.5);
        break;
      case "petal":
      case "heart":
        p.x += p.vx + Math.sin(p.life * p.sway + p.phase) * 0.6;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.drag) { p.vx *= p.drag; p.vy *= p.drag; }
        p.vy += p.g || 0;
        break;
      case "spark":
        p.px = p.x; p.py = p.y;
        p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.045;
        p.x += p.vx; p.y += p.vy;
        break;
      case "rocket":
        p.px = p.x; p.py = p.y;
        p.y += p.vy; p.x += p.vx;
        p.vy *= 0.985;
        if (p.y <= p.ty || p.vy > -1.5) { burst(p.x, p.y); p.life = p.max; }
        else if (Math.random() < 0.6) parts.push({ kind: "spark", x: p.x, y: p.y, vx: rand(-0.3, 0.3), vy: rand(0, 0.6), color: "#ffd54f", size: 1.2, life: 0, max: 0.5 });
        break;
    }
    if (p.life >= p.max || p.y > H + 40 || p.x < -60 || p.x > W + 60 || p.y < -200) parts.splice(i, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  for (const p of parts) {
    const fade = Math.min(1, p.life / 0.4, (p.max - p.life) / 0.8);
    ctx.globalAlpha = Math.max(0, fade);
    switch (p.kind) {
      case "firefly": {
        const tw = 0.5 + 0.5 * Math.sin(p.life * 3 + p.phase);
        ctx.globalCompositeOperation = "lighter";
        const r = p.size * 5;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(255,236,170,${0.9 * tw})`);
        g.addColorStop(1, "rgba(255,200,120,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "petal": {
        ctx.globalCompositeOperation = "source-over";
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.scale(1, 0.6 + 0.4 * Math.sin(p.life * 2 + p.phase)); // lật cánh 3D giả
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.6, p.size * 0.7, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.7, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
        ctx.fill();
        ctx.restore();
        break;
      }
      case "heart": {
        ctx.globalCompositeOperation = "source-over";
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; drawHeart(ctx, p.size);
        ctx.restore();
        break;
      }
      case "spark":
      case "rocket": {
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = p.color; ctx.lineWidth = p.size; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(p.px ?? p.x, p.py ?? p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        break;
      }
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

function loop(t) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
  last = t;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

/** Pháo hoa nổ tại (x,y): tia sáng + cánh hoa. */
export function burst(x, y, n = 70) {
  if (reducedMotion) n = 20;
  const color = pick(SPARK_COLORS);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
    const sp = rand(2, 5.5);
    parts.push({ kind: "spark", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, color: Math.random() < 0.8 ? color : "#fff", size: rand(1.4, 2.6), life: 0, max: rand(1, 1.8) });
  }
  for (let i = 0; i < n / 5; i++) {
    const a = rand(0, Math.PI * 2), sp = rand(1, 3.5);
    parts.push({ kind: "petal", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, g: 0.03, drag: 0.98, size: rand(5, 9), rot: rand(0, 6.28), vr: rand(-0.08, 0.08), sway: 1, phase: rand(0, 6), color: pick(PETAL_COLORS), life: 0, max: rand(3, 5) });
  }
}

export const fx = {
  init(el) {
    canvas = el;
    resize();
    addEventListener("resize", resize);
    requestAnimationFrame(loop);
  },
  fireflies(on) { modes.fireflies = on; },
  petals(rate) { modes.petals = reducedMotion ? Math.min(rate, 0.02) : rate; },
  burst,
  /** Bắn pháo hoa từ dưới lên. */
  launch(x = rand(W * 0.15, W * 0.85), ty = rand(H * 0.12, H * 0.4)) {
    parts.push({ kind: "rocket", x, y: H + 10, vx: rand(-0.6, 0.6), vy: -rand(9, 12), ty, color: "#ffe9a8", size: 2.5, life: 0, max: 5 });
  },
  /** Mưa tim (easter egg). */
  hearts(count = 60) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => parts.push({
        kind: "heart", x: rand(0, W), y: -20, vx: rand(-0.4, 0.4), vy: rand(1.5, 3.5), size: rand(8, 18),
        rot: rand(-0.4, 0.4), vr: rand(-0.02, 0.02), sway: rand(0.5, 1.5), phase: rand(0, 6),
        color: pick(["#ff6f91", "#ff4d7d", "#ff8fab", "#e91e63"]), life: 0, max: 12,
      }), i * 40);
    }
  },
  /** Cánh hoa bung ra từ một điểm (dùng khi trồng hoa / mở quà). */
  puff(x, y, n = 14) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(1, 3);
      parts.push({ kind: "petal", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5, g: 0.05, drag: 0.97, size: rand(4, 8), rot: rand(0, 6.28), vr: rand(-0.1, 0.1), sway: 1, phase: rand(0, 6), color: pick(PETAL_COLORS), life: 0, max: rand(1.5, 2.5) });
    }
  },
};
