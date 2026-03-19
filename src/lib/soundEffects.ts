/**
 * Premium sound effects inspired by Duolingo & Brilliant.
 * Uses layered synthesis with proper envelopes, reverb, and harmonics.
 */

let audioCtx: AudioContext | null = null;
let reverbBuffer: AudioBuffer | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    createReverb(audioCtx);
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};

// Create a convolution reverb impulse response
const createReverb = async (ctx: AudioContext) => {
  const length = ctx.sampleRate * 0.6;
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  reverbBuffer = buffer;
};

const getReverb = (ctx: AudioContext, wetLevel = 0.15): ConvolverNode | null => {
  if (!reverbBuffer) return null;
  const convolver = ctx.createConvolver();
  convolver.buffer = reverbBuffer;
  const wet = ctx.createGain();
  wet.gain.value = wetLevel;
  convolver.connect(wet).connect(ctx.destination);
  return convolver;
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

// ── Synthesis Helpers ───────────────────────────────────

/** Play a bell-like tone with natural decay and harmonics */
const playBell = (
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number,
  dest?: AudioNode,
) => {
  const target = dest || ctx.destination;

  // Fundamental
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = freq;

  // Slight detune for warmth
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freq * 1.002;

  // 2nd harmonic (octave) for brightness
  const osc3 = ctx.createOscillator();
  osc3.type = "sine";
  osc3.frequency.value = freq * 2;

  // 3rd harmonic (soft) for bell character
  const osc4 = ctx.createOscillator();
  osc4.type = "sine";
  osc4.frequency.value = freq * 3;

  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();
  const gain3 = ctx.createGain();
  const gain4 = ctx.createGain();

  // ADSR-like envelope: quick attack, natural decay
  const attack = 0.008;
  const decayEnd = startTime + duration;

  [gain1, gain2].forEach((g) => {
    g.gain.setValueAtTime(0.001, startTime);
    g.gain.linearRampToValueAtTime(volume, startTime + attack);
    g.gain.exponentialRampToValueAtTime(volume * 0.4, startTime + duration * 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, decayEnd);
  });

  // Overtones decay faster
  gain3.gain.setValueAtTime(0.001, startTime);
  gain3.gain.linearRampToValueAtTime(volume * 0.25, startTime + attack);
  gain3.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.5);

  gain4.gain.setValueAtTime(0.001, startTime);
  gain4.gain.linearRampToValueAtTime(volume * 0.08, startTime + attack);
  gain4.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.3);

  osc1.connect(gain1).connect(target);
  osc2.connect(gain2).connect(target);
  osc3.connect(gain3).connect(target);
  osc4.connect(gain4).connect(target);

  [osc1, osc2, osc3, osc4].forEach((o) => {
    o.start(startTime);
    o.stop(decayEnd + 0.05);
  });
};

/** Soft percussive pop using shaped noise */
const playPop = (ctx: AudioContext, startTime: number, pitch: number, volume: number) => {
  // Pitched body
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(pitch, startTime);
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, startTime + 0.08);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

  osc.connect(gain).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + 0.1);

  // Transient click
  const clickOsc = ctx.createOscillator();
  clickOsc.type = "square";
  clickOsc.frequency.value = pitch * 4;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(volume * 0.3, startTime);
  clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.008);
  clickOsc.connect(clickGain).connect(ctx.destination);
  clickOsc.start(startTime);
  clickOsc.stop(startTime + 0.015);
};

/** Shimmer — high sparkle texture */
const playShimmer = (ctx: AudioContext, startTime: number, duration: number, volume: number) => {
  const bufSize = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;

  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 6000;

  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 10000;
  bp.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  src.connect(hp).connect(bp).connect(gain).connect(ctx.destination);
  src.start(startTime);
  src.stop(startTime + duration);
};

// ── SOUND EFFECTS ───────────────────────────────────────

/** Soft, gentle tap — a quiet rounded "boop" for UI interactions */
export const playClick = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Soft sine boop — warm, low-pitched, gentle
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.exponentialRampToValueAtTime(380, t + 0.06);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.09, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.08);
};

/** ✅ Correct — Duolingo's signature rising major-third chime */
export const playCorrect = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Two bell tones: C5 → E5 (the Duolingo interval)
  playBell(ctx, 523.25, t, 0.35, 0.22);          // C5
  playBell(ctx, 659.25, t + 0.1, 0.4, 0.25);     // E5

  // Sparkle on the second note
  playShimmer(ctx, t + 0.12, 0.08, 0.025);

  // Send to reverb
  const reverb = getReverb(ctx, 0.1);
  if (reverb) {
    playBell(ctx, 659.25, t + 0.1, 0.4, 0.06, reverb);
  }
};

