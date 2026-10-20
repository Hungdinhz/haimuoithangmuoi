// Bộ phát nhạc hộp âm nhạc (Music Box / Celesta) bằng Web Audio API
// Dùng làm nhạc nền êm dịu khi người dùng chưa thêm file assets/music.mp3

class MusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.step = 0;

    // Chuỗi nốt nhạc lãng mạn, nhẹ nhàng (âm điệu G major / Pentatonic)
    // Tần số tương ứng: G3, B3, D4, E4, G4, A4, B4, D5, E5
    this.melody = [
      { note: 392.00, dur: 0.5 },  // G4
      { note: 440.00, dur: 0.5 },  // A4
      { note: 493.88, dur: 1.0 },  // B4
      { note: 587.33, dur: 1.0 },  // D5
      { note: 493.88, dur: 0.5 },  // B4
      { note: 440.00, dur: 0.5 },  // A4
      { note: 392.00, dur: 1.5 },  // G4
      { note: 329.63, dur: 0.5 },  // E4

      { note: 293.66, dur: 0.5 },  // D4
      { note: 329.63, dur: 0.5 },  // E4
      { note: 392.00, dur: 1.0 },  // G4
      { note: 440.00, dur: 1.0 },  // A4
      { note: 392.00, dur: 0.5 },  // G4
      { note: 329.63, dur: 0.5 },  // E4
      { note: 293.66, dur: 1.5 },  // D4
      { note: 246.94, dur: 0.5 },  // B3

      { note: 261.63, dur: 0.5 },  // C4
      { note: 329.63, dur: 0.5 },  // E4
      { note: 392.00, dur: 1.0 },  // G4
      { note: 523.25, dur: 1.0 },  // C5
      { note: 493.88, dur: 0.5 },  // B4
      { note: 392.00, dur: 0.5 },  // G4
      { note: 440.00, dur: 2.0 },  // A4

      { note: 587.33, dur: 0.5 },  // D5
      { note: 493.88, dur: 0.5 },  // B4
      { note: 440.00, dur: 0.5 },  // A4
      { note: 392.00, dur: 0.5 },  // G4
      { note: 329.63, dur: 1.0 },  // E4
      { note: 293.66, dur: 1.0 },  // D4
      { note: 392.00, dur: 2.5 },  // G4
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playNote(freq, dur) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Tạo âm thanh chuông hộp nhạc bằng sự kết hợp của sóng sine và bồi âm nhẹ
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);

    // Họa âm cao tạo độ trong trẻo như phím đàn kim loại
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2.76, now);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.12, now);
    osc2.connect(gain2);
    gain2.connect(gain);

    osc1.connect(gain);
    gain.connect(this.ctx.destination);

    // Envelope tiếng gõ chuông: bật nhanh, ngân dài tắt dần
    const attack = 0.008;
    const decay = dur * 1.8;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + decay);
    osc2.stop(now + decay);
  }

  tick() {
    if (!this.isPlaying) return;
    const item = this.melody[this.step % this.melody.length];
    this.playNote(item.note, item.dur);
    this.step++;
    const nextInterval = item.dur * 650;
    this.timer = setTimeout(() => this.tick(), nextInterval);
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.tick();
  }

  stop() {
    this.isPlaying = false;
    clearTimeout(this.timer);
    this.timer = null;
  }
}

export const synthMusic = new MusicBox();
