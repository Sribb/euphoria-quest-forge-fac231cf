import { useEffect, useRef } from "react";

/**
 * Subtle animated ambient background with floating violet orbs and micro-particles.
 * Psychologically warm & inviting — creates depth without distraction.
 */
export const AmbientBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);


    // Micro particles — subtle dots
    const dots = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.4,
      vy: -(Math.random() * 0.15 + 0.03),
      vx: (Math.random() - 0.5) * 0.06,
      alpha: Math.random() * 0.45 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw micro particles
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < -5) {
          d.y = h + 5;
          d.x = Math.random() * w;
        }
        if (d.x < -5) d.x = w + 5;
        if (d.x > w + 5) d.x = -5;

        ctx.fillStyle = `hsla(263, 70%, 70%, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
