/**
 * Duolingo / Brilliant-inspired sound effects using Web Audio API.
 * Rich, layered, gamified audio feedback — zero external dependencies.
 */

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};

// ── Preference ──────────────────────────────────────────
const STORAGE_KEY = "euphoria-sfx-enabled";

export const isSoundEnabled = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
};

export const setSoundEnabled = (v: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(v));
  } catch {}
};

// ── Core Helpers ────────────────────────────────────────

const createOsc = (
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  startTime: number,
  endTime: number,
  gainNode: GainNode,
) => {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gainNode);
  osc.start(startTime);
  osc.stop(endTime);
  return osc;
};

const createGain = (ctx: AudioContext, volume: number, destination?: AudioNode) => {
  const gain = ctx.createGain();
  gain.gain.value = volume;
  gain.connect(destination || ctx.destination);
  return gain;
};

// Noise burst for percussive texture
const playNoiseBurst = (ctx: AudioContext, startTime: number, duration: number, volume: number) => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 4000;
  bandpass.Q.value = 2;

  const gain = createGain(ctx, 0);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  noise.connect(bandpass).connect(gain);
  noise.start(startTime);
  noise.stop(startTime + duration);
};

// ── SOUND EFFECTS ───────────────────────────────────────

/** Duolingo-style satisfying tap/pop — short sine pop + filtered noise */
export const playClick = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Main pop — sine that pitches down
  const gain = createGain(ctx, 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1400, t);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.04);
  osc.connect(gain);
  osc.start(t);
  osc.stop(t + 0.06);

  // Subtle click noise
  playNoiseBurst(ctx, t, 0.025, 0.04);
};

/** ✅ Correct answer — Duolingo rising major third chime with shimmer */
export const playCorrect = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Two-note rising chime: C5 → E5 (major third = satisfaction)
  const notes = [
    { freq: 523.25, time: 0, dur: 0.18 },    // C5
    { freq: 659.25, time: 0.08, dur: 0.25 },  // E5
  ];

  notes.forEach(({ freq, time, dur }) => {
    const gain = createGain(ctx, 0.18);
    gain.gain.setValueAtTime(0.18, t + time);
    gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
    createOsc(ctx, "sine", freq, t + time, t + time + dur, gain);

    // Harmonic shimmer (octave above, quieter)
    const shimmer = createGain(ctx, 0.04);
    shimmer.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
    createOsc(ctx, "sine", freq * 2, t + time + 0.01, t + time + dur, shimmer);
  });

  // Subtle sparkle noise
  playNoiseBurst(ctx, t + 0.06, 0.05, 0.03);
};

/** ❌ Wrong answer — Duolingo gentle two-tone descending buzz */
export const playIncorrect = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Soft descending minor second
  const notes = [
    { freq: 370, time: 0, dur: 0.15 },
    { freq: 330, time: 0.1, dur: 0.2 },
  ];

  notes.forEach(({ freq, time, dur }) => {
    const gain = createGain(ctx, 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
    createOsc(ctx, "triangle", freq, t + time, t + time + dur, gain);
  });

  // Low rumble
  const rumble = createGain(ctx, 0.06);
  rumble.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  createOsc(ctx, "sine", 110, t, t + 0.25, rumble);
};

/** 🪙 XP/Coin reward — Brilliant-style ascending sparkle arpeggio */
export const playReward = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Fast pentatonic sparkle: D5 → E5 → G5 → A5 → D6
  const notes = [
    { freq: 587.33, delay: 0 },
    { freq: 659.25, delay: 0.05 },
    { freq: 783.99, delay: 0.1 },
    { freq: 880, delay: 0.15 },
    { freq: 1174.66, delay: 0.22 },
  ];

  notes.forEach(({ freq, delay }) => {
    const dur = 0.15;
    const gain = createGain(ctx, 0.12);
    gain.gain.setValueAtTime(0.12, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
    createOsc(ctx, "sine", freq, t + delay, t + delay + dur, gain);

    // Bell-like overtone
    const bell = createGain(ctx, 0.03);
    bell.gain.exponentialRampToValueAtTime(0.001, t + delay + dur * 0.8);
    createOsc(ctx, "sine", freq * 3, t + delay, t + delay + dur * 0.8, bell);
  });

  playNoiseBurst(ctx, t + 0.08, 0.06, 0.025);
};

