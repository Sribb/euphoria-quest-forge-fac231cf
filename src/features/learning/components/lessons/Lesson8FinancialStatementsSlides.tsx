import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Calculator, CheckCircle2, XCircle, Sparkles, DollarSign } from "lucide-react";
import { BeginnerLessonTemplate, LessonSlide } from "./BeginnerLessonTemplate";
import { useXPSystem } from "@/hooks/useXPSystem";
import { playCorrect, playIncorrect } from "@/lib/soundEffects";
import { fireSmallConfetti } from "@/lib/confetti";
import { DragSortChallenge } from "../interactive/DragSortChallenge";

// Slide 1: The Three Statements
const ThreeStatements = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      Every public company shares three key reports. Think of them as a company's 
      <span className="text-primary font-bold"> financial health checkup</span>.
    </p>

    <div className="space-y-4 mt-6">
      {[
        {
          emoji: "💰", name: "Income Statement",
          subtitle: "The Report Card",
          desc: "Shows if the company made money. Revenue - Expenses = Profit (or Loss).",
          example: "Revenue: $10M → Costs: $7M → Profit: $3M ✅"
        },
        {
          emoji: "🏦", name: "Balance Sheet",
          subtitle: "The Snapshot",
          desc: "Shows what the company owns (assets) vs. what it owes (liabilities).",
          example: "Assets: $50M → Liabilities: $20M → Net Worth: $30M"
        },
        {
          emoji: "🌊", name: "Cash Flow Statement",
          subtitle: "The Reality Check",
          desc: "Shows actual cash coming in and going out. Profit on paper ≠ cash in hand.",
          example: "Cash In: $8M → Cash Out: $6M → Net Cash: +$2M"
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="p-5 rounded-xl bg-muted/40 border border-border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-foreground">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
          <p className="text-xs font-mono bg-muted/50 p-2 rounded-lg text-muted-foreground">{item.example}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

// Slide 2: Key Ratios Made Simple
const KeyRatios = () => (
  <div className="space-y-6">
    <p className="text-lg text-muted-foreground leading-relaxed">
      You don't need to be an accountant. Just know these <span className="text-primary font-bold">3 ratios</span>:
    </p>

    <div className="space-y-4 mt-6">
      {[
        {
          name: "P/E Ratio (Price-to-Earnings)",
          formula: "Stock Price ÷ Earnings Per Share",
          meaning: "How many years of profits you're paying for",
          rule: "< 15 = cheap • 15-25 = fair • > 25 = expensive",
          emoji: "📊"
        },
        {
          name: "Debt-to-Equity",
          formula: "Total Debt ÷ Total Equity",
          meaning: "How much the company borrowed vs. what it owns",
          rule: "< 0.5 = strong • 0.5-1 = ok • > 1 = risky",
          emoji: "⚖️"
        },
        {
          name: "Profit Margin",
          formula: "Net Profit ÷ Revenue × 100",
          meaning: "What percentage of sales becomes profit",
          rule: "> 20% = great • 10-20% = decent • < 10% = thin",
          emoji: "📈"
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="p-5 rounded-xl bg-muted/40 border border-border"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0" />
            <h3 className="font-bold text-foreground">{item.name}</h3>
          </div>
          <p className="text-xs font-mono bg-muted/50 p-2 rounded-lg text-muted-foreground mb-2">{item.formula}</p>
          <p className="text-sm text-muted-foreground mb-1">{item.meaning}</p>
          <p className="text-xs text-primary font-medium">{item.rule}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

// Slide 3: Practice Reading
const PracticeReading = () => {
  const [revealed, setRevealed] = useState<number[]>([]);

  const company = {
    name: "SnackCo",
    revenue: "$50M",
    expenses: "$35M",
    profit: "$15M",
    assets: "$80M",
    liabilities: "$30M",
    pe: 12,
    debtEquity: 0.6,
    margin: 30,
  };

  const insights = [
    { label: "Profit Margin", value: `${company.margin}%`, verdict: "Great — keeps 30¢ of every dollar", good: true },
    { label: "P/E Ratio", value: `${company.pe}x`, verdict: "Cheap — paying 12 years of earnings", good: true },
    { label: "Debt/Equity", value: `${company.debtEquity}`, verdict: "Moderate — manageable debt level", good: true },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">
        Let's analyze <span className="text-primary font-bold">SnackCo</span> together. Tap each metric to reveal the insight:
      </p>

      <div className="p-5 rounded-xl bg-muted/30 border border-border">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-lg font-bold">{company.revenue}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-lg font-bold">{company.expenses}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <p className="text-xs text-muted-foreground">Profit</p>
            <p className="text-lg font-bold text-primary">{company.profit}</p>
          </div>
        </div>

        <div className="space-y-3">
          {insights.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => !revealed.includes(i) && setRevealed(prev => [...prev, i])}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                revealed.includes(i)
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-background hover:bg-muted/30 cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="font-bold text-primary">{item.value}</span>
              </div>
              {revealed.includes(i) && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mt-2">
                  {item.good ? "✅" : "⚠️"} {item.verdict}
                </motion.p>
              )}
              {!revealed.includes(i) && (
                <p className="text-xs text-muted-foreground mt-1">Tap to reveal insight</p>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Slide 4: Quiz
const StatementsQuiz = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const { addXP } = useXPSystem();
  const correctIndex = 2;

  const options = [
    "The Balance Sheet — it shows current cash",
    "The Income Statement — it shows stock price history",
    "The Cash Flow Statement — profit on paper doesn't mean cash in hand",
    "None of them — just look at the stock price",
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
        <p className="font-bold text-foreground text-base mb-4">Which statement shows if a company actually has cash to operate?</p>
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
              ? "🎯 Correct! +10 XP — The cash flow statement reveals if a company can actually pay its bills."
              : "❌ The cash flow statement shows real cash moving in and out — a company can be 'profitable' on paper but cash-poor!"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Slide 5: Takeaways
const KeyTakeaways = () => {
  const takeaways = [
    { icon: <FileText className="w-5 h-5" />, text: "Three key statements: Income, Balance Sheet, Cash Flow" },
    { icon: <Calculator className="w-5 h-5" />, text: "P/E ratio, Debt/Equity, and Profit Margin are the basics you need" },
    { icon: <DollarSign className="w-5 h-5" />, text: "Cash flow is king — profit on paper ≠ cash in hand" },
    { icon: <Sparkles className="w-5 h-5" />, text: "You don't need to be an accountant — just know the key signals" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-lg text-muted-foreground leading-relaxed">You can now read a company's financial health:</p>
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
        <p className="text-xl font-bold text-foreground mb-1">Financial literacy unlocked! 📊</p>
        <p className="text-sm text-muted-foreground">Next: understanding competitive moats.</p>
      </motion.div>
    </div>
  );
};

interface Lesson8Props {
  onComplete?: () => void;
}

export const Lesson8FinancialStatementsSlides = ({ onComplete }: Lesson8Props) => {
  const slides: LessonSlide[] = [
    { id: "three-statements", title: "The 3 Financial Statements", content: <ThreeStatements /> },
    { id: "key-ratios", title: "3 Ratios You Need to Know", content: <KeyRatios /> },
    { id: "practice", title: "Let's Analyze a Company 🔍", content: <PracticeReading /> },
    { id: "quiz", title: "Quick Check ✍️", content: <StatementsQuiz /> },
    { id: "takeaways", title: "Key Takeaways", content: <KeyTakeaways /> },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete || (() => {})} />;
};
