import { useState } from "react";
import { motion } from "framer-motion";
import { Package, ShieldCheck, AlertTriangle, Layers, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { DragSortChallenge } from "../interactive/DragSortChallenge";

// Slide 1: Eggs in Baskets
const EggsInBaskets = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      You've probably heard: <span className="text-primary font-bold">"Don't put all your eggs in one basket."</span> 
      That's diversification in a nutshell.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <motion.div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/20">
        <p className="text-3xl mb-2">🧺💔</p>
        <h3 className="font-bold text-foreground mb-2">All Eggs, One Basket</h3>
        <p className="text-sm text-muted-foreground">
          You put $10,000 into one company. It goes bankrupt. You lose everything. Game over.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
      >
        <p className="text-3xl mb-2">🧺🧺🧺✨</p>
        <h3 className="font-bold text-foreground mb-2">Eggs in Many Baskets</h3>
        <p className="text-sm text-muted-foreground">
          You spread $10,000 across 10 companies. One fails? You only lose 10%. The rest keep growing.
        </p>
      </motion.div>
    </div>

    <p className="text-base text-muted-foreground mt-4">
      💡 Diversification doesn't prevent all losses — but it prevents <span className="text-primary font-semibold">catastrophic</span> ones.
    </p>
  </div>
);

// Slide 2: How to Diversify
const HowToDiversify = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      True diversification means spreading across <span className="text-primary font-bold">multiple dimensions</span>:
    </p>

    <div className="space-y-3 mt-6">
      {[
        { emoji: "🏢", title: "Different Companies", desc: "Don't just own Apple — own 20+ companies" },
        { emoji: "🏭", title: "Different Sectors", desc: "Tech, healthcare, energy, finance — they don't all crash together" },
        { emoji: "🌍", title: "Different Countries", desc: "US, Europe, Asia — global exposure reduces regional risk" },
        { emoji: "📦", title: "Different Asset Types", desc: "Stocks + bonds + real estate = smoother ride" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border"
        >
          <span className="text-2xl">{item.emoji}</span>
          <div>
            <h3 className="font-bold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-4">
      <p className="text-sm text-muted-foreground">
        🎯 The easiest way to diversify? Buy an <span className="text-primary font-semibold">index fund</span> — 
        it owns hundreds of companies in one investment!
      </p>
    </div>
  </div>
);

// Slide 3: Real Example
const RealExample = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Let's look at what happened during the <span className="text-primary font-bold">2020 COVID crash</span>:
    </p>

    <div className="space-y-3 mt-6">
      {[
        { name: "✈️ Airlines", change: "-62%", color: "text-destructive" },
        { name: "🏨 Hotels", change: "-52%", color: "text-destructive" },
        { name: "🛒 Amazon", change: "+76%", color: "text-primary" },
        { name: "💻 Zoom", change: "+396%", color: "text-primary" },
        { name: "📊 S&P 500 (diversified)", change: "+18%", color: "text-primary" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border"
        >
          <span className="font-medium text-foreground">{item.name}</span>
          <span className={`font-bold text-lg ${item.color}`}>{item.change}</span>
        </motion.div>
      ))}
    </div>

    <div className="p-4 rounded-xl bg-muted/50 border border-border mt-4">
      <p className="text-sm text-muted-foreground">
        💡 If you only owned airlines, you'd be devastated. A diversified index fund? 
        <span className="text-primary font-semibold"> Up 18% by year end</span>.
      </p>
    </div>
  </div>
);

// Slide 4: Quiz
const DiversificationQuiz = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { addXP } = useXPSystem();
  const correctIndex = 2;

  const options = [
    "Buying 5 different tech stocks",
    "Putting all your money into the safest bond",
    "Spreading investments across different sectors, countries, and asset types",
    "Only investing in companies you personally use",
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
      <div className="p-5 rounded-2xl bg-muted/30 border border-border">
        <p className="font-bold text-foreground text-base mb-4">
          What is TRUE diversification?
        </p>

        <div className="space-y-3">
          {options.map((option, i) => {
            const isCorrect = i === correctIndex;
            const isSelected = i === selected;
            let borderClass = "border-border";
            let bgClass = "bg-background hover:bg-muted/50";

            if (answered && isSelected && isCorrect) {
              borderClass = "border-primary"; bgClass = "bg-primary/10";
            } else if (answered && isSelected && !isCorrect) {
              borderClass = "border-destructive"; bgClass = "bg-destructive/10";
            } else if (answered && isCorrect) {
              borderClass = "border-primary/40"; bgClass = "bg-primary/5";
            }

            return (
              <motion.button
                key={i}
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
              ? "🎯 Correct! +10 XP — True diversification means spreading across sectors, countries, AND asset types."
              : "❌ Buying 5 tech stocks isn't diversified — they all move together. Spread across different sectors and asset types!"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Slide 5: Key Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <Package className="w-5 h-5" />, text: "Don't put all your eggs in one basket" },
    { icon: <Layers className="w-5 h-5" />, text: "Diversify across companies, sectors, countries, and asset types" },
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Index funds are the easiest way to get instant diversification" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Diversification won't prevent all losses, but prevents catastrophic ones" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">You now understand the power of diversification:</p>
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
        <p className="text-xl font-bold text-foreground mb-1">Smart thinking! 🧺✨</p>
        <p className="text-sm text-muted-foreground">Next up: understanding market psychology.</p>
      </motion.div>
    </div>
  );
};

interface Lesson5Props {
  onComplete?: () => void;
}

export const Lesson5DiversificationSlides = ({ onComplete }: Lesson5Props) => {
  const slides: LessonSlide[] = [
    { id: "eggs-baskets", title: "Don't Put All Your Eggs in One Basket", content: <EggsInBaskets /> },
    { id: "how-to", title: "How to Diversify", content: <HowToDiversify /> },
    { id: "real-example", title: "A Real-World Example", content: <RealExample /> },
    { id: "quiz", title: "Quick Check ✍️", content: <DiversificationQuiz /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};