/** 🎉 Level up — Duolingo triumphant fanfare with harmony + bass */
export const playLevelUp = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Triumphant melody: C5 → E5 → G5 → C6 (major chord arpeggio)
  const melody = [
    { freq: 523.25, delay: 0, dur: 0.2 },
    { freq: 659.25, delay: 0.12, dur: 0.2 },
    { freq: 783.99, delay: 0.24, dur: 0.2 },
    { freq: 1046.5, delay: 0.38, dur: 0.35 },
  ];

  melody.forEach(({ freq, delay, dur }) => {
    const gain = createGain(ctx, 0.16);
    gain.gain.setValueAtTime(0.16, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
    createOsc(ctx, "sine", freq, t + delay, t + delay + dur, gain);
  });

  // Harmony pad (third below, soft)
  const harmony = [
    { freq: 392, delay: 0.15, dur: 0.4 },
    { freq: 523.25, delay: 0.3, dur: 0.35 },
  ];
  harmony.forEach(({ freq, delay, dur }) => {
    const gain = createGain(ctx, 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
    createOsc(ctx, "triangle", freq, t + delay, t + delay + dur, gain);
  });

  // Bass foundation
  const bass = createGain(ctx, 0.08);
  bass.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  createOsc(ctx, "sine", 130.81, t, t + 0.6, bass);

  // Sparkle burst
  playNoiseBurst(ctx, t + 0.35, 0.08, 0.04);
};

/** 🎓 Lesson complete — Duolingo celebration: full melody + shimmer cascade */
export const playLessonComplete = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Celebratory ascending melody
  const melody = [
    { freq: 523.25, delay: 0, dur: 0.12 },     // C5
    { freq: 659.25, delay: 0.08, dur: 0.12 },   // E5
    { freq: 783.99, delay: 0.16, dur: 0.12 },   // G5
    { freq: 1046.5, delay: 0.26, dur: 0.15 },   // C6
    { freq: 1318.51, delay: 0.38, dur: 0.4 },   // E6 (sustained)
  ];

  melody.forEach(({ freq, delay, dur }) => {
    const gain = createGain(ctx, 0.15);
    gain.gain.setValueAtTime(0.15, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
    createOsc(ctx, "sine", freq, t + delay, t + delay + dur, gain);

    // Octave shimmer on higher notes
    if (freq > 700) {
      const shim = createGain(ctx, 0.035);
      shim.gain.exponentialRampToValueAtTime(0.001, t + delay + dur * 0.7);
      createOsc(ctx, "sine", freq * 2, t + delay + 0.02, t + delay + dur * 0.7, shim);
    }
  });

  // Warm pad underneath
  const pad = createGain(ctx, 0.05);
  pad.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
  createOsc(ctx, "triangle", 261.63, t + 0.1, t + 0.7, pad);

  // Bass drop
  const bass = createGain(ctx, 0.07);
  bass.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
  createOsc(ctx, "sine", 130.81, t + 0.25, t + 0.5, bass);

  // Sparkle cascade
  playNoiseBurst(ctx, t + 0.15, 0.06, 0.03);
  playNoiseBurst(ctx, t + 0.35, 0.08, 0.04);
};

/** 🏆 Game win — rich victory fanfare */
export const playGameWin = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Fanfare
  const notes = [
    { freq: 392, delay: 0, dur: 0.15 },       // G4
    { freq: 523.25, delay: 0.1, dur: 0.15 },  // C5
    { freq: 659.25, delay: 0.2, dur: 0.15 },  // E5
    { freq: 783.99, delay: 0.3, dur: 0.2 },   // G5
    { freq: 1046.5, delay: 0.42, dur: 0.35 }, // C6 hold
  ];

  notes.forEach(({ freq, delay, dur }) => {
    const gain = createGain(ctx, 0.14);
    gain.gain.setValueAtTime(0.14, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
    createOsc(ctx, "sine", freq, t + delay, t + delay + dur, gain);
  });

  // Harmony layer
  [392, 523.25, 659.25].forEach((freq, i) => {
    const gain = createGain(ctx, 0.04);
    const delay = 0.15 + i * 0.12;
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.3);
    createOsc(ctx, "triangle", freq, t + delay, t + delay + 0.3, gain);
  });

  // Bass
  const bass = createGain(ctx, 0.06);
  bass.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
  createOsc(ctx, "sine", 130.81, t + 0.2, t + 0.7, bass);

  playNoiseBurst(ctx, t + 0.4, 0.1, 0.04);
};