/** ❌ Incorrect — gentle, non-punishing two-tone drop */
export const playIncorrect = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Soft descending minor second with triangle wave
  const notes = [
    { freq: 392, time: 0, dur: 0.18 },    // G4
    { freq: 349.23, time: 0.12, dur: 0.22 }, // F4
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t + time);
    gain.gain.linearRampToValueAtTime(0.12, t + time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t + time);
    osc.stop(t + time + dur + 0.05);
  });
};

/** 🪙 XP / Coin — Brilliant-style ascending sparkle cascade */
export const playReward = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Pentatonic sparkle: fast ascending bells
  const notes = [587.33, 698.46, 880, 1046.5, 1318.51]; // D5 F5 A5 C6 E6
  notes.forEach((freq, i) => {
    const delay = i * 0.055;
    playBell(ctx, freq, t + delay, 0.2, 0.12 + i * 0.01);
  });

  // Shimmer at peak
  playShimmer(ctx, t + 0.2, 0.12, 0.035);

  // Reverb tail
  const reverb = getReverb(ctx, 0.12);
  if (reverb) playBell(ctx, 1318.51, t + 0.22, 0.3, 0.04, reverb);
};

/** 🎉 Level up — triumphant fanfare with bass and shimmer */
export const playLevelUp = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Melody: C5 → E5 → G5 → C6
  const melody = [
    { freq: 523.25, delay: 0, dur: 0.25 },
    { freq: 659.25, delay: 0.14, dur: 0.25 },
    { freq: 783.99, delay: 0.28, dur: 0.25 },
    { freq: 1046.5, delay: 0.44, dur: 0.45 },
  ];

  melody.forEach(({ freq, delay, dur }) => {
    playBell(ctx, freq, t + delay, dur, 0.2);
  });

  // Warm bass foundation
  const bass = ctx.createOscillator();
  bass.type = "sine";
  bass.frequency.value = 130.81; // C3
  const bassGain = ctx.createGain();
  bassGain.gain.setValueAtTime(0.001, t + 0.1);
  bassGain.gain.linearRampToValueAtTime(0.1, t + 0.2);
  bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  bass.connect(bassGain).connect(ctx.destination);
  bass.start(t + 0.1);
  bass.stop(t + 0.85);

  // Triumph shimmer
  playShimmer(ctx, t + 0.4, 0.15, 0.04);

  // Reverb on final note
  const reverb = getReverb(ctx, 0.2);
  if (reverb) playBell(ctx, 1046.5, t + 0.44, 0.5, 0.06, reverb);
};

/** 🎓 Lesson complete — Duolingo celebration melody */
export const playLessonComplete = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Full ascending celebration: C5 E5 G5 C6 E6
  const melody = [
    { freq: 523.25, delay: 0 },
    { freq: 659.25, delay: 0.09 },
    { freq: 783.99, delay: 0.18 },
    { freq: 1046.5, delay: 0.3 },
    { freq: 1318.51, delay: 0.44 },
  ];

  melody.forEach(({ freq, delay }, i) => {
    const dur = i === melody.length - 1 ? 0.6 : 0.22;
    playBell(ctx, freq, t + delay, dur, 0.18 + i * 0.01);
  });

  // Harmony pad: G4 + C5 underneath
  [392, 523.25].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t + 0.15);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + 0.15);
    osc.stop(t + 0.95);
  });

  // Bass
  const bass = ctx.createOscillator();
  bass.type = "sine";
  bass.frequency.value = 130.81;
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0.001, t + 0.25);
  bg.gain.linearRampToValueAtTime(0.08, t + 0.35);
  bg.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
  bass.connect(bg).connect(ctx.destination);
  bass.start(t + 0.25);
  bass.stop(t + 0.95);

  // Celebration shimmer cascade
  playShimmer(ctx, t + 0.18, 0.08, 0.03);
  playShimmer(ctx, t + 0.42, 0.12, 0.04);

  // Reverb
  const reverb = getReverb(ctx, 0.25);
  if (reverb) {
    playBell(ctx, 1318.51, t + 0.44, 0.6, 0.05, reverb);
  }
};

