// Tiện ích dùng chung

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const rand = (min, max) => Math.random() * (max - min) + min;
export const randInt = (min, max) => Math.floor(rand(min, max + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Base64 URL-safe, hỗ trợ UTF-8 (tiếng Việt + emoji). */
export function encodePayload(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodePayload(str) {
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    if (!obj || typeof obj !== "object") return null;
    // Chỉ lấy các trường hợp lệ, cắt độ dài để tránh lạm dụng
    const s = (v, n) => (typeof v === "string" ? v.trim().slice(0, n) : "");
    const out = { to: s(obj.to, 30), from: s(obj.from, 30), msg: s(obj.msg, 300) };
    return out.to || out.msg ? out : null;
  } catch {
    return null;
  }
}

/** Gõ chữ từng ký tự vào element (luôn dùng textContent để an toàn). */
export async function typeText(el, text, speed = 45) {
  const caret = document.createElement("span");
  caret.className = "caret";
  const node = document.createTextNode("");
  el.append(node, caret);
  for (const ch of [...text]) {
    node.textContent += ch;
    await sleep(reducedMotion ? 0 : ch === "," || ch === "…" ? speed * 6 : speed);
  }
  caret.remove();
}

let toastTimer;
export function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/** Tạo canvas HiDPI khớp với kích thước hiển thị. */
export function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h, dpr };
}

export function downloadCanvas(canvas, filename) {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
}

/** Tên người xem và trạng thái mở quà (lưu localStorage). */
export const viewer = {
  override: "",
  _memGifts: {},
  _memFortune: "",
  get name() {
    try { return this.override || localStorage.getItem("kvcn-name") || ""; } catch { return this.override; }
  },
  set name(v) { try { localStorage.setItem("kvcn-name", v); } catch { this.override = v; } },
  display() { return this.name || "bạn"; },

  get fortune() {
    try { return localStorage.getItem("kvcn-fortune") || this._memFortune; } catch { return this._memFortune; }
  },
  set fortune(v) {
    this._memFortune = v;
    try { localStorage.setItem("kvcn-fortune", v); } catch {}
  },

  getOpenedMap() {
    try {
      const raw = localStorage.getItem("kvcn-gifts-v4");
      return raw ? JSON.parse(raw) : this._memGifts;
    } catch {
      return this._memGifts;
    }
  },
  saveOpenedGift(boxIdx, gift) {
    const map = this.getOpenedMap();
    if (Object.keys(map).length >= 6 && !map[boxIdx]) return map[boxIdx] || null;
    map[boxIdx] = gift;
    this._memGifts = map;
    try { localStorage.setItem("kvcn-gifts-v4", JSON.stringify(map)); } catch {}
    return gift;
  },
  openedList() {
    const map = this.getOpenedMap();
    return [0, 1, 2, 3, 4, 5]
      .filter((k) => map[k])
      .map((k) => ({ box: Number(k) + 1, ...map[k] }));
  },
  hasBanhMi() {
    return this.openedList().some((g) => g.isBanhMi || (g.title && g.title.includes("Bánh mì")));
  },
  getSelectedGifts() {
    try {
      const raw = localStorage.getItem("kvcn-selected-gifts-v4");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  saveSelectedGifts(list) {
    try { localStorage.setItem("kvcn-selected-gifts-v4", JSON.stringify(list)); } catch {}
  },
  resetGiftsSession() {
    this._memGifts = {};
    try {
      localStorage.removeItem("kvcn-gifts-v4");
      localStorage.removeItem("kvcn-selected-gifts-v4");
      localStorage.removeItem("kvcn-gifts-v3");
      localStorage.removeItem("kvcn-gifts-v2");
      localStorage.removeItem("kvcn-gifts");
    } catch {}
  },
};

export const fillName = (tpl) => tpl.replaceAll("{name}", viewer.display());
