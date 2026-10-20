// Vẽ hoa, thân, lá bằng Canvas 2D – dùng chung cho màn mở đầu và khu vườn.
import { easeOutBack, clamp, pick } from "../utils.js";

export const PALETTES = {
  daisy:  [["#ffffff", "#ffd54f"], ["#ffe4ec", "#ffca28"], ["#f3e5f5", "#ffb300"]],
  sakura: [["#ffc1d6", "#ff80a6"], ["#ffd6e5", "#f06292"], ["#fff0f5", "#ff8fb1"]],
  tulip:  [["#ff6f91", "#c2185b"], ["#ffb74d", "#f57c00"], ["#ba68c8", "#7b1fa2"], ["#fff176", "#f9a825"]],
  rose:   [["#ff4d7d", "#9c0f45"], ["#ff8a80", "#c62828"], ["#f8bbd0", "#e2457a"]],
  lotus:  [["#ffd1dc", "#ff6f99"], ["#fff0f5", "#f48fb1"]],
};
export const TYPES = Object.keys(PALETTES);
export const randomFlower = () => {
  const type = pick(TYPES);
  return { type, pal: pick(PALETTES[type]) };
};

function petalPath(ctx, len, w) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(w, -len * 0.3, w * 0.8, -len * 0.9, 0, -len);
  ctx.bezierCurveTo(-w * 0.8, -len * 0.9, -w, -len * 0.3, 0, 0);
}

function notchedPetal(ctx, len, w) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(w * 1.1, -len * 0.35, w * 0.9, -len * 0.9, w * 0.35, -len);
  ctx.lineTo(0, -len * 0.86);
  ctx.lineTo(-w * 0.35, -len);
  ctx.bezierCurveTo(-w * 0.9, -len * 0.9, -w * 1.1, -len * 0.35, 0, 0);
}

function radial(ctx, r, inner, outer, mid = 0.65) {
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(r, 0.1));
  g.addColorStop(0, inner);
  g.addColorStop(mid, outer);
  g.addColorStop(1, outer);
  return g;
}

/**
 * Vẽ một bông hoa.
 * @param p tiến độ nở 0..1
 */
