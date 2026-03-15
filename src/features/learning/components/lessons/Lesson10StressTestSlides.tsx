import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, TrendingDown, AlertTriangle, CheckCircle2, XCircle, Sparkles, Zap } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { SliderSimulator } from "../interactive/SliderSimulator";
import { DragSortChallenge } from "../interactive/DragSortChallenge";

// Slide 1: What is a Stress Test?
const WhatIsStressTest = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      A <span className="text-primary font-bold">stress test</span> asks: "What happens to my portfolio 
      in the worst-case scenario?" It's like a fire drill for your investments.
    </p>

    <div className="space-y-4 mt-6">
      {[
        { emoji: "📉", event: "2008 Financial Crisis", stocks: "-50%", bonds: "+5%", lesson: "Diversified portfolios recovered faster" },
        { emoji: "🦠", event: "2020 COVID Crash", stocks: "-34%", bonds: "+7%", lesson: "Markets recovered in 5 months" },
        { emoji: "💻", event: "2000 Dot-Com Bust", stocks: "-78%", bonds: "+12%", lesson: "Tech-heavy portfolios were devastated" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="p-4 rounded-xl bg-muted/40 border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0" />
            <h3 className="font-bold text-foreground">{item.event}</h3>
          </div>
          <div className="flex gap-4 text-sm mb-2">
            <span className="text-destructive font-medium">Stocks: {item.stocks}</span>
            <span className="text-primary font-medium">Bonds: {item.bonds}</span>
          </div>
          <p className="text-xs text-muted-foreground">💡 {item.lesson}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

// Slide 2: Your Portfolio Under Stress
const StressSimulator = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      See how your portfolio would fare in a crash based on your stock/bond mix:
    </p>

    <SliderSimulator
      title="🔥 Crash Simulator"
      description="Set your allocation and see what happens in a 2008-style crash:"
      sliders={[
        { id: "stocks", label: "Stocks %", min: 0, max: 100, step: 10, defaultValue: 60, unit: "%" },
        { id: "amount", label: "Portfolio Value", min: 5000, max: 100000, step: 5000, defaultValue: 50000, unit: "$" },
      ]}
      calculateResult={(vals) => {
        const bonds = 100 - vals.stocks;
        const crashImpact = (vals.stocks / 100) * -0.50 + (bonds / 100) * 0.05;
        const afterCrash = vals.amount * (1 + crashImpact);
        const loss = vals.amount - afterCrash;
        return {
          primary: `$${Math.round(afterCrash).toLocaleString()}`,
          secondary: `You'd lose $${Math.round(loss).toLocaleString()} (${(crashImpact * 100).toFixed(0)}%)`,
          insight:
            vals.stocks >= 80
              ? "Ouch! High stock allocation = big crash losses. Could you handle this emotionally?"
              : vals.stocks <= 30
              ? "Very protected! But remember — you'll also miss big gains during bull markets."
              : "Moderate impact. A balanced approach helps you survive and recover.",
        };
      }}
    />
  </div>
);

// Slide 3: What To Do in a Crash
const WhatToDoInCrash = () => {
  const [revealed, setRevealed] = useState<number[]>([]);

  const rules = [
    { emoji: "🧘", rule: "Don't Panic Sell", detail: "Selling during a crash locks in your losses. Markets have always recovered." },
    { emoji: "📋", rule: "Stick to Your Plan", detail: "If you had a good plan before the crash, it's still a good plan during the crash." },
    { emoji: "💰", rule: "Consider Buying More", detail: "Crashes create sale prices. Warren Buffett's favorite time to buy!" },
    { emoji: "⏳", rule: "Remember Your Time Horizon", detail: "If you don't need the money for 10+ years, short-term crashes don't matter." },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        When markets crash, follow these rules. Tap each to learn more:
      </p>

      <div className="space-y-3 mt-6">
        {rules.map((item, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => !revealed.includes(i) && setRevealed(prev => [...prev, i])}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              revealed.includes(i) ? "border-primary/40 bg-primary/5" : "border-border bg-background hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0" />
              <span className="font-bold text-foreground">{item.rule}</span>
            </div>
            {revealed.includes(i) && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mt-2 ml-9">
                {item.detail}
              </motion.p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Slide 4: Quiz
const StressQuiz = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { addXP } = useXPSystem();
  const correctIndex = 1;

  const options = [
    "Sell everything immediately to prevent more losses",
    "Hold steady and stick to your long-term plan",
    "Move all money into cryptocurrency",
    "Stop looking at your portfolio forever",
  ];

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === correctIndex) { playCorrect(); fireSmallConfetti(); addXP(10); } else { playIncorrect(); }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-muted/30 border border-border">
        <p className="font-bold text-foreground text-base mb-4">Your portfolio drops 40% in a crash. What's the smartest move?</p>
        <div className="space-y-3">
          {options.map((option, i) => {
            const isCorrect = i === correctIndex;
            const isSelected = i === selected;
            let borderClass = "border-border";
            let bgClass = "bg-background hover:bg-muted/50";
            if (answered && isSelected && isCorrect) { borderClass = "border-primary"; bgClass = "bg-primary/10"; }
            else if (answered && isSelected && !isCorrect) { borderClass = "border-destructive"; bgClass = "bg-destructive/10"; }
            else if (answered && isCorrect) { borderClass = "border-primary/40"; bgClass = "bg-primary/5"; }

            return (
              <motion.button key={i} onClick={() => handleSelect(i)} disabled={answered}
                className={`w-full text-left p-4 rounded-xl border ${borderClass} ${bgClass} transition-all duration-200 flex items-center gap-3`}>
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                <span className="text-sm font-medium text-foreground flex-1">{option}</span>
                {answered && isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>
      {answered && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${selected === correctIndex ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"}`}>
          <p className="text-sm text-muted-foreground">
            {selected === correctIndex
              ? "🎯 Correct! +10 XP — Staying the course during crashes has historically been the winning strategy."
              : "❌ Panic selling locks in losses. Every major crash in history has been followed by recovery."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Slide 5: Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <Activity className="w-5 h-5" />, text: "Stress-test your portfolio before a crash — not during one" },
    { icon: <Shield className="w-5 h-5" />, text: "Bonds act as a cushion during stock market crashes" },
    { icon: <AlertTriangle className="w-5 h-5" />, text: "Never panic sell — markets have always recovered from every crash" },
    { icon: <Sparkles className="w-5 h-5" />, text: "The best time to prepare for a storm is when the sun is shining" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">You're now crash-proof (mentally at least!):</p>
      <div className="space-y-3 mt-6">
        {takeaways.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{item.icon}</div>
            <p className="text-foreground font-medium leading-relaxed pt-1.5">{item.text}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center mt-6">
        <p className="text-xl font-bold text-foreground mb-1">Crash-tested! 🛡️</p>
        <p className="text-sm text-muted-foreground">You've completed the first 10 lessons. Amazing progress!</p>
      </motion.div>
    </div>
  );
};

interface Lesson10Props {
  onComplete?: () => void;
}

export const Lesson10StressTestSlides = ({ onComplete }: Lesson10Props) => {
  const slides: LessonSlide[] = [
    { id: "what-is-stress-test", title: "What is a Stress Test?", content: <WhatIsStressTest /> },
    { id: "simulator", title: "Crash Simulator 🔥", content: <StressSimulator /> },
    { id: "what-to-do", title: "What To Do in a Crash", content: <WhatToDoInCrash /> },
    { id: "quiz", title: "Quick Check ✍️", content: <StressQuiz /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};
