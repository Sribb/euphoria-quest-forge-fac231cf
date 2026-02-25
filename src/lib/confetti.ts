import confetti from "canvas-confetti";

/** Big celebration burst — lesson complete, level up */
export const fireConfetti = () => {
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};

/** Quick burst — correct answer, small win */
export const fireSmallConfetti = () => {
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#22c55e", "#3b82f6", "#a855f7"],
    scalar: 0.8,
  });
};

/** Stars burst — special achievement */
export const fireStarConfetti = () => {
  confetti({
    particleCount: 60,
    spread: 100,
    origin: { y: 0.5 },
    shapes: ["star"],
    colors: ["#fbbf24", "#f59e0b", "#eab308"],
    scalar: 1.2,
  });
};
