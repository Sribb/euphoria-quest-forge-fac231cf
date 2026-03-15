import { useState } from "react";
import { motion } from "framer-motion";
import { PiggyBank, TrendingUp, Clock, DollarSign, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { DragSortChallenge } from "../interactive/DragSortChallenge";
import { SliderSimulator } from "../interactive/SliderSimulator";

// Slide 1: What is Investing?
const WhatIsInvesting = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Imagine you have <span className="text-primary font-bold">$100</span>. You can put it in a jar at home, 
      or you can use it to buy a tiny piece of a company — like Apple or Nike.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <motion.div className="p-6 rounded-2xl bg-muted/50 border border-border">
        <PiggyBank className="w-10 h-10 text-accent mb-3" />
        <h3 className="font-bold text-foreground mb-2">Saving</h3>
        <p className="text-sm text-muted-foreground">
          Your $100 stays safe in a jar. After a year, you still have $100. But everything around you costs a little more.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
      >
        <TrendingUp className="w-10 h-10 text-primary mb-3" />
        <h3 className="font-bold text-foreground mb-2">Investing</h3>
        <p className="text-sm text-muted-foreground">
          Your $100 buys a piece of a growing company. If the company does well, your piece becomes worth $107, $110, or more.
        </p>
      </motion.div>
    </div>

    <p className="text-base text-muted-foreground mt-4">
      <span className="text-primary font-semibold">Investing</span> means putting your money into something that can grow over time — 
      like businesses, real estate, or funds.
    </p>
  </div>
);

// Slide 2: Why Does Money Lose Value? (with drag sort)
const WhyMoneyLosesValue = () => {
  const items = [
    { year: "Today", price: "$5.00", emoji: "☕" },
    { year: "In 5 years", price: "$5.80", emoji: "☕" },
    { year: "In 10 years", price: "$6.72", emoji: "☕" },
    { year: "In 20 years", price: "$9.03", emoji: "☕" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Every year, prices go up a little. This is called <span className="text-primary font-bold">inflation</span>. 
        The same coffee that costs $5 today will cost more in the future.
      </p>

      <div className="space-y-3 mt-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground">{item.year}</span>
              <span className="font-medium text-foreground">{item.year}</span>
            </div>
            <span className="font-bold text-foreground text-lg">{item.price}</span>
          </motion.div>
        ))}
      </div>

      {/* Drag sort challenge */}
      <DragSortChallenge
        title="🧩 Order these by risk level"
        description="Drag to rank from LOWEST to HIGHEST risk:"
        items={[
          { id: "savings", label: "💰 Savings Account" },
          { id: "bonds", label: "📜 Government Bonds" },
          { id: "stocks", label: "📈 Large-Cap Stocks" },
          { id: "crypto", label: "🪙 Cryptocurrency" },
        ]}
        correctOrder={["savings", "bonds", "stocks", "crypto"]}
      />

      <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 mt-4">
        <p className="text-sm text-muted-foreground">
          💡 If your money isn't growing, it's actually <span className="text-destructive font-semibold">shrinking</span> in value. 
          That's why just saving isn't always enough.
        </p>
      </div>
    </div>
  );
};

