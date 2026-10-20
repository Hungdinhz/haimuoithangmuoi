// Cảnh 0 + 1: chữ gõ từng dòng -> gieo hạt -> hoa nở -> bình minh.
import { $, typeText, sleep, fitCanvas, clamp, easeOutCubic, rand, viewer } from "../utils.js";
import { INTRO_LINES } from "../data.js";
import { fx } from "../fx/particles.js";
import { drawFlower, drawStem, isCupFlower, PALETTES } from "../fx/flowers.js";

export default function createIntro(app) {
  const canvas = $("#seed-canvas");
  const textEl = $("#intro-text");
  const btnSeed = $("#btn-seed");
  const title = $("#bloom-title");
  let ctx, W, H, raf = 0, t0 = 0, planted = false, ready = false;
  let bouquet = [];
  const flags = {};
  const blades = Array.from({ length: 40 }, () => ({ x: rand(-1, 1), h: rand(8, 22), lean: rand(-0.4, 0.4) }));

  function layout() {
    ({ ctx, w: W, h: H } = fitCanvas(canvas));
    const cx = W / 2, gy = H * 0.92;
    const S = clamp(Math.min(W, H) * 0.11, 38, 88);
    const mk = (dx, top, type, pal, size, start, cdx, leaves) => ({
      st: { x0: cx + dx * 0.15, y0: gy, cx: cx + cdx, cy: (gy + top) / 2, x1: cx + dx, y1: top, leaves },
      type, pal, size, start,
    });
    bouquet = [
      mk(-S * 1.9, H * 0.68, "tulip", PALETTES.tulip[0], S * 0.55, 0.6, -S * 0.6, [{ t: 0.4, side: -1, size: S * 0.5 }]),
      mk(S * 2.0, H * 0.7, "daisy", PALETTES.daisy[1], S * 0.55, 0.8, S * 0.9, [{ t: 0.45, side: 1, size: S * 0.5 }]),
      mk(-S * 3.0, H * 0.78, "sakura", PALETTES.sakura[0], S * 0.42, 1.1, -S * 1.4, []),
      mk(S * 3.1, H * 0.8, "lotus", PALETTES.lotus[0], S * 0.45, 1.2, S * 1.6, []),
      // bông chính – vẽ sau cùng để nằm trên
      mk(S * 0.15, H * 0.55, "rose", PALETTES.rose[0], S, 0, -S * 0.7, [
        { t: 0.3, side: -1, size: S * 0.75 }, { t: 0.5, side: 1, size: S * 0.7 },
      ]),
    ];
  }

  function drawGround(alpha) {
    const gy = H * 0.92;
    ctx.save();
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(W / 2, gy + 30, 10, W / 2, gy + 30, Math.min(W, 520) * 0.55);
    g.addColorStop(0, "rgba(90,140,90,.9)");
    g.addColorStop(1, "rgba(90,140,90,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(W / 2, gy + 30, Math.min(W, 520) * 0.55, 60, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#5e9c63"; ctx.lineWidth = 2; ctx.lineCap = "round";
    blades.forEach((b) => {
      const x = W / 2 + b.x * Math.min(W, 520) * 0.4;
      ctx.beginPath(); ctx.moveTo(x, gy + 6); ctx.quadraticCurveTo(x, gy - b.h * 0.5, x + b.lean * b.h, gy - b.h); ctx.stroke();
    });
    ctx.restore();
  }

  function frame(now) {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    const gy = H * 0.92;

    // 1) Hạt giống rơi (0 -> 1s)
    if (t < 1.6) {
      const k = clamp(t / 1, 0, 1);
      const y = H * 0.4 + (gy - H * 0.4) * (k * k);
      const glow = ctx.createRadialGradient(W / 2, y, 0, W / 2, y, 40);
      glow.addColorStop(0, "rgba(255,230,160,.9)"); glow.addColorStop(1, "rgba(255,200,120,0)");
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(W / 2, y, 40, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#8d5a3b"; ctx.beginPath(); ctx.ellipse(W / 2, y, 5, 7, 0.3, 0, Math.PI * 2); ctx.fill();
      if (k >= 1) {
        // vòng sáng lan ra khi chạm đất
        const r = (t - 1) * 220;
        ctx.strokeStyle = `rgba(255,220,150,${clamp(1 - (t - 1) / 0.6, 0, 1)})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(W / 2, gy, r, r * 0.25, 0, 0, Math.PI * 2); ctx.stroke();
      }
    }
    drawGround(clamp((t - 0.9) / 0.8, 0, 1));

    // 2) Thân mọc (1.4s ->), 3) hoa nở
    const GROW = 2.4;
    bouquet.forEach((f, i) => {
      const ts = t - 1.4 - f.start;
      const p = easeOutCubic(clamp(ts / GROW, 0, 1));
      const sway = Math.sin(t * 1.2 + i) * 3 * p;
      const head = drawStem(ctx, f.st, p, f === bouquet[bouquet.length - 1] ? 4 : 3, sway);
      if (!head) return;
      const bp = clamp((ts - GROW * 0.85) / 1.2, 0, 1);
      drawFlower(ctx, head.x, head.y + (isCupFlower(f.type) ? 4 : 0), f.size, f.type, f.pal, bp, isCupFlower(f.type) ? sway * 0.02 : t * 0.05 + i);
    });

    // Mốc sự kiện
    if (t > 2.6 && !flags.dawn) { flags.dawn = true; document.body.classList.add("dawn"); fx.fireflies(false); }
    if (t > 4.9 && !flags.burst) {
      flags.burst = true;
      const main = bouquet[bouquet.length - 1].st;
      fx.burst(main.x1, main.y1, 90);
      fx.petals(0.05);
      title.classList.remove("hidden");
      app.showHud();
    }
    raf = requestAnimationFrame(frame);
  }

  function plant() {
    if (planted || !ready) return;
    planted = true;
    viewer.resetGiftsSession();
    app.startMusic();
    btnSeed.classList.add("hidden");
    textEl.style.transition = "opacity .8s";
    textEl.style.opacity = "0";
    layout();
    t0 = performance.now();
    raf = requestAnimationFrame(frame);
  }

  btnSeed.addEventListener("click", plant);
  canvas.addEventListener("click", plant);
  addEventListener("resize", () => { if (planted && app.current === "scene-intro") layout(); });

  async function playIntro() {
    const lines = app.payload
      ? [`${app.payload.to || "Bạn"} ơi…`, "có người muốn gửi tới bạn một điều thật đặc biệt.", "~Nhưng trước tiên, hãy gieo một hạt giống nhé."]
      : INTRO_LINES;
    await sleep(700);
    for (const line of lines) {
      const p = document.createElement("p");
      const isScript = line.startsWith("~");
      if (isScript) p.className = "script";
      textEl.append(p);
      await typeText(p, isScript ? line.slice(1) : line);
      await sleep(450);
    }
    ready = true;
    btnSeed.classList.remove("hidden");
  }

  return {
    enter() {
      fx.fireflies(!planted);
      if (!textEl.childElementCount) playIntro();
      if (planted) raf = requestAnimationFrame(frame);
    },
    leave() {
      cancelAnimationFrame(raf);
    },
  };
}
