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

    // Floating orbs — large soft glows
    const orbs = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 180 + Math.random() * 220,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.12,
      hue: i % 2 === 0 ? 263 : 280, // primary vs accent
      alpha: 0.025 + Math.random() * 0.015,
    }));

    // Micro particles — subtle dots
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      vy: -(Math.random() * 0.2 + 0.05),
      vx: (Math.random() - 0.5) * 0.08,
      alpha: Math.random() * 0.25 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw orbs
      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = w + o.r;
        if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r;
        if (o.y > h + o.r) o.y = -o.r;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `hsla(${o.hue}, 70%, 50%, ${o.alpha})`);
        grad.addColorStop(0.5, `hsla(${o.hue}, 70%, 50%, ${o.alpha * 0.4})`);
        grad.addColorStop(1, `hsla(${o.hue}, 70%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      }

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
