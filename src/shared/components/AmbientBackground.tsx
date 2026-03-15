import { useEffect, useRef } from "react";

/**
 * Subtle animated ambient background with rising micro-star particles.
 * Matches the Auth page particle style for visual consistency.
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

    type P = { x: number; y: number; vx: number; vy: number; o: number; r: number };
    let particles: P[] = [];

    const makeParticle = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -(Math.random() * 0.15 + 0.02),
      o: Math.random() * 0.5 + 0.15,
      r: Math.random() * 0.8 + 0.4,
    });

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // Re-init particles on resize
      const count = Math.floor((w * h) / 5000);
      particles = Array.from({ length: count }, makeParticle);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = h + Math.random() * 40;
          p.x = Math.random() * w;
          p.o = Math.random() * 0.5 + 0.15;
          p.r = Math.random() * 0.8 + 0.4;
        }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;

        ctx.fillStyle = `hsla(0, 0%, 80%, ${p.o})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
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
