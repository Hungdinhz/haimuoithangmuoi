// Cảnh 6: Dòng thời gian – những người phụ nữ Việt Nam làm nên lịch sử.
import { $, fillName } from "../utils.js";
import { TIMELINE } from "../data.js";

export default function createTimeline(app) {
  const list = $("#timeline");
  const scene = $("#scene-timeline");
  let io;

  function render() {
    list.replaceChildren();
    TIMELINE.forEach((item) => {
      const li = document.createElement("li");
      li.className = "t-item" + (item.you ? " you" : "");
      li.dataset.icon = item.icon;
      const year = document.createElement("div"); year.className = "t-year"; year.textContent = item.year;
      const name = document.createElement("div"); name.className = "t-name"; name.textContent = fillName(item.name);
      const desc = document.createElement("p"); desc.className = "t-desc"; desc.textContent = fillName(item.desc);
      li.append(year, name, desc);
      if (item.quote) {
        const q = document.createElement("p"); q.className = "t-quote"; q.textContent = item.quote;
        li.append(q);
      }
      list.append(li);
    });
  }

  return {
    enter() {
      render();
      io?.disconnect();
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { root: scene, threshold: 0.2 });
      list.querySelectorAll(".t-item").forEach((el) => io.observe(el));
    },
    leave() { io?.disconnect(); },
  };
}
