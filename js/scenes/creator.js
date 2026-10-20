// Cảnh 8: Tạo thiệp cá nhân hóa -> link + mã QR + chia sẻ.
import { $, pick, encodePayload, toast, downloadCanvas } from "../utils.js";
import { SUGGESTIONS } from "../data.js";

/** Vẽ mã QR lên canvas (dùng thư viện qrcode-generator, global `qrcode`). */
function drawQR(text, scale = 6, margin = 3) {
  const qr = window.qrcode(0, "L");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const size = (n + margin * 2) * scale;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d");
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#6a1b4d";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
  return cv;
}

async function qrCard(link, to) {
  await document.fonts?.ready;
  const W = 900, H = 1100;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#ffd6e0"); bg.addColorStop(1, "#ffb4c6");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.fillStyle = "#b3164a";
  ctx.font = "700 78px 'Dancing Script', cursive";
  ctx.fillText(`Gửi ${to}`, W / 2, 150);
  const q = drawQR(link, 10, 3);
  const qs = 620;
  ctx.fillStyle = "#fff";
  ctx.fillRect((W - qs) / 2 - 20, 210, qs + 40, qs + 40);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(q, (W - qs) / 2, 230, qs, qs);
  ctx.fillStyle = "#6a1b4d";
  ctx.font = "600 40px 'Be Vietnam Pro', sans-serif";
  ctx.fillText("📷 Quét để mở khu vườn của bạn", W / 2, 960);
  ctx.font = "700 46px 'Dancing Script', cursive";
  ctx.fillText("Chúc mừng 20/10 🌸", W / 2, 1040);
  return cv;
}

export default function createCreator(app) {
  const form = $("#creator-form");
  const result = $("#creator-result");
  const linkInput = $("#share-link");
  let link = "", to = "";

  $("#btn-suggest").addEventListener("click", () => {
    const ta = $("#c-msg");
    let s;
    do { s = pick(SUGGESTIONS); } while (s === ta.value && SUGGESTIONS.length > 1);
    ta.value = s;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    to = $("#c-to").value.trim();
    const from = $("#c-from").value.trim();
    const msg = $("#c-msg").value.trim();
    const base = location.href.split("#")[0].split("?")[0];
    link = `${base}?c=${encodePayload({ to, from, msg })}`;
    linkInput.value = link;
    $("#btn-preview").href = link;
    const qrBox = $("#qr");
    qrBox.replaceChildren();
    try {
      const cv = drawQR(link, 4, 2);
      cv.setAttribute("aria-label", "Mã QR của thiệp");
      qrBox.append(cv);
    } catch {
      qrBox.textContent = "Lời chúc hơi dài để tạo mã QR – hãy dùng link nhé!";
    }
    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      linkInput.select();
      document.execCommand("copy");
    }
    toast("✅ Đã copy link! Gửi ngay cho nàng nhé");
  }
  $("#btn-copy").addEventListener("click", copy);
  linkInput.addEventListener("focus", () => linkInput.select());

  $("#btn-share").addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "🌸 Có một khu vườn đang chờ bạn…", text: `Gửi ${to}: một món quà nhỏ nhân ngày 20/10 💐`, url: link });
      } catch { /* người dùng hủy */ }
    } else copy();
  });

  $("#btn-qr-dl").addEventListener("click", async () => {
    try {
      downloadCanvas(await qrCard(link, to), "thiep-20-10-qr.png");
    } catch {
      toast("Không tạo được ảnh QR, hãy dùng link nhé");
    }
  });

  return {};
}
