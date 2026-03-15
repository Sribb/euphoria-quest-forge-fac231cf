import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/euphoria-logo-button.png";

const LAUNCH_LINES = [
  "INIT_SEQUENCE: 0x7C3AED",
  "LOADING MARKET_ENGINE v4.2.1",
  "CONNECTING TO SIMULATION_SERVER...",
  "AUTH_MODULE: READY",
  "PORTFOLIO_TRACKER: ONLINE",
  "AI_COACH: STANDBY",
  "LESSON_DB: 25 MODULES LOADED",
  "XP_SYSTEM: CALIBRATED",
  "STREAK_ENGINE: ACTIVE",
  "RISK_ANALYZER: NOMINAL",
  "MARKET_FEED: SUBSCRIBING...",
  "VOLATILITY_INDEX: 0.42",
  "SESSION_SEED: GENERATING...",
  "LEADERBOARD_SYNC: OK",
  "ACHIEVEMENT_CACHE: WARM",
  "HEART_SYSTEM: 5/5 REMAINING",
  "TRADE_EXECUTOR: READY",
  "NEWS_FEED: FETCHING...",
  "COIN_BALANCE: LOADED",
  "RENDERING PIPELINE: GPU_ACCEL",
  "EUPHORIA_CORE: ALL SYSTEMS GO",
  "AWAITING USER INPUT...",
  "BUILD: PROD-2026.03.15-STABLE",
  "ENV: SIMULATION_SANDBOX",
  "LATENCY: 12ms",
  "UPTIME: 99.97%",
  "NODES: 4/4 HEALTHY",
  "CACHE_HIT_RATE: 94.2%",
  "MEMORY: 847MB / 2048MB",
  "THREADS: 12 ACTIVE",
];

const LaunchCodeBackground = () => {
  const lines = useMemo(() => {
    const result: { text: string; top: number; left: number; delay: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      result.push({
        text: LAUNCH_LINES[i % LAUNCH_LINES.length],
        top: (i * 2.5) % 100,
        left: Math.sin(i * 0.7) * 30 + 50,
        delay: i * 0.15,
        opacity: 0.04 + (Math.sin(i * 0.5) * 0.02),
      });
    }
    return result;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {lines.map((line, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap font-mono text-[10px] text-white animate-fade-in"
          style={{
            top: `${line.top}%`,
            left: `${line.left}%`,
            transform: "translateX(-50%)",
            opacity: line.opacity,
            animationDelay: `${line.delay}s`,
            animationDuration: "2s",
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};

const SpiralDemo = () => {
  const [startVisible, setStartVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setStartVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#09090D]">
      {/* Launch code text background */}
      <LaunchCodeBackground />

      {/* Spiral Animation */}
      <div className="absolute inset-0 z-[2]">
        <SpiralAnimation />
      </div>

      {/* Euphoria Logo Button */}
      <div
        className="absolute inset-0 z-[3] flex items-center justify-center"
        style={{
          opacity: startVisible ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="group relative flex flex-col items-center gap-4 cursor-pointer"
        >
          {/* Pulsing glow ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-primary/10 animate-pulse" />
          </div>

          {/* Logo */}
          <img
            src={logo}
            alt="Euphoria"
            className="w-20 h-20 relative z-10 drop-shadow-[0_0_24px_rgba(124,58,237,0.5)] transition-transform duration-500 group-hover:scale-110"
          />

          {/* Label */}
          <span className="relative z-10 text-sm font-medium text-white/60 tracking-[0.2em] uppercase group-hover:text-white/90 transition-colors duration-300">
            Launch
          </span>
        </button>
      </div>
    </div>
  );
};

export { SpiralDemo };
