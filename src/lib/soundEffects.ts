/**
 * Lightweight synthesized sound effects using Web Audio API.
 * No external dependencies or API calls — instant, zero-latency feedback.
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

// ── Helpers ─────────────────────────────────────────────
const playTone = (
  freq: number,
  type: OscillatorType,
  duration: number,
  volume = 0.15,
  rampDown = true,
) => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  if (rampDown) gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

const playSequence = (
  notes: { freq: number; delay: number }[],
  type: OscillatorType = "sine",
  noteDuration = 0.12,
  volume = 0.12,
) => {
  if (!isSoundEnabled()) return;
  const ctx = getCtx();
  notes.forEach(({ freq, delay }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + noteDuration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + noteDuration);
  });
};

// ── Sound Effects ───────────────────────────────────────

/** Satisfying pop for button taps & interactive element clicks */
export const playClick = () => playTone(880, "sine", 0.08, 0.08);

/** Positive chime — correct answer, task completed */
export const playCorrect = () =>
  playSequence([
    { freq: 523.25, delay: 0 },     // C5
    { freq: 659.25, delay: 0.08 },  // E5
    { freq: 783.99, delay: 0.16 },  // G5
  ], "sine", 0.15, 0.12);

/** Wrong answer — gentle descending buzz */
export const playIncorrect = () =>
  playSequence([
    { freq: 440, delay: 0 },
    { freq: 349.23, delay: 0.1 },
  ], "triangle", 0.18, 0.1);

/** XP / coin reward — sparkling ascending arpeggio */
export const playReward = () =>
  playSequence([
    { freq: 587.33, delay: 0 },     // D5
    { freq: 739.99, delay: 0.07 },  // F#5
    { freq: 880, delay: 0.14 },     // A5
    { freq: 1174.66, delay: 0.21 }, // D6
  ], "sine", 0.14, 0.1);

/** Level up — triumphant fanfare */
export const playLevelUp = () => {
  playSequence([
    { freq: 523.25, delay: 0 },     // C5
    { freq: 659.25, delay: 0.1 },   // E5
    { freq: 783.99, delay: 0.2 },   // G5
    { freq: 1046.5, delay: 0.3 },   // C6
  ], "sine", 0.2, 0.13);
  // Harmony layer
  playSequence([
    { freq: 392, delay: 0.15 },     // G4
    { freq: 523.25, delay: 0.25 },  // C5
    { freq: 659.25, delay: 0.35 },  // E5
  ], "triangle", 0.25, 0.06);
};

/** Lesson complete — celebratory melody */
export const playLessonComplete = () =>
  playSequence([
    { freq: 659.25, delay: 0 },     // E5
    { freq: 783.99, delay: 0.1 },   // G5
    { freq: 880, delay: 0.18 },     // A5
    { freq: 1046.5, delay: 0.28 },  // C6
    { freq: 1174.66, delay: 0.4 },  // D6
  ], "sine", 0.18, 0.11);

/** Game win / high score */
export const playGameWin = () => {
  playSequence([
    { freq: 523.25, delay: 0 },
    { freq: 659.25, delay: 0.08 },
    { freq: 783.99, delay: 0.16 },
    { freq: 1046.5, delay: 0.24 },
    { freq: 1318.51, delay: 0.34 },
  ], "sine", 0.16, 0.12);
  playSequence([
    { freq: 261.63, delay: 0.1 },
    { freq: 329.63, delay: 0.2 },
    { freq: 392, delay: 0.3 },
  ], "triangle", 0.3, 0.05);
};

/** Streak milestone — warm ping */
export const playStreak = () =>
  playSequence([
    { freq: 698.46, delay: 0 },    // F5
    { freq: 880, delay: 0.1 },     // A5
    { freq: 1046.5, delay: 0.2 },  // C6
  ], "sine", 0.15, 0.1);

/** Navigation / tab switch — subtle tick */
export const playNav = () => playTone(1200, "sine", 0.04, 0.05);

/** Error / warning — soft double buzz */
export const playError = () =>
  playSequence([
    { freq: 200, delay: 0 },
    { freq: 200, delay: 0.12 },
  ], "square", 0.08, 0.06);

/** Trade executed — cash register ding */
export const playTradeExecuted = () =>
  playSequence([
    { freq: 1318.51, delay: 0 },   // E6
    { freq: 1567.98, delay: 0.06 }, // G6
  ], "sine", 0.1, 0.1);
