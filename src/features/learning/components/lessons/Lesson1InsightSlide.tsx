import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Lesson1InsightSlideProps {
  onComplete: () => void;
}

export const Lesson1InsightSlide = ({ onComplete }: Lesson1InsightSlideProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showAha, setShowAha] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const insights = [
    { text: "Saving protects money.", color: "#3b82f6", delay: 2 },
    { text: "Investing allows money to grow.", color: "#10b981", delay: 4 },
    { text: "Time and compounding multiply results.", color: "#f59e0b", delay: 6 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let progress = 0;
    const duration = 8000; // 8 seconds for full animation
    const startTime = Date.now();

    const drawChart = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, width / 2, height / 2);

      const chartWidth = width / 2 - 80;
      const chartHeight = height / 2 - 100;
      const startX = 50;
      const startY = height / 2 - 50;

      // Draw axes
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, startY - chartHeight);
      ctx.lineTo(startX, startY);
      ctx.lineTo(startX + chartWidth, startY);
      ctx.stroke();

      // Saving line (linear, slow growth)
      const savingPoints: [number, number][] = [];
      const investingPoints: [number, number][] = [];

      const numPoints = Math.floor(progress * 100);
      
      for (let i = 0; i <= numPoints; i++) {
        const x = startX + (i / 100) * chartWidth;
        
        // Saving: linear growth (2% per year over 30 years)
        const savingY = startY - (chartHeight * 0.15) - (i / 100) * (chartHeight * 0.2);
        savingPoints.push([x, savingY]);

        // Investing: exponential growth (7% compounded)
        const years = (i / 100) * 30;
        const investingGrowth = Math.pow(1.07, years);
        const investingY = startY - (chartHeight * 0.15) - (investingGrowth - 1) / 6 * (chartHeight * 0.7);
        investingPoints.push([x, Math.max(investingY, startY - chartHeight + 20)]);
      }

      // Draw saving line
      if (savingPoints.length > 1) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(savingPoints[0][0], savingPoints[0][1]);
        for (let i = 1; i < savingPoints.length; i++) {
          ctx.lineTo(savingPoints[i][0], savingPoints[i][1]);
        }
        ctx.stroke();
      }

      // Draw investing line with glow
      if (investingPoints.length > 1) {
        // Glow effect
        ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(investingPoints[0][0], investingPoints[0][1]);
        for (let i = 1; i < investingPoints.length; i++) {
          ctx.lineTo(investingPoints[i][0], investingPoints[i][1]);
        }
        ctx.stroke();

        // Main line
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(investingPoints[0][0], investingPoints[0][1]);
        for (let i = 1; i < investingPoints.length; i++) {
          ctx.lineTo(investingPoints[i][0], investingPoints[i][1]);
        }
        ctx.stroke();

        // Highlight the inflection point (around 40% through)
        if (progress > 0.4) {
          const inflectionIndex = Math.floor(40);
          if (inflectionIndex < investingPoints.length) {
            const [ix, iy] = investingPoints[inflectionIndex];
            
            // Pulsing circle at inflection point
            const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.2;
            ctx.beginPath();
            ctx.arc(ix, iy, 8 * pulseScale, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(16, 185, 129, 0.5)";
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(ix, iy, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#10b981";
            ctx.fill();
          }
        }
      }

      // Update animation phase based on progress
      if (progress >= 0.25 && animationPhase < 1) setAnimationPhase(1);
      if (progress >= 0.5 && animationPhase < 2) setAnimationPhase(2);
      if (progress >= 0.75 && animationPhase < 3) setAnimationPhase(3);
      if (progress >= 1 && !showAha) {
        setTimeout(() => setShowAha(true), 500);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(drawChart);
      }
    };

    drawChart();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationPhase, showAha]);

  return (
    <div className="relative min-h-[700px] bg-slate-950 rounded-2xl overflow-hidden">
      {/* Animated chart */}
      <div className="absolute inset-0 p-8">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ maxHeight: "400px" }}
        />
      </div>

      {/* Overlaid insights */}
      <div className="absolute inset-x-0 bottom-0 p-8 space-y-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-32">
        <AnimatePresence>
          {insights.map((insight, index) => (
            animationPhase > index && (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: insight.color }}
                />
                <p className="text-xl md:text-2xl text-slate-200 font-medium">
                  {insight.text}
                </p>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Aha moment */}
        <AnimatePresence>
          {showAha && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-8 p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl"
            >
              <p className="text-2xl md:text-3xl text-center text-emerald-200 font-semibold leading-relaxed">
                This is where money starts working harder than you do.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-advance after animation completes */}
        <AnimatePresence>
          {showAha && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex justify-center pt-6"
            >
              <button
                onClick={onComplete}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                Complete Lesson
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
