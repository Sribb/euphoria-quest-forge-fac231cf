import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Sparkles, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { CompoundGrowthExplorer } from "../interactive/CompoundGrowthExplorer";

// Slide 1: Simple vs Compound
const SimpleVsCompound = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Imagine you invest <span className="text-primary font-bold">$1,000</span> at 10% per year. 
      There are two ways your money can grow:
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <motion.div className="p-6 rounded-2xl bg-muted/50 border border-border">
        <DollarSign className="w-10 h-10 text-muted-foreground mb-3" />
        <h3 className="font-bold text-foreground mb-2">Simple Interest</h3>
        <p className="text-sm text-muted-foreground mb-3">You earn 10% on your original $1,000 every year.</p>
        <div className="space-y-1 text-sm">
          <p>Year 1: $1,000 + $100 = <span className="font-bold">$1,100</span></p>
          <p>Year 2: $1,100 + $100 = <span className="font-bold">$1,200</span></p>
          <p>Year 3: $1,200 + $100 = <span className="font-bold">$1,300</span></p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
      >
        <Sparkles className="w-10 h-10 text-primary mb-3" />
        <h3 className="font-bold text-foreground mb-2">Compound Interest</h3>
        <p className="text-sm text-muted-foreground mb-3">You earn 10% on your <em>total balance</em> — including past interest!</p>
        <div className="space-y-1 text-sm">
          <p>Year 1: $1,000 + $100 = <span className="font-bold">$1,100</span></p>
          <p>Year 2: $1,100 + $110 = <span className="font-bold">$1,210</span></p>
          <p>Year 3: $1,210 + $121 = <span className="font-bold text-primary">$1,331</span></p>
        </div>
      </motion.div>
    </div>

    <p className="text-base text-muted-foreground mt-4">
      💡 The difference seems small at first, but over decades it becomes <span className="text-primary font-semibold">massive</span>.
    </p>
  </div>
);

// Slide 2: The Snowball Effect
const SnowballEffect = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Think of compound interest like a <span className="text-primary font-bold">snowball</span> rolling downhill. 
      It starts small, but as it rolls, it picks up more and more snow.
    </p>

    <div className="space-y-3 mt-6">
      {[
        { year: "Year 1", amount: "$1,100", snowball: "⚪", note: "Small start" },
        { year: "Year 5", amount: "$1,611", snowball: "⚪⚪", note: "Getting bigger" },
        { year: "Year 10", amount: "$2,594", snowball: "⚪⚪⚪", note: "Momentum building" },
        { year: "Year 20", amount: "$6,727", snowball: "⚪⚪⚪⚪⚪", note: "Snowball effect!" },
        { year: "Year 30", amount: "$17,449", snowball: "⚪⚪⚪⚪⚪⚪⚪⚪", note: "🏔️ Avalanche!" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm">{item.snowball}</span>
            <div>
              <span className="font-medium text-foreground">{item.year}</span>
              <p className="text-xs text-muted-foreground">{item.note}</p>
            </div>
          </div>
          <span className="font-bold text-foreground text-lg">{item.amount}</span>
        </motion.div>
      ))}
    </div>

    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-4">
      <p className="text-sm text-muted-foreground">
        🎯 Starting with just $1,000 at 10%, you'd have <span className="text-primary font-semibold">$17,449</span> after 30 years — 
        without adding a single dollar more!
      </p>
    </div>
  </div>
);

// Slide 3: Interactive Simulator
const CompoundSimulator = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Play with the numbers and watch compound interest in action:
    </p>

    <CompoundGrowthExplorer
      title="📈 Compound Interest Explorer"
      description="Adjust starting amount, monthly contributions, return rate, and time — see the growth curve update instantly."
    />
  </div>
);

// Slide 4: Quiz
const CompoundQuiz = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { addXP } = useXPSystem();
  const correctIndex = 1;

  const options = [
    "You earn a fixed amount every year, always the same",
    "Your returns generate their own returns, creating exponential growth",
    "The bank doubles your money every 5 years",
    "You have to add money every month for it to work",
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
        Quick check! Pick the best answer:
      </p>

      <div className="p-5 rounded-2xl bg-muted/30 border border-border">
        <p className="font-bold text-foreground text-base mb-4">
          What makes compound interest so powerful?
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
              ? "🎯 Correct! +10 XP — Compound interest earns returns on your returns, creating a snowball effect."
              : "❌ Not quite — Compound interest is special because your earnings generate their own earnings over time."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Slide 5: Key Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <Sparkles className="w-5 h-5" />, text: "Compound interest = earning returns on your returns" },
    { icon: <Clock className="w-5 h-5" />, text: "Time is the most powerful ingredient — start early!" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Even small amounts grow dramatically over decades" },
    { icon: <DollarSign className="w-5 h-5" />, text: "Einstein called it 'the eighth wonder of the world'" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Compound interest is the single most important concept in building wealth:
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
        <p className="text-xl font-bold text-foreground mb-1">You're on a roll! ⚡</p>
        <p className="text-sm text-muted-foreground">Next up: understanding different types of investments.</p>
      </motion.div>
    </div>
  );
};

interface Lesson3Props {
  onComplete?: () => void;
}

export const Lesson3CompoundInterestSlides = ({ onComplete }: Lesson3Props) => {
  const slides: LessonSlide[] = [
    { id: "simple-vs-compound", title: "Simple vs Compound Interest", content: <SimpleVsCompound /> },
    { id: "snowball", title: "The Snowball Effect ⚪", content: <SnowballEffect /> },
    { id: "simulator", title: "Try It Yourself", content: <CompoundSimulator /> },
    { id: "quiz", title: "Quick Check ✍️", content: <CompoundQuiz /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};