/** 🏆 Game win — victory fanfare */
export const playGameWin = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // G4 C5 E5 G5 C6
  const fanfare = [392, 523.25, 659.25, 783.99, 1046.5];
  fanfare.forEach((freq, i) => {
    const delay = i * 0.1;
    const dur = i === fanfare.length - 1 ? 0.5 : 0.2;
    playBell(ctx, freq, t + delay, dur, 0.17);
  });

  // Sub bass
  const bass = ctx.createOscillator();
  bass.type = "sine";
  bass.frequency.value = 98; // G2
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0.001, t + 0.2);
  bg.gain.linearRampToValueAtTime(0.09, t + 0.3);
  bg.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  bass.connect(bg).connect(ctx.destination);
  bass.start(t + 0.2);
  bass.stop(t + 0.85);

  playShimmer(ctx, t + 0.38, 0.15, 0.04);
};

/** 🔥 Streak — warm ascending ping */
export const playStreak = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // F5 A5 D6 — warm rising
  [698.46, 880, 1174.66].forEach((freq, i) => {
    playBell(ctx, freq, t + i * 0.09, 0.25, 0.15);
  });
  playShimmer(ctx, t + 0.2, 0.06, 0.02);
};

/** 📱 Nav tap — Brilliant-style soft glass tick */
export const playNav = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(2400, t);
  osc.frequency.exponentialRampToValueAtTime(1600, t + 0.025);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.07, t + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05);
};

/** ⚠️ Error — gentle double pulse */
export const playError = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  [0, 0.13].forEach((d) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 250;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t + d);
    gain.gain.linearRampToValueAtTime(0.09, t + d + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + d + 0.1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + d);
    osc.stop(t + d + 0.12);
  });
};

/** 💰 Trade executed — bright register ding */
export const playTradeExecuted = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  playBell(ctx, 1318.51, t, 0.3, 0.18);        // E6
  playBell(ctx, 1567.98, t + 0.06, 0.35, 0.2);  // G6
  playShimmer(ctx, t + 0.05, 0.06, 0.025);

  const reverb = getReverb(ctx, 0.12);
  if (reverb) playBell(ctx, 1567.98, t + 0.06, 0.35, 0.05, reverb);
};

/** 📖 Slide forward — soft page whoosh with tonal accent */
export const playSlideForward = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Tonal accent — quick rising bell
  playBell(ctx, 880, t, 0.1, 0.08);

  // Whoosh texture
  const bufSize = ctx.sampleRate * 0.1;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
  const src = ctx.createBufferSource();
  src.buffer = buf;

  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(2000, t);
  bp.frequency.exponentialRampToValueAtTime(5000, t + 0.05);
  bp.frequency.exponentialRampToValueAtTime(1500, t + 0.1);
  bp.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.04, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

  src.connect(bp).connect(gain).connect(ctx.destination);
  src.start(t);
  src.stop(t + 0.12);
};

/** 📖 Slide back — reverse whoosh */
export const playSlideBack = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  playBell(ctx, 660, t, 0.08, 0.06);

  const bufSize = ctx.sampleRate * 0.08;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
  const src = ctx.createBufferSource();
  src.buffer = buf;

  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(5000, t);
  bp.frequency.exponentialRampToValueAtTime(1500, t + 0.08);
  bp.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.035, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

  src.connect(bp).connect(gain).connect(ctx.destination);
  src.start(t);
  src.stop(t + 0.1);
};

/** ⭐ Milestone / halfway — warm chord strum */
export const playMilestone = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Major chord strum: C5 E5 G5
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    playBell(ctx, freq, t + i * 0.045, 0.35, 0.15);
  });

  playShimmer(ctx, t + 0.12, 0.08, 0.025);

  const reverb = getReverb(ctx, 0.15);
  if (reverb) playBell(ctx, 783.99, t + 0.09, 0.35, 0.04, reverb);
};

/** 🎯 Snap — item snapping into place */
export const playSnap = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;
  playPop(ctx, 1200, t, 0.18);
};

/** 🔓 Unlock — rising sweep with sparkle */
export const playUnlock = () => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const t = ctx.currentTime;

  // Rising sweep
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.18);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.12, t + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.35);

  // Bell at peak
  playBell(ctx, 1318.51, t + 0.15, 0.25, 0.12);
  playShimmer(ctx, t + 0.16, 0.06, 0.03);
};