/** 🔥 Streak milestone — warm ascending ping trio */
export const playStreak = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  const notes = [
    { freq: 698.46, delay: 0 },    // F5
    { freq: 880, delay: 0.08 },    // A5
    { freq: 1174.66, delay: 0.16 }, // D6
  ];

  notes.forEach(({ freq, delay }) => {
    const dur = 0.18;
    const gain = createGain(ctx, 0.13);
    gain.gain.setValueAtTime(0.13, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
    createOsc(ctx, "sine", freq, t + delay, t + delay + dur, gain);
  });

  playNoiseBurst(ctx, t + 0.1, 0.04, 0.02);
};

/** 📱 Navigation — Brilliant-style subtle glass tap */
export const playNav = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  const gain = createGain(ctx, 0.06);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1800, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.03);
  osc.connect(gain);
  osc.start(t);
  osc.stop(t + 0.05);

  playNoiseBurst(ctx, t, 0.015, 0.02);
};

/** ⚠️ Error — soft warning double pulse */
export const playError = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  [0, 0.12].forEach((delay) => {
    const gain = createGain(ctx, 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.1);
    createOsc(ctx, "square", 220, t + delay, t + delay + 0.1, gain);
  });
};

/** 💰 Trade executed — cash register ding with resonance */
export const playTradeExecuted = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Bright ding
  const notes = [
    { freq: 1318.51, delay: 0 },   // E6
    { freq: 1567.98, delay: 0.05 }, // G6
  ];
  notes.forEach(({ freq, delay }) => {
    const gain = createGain(ctx, 0.13);
    gain.gain.setValueAtTime(0.13, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.2);
    createOsc(ctx, "sine", freq, t + delay, t + delay + 0.2, gain);
  });

  // Bell resonance
  const bell = createGain(ctx, 0.03);
  bell.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  createOsc(ctx, "sine", 2637, t + 0.04, t + 0.35, bell);

  playNoiseBurst(ctx, t + 0.03, 0.03, 0.025);
};

/** 📖 Slide transition — page-turn whoosh */
export const playSlideForward = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Gentle whoosh via filtered noise
  const bufferSize = ctx.sampleRate * 0.12;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2000, t);
  filter.frequency.exponentialRampToValueAtTime(6000, t + 0.06);
  filter.frequency.exponentialRampToValueAtTime(1000, t + 0.12);
  filter.Q.value = 1;

  const gain = createGain(ctx, 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

  noise.connect(filter).connect(gain);
  noise.start(t);
  noise.stop(t + 0.12);

  // Subtle tone accent
  const tone = createGain(ctx, 0.03);
  tone.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  createOsc(ctx, "sine", 800, t, t + 0.06, tone);
};

/** 📖 Slide back — reverse page turn */
export const playSlideBack = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(5000, t);
  filter.frequency.exponentialRampToValueAtTime(1500, t + 0.1);
  filter.Q.value = 1;

  const gain = createGain(ctx, 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

  noise.connect(filter).connect(gain);
  noise.start(t);
  noise.stop(t + 0.1);
};

/** ⭐ Milestone / halfway — warm chime ping */
export const playMilestone = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Warm major chord strum
  const notes = [
    { freq: 523.25, delay: 0 },    // C5
    { freq: 659.25, delay: 0.04 }, // E5
    { freq: 783.99, delay: 0.08 }, // G5
  ];

  notes.forEach(({ freq, delay }) => {
    const dur = 0.25;
    const gain = createGain(ctx, 0.11);
    gain.gain.setValueAtTime(0.11, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
    createOsc(ctx, "sine", freq, t + delay, t + delay + dur, gain);

    // Soft overtone
    const shim = createGain(ctx, 0.025);
    shim.gain.exponentialRampToValueAtTime(0.001, t + delay + dur * 0.6);
    createOsc(ctx, "sine", freq * 2, t + delay + 0.01, t + delay + dur * 0.6, shim);
  });
};

/** 🎯 Drag snap — item snapping into place */
export const playSnap = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  const gain = createGain(ctx, 0.12);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.03);
  osc.connect(gain);
  osc.start(t);
  osc.stop(t + 0.04);

  playNoiseBurst(ctx, t, 0.02, 0.06);
};

/** 🔓 Unlock — new content available */
export const playUnlock = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Rising "unlock" sweep
  const gain = createGain(ctx, 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
  osc.connect(gain);
  osc.start(t);
  osc.stop(t + 0.3);

  // Sparkle at peak
  setTimeout(() => {
    const ctx2 = getCtx();
    const t2 = ctx2.currentTime;
    const g = createGain(ctx2, 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, t2 + 0.15);
    createOsc(ctx2, "sine", 1567.98, t2, t2 + 0.15, g);
    playNoiseBurst(ctx2, t2, 0.04, 0.03);
  }, 120);
};
