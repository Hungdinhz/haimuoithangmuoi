// Điều phối toàn bộ web: chuyển cảnh, nhạc nền, link thiệp riêng, easter eggs.
import { $, $$, decodePayload, viewer, toast } from "./utils.js";
import { fx } from "./fx/particles.js";
import createIntro from "./scenes/intro.js";
import createLetter from "./scenes/letter.js";
import createGarden from "./scenes/garden.js";
import createFortune from "./scenes/fortune.js";
import createGifts from "./scenes/gifts.js";
import createTimeline from "./scenes/timeline.js";
import createFinale from "./scenes/finale.js";
import createCreator from "./scenes/creator.js";

import { synthMusic } from "./fx/audio.js";

const ORDER = [
  "scene-intro", "scene-letter", "scene-garden", "scene-fortune",
  "scene-gifts", "scene-timeline", "scene-finale", "scene-creator",
];
const PROGRESS_SCENES = ORDER.slice(1, 7);

// ---------- Link thiệp riêng (?c=...) ----------
const params = new URLSearchParams(location.search);
const payload = params.get("c") ? decodePayload(params.get("c")) : null;
if (payload?.to) viewer.override = payload.to;

// ---------- Nhạc nền ----------
const bgm = $("#bgm");
const btnMusic = $("#btn-music");
let musicOn = false;

async function startMusic() {
  if (musicOn) return;
  try {
    bgm.volume = 0.5;
    await bgm.play();
    musicOn = true;
    btnMusic.classList.remove("off");
    return;
  } catch {
    // Chặn autoplay hoặc không tải được -> chuyển sang hộp âm nhạc Web Audio
  }

  // Fallback: hộp âm nhạc ngân vang bằng Web Audio API
  try {
    synthMusic.start();
    musicOn = true;
    btnMusic.classList.remove("off");
  } catch {
    btnMusic.classList.add("off");
  }
}

function stopMusic() {
  musicOn = false;
  try { bgm.pause(); } catch {}
  synthMusic.stop();
  btnMusic.classList.add("off");
}

btnMusic.addEventListener("click", () => {
  if (musicOn) stopMusic();
  else startMusic();
});

// ---------- App object truyền cho các cảnh ----------
const app = {
  payload,
  startMusic,
  current: null,
  go,
  next() {
    const i = ORDER.indexOf(app.current);
    go(ORDER[Math.min(i + 1, ORDER.length - 1)]);
  },
  showHud() {
    $("#hud").classList.add("show");
    $("#progress").classList.add("show");
  },
  refreshNames() {
    $$(".viewer-name").forEach((el) => (el.textContent = viewer.display()));
  },
};

const scenes = {
  "scene-intro": createIntro(app),
  "scene-letter": createLetter(app),
  "scene-garden": createGarden(app),
  "scene-fortune": createFortune(app),
  "scene-gifts": createGifts(app),
  "scene-timeline": createTimeline(app),
  "scene-finale": createFinale(app),
  "scene-creator": createCreator(app),
};

// Thanh tiến trình
const progress = $("#progress");
PROGRESS_SCENES.forEach(() => progress.append(document.createElement("i")));

function go(id) {
  if (id === app.current) return;
  const prev = app.current;
  if (prev) {
    scenes[prev]?.leave?.();
    $("#" + prev).classList.remove("active");
  }
  app.current = id;
  app.refreshNames();
  const el = $("#" + id);
  el.classList.add("active");
  el.scrollTop = 0;
  scenes[id]?.enter?.();
  $$("i", progress).forEach((dot, i) => dot.classList.toggle("on", PROGRESS_SCENES[i] === id));
  if (id !== "scene-intro") history.replaceState(null, "", location.search + "#" + id.replace("scene-", ""));
}

// Nút "Tiếp"
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-next]")) app.next();
});
$("#btn-create").addEventListener("click", () => go("scene-creator"));
$("#btn-back-home").addEventListener("click", () => go("scene-garden"));
$("#btn-replay").addEventListener("click", () => {
  location.href = location.pathname + location.search;
});

// ---------- Easter eggs ----------
let keys = "";
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;
  keys = (keys + e.key.toLowerCase()).slice(-3);
  if (keys === "yeu") { fx.hearts(80); toast("💗 Yêu thương được gửi tới bạn!"); }
});
let taps = 0, tapTimer;
$("#bloom-title h1").addEventListener("click", () => {
  taps++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => (taps = 0), 1200);
  if (taps >= 5) { taps = 0; fx.hearts(80); toast("💗 Bạn tìm ra bí mật rồi!"); }
});
function checkHerHour() {
  const d = new Date();
  const m = d.getHours() * 60 + d.getMinutes();
  if (m >= 20 * 60 + 10 && m <= 20 * 60 + 20) {
    fx.hearts(50);
    toast("🌙 Đúng 20:10 – Giờ của nàng!");
    return true;
  }
  return false;
}

// ---------- Khởi động ----------
fx.init($("#fx"));
app.refreshNames();
go("scene-intro");
const herHourTimer = setInterval(() => { if (app.current !== "scene-intro" && checkHerHour()) clearInterval(herHourTimer); }, 30000);
