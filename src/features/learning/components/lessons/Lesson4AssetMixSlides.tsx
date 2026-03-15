import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Building, Coins, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { DragSortChallenge } from "../interactive/DragSortChallenge";
import { RiskReturnExplorer } from "../interactive/RiskReturnExplorer";

// Slide 1: What Are Asset Classes?
const WhatAreAssets = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Just like a balanced meal has different food groups, a good portfolio has different 
      <span className="text-primary font-bold"> asset classes</span> — types of investments that behave differently.
    </p>

    <div className="grid grid-cols-1 gap-4 mt-6">
      {[
        { icon: <TrendingUp className="w-8 h-8 text-primary" />, name: "Stocks", desc: "Pieces of companies. High growth potential, but bumpy ride.", emoji: "📈" },
        { icon: <Shield className="w-8 h-8 text-accent" />, name: "Bonds", desc: "Loans to governments/companies. Steady income, lower risk.", emoji: "📜" },
        { icon: <Building className="w-8 h-8 text-muted-foreground" />, name: "Real Estate", desc: "Property investments. Tangible assets that can generate rent.", emoji: "🏠" },
        { icon: <Coins className="w-8 h-8 text-muted-foreground" />, name: "Cash", desc: "Savings accounts, money markets. Safe but barely grows.", emoji: "💵" },
      ].map((asset, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0" />
          <div>
            <h3 className="font-bold text-foreground">{asset.name}</h3>
            <p className="text-sm text-muted-foreground">{asset.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Slide 2: Why Mix Them?
const WhyMix = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Different assets go up and down at different times. When stocks crash, bonds often hold steady. 
      That's why mixing them <span className="text-primary font-bold">reduces your overall risk</span>.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <motion.div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
        <p className="text-2xl mb-2">🎢</p>
        <h3 className="font-bold text-foreground mb-2">100% Stocks</h3>
        <p className="text-sm text-muted-foreground">
          Maximum growth potential, but your portfolio could drop 40%+ in a crash. 
          Can you handle that emotionally?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
      >
        <p className="text-2xl mb-2">⚖️</p>
        <h3 className="font-bold text-foreground mb-2">60% Stocks / 40% Bonds</h3>
        <p className="text-sm text-muted-foreground">
          Good growth with a cushion. In a crash, you might only drop 20%. 
          Much easier to sleep at night.
        </p>
      </motion.div>
    </div>

    <div className="p-4 rounded-xl bg-muted/50 border border-border mt-4">
      <p className="text-sm text-muted-foreground">
        💡 A common rule of thumb: <span className="text-primary font-semibold">110 minus your age = % in stocks</span>. 
        A 25-year-old might hold 85% stocks, while a 60-year-old holds 50%.
      </p>
    </div>
  </div>
);

// Slide 3: Mix Simulator
const MixSimulator = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Build your ideal asset mix and see the risk-return tradeoff:
    </p>

    <RiskReturnExplorer
      title="⚖️ Asset Mix Builder"
      description="Allocate between bonds, stocks, and crypto. Watch the expected return and volatility update in real time."
    />
  </div>
);

// Slide 4: Drag Sort
const AssetQuiz = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Can you rank these asset classes by their typical long-term return?
    </p>

    <DragSortChallenge
      title="📊 Rank by Historical Returns"
      description="Drag from LOWEST to HIGHEST average annual return:"
      items={[
        { id: "cash", label: "💵 Cash / Savings" },
        { id: "bonds", label: "📜 Bonds" },
        { id: "realestate", label: "🏠 Real Estate" },
        { id: "stocks", label: "📈 Stocks" },
      ]}
      correctOrder={["cash", "bonds", "realestate", "stocks"]}
    />
  </div>
);

// Slide 5: Key Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <TrendingUp className="w-5 h-5" />, text: "Stocks offer the highest long-term returns but the most volatility" },
    { icon: <Shield className="w-5 h-5" />, text: "Bonds provide stability and cushion your portfolio in crashes" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Your ideal mix depends on your age, goals, and comfort with risk" },
    { icon: <Coins className="w-5 h-5" />, text: "Rebalance periodically to maintain your target allocation" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Building the right asset mix is one of the most important decisions you'll make:
      </p>

      <div className="space-y-3 mt-6">
        {takeaways.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              {item.icon}
            </div>
            <p className="text-foreground font-medium leading-relaxed pt-1.5">{item.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center mt-6"
      >
        <p className="text-xl font-bold text-foreground mb-1">Well done! ⚖️</p>
        <p className="text-sm text-muted-foreground">Next: why diversification is your best friend.</p>
      </motion.div>
    </div>
  );
};

interface Lesson4Props {
  onComplete?: () => void;
}

export const Lesson4AssetMixSlides = ({ onComplete }: Lesson4Props) => {
  const slides: LessonSlide[] = [
    { id: "what-are-assets", title: "What Are Asset Classes?", content: <WhatAreAssets /> },
    { id: "why-mix", title: "Why Mix Them?", content: <WhyMix /> },
    { id: "simulator", title: "Build Your Mix", content: <MixSimulator /> },
    { id: "quiz", title: "Test Yourself 📊", content: <AssetQuiz /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};
