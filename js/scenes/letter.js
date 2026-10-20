// Cảnh 2: phong bì thư riêng (khi mở bằng link thiệp) hoặc hỏi tên người xem.
import { $, viewer } from "../utils.js";
import { fx } from "../fx/particles.js";

export default function createLetter(app) {
  const personal = $("#letter-personal");
  const ask = $("#letter-ask");
  const env = $("#envelope");
  let opened = false;

  if (app.payload) {
    personal.classList.remove("hidden");
    // textContent -> không thể chèn HTML/script qua link
    $("#l-to").textContent = app.payload.to || "bạn";
    $("#l-msg").textContent = app.payload.msg || "Chúc mừng ngày Phụ nữ Việt Nam 20/10! 💐";
    $("#l-from").textContent = app.payload.from || "Một người thương bạn";
  } else {
    ask.classList.remove("hidden");
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    env.classList.add("open");
    $("#env-hint").classList.add("hidden");
    const r = env.getBoundingClientRect();
    fx.puff(r.left + r.width / 2, r.top + r.height / 2, 24);
    // chừa chỗ phía trên cho lá thư trồi lên
    setTimeout(() => {
      const paper = $("#paper");
      env.style.marginTop = Math.max(paper.offsetHeight * 0.62 + 30, r.height * 0.7) + "px";
    }, 600);
    setTimeout(() => $("#btn-letter-next").classList.remove("hidden"), 1800);
  }
  env.addEventListener("click", openEnvelope);
  env.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); } });

  $("#name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    viewer.name = $("#name-input").value.trim().slice(0, 30);
    app.refreshNames();
    app.next();
  });

  return {
    enter() {
      if (!app.payload) $("#name-input").value = viewer.name;
    },
  };
}
