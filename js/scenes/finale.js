// Cảnh 7: Lời cảm ơn + Lời chúc riêng cho bạn nữ + Gửi lời nhắn tới HungDinh + API & Hộp thư lưu trữ vĩnh viễn cho riêng HungDinh.
import { $, fillName, viewer, toast } from "../utils.js";
import { FINALE_WISHES, QUICK_REQUESTS, AUTHOR_NAME } from "../data.js";
import { fx } from "../fx/particles.js";

// Kênh lưu trữ đám mây vĩnh viễn (lưu ngày mai, tuần sau mở lại vẫn còn nguyên)
const PERMANENT_OBJ_ID = "ff808181a09d98f701a157c9127e25c9";
const PERMANENT_URL = `https://api.restful-api.dev/objects/${PERMANENT_OBJ_ID}`;

// Kênh pub/sub thời gian thực
const SECRET_API_TOPIC = "hungdinh_2010_api_private_99";
const REALTIME_URL = `https://ntfy.sh/${SECRET_API_TOPIC}`;

const STORAGE_KEY = "kvcn-hungdinh-inbox-v3";

function loadLocalInbox() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalInbox(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 150)));
  } catch { /* ignore */ }
}

function formatTime(ts) {
  try {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())} · ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return "";
  }
}

export default function createFinale(app) {
  let timer = 0, stopTimer = 0;
  let wishIndex = 0;

  const fwContent = $("#fw-content");
  const btnNextWish = $("#btn-next-wish");
  const reqForm = $("#request-form");
  const reqName = $("#req-name");
  const btnToggleGifts = $("#btn-toggle-gifts");
  const reqGiftDropdown = $("#req-gift-dropdown");
  const reqChips = $("#req-chips");
  const reqMsg = $("#req-msg");
  const btnSendReq = $("#btn-send-req");
  const reqSent = $("#req-sent");
  const reqSentDetail = $("#req-sent-detail");
  const btnReqAgain = $("#btn-req-again");

  const btnInbox = $("#btn-inbox");
  const inboxModal = $("#inbox-modal");
  const inboxList = $("#inbox-list");
  const inboxBadge = $("#inbox-badge");

  // Kiểm tra quyền Admin của HungDinh (?key=hungdinh)
  const urlParams = new URLSearchParams(location.search);
  let isAdmin = urlParams.get("key")?.toLowerCase() === "hungdinh" || location.hash === "#hungdinh";

  function enableAdminMode() {
    isAdmin = true;
    btnInbox.classList.remove("hidden");
  }
  if (isAdmin) enableAdminMode();

  // ---------- 1. Lời chúc riêng dành tặng bạn nữ ----------
  function renderSpecialWish(animate = false) {
    const tpl = FINALE_WISHES[wishIndex % FINALE_WISHES.length];
    fwContent.textContent = fillName(tpl);
    if (animate) {
      fwContent.style.opacity = "0";
      fwContent.style.transition = "opacity .3s";
      requestAnimationFrame(() => { fwContent.style.opacity = "1"; });
    }
  }

  btnNextWish.addEventListener("click", (e) => {
    wishIndex = (wishIndex + 1) % FINALE_WISHES.length;
    renderSpecialWish(true);
    const r = e.currentTarget.getBoundingClientRect();
    fx.puff(r.left + r.width / 2, r.top, 12);
  });

  // ---------- 2. Dòng chọn đổi phiếu quà đã mở (chỉ hiện chi tiết khi bấm vào) ----------
  function renderGiftSelector() {
    const opened = viewer.openedList();
    const wonBanhMi = viewer.hasBanhMi();
    reqGiftDropdown.replaceChildren();

    if (!opened.length && !viewer.fortune) {
      const emptyNote = document.createElement("div");
      emptyNote.style.padding = "8px";
      emptyNote.style.fontSize = ".82rem";
      emptyNote.style.opacity = ".8";
      emptyNote.textContent = "Bạn chưa mở hộp quà nào ở cảnh trước. Bạn có thể tự viết lời nhắn / điều ước bên dưới nhé!";
      reqGiftDropdown.append(emptyNote);
    } else {
      opened.forEach((g) => {
        const itemBtn = document.createElement("button");
        itemBtn.type = "button";
        itemBtn.className = "req-gift-option" + (g.isBanhMi ? " banhmi" : "");

        const textSpan = document.createElement("span");
        textSpan.textContent = `Hộp ${g.box}: ${g.icon} ${g.title}`;

        const tagSpan = document.createElement("span");
        tagSpan.className = "req-gift-option-tag";
        tagSpan.textContent = g.isBanhMi ? "🥖 Trúng Bánh Mì" : "Đổi phiếu này";

        itemBtn.append(textSpan, tagSpan);

        itemBtn.addEventListener("click", () => {
          if (g.isBanhMi) {
            reqMsg.value = `🥖 Mình mở trúng Bánh mì (trị giá 10–20k) rồi, ${AUTHOR_NAME} tặng mình nha!`;
          } else {
            reqMsg.value = `🎁 Cho mình đổi phiếu "${g.title}" nha ${AUTHOR_NAME}!`;
          }
          btnToggleGifts.textContent = `🎁 Đã chọn: ${g.title} (bấm để đổi) ▲`;
          reqGiftDropdown.classList.add("hidden");
          reqMsg.focus();
          fx.puff(itemBtn.getBoundingClientRect().left + 80, itemBtn.getBoundingClientRect().top, 10);
        });

        reqGiftDropdown.append(itemBtn);
      });

      if (viewer.fortune) {
        const itemBtn = document.createElement("button");
        itemBtn.type = "button";
        itemBtn.className = "req-gift-option";
        itemBtn.innerHTML = `<span>🎋 Quẻ đã gieo: ${viewer.fortune}</span><span class="req-gift-option-tag">Gửi quẻ này</span>`;
        itemBtn.addEventListener("click", () => {
          reqMsg.value = `🎋 Mình gieo được ${viewer.fortune} nè ${AUTHOR_NAME}!`;
          btnToggleGifts.textContent = `🎋 Đã chọn gửi Quẻ xăm (bấm để đổi) ▲`;
          reqGiftDropdown.classList.add("hidden");
          reqMsg.focus();
        });
        reqGiftDropdown.append(itemBtn);
      }
    }

    // Các nút gợi ý nhanh ở dưới
    reqChips.replaceChildren();
    const list = [...QUICK_REQUESTS];
    if (wonBanhMi) {
      list.unshift(`🥖 Mình mở trúng Bánh mì (trị giá 10–20k) rồi, ${AUTHOR_NAME} tặng mình nha!`);
    }

    list.forEach((txt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "req-chip";
      btn.textContent = txt;
      btn.addEventListener("click", () => {
        reqMsg.value = txt;
        reqMsg.focus();
      });
      reqChips.append(btn);
    });
  }

  btnToggleGifts.addEventListener("click", () => {
    const isHidden = reqGiftDropdown.classList.toggle("hidden");
    const opened = viewer.openedList();
    if (isHidden) {
      btnToggleGifts.textContent = opened.length ? "🎁 Đổi phiếu quà đã mở... ▼" : "🎁 Xem phiếu quà... ▼";
    } else {
      btnToggleGifts.textContent = "🎁 Chọn phiếu bạn muốn đổi bên dưới: ▲";
    }
  });

  reqName.addEventListener("input", () => {
    const v = reqName.value.trim().slice(0, 30);
    if (v) {
      viewer.name = v;
      app.refreshNames();
      renderSpecialWish(false);
    }
  });

  // ---------- 3. Quản lý Hộp thư & Đám mây vĩnh viễn của HungDinh ----------
  const messagesMap = new Map();
  loadLocalInbox().forEach((item) => {
    if (item && item.id) messagesMap.set(item.id, item);
  });

  function updateBadge() {
    const count = messagesMap.size;
    inboxBadge.textContent = count > 99 ? "99+" : String(count);
    inboxBadge.classList.toggle("hidden", count === 0);
  }

  function renderInbox() {
    updateBadge();
    inboxList.replaceChildren();
    const all = [...messagesMap.values()].sort((a, b) => (b.ts || 0) - (a.ts || 0));
    saveLocalInbox(all);

    if (!all.length) {
      const empty = document.createElement("div");
      empty.className = "inbox-empty";
      empty.textContent = "Chưa có tin nhắn nào gửi tới HungDinh. Dữ liệu được lưu trữ vĩnh viễn trên đám mây.";
      inboxList.append(empty);
      return;
    }

    all.forEach((item) => {
      const card = document.createElement("div");
      card.className = "inbox-item";

      const top = document.createElement("div");
      top.className = "inbox-item-top";

      const sender = document.createElement("span");
      sender.className = "inbox-sender";
      sender.textContent = `👤 ${item.name || "Bạn nữ ẩn danh"}`;

      const time = document.createElement("span");
      time.className = "inbox-time";
      time.textContent = formatTime(item.ts);

      top.append(sender, time);
      card.append(top);

      // Nhãn xác thực trúng Bánh mì 10-20k từ hệ thống
      const verifyBadge = document.createElement("div");
      verifyBadge.className = "inbox-banhmi-status " + (item.wonBanhMi ? "won" : "not-won");
      verifyBadge.textContent = item.wonBanhMi
        ? "✅ HỆ THỐNG XÁC NHẬN: ĐÃ MỞ TRÚNG BÁNH MÌ (10–20K)"
        : "❌ HỆ THỐNG XÁC NHẬN: Chưa mở trúng Bánh mì";
      card.append(verifyBadge);

      const giftsArr = Array.isArray(item.openedGifts) ? item.openedGifts : (item.coupon ? [item.coupon] : []);
      if (giftsArr.length || item.fortune) {
        const perks = document.createElement("div");
        perks.className = "inbox-perks";
        giftsArr.forEach((gText) => {
          const c = document.createElement("span");
          c.textContent = `🎁 ${gText}`;
          perks.append(c);
        });
        if (item.fortune) {
          const f = document.createElement("span");
          f.textContent = `🎋 ${item.fortune}`;
          perks.append(f);
        }
        card.append(perks);
      }

      const msg = document.createElement("p");
      msg.className = "inbox-msg";
      msg.textContent = item.msg || "";
      card.append(msg);

      inboxList.append(card);
    });
  }

  function ingestItem(data, notify = false) {
    if (!data || typeof data !== "object" || !data.msg) return;
    const id = data.id || "item-" + data.ts;
    const isNew = !messagesMap.has(id);
    messagesMap.set(id, {
      id,
      name: String(data.name || "Bạn nữ").slice(0, 30),
      msg: String(data.msg || "").slice(0, 300),
      wonBanhMi: Boolean(data.wonBanhMi),
      banhMiStatus: String(data.banhMiStatus || ""),
      openedGifts: Array.isArray(data.openedGifts) ? data.openedGifts.map((x) => String(x).slice(0, 80)) : [],
      fortune: String(data.fortune || "").slice(0, 80),
      ts: data.ts || Date.now(),
    });
    if (isNew) {
      renderInbox();
      if (notify && isAdmin) toast(`📬 Tin nhắn mới từ ${data.name || "bạn nữ"}!`);
    }
  }

  async function fetchPermanentInbox() {
    try {
      const res = await fetch(PERMANENT_URL);
      if (res.ok) {
        const obj = await res.json();
        const list = obj?.data?.messages || [];
        list.forEach((m) => ingestItem(m, false));
        renderInbox();
      }
    } catch { /* fallback to local and pubsub */ }

    try {
      const res2 = await fetch(`${REALTIME_URL}/json?poll=1&since=24h`);
      if (res2.ok) {
        const text = await res2.text();
        text.split("\n").filter(Boolean).forEach((line) => {
          try {
            const env = JSON.parse(line);
            if (env.event === "message" && env.message) ingestItem(JSON.parse(env.message), false);
          } catch {}
        });
        renderInbox();
      }
    } catch {}
  }

  // Gửi lời nhắn từ bạn nữ tới HungDinh (Lưu vĩnh viễn lên Cloud + Realtime)
  reqForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senderName = (reqName.value.trim() || viewer.display()).slice(0, 30);
    const messageText = reqMsg.value.trim().slice(0, 300);
    if (!messageText) return;

    viewer.name = senderName;
    app.refreshNames();

    btnSendReq.disabled = true;
    btnSendReq.textContent = `Đang gửi tới ${AUTHOR_NAME}…`;

    const opened = viewer.openedList();
    const wonBanhMi = viewer.hasBanhMi();
    const openedGiftsText = opened.map((g) => `Hộp ${g.box}: ${g.icon} ${g.title}`);

    const item = {
      id: "req-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      name: senderName,
      msg: messageText,
      wonBanhMi,
      banhMiStatus: wonBanhMi
        ? "ĐÃ MỞ TRÚNG BÁNH MÌ (10-20K)"
        : "KHÔNG TRÚNG BÁNH MÌ",
      openedGifts: openedGiftsText,
      fortune: viewer.fortune || "",
      ts: Date.now(),
    };

    messagesMap.set(item.id, item);
    renderInbox();

    // 1. Lưu vĩnh viễn lên Đám mây (Persistent Cloud Database)
    try {
      const getRes = await fetch(PERMANENT_URL);
      let curList = [];
      if (getRes.ok) {
        const curObj = await getRes.json();
        curList = curObj?.data?.messages || [];
      }
      curList.unshift(item);
      await fetch(PERMANENT_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "HungDinh 2010 Permanent Inbox",
          data: { messages: curList.slice(0, 100) },
        }),
      });
    } catch { /* đã lưu local */ }

    // 2. Bắn tin tức thời qua realtime
    try {
      await fetch(REALTIME_URL, {
        method: "POST",
        body: JSON.stringify(item),
      });
    } catch {}

    btnSendReq.disabled = false;
    btnSendReq.textContent = `🚀 Gửi cho ${AUTHOR_NAME}`;
    reqForm.classList.add("hidden");
    reqSentDetail.textContent = `${AUTHOR_NAME} đã nhận được lời nhắn từ "${senderName}": “${messageText}” 💗`;
    reqSent.classList.remove("hidden");
    fx.hearts(55);
    toast(`💌 Đã gửi tới ${AUTHOR_NAME}!`);
  });

  btnReqAgain.addEventListener("click", () => {
    reqMsg.value = "";
    reqSent.classList.add("hidden");
    reqForm.classList.remove("hidden");
    reqMsg.focus();
  });

  // Mở / đóng hộp thư bí mật của HungDinh
  let es = null;
  function openInbox() {
    enableAdminMode();
    inboxModal.classList.remove("hidden");
    renderInbox();
    fetchPermanentInbox();
    if (!es) {
      try {
        es = new EventSource(`${REALTIME_URL}/sse`);
        es.addEventListener("message", (ev) => {
          try {
            const env = JSON.parse(ev.data);
            if (env.message) ingestItem(JSON.parse(env.message), true);
          } catch {}
        });
      } catch { /* ignore */ }
    }
  }
  function closeInbox() {
    inboxModal.classList.add("hidden");
    if (es) {
      es.close();
      es = null;
    }
  }

  btnInbox.addEventListener("click", openInbox);
  $("#btn-inbox-close").addEventListener("click", closeInbox);
  $("#btn-inbox-refresh").addEventListener("click", () => {
    toast("🔄 Đang cập nhật hộp thư…");
    fetchPermanentInbox();
  });
  inboxModal.addEventListener("click", (e) => {
    if (e.target === inboxModal) closeInbox();
  });

  // Phím tắt bí mật cho HungDinh: gõ chữ "hungdinh" trên bàn phím sẽ mở hộp thư
  let adminKeys = "";
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    adminKeys = (adminKeys + e.key.toLowerCase()).slice(-8);
    if (adminKeys === "hungdinh") {
      adminKeys = "";
      openInbox();
    }
  });

  // Nếu HungDinh mở bằng link ?key=hungdinh thì tự động mở Hộp thư
  if (isAdmin) {
    renderInbox();
    setTimeout(openInbox, 400);
  }

  return {
    enter() {
      reqName.value = viewer.name || "";
      renderSpecialWish(false);
      renderGiftSelector();

      fx.petals(0.15);
      let n = 0;
      timer = setInterval(() => {
        fx.launch();
        if (++n % 3 === 0) fx.launch();
      }, 900);
      stopTimer = setTimeout(() => {
        clearInterval(timer);
        timer = setInterval(() => fx.launch(), 3000);
      }, 12000);
    },
    leave() {
      clearInterval(timer);
      clearTimeout(stopTimer);
      fx.petals(0.05);
    },
  };
}
