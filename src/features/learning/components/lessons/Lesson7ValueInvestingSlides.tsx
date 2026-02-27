import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Search, Scale, Target, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { SliderSimulator } from "../interactive/SliderSimulator";

// Slide 1: Price vs Value
const PriceVsValue = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Here's a secret most beginners miss: a stock's <span className="text-primary font-bold">price</span> and its 
      <span className="text-primary font-bold"> value</span> are not the same thing.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <motion.div className="p-6 rounded-2xl bg-muted/50 border border-border text-center">
        <p className="text-3xl mb-2">🏷️</p>
        <h3 className="font-bold text-foreground mb-2">Price</h3>
        <p className="text-sm text-muted-foreground">What the market says a stock costs today. Changes every second based on supply and demand.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center"
      >
        <p className="text-3xl mb-2">💎</p>
        <h3 className="font-bold text-foreground mb-2">Value</h3>
        <p className="text-sm text-muted-foreground">What a company is actually worth based on its profits, assets, and future potential.</p>
      </motion.div>
    </div>

    <div className="p-4 rounded-xl bg-muted/50 border border-border mt-4">
      <p className="text-sm text-muted-foreground italic">
        "Price is what you pay. Value is what you get." — Warren Buffett
      </p>
    </div>
  </div>
);

// Slide 2: Margin of Safety
const MarginOfSafety = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      The <span className="text-primary font-bold">margin of safety</span> is the gap between 
      a stock's price and its true value. The bigger the gap, the safer your investment.
    </p>

    <div className="space-y-4 mt-6">
      {[
        { company: "TechHype Inc", price: "$150", value: "$80", verdict: "Overvalued 🚫", color: "bg-destructive/10 border-destructive/20", gap: "-47%" },
        { company: "StableBank Corp", price: "$45", value: "$70", verdict: "Undervalued ✅", color: "bg-primary/10 border-primary/20", gap: "+36%" },
        { company: "FairValue Ltd", price: "$100", value: "$105", verdict: "Fair Price 😐", color: "bg-muted/50 border-border", gap: "+5%" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className={`p-5 rounded-xl border ${item.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">{item.company}</h3>
              <p className="text-sm text-muted-foreground">Price: {item.price} • Value: {item.value}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-foreground">{item.verdict}</p>
              <p className="text-sm text-muted-foreground">Margin: {item.gap}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    <p className="text-base text-muted-foreground mt-4">
      💡 Value investors only buy when there's a <span className="text-primary font-semibold">big margin of safety</span> — buying $1 of value for $0.50.
    </p>
  </div>
);

// Slide 3: Valuation Simulator
const ValuationSimulator = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      See how price and value interact:
    </p>

    <SliderSimulator
      title="💎 Value vs Price Checker"
      description="Set the price and estimated value of a stock:"
      sliders={[
        { id: "price", label: "Stock Price", min: 10, max: 200, step: 5, defaultValue: 100, unit: "$" },
        { id: "value", label: "Estimated True Value", min: 10, max: 200, step: 5, defaultValue: 130, unit: "$" },
      ]}
      calculateResult={(vals) => {
        const margin = ((vals.value - vals.price) / vals.value * 100).toFixed(0);
        const isUndervalued = vals.value > vals.price;
        return {
          primary: `${isUndervalued ? "+" : ""}${margin}% margin`,
          secondary: isUndervalued ? `Buying $${vals.price} of stock worth $${vals.value}` : `Paying $${vals.price} for only $${vals.value} of value`,
          insight:
            Number(margin) > 30
              ? "Excellent margin of safety! This is what value investors look for."
              : Number(margin) > 0
              ? "Some upside, but a thin margin. Proceed with caution."
              : "Overvalued! A value investor would pass on this one.",
        };
      }}
    />
  </div>
);

// Slide 4: Quiz
const ValueQuiz = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { addXP } = useXPSystem();
  const correctIndex = 1;

  const options = [
    "Always buy the cheapest stocks by price",
    "Buy stocks trading below their estimated intrinsic value",
    "Only invest in companies with rising stock prices",
    "Wait until a stock hits $0 to buy it",
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
        <p className="font-bold text-foreground text-base mb-4">What is value investing?</p>
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
              ? "🎯 Correct! +10 XP — Value investing means finding stocks priced below their true worth."
              : "❌ A cheap price doesn't mean good value. Value investing is about buying below intrinsic worth."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Slide 5: Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <Scale className="w-5 h-5" />, text: "Price and value are different — price is what you pay, value is what you get" },
    { icon: <Target className="w-5 h-5" />, text: "Look for a margin of safety — buy when price is well below value" },
    { icon: <Search className="w-5 h-5" />, text: "Do your own research — don't just follow the crowd" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Patience pays — great opportunities come when others are fearful" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">You now think like a value investor:</p>
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
        <p className="text-xl font-bold text-foreground mb-1">Buffett would be proud! 💎</p>
        <p className="text-sm text-muted-foreground">Next: reading financial statements like a pro.</p>
      </motion.div>
    </div>
  );
};

interface Lesson7Props {
  onComplete?: () => void;
}

export const Lesson7ValueInvestingSlides = ({ onComplete }: Lesson7Props) => {
  const slides: LessonSlide[] = [
    { id: "price-vs-value", title: "Price vs Value", content: <PriceVsValue /> },
    { id: "margin-of-safety", title: "Margin of Safety", content: <MarginOfSafety /> },
    { id: "simulator", title: "Check the Value 💎", content: <ValuationSimulator /> },
    { id: "quiz", title: "Quick Check ✍️", content: <ValueQuiz /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};