export function drawFlower(ctx, x, y, size, type, pal, p = 1, rot = 0) {
  const s = size * Math.max(0, easeOutBack(clamp(p, 0, 1)));
  if (s <= 0.5) return;
  const [light, deep] = pal;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  switch (type) {
    case "daisy": {
      const n = 14;
      ctx.fillStyle = radial(ctx, s, deep + "55", light, 0.35);
      for (let i = 0; i < n; i++) {
        ctx.rotate((Math.PI * 2) / n);
        petalPath(ctx, s, s * 0.2);
        ctx.fill();
      }
      ctx.fillStyle = radial(ctx, s * 0.3, "#fff59d", deep, 0.4);
      ctx.beginPath(); ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(120,70,0,.35)";
      for (let i = 0; i < 12; i++) {
        const a = i * 2.4, r = Math.sqrt(i / 12) * s * 0.22;
        ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r, s * 0.025, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case "sakura": {
      ctx.fillStyle = radial(ctx, s, deep, light, 0.45);
      for (let i = 0; i < 5; i++) {
        ctx.rotate((Math.PI * 2) / 5);
        notchedPetal(ctx, s, s * 0.5);
        ctx.fill();
      }
      ctx.strokeStyle = deep; ctx.lineWidth = Math.max(1, s * 0.03);
      ctx.fillStyle = "#ffe082";
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const ex = Math.cos(a) * s * 0.3, ey = Math.sin(a) * s * 0.3;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.beginPath(); ctx.arc(ex, ey, s * 0.04, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case "tulip": {
      // gốc hoa tại (0,0), hoa hướng lên
      const h = s * 1.4, w = s * 0.55;
      const grad = ctx.createLinearGradient(0, 0, 0, -h);
      grad.addColorStop(0, deep); grad.addColorStop(1, light);
      ctx.fillStyle = grad;
      for (const side of [-1, 1]) {
        ctx.save(); ctx.rotate(side * 0.32);
        petalPath(ctx, h, w); ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 0.95;
      petalPath(ctx, h * 1.02, w * 1.05); ctx.fill();
      ctx.globalAlpha = 0.25; ctx.strokeStyle = "#fff"; ctx.lineWidth = Math.max(1, s * 0.04);
      ctx.beginPath(); ctx.moveTo(0, -h * 0.15); ctx.quadraticCurveTo(w * 0.2, -h * 0.5, 0, -h * 0.85); ctx.stroke();
      break;
    }
    case "rose": {
      const layers = [
        { n: 6, r: 0.55, ps: 0.62, c: light },
        { n: 5, r: 0.38, ps: 0.5, c: light },
        { n: 5, r: 0.22, ps: 0.38, c: deep },
      ];
      layers.forEach((L, li) => {
        ctx.save(); ctx.rotate(li * 0.5);
        for (let i = 0; i < L.n; i++) {
          ctx.rotate((Math.PI * 2) / L.n);
          ctx.fillStyle = radial(ctx, s, deep, L.c, 0.2 + li * 0.15);
          ctx.beginPath();
          ctx.ellipse(0, -s * L.r * 0.6, s * L.ps * 0.62, s * L.ps * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,.08)"; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.restore();
      });
      ctx.strokeStyle = "rgba(90,0,30,.45)"; ctx.lineWidth = Math.max(1, s * 0.035);
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 5; a += 0.2) {
        const r = (a / (Math.PI * 5)) * s * 0.26;
        const px = Math.cos(a) * r, py = Math.sin(a) * r;
        a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      break;
    }
    case "lotus": {
      // gốc hoa tại (0,0), cánh sen xòe lên
      const grad = ctx.createLinearGradient(0, 0, 0, -s * 1.3);
      grad.addColorStop(0, light); grad.addColorStop(1, deep);
      ctx.fillStyle = grad;
      const back = [-1.25, -0.75, -0.25, 0.25, 0.75, 1.25];
      back.forEach((a) => { ctx.save(); ctx.rotate(a); petalPath(ctx, s * 1.05, s * 0.3); ctx.fill(); ctx.restore(); });
      ctx.fillStyle = grad;
      [-0.5, 0, 0.5].forEach((a) => { ctx.save(); ctx.rotate(a); petalPath(ctx, s * 1.25, s * 0.36); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); });
      ctx.fillStyle = "#ffd54f";
      ctx.beginPath(); ctx.ellipse(0, -s * 0.12, s * 0.22, s * 0.1, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
  }
  ctx.restore();
}

/** Loại hoa có gốc ở dưới (vẽ ngay trên đỉnh thân) hay tâm ở giữa. */
export const isCupFlower = (type) => type === "tulip" || type === "lotus";

export function drawLeaf(ctx, x, y, angle, size) {
  if (size <= 0.5) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const g = ctx.createLinearGradient(0, 0, 0, -size);
  g.addColorStop(0, "#2e7d32"); g.addColorStop(1, "#81c784");
  ctx.fillStyle = g;
  petalPath(ctx, size, size * 0.38);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -size * 0.85); ctx.stroke();
  ctx.restore();
}

/** Thân cây là đường cong bậc 2: {x0,y0,cx,cy,x1,y1,leaves:[{t,side,size}]} */
export function stemPoint(st, t) {
  const u = 1 - t;
  return {
    x: u * u * st.x0 + 2 * u * t * st.cx + t * t * st.x1,
    y: u * u * st.y0 + 2 * u * t * st.cy + t * t * st.y1,
  };
}

export function drawStem(ctx, st, p, width = 3, sway = 0) {
  if (p <= 0) return null;
  const s = { ...st, cx: st.cx + sway * 0.5, x1: st.x1 + sway };
  const N = 24;
  ctx.save();
  ctx.strokeStyle = "#3f8f4f";
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(s.x0, s.y0);
  for (let i = 1; i <= N; i++) {
    const pt = stemPoint(s, (i / N) * p);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();
  ctx.restore();
  for (const lf of st.leaves || []) {
    if (p > lf.t) {
      const pt = stemPoint(s, lf.t);
      const k = clamp((p - lf.t) * 4, 0, 1);
      drawLeaf(ctx, pt.x, pt.y, lf.side * (0.9 + lf.t * 0.3), lf.size * easeOutBack(k));
    }
  }
  return stemPoint(s, p);
}
