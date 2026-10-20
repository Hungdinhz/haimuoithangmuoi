// Cảnh 5: Hộp quà bí ẩn – 6 hộp quà, chọn mở 2/6 hộp, tải về thành ảnh PNG.
import { $, $$, pick, viewer, downloadCanvas, toast } from "../utils.js";
import { COUPONS } from "../data.js";
import { fx } from "../fx/particles.js";

/** Xuống dòng chữ trên canvas theo độ rộng tối đa. */
function wrap(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function renderCoupon(c) {
  await document.fonts?.ready;
  const W = 1080, H = 1350;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#ffd6e0"); bg.addColorStop(1, "#ffb4c6");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // chấm hoa trang trí
  ctx.globalAlpha = 0.25;
  ctx.font = "60px serif";
  ["🌸", "🌷", "💗", "🌼"].forEach((e, i) => {
    for (let k = 0; k < 4; k++) ctx.fillText(e, ((i * 4 + k) * 173) % W, ((i * 4 + k) * 311) % H + 60);
  });
  ctx.globalAlpha = 1;
  // thẻ
  const x = 110, y = 200, w = W - 220, h = H - 400;
  ctx.shadowColor = "rgba(120,40,80,.3)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
  ctx.fillStyle = "#fffaf6"; roundRect(ctx, x, y, w, h, 40); ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.setLineDash([18, 14]); ctx.lineWidth = 5; ctx.strokeStyle = "#ff8fab";
  roundRect(ctx, x + 30, y + 30, w - 60, h - 60, 28); ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ff6f91";
  ctx.font = "700 34px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("PHIẾU ĐẶC QUYỀN 20/10", W / 2, y + 120);
  ctx.font = "170px serif";
  ctx.fillText(c.icon, W / 2, y + 330);
  ctx.fillStyle = "#b3164a";
  ctx.font = "700 92px 'Dancing Script', cursive";
  wrap(ctx, c.title, w - 140).forEach((l, i) => ctx.fillText(l, W / 2, y + 470 + i * 96));
  ctx.fillStyle = "#3a2240";
  ctx.font = "400 40px 'Be Vietnam Pro', sans-serif";
  const titleLines = wrap(ctx, c.title, w - 140).length;
  wrap(ctx, c.desc, w - 180).forEach((l, i) => ctx.fillText(l, W / 2, y + 520 + titleLines * 70 + i * 58));
  ctx.font = "600 38px 'Be Vietnam Pro', sans-serif";
  ctx.fillStyle = "#8e3b63";
  ctx.fillText("Người sở hữu: " + viewer.display(), W / 2, y + h - 90);
  ctx.font = "700 60px 'Dancing Script', cursive";
  ctx.fillStyle = "#fff";
  ctx.fillText("Chúc mừng ngày Phụ nữ Việt Nam", W / 2, H - 90);
  return cv;
}

export default function createGifts(app) {
  const gifts = $("#gifts");
  const coupon = $("#coupon");
  const countEl = $("#gift-count");
  const btnRegift = $("#btn-regift");
  let current = null;
  let busy = false;

  function syncUI() {
    const map = viewer.getOpenedMap();
    const openedCount = Object.keys(map).length;
    if (countEl) countEl.textContent = String(openedCount);

    $$(".gift", gifts).forEach((g) => {
      const idx = g.dataset.gift;
      const item = map[idx];
      g.classList.toggle("opened", Boolean(item));
    });

    const remain = Math.max(0, 2 - openedCount);
    btnRegift.textContent = remain > 0
      ? `🎁 Mở tiếp 1 hộp nữa (còn ${remain} hộp)`
      : "Đóng (Đã mở đủ 2/6 hộp)";
  }

  function showCoupon(c) {
    current = c;
    $("#c-icon").textContent = c.icon;
    $("#c-title").textContent = c.title;
    $("#c-desc").textContent = c.desc;
    syncUI();
    coupon.classList.remove("hidden");
  }

  $$(".gift", gifts).forEach((g) =>
    g.addEventListener("click", () => {
      if (busy) return;
      const idx = g.dataset.gift;
      const map = viewer.getOpenedMap();

      // Nếu hộp này đã mở rồi -> cho xem lại phiếu của hộp đó
      if (map[idx]) {
        showCoupon(map[idx]);
        return;
      }

      // Nếu đã mở đủ 2 hộp thì không mở thêm được nữa
      if (Object.keys(map).length >= 2) {
        toast("Bạn đã mở đủ 2/6 hộp quà rồi nhé! 🎁");
        return;
      }

      busy = true;
      g.classList.add("opened");
      const r = g.getBoundingClientRect();
      fx.puff(r.left + r.width / 2, r.top, 30);
      fx.burst(r.left + r.width / 2, r.top - 20, 40);

      // Chọn món quà chưa trùng với các hộp đã mở
      const usedTitles = new Set(Object.values(map).map((x) => x.title));
      const pool = COUPONS.filter((x) => !usedTitles.has(x.title));
      const c = pick(pool.length ? pool : COUPONS);
      viewer.saveOpenedGift(idx, c);
      syncUI();

      setTimeout(() => {
        showCoupon(c);
        busy = false;
      }, 650);
    }));

  btnRegift.addEventListener("click", () => {
    coupon.classList.add("hidden");
  });

  $("#btn-download").addEventListener("click", async () => {
    if (!current) return;
    const cv = await renderCoupon(current);
    downloadCanvas(cv, "phieu-dac-quyen-20-10.png");
  });

  return {
    enter() {
      syncUI();
    },
  };
}