// Slide 3: Interactive Compound Growth Simulator
const MagicOfTime = () => {
  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Here's the exciting part: when your money earns returns, those returns also earn returns. 
        This is called <span className="text-primary font-bold">compound growth</span>.
      </p>

      <SliderSimulator
        title="🎛️ Compound Growth Simulator"
        description="Move the sliders to see how your money grows:"
        sliders={[
          { id: "initial", label: "Starting Amount", min: 100, max: 10000, step: 100, defaultValue: 1000, unit: "$" },
          { id: "rate", label: "Annual Return", min: 1, max: 15, step: 0.5, defaultValue: 7, unit: "%" },
          { id: "years", label: "Years Invested", min: 1, max: 40, step: 1, defaultValue: 20, unit: " yrs" },
        ]}
        calculateResult={(vals) => {
          const future = vals.initial * Math.pow(1 + vals.rate / 100, vals.years);
          const earned = future - vals.initial;
          return {
            primary: `$${Math.round(future).toLocaleString()}`,
            secondary: `You earn $${Math.round(earned).toLocaleString()} in returns`,
            insight:
              vals.years >= 20
                ? "Time is your biggest advantage — most growth happens in the later years!"
                : vals.rate >= 10
                ? "Higher returns accelerate growth, but come with more risk."
                : "Even modest returns create significant wealth over time.",
          };
        }}
        chartRender={(vals) => {
          const points = Array.from({ length: Math.min(vals.years + 1, 41) }, (_, i) => ({
            year: i,
            value: vals.initial * Math.pow(1 + vals.rate / 100, i),
          }));
          const maxVal = points[points.length - 1].value;
          const w = 540;
          const h = 120;
          const pad = 10;
          const pathD = points
            .map((p, i) => {
              const x = pad + (i / (points.length - 1)) * (w - pad * 2);
              const y = h - pad - ((p.value - vals.initial) / (maxVal - vals.initial || 1)) * (h - pad * 2);
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");

          return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minHeight: 100 }}>
              <path d={pathD} fill="none" className="stroke-primary" strokeWidth={2.5} />
              <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} className="stroke-border" strokeWidth={0.5} />
            </svg>
          );
        }}
      />
    </div>
  );
};

// Slide 4: Quiz
const QuizSlide = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { addXP } = useXPSystem();
  const correctIndex = 2;

  const options = [
    "Your money doubles every year automatically",
    "You need thousands of dollars to start investing",
    "Your investment returns earn their own returns over time",
    "Inflation makes investments worthless",
  ];

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === correctIndex) {
      playCorrect();
      fireSmallConfetti();
      addXP(10);
    } else {
      playIncorrect();
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Let's check what you've learned! Choose the best answer:
      </p>

      <div className="p-5 rounded-2xl bg-muted/30 border border-border">
        <p className="font-bold text-foreground text-base mb-4">
          What does "compound growth" mean?
        </p>

        <div className="space-y-3">
          {options.map((option, i) => {
            const isCorrect = i === correctIndex;
            const isSelected = i === selected;
            let borderClass = "border-border";
            let bgClass = "bg-background hover:bg-muted/50";

            if (answered && isSelected && isCorrect) {
              borderClass = "border-primary";
              bgClass = "bg-primary/10";
            } else if (answered && isSelected && !isCorrect) {
              borderClass = "border-destructive";
              bgClass = "bg-destructive/10";
            } else if (answered && isCorrect) {
              borderClass = "border-primary/40";
              bgClass = "bg-primary/5";
            }

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-xl border ${borderClass} ${bgClass} transition-all duration-200 flex items-center gap-3`}
              >
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm font-medium text-foreground flex-1">{option}</span>
                {answered && isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${selected === correctIndex ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"}`}
        >
          <p className="text-sm text-muted-foreground">
            {selected === correctIndex
              ? "🎯 Correct! +10 XP — Compound growth is when your returns generate their own returns, creating exponential growth over time."
              : "❌ Not quite — Compound growth means your returns earn their own returns, creating a snowball effect over time."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Slide 5: Key Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <DollarSign className="w-5 h-5" />, text: "Investing means putting money into things that can grow over time" },
    { icon: <Clock className="w-5 h-5" />, text: "Inflation makes your money worth less each year if it just sits there" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Compound growth means your returns earn their own returns" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Starting early matters more than starting with a lot" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        You just learned the most important foundation of building wealth. Let's recap:
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
        <p className="text-xl font-bold text-foreground mb-1">You're ready for the next step! 🚀</p>
        <p className="text-sm text-muted-foreground">Hit "Complete" to finish this lesson and unlock the next one.</p>
      </motion.div>
    </div>
  );
};

interface Lesson1BeginnerProps {
  onComplete: () => void;
}

export const Lesson1Beginner = ({ onComplete }: Lesson1BeginnerProps) => {
  const slides: LessonSlide[] = [
    { id: "what-is-investing", title: "What is Investing?", content: <WhatIsInvesting /> },
    { id: "inflation", title: "Why Does Money Lose Value?", content: <WhyMoneyLosesValue /> },
    { id: "compound-growth", title: "The Magic of Compound Growth", content: <MagicOfTime /> },
    { id: "quiz", title: "Quick Check ✍️", content: <QuizSlide /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
