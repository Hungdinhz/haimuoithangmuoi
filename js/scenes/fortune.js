// Cảnh 4: Gieo quẻ 20/10 – chạm hoặc lắc điện thoại.
import { $, pick, sleep, viewer } from "../utils.js";
import { FORTUNES } from "../data.js";
import { fx } from "../fx/particles.js";

export default function createFortune(app) {
  const tube = $("#tube");
  const stick = $("#stick-out");
  const card = $("#fortune-card");
  let busy = false, last = null, motionAsked = false, active = false;

  const hasMotion = "DeviceMotionEvent" in window && "ontouchstart" in window;
  if (!hasMotion) document.querySelectorAll(".only-motion").forEach((el) => el.classList.add("hidden"));

  async function askMotion() {
    if (motionAsked || !hasMotion) return;
    motionAsked = true;
    // iOS 13+ cần xin quyền trong một thao tác của người dùng
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try { await DeviceMotionEvent.requestPermission(); } catch { /* bỏ qua */ }
    }
  }

  async function shake() {
    if (busy) return;
    busy = true;
    card.classList.add("hidden");
    tube.classList.remove("shake");
    void tube.offsetWidth; // restart animation
    tube.classList.add("shake");
    navigator.vibrate?.([60, 40, 60, 40, 60]);
    await sleep(900);
    tube.classList.remove("shake");
    stick.classList.remove("fly");
    void stick.offsetWidth;
    stick.classList.add("fly");
    await sleep(700);
    let f;
    do { f = pick(FORTUNES); } while (f === last && FORTUNES.length > 1);
    last = f;
    viewer.fortune = `${f.title} (${f.rank})`;
    $("#f-rank").textContent = f.rank;
    $("#f-title").textContent = f.title;
    $("#f-text").textContent = f.text;
    card.classList.remove("hidden");
    const r = card.getBoundingClientRect();
    fx.puff(r.left + r.width / 2, r.top, 18);
    busy = false;
  }

  tube.addEventListener("click", () => { askMotion(); shake(); });
  tube.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); shake(); } });
  $("#btn-refortune").addEventListener("click", shake);

  // Lắc điện thoại thật
  let lastShake = 0;
  addEventListener("devicemotion", (e) => {
    if (!active) return;
    const a = e.accelerationIncludingGravity || e.acceleration;
    if (!a) return;
    const mag = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0);
    const now = Date.now();
    if (mag > 35 && now - lastShake > 2500) { lastShake = now; shake(); }
  });

  return {
    enter() { active = true; },
    leave() { active = false; },
  };
}
