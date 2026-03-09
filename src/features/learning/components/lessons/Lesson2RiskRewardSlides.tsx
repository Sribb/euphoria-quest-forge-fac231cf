import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Target, TrendingUp, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { RiskReturnExplorer } from "../interactive/RiskReturnExplorer";
import { DragSortChallenge } from "../interactive/DragSortChallenge";

// Slide 1: What is Risk?
const WhatIsRisk = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      In investing, <span className="text-primary font-bold">risk</span> means the chance you could 
      lose some or all of your money. But here's the twist — without risk, there's almost no reward.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <motion.div className="p-6 rounded-2xl bg-muted/50 border border-border">
        <Shield className="w-10 h-10 text-accent mb-3" />
        <h3 className="font-bold text-foreground mb-2">Low Risk</h3>
        <p className="text-sm text-muted-foreground">
          Savings accounts, government bonds. Your money is safe but grows very slowly — maybe 2-4% a year.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
      >
        <Zap className="w-10 h-10 text-primary mb-3" />
        <h3 className="font-bold text-foreground mb-2">High Risk</h3>
        <p className="text-sm text-muted-foreground">
          Individual stocks, crypto. Could double your money — or lose half of it. Big swings, big emotions.
        </p>
      </motion.div>
    </div>

    <p className="text-base text-muted-foreground mt-4">
      💡 The key isn't avoiding risk — it's <span className="text-primary font-semibold">understanding</span> how much risk you're comfortable with.
    </p>
  </div>
);

// Slide 2: The Risk-Reward Tradeoff
const RiskRewardTradeoff = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      There's a simple rule in investing: <span className="text-primary font-bold">higher potential returns = higher risk</span>. 
      Let's see how different investments compare.
    </p>

    <div className="space-y-3 mt-6">
      {[
        { label: "💰 Savings Account", risk: "Very Low", reward: "~2%/yr", color: "bg-muted/50" },
        { label: "📜 Government Bonds", risk: "Low", reward: "~4%/yr", color: "bg-muted/50" },
        { label: "📊 Index Funds", risk: "Medium", reward: "~8-10%/yr", color: "bg-primary/5" },
        { label: "📈 Individual Stocks", risk: "High", reward: "~15%+ or losses", color: "bg-primary/10" },
        { label: "🪙 Cryptocurrency", risk: "Very High", reward: "Extreme gains or losses", color: "bg-destructive/5" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center justify-between p-4 rounded-xl ${item.color} border border-border`}
        >
          <span className="font-medium text-foreground">{item.label}</span>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Risk: {item.risk}</span>
            <p className="text-sm font-bold text-foreground">{item.reward}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Slide 3: Interactive Risk Simulator
const RiskSimulator = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Build a portfolio and see how risk and return change in real time:
    </p>

    <RiskReturnExplorer
      title="⚖️ Risk-Reward Explorer"
      description="Allocate between bonds, stocks, and crypto to see the tradeoff between risk and potential return."
    />
  </div>
);

// Slide 4: Drag & Quiz
const RiskQuiz = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Can you rank these from safest to riskiest?
    </p>

    <DragSortChallenge
      title="🧩 Rank by Risk Level"
      description="Drag from LOWEST to HIGHEST risk:"
      items={[
        { id: "savings", label: "💰 Savings Account" },
        { id: "bonds", label: "📜 Government Bonds" },
        { id: "index", label: "📊 Index Fund" },
        { id: "stock", label: "📈 Single Stock" },
      ]}
      correctOrder={["savings", "bonds", "index", "stock"]}
    />
  </div>
);

// Slide 5: Key Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <Shield className="w-5 h-5" />, text: "Risk means the chance of losing money — but also the chance of making more" },
    { icon: <Target className="w-5 h-5" />, text: "Higher potential returns always come with higher risk" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Your risk tolerance depends on your goals, age, and personality" },
    { icon: <AlertTriangle className="w-5 h-5" />, text: "Never invest money you can't afford to lose" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Understanding risk is the foundation of smart investing. Here's what to remember:
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
        <p className="text-xl font-bold text-foreground mb-1">Great job! 🎯</p>
        <p className="text-sm text-muted-foreground">You now understand the risk-reward tradeoff.</p>
      </motion.div>
    </div>
  );
};

interface Lesson2Props {
  onComplete?: () => void;
}

export const Lesson2RiskRewardSlides = ({ onComplete }: Lesson2Props) => {
  const slides: LessonSlide[] = [
    { id: "what-is-risk", title: "What is Risk?", content: <WhatIsRisk /> },
    { id: "tradeoff", title: "The Risk-Reward Tradeoff", content: <RiskRewardTradeoff /> },
    { id: "simulator", title: "See Risk in Action", content: <RiskSimulator /> },
    { id: "quiz", title: "Test Yourself 🧩", content: <RiskQuiz /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};
