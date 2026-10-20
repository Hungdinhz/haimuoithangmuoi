// Cảnh 3: Khu vườn lời chúc – chạm để trồng hoa, đủ 20 bông mở thông điệp ẩn.
import { $, fitCanvas, rand, clamp, easeOutCubic, fillName, viewer } from "../utils.js";
import { WISHES, GARDEN_GOAL } from "../data.js";
import { fx } from "../fx/particles.js";
import { drawFlower, drawStem, randomFlower, isCupFlower } from "../fx/flowers.js";

export default function createGarden(app) {
  const canvas = $("#garden-canvas");
  const toastEl = $("#wish-toast");
  const countEl = $("#garden-count");
  const secret = $("#garden-secret");
  let ctx, W, H, raf = 0, count = 0, toastTimer;
  const flowers = [];
  const grass = Array.from({ length: 120 }, () => ({ x: Math.random(), h: rand(10, 30), lean: rand(-0.5, 0.5), shade: rand(0, 1) }));

  // Hàng đợi lời chúc không lặp lại cho tới khi hết
  let queue = [];
  const nextWish = () => {
    if (!queue.length) queue = [...WISHES].sort(() => Math.random() - 0.5);
    return fillName(queue.pop());
  };

  function resize() { ({ ctx, w: W, h: H } = fitCanvas(canvas)); }

  function plant(rx, ry, silent = false) {
    const { type, pal } = randomFlower();
    const S = clamp(Math.min(W, H) * 0.06, 22, 46);
    flowers.push({
      rx, ry, rgy: rand(0.9, 0.99), type, pal,
      size: rand(S * 0.75, S * 1.15), bend: rand(-30, 30), born: performance.now(),
      leaves: [{ t: rand(0.25, 0.45), side: Math.random() < 0.5 ? -1 : 1, size: rand(S * 0.5, S * 0.8) }],
    });
    flowers.sort((a, b) => a.rgy - b.rgy);
    if (silent) return;
    fx.puff(rx * W, ry * H, 10);
    showWish(nextWish());
    count++;
    countEl.textContent = Math.min(count, GARDEN_GOAL);
    if (count === GARDEN_GOAL) celebrate();
  }

  function showWish(text) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3600);
  }

  function celebrate() {
    toastEl.classList.remove("show");
    secret.classList.remove("hidden");
    for (let i = 0; i < 4; i++) setTimeout(() => fx.launch(), i * 350);
    fx.hearts(30);
  }
  secret.addEventListener("click", () => secret.classList.add("hidden"));

  function drawGrass(now) {
    const top = H * 0.86;
    const g = ctx.createLinearGradient(0, top - 40, 0, H);
    g.addColorStop(0, "rgba(129,199,132,0)");
    g.addColorStop(0.35, "rgba(129,199,132,.55)");
    g.addColorStop(1, "rgba(76,140,80,.85)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, top);
    for (let x = 0; x <= W; x += 20) ctx.lineTo(x, top + Math.sin(x / 90) * 10);
    ctx.lineTo(W, H);
    ctx.fill();
    ctx.lineCap = "round"; ctx.lineWidth = 2;
    const t = now / 1000;
    grass.forEach((b) => {
      const x = b.x * W, y = H - 2;
      const sw = Math.sin(t * 1.5 + b.x * 10) * 3;
      ctx.strokeStyle = b.shade > 0.5 ? "#4f9a55" : "#6fbf73";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - b.h * 0.5, x + b.lean * b.h + sw, y - b.h); ctx.stroke();
    });
  }

  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    drawGrass(now);
    const t = now / 1000;
    for (const f of flowers) {
      const age = (now - f.born) / 1000;
      const p = easeOutCubic(clamp(age / 0.9, 0, 1));
      const x = f.rx * W, top = f.ry * H, gy = f.rgy * H;
      const sway = Math.sin(t * 1.3 + f.rx * 12) * 4 * p;
      const st = { x0: x + f.bend * 0.3, y0: gy, cx: x - f.bend, cy: (gy + top) / 2, x1: x, y1: top, leaves: f.leaves };
      const head = drawStem(ctx, st, p, 2.5, sway);
      if (!head) continue;
      const bp = clamp((age - 0.6) / 0.8, 0, 1);
      drawFlower(ctx, head.x, head.y, f.size, f.type, f.pal, bp, isCupFlower(f.type) ? 0 : t * 0.1 + f.rx * 6);
    }
    raf = requestAnimationFrame(frame);
  }

  canvas.addEventListener("pointerdown", (e) => {
    const r = canvas.getBoundingClientRect();
    const rx = (e.clientX - r.left) / r.width;
    const ry = clamp((e.clientY - r.top) / r.height, 0.3, 0.84);
    plant(rx, ry);
  });

  let seeded = false;
  return {
    enter() {
      resize();
      if (!seeded) {
        seeded = true;
        // vài bông "mồi" để khu vườn không trống
        [[0.12, 0.72], [0.85, 0.68], [0.3, 0.8], [0.68, 0.78]].forEach(([x, y], i) =>
          setTimeout(() => plant(x, y, true), 300 + i * 250));
        setTimeout(() => showWish(`Chào ${viewer.display()}! Chạm vào khu vườn để nhận lời chúc nhé 🌷`), 900);
      }
      raf = requestAnimationFrame(frame);
      addEventListener("resize", resize);
    },
    leave() {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
    },
  };
}
