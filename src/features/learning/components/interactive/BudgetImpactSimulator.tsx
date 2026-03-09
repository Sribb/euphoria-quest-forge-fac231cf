import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { playSnap } from "@/lib/soundEffects";

interface BudgetCategory {
  id: string;
  label: string;
  emoji: string;
  defaultPct: number;
  color: string; // tailwind bg class using design tokens
}

interface BudgetImpactSimulatorProps {
  title?: string;
  description?: string;
  monthlyIncome?: number;
  categories?: BudgetCategory[];
  onComplete?: (score: number) => void;
}

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: "housing", label: "Housing", emoji: "🏠", defaultPct: 30, color: "bg-primary" },
  { id: "food", label: "Food & Groceries", emoji: "🍎", defaultPct: 15, color: "bg-accent" },
  { id: "transport", label: "Transportation", emoji: "🚗", defaultPct: 10, color: "bg-secondary" },
  { id: "entertainment", label: "Entertainment", emoji: "🎮", defaultPct: 10, color: "bg-muted" },
  { id: "savings", label: "Savings & Investing", emoji: "💰", defaultPct: 20, color: "bg-primary/60" },
  { id: "other", label: "Other", emoji: "📦", defaultPct: 15, color: "bg-muted-foreground/30" },
];

export const BudgetImpactSimulator = ({
  title = "Budget Allocator",
  description = "Adjust your spending categories and see how it impacts your monthly surplus.",
  monthlyIncome = 4000,
  categories = DEFAULT_CATEGORIES,
  onComplete,
}: BudgetImpactSimulatorProps) => {
  const [allocations, setAllocations] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    categories.forEach((c) => (init[c.id] = c.defaultPct));
    return init;
  });

  const totalPct = useMemo(
    () => Object.values(allocations).reduce((s, v) => s + v, 0),
    [allocations]
  );

  const surplus = monthlyIncome - (totalPct / 100) * monthlyIncome;
  const savingsRate = allocations["savings"] || 0;

  const tenYearGrowth = useMemo(() => {
    const monthlySavings = (savingsRate / 100) * monthlyIncome;
    const rate = 0.08 / 12;
    const months = 120;
    if (rate === 0) return monthlySavings * months;
    return monthlySavings * ((Math.pow(1 + rate, months) - 1) / rate);
  }, [savingsRate, monthlyIncome]);

  const handleChange = (id: string, val: number[]) => {
    setAllocations((prev) => ({ ...prev, [id]: val[0] }));
  };

  const overBudget = totalPct > 100;
  const perfect = totalPct === 100 && savingsRate >= 20;

  return (
    <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-5">
      {/* Header */}
      <div>
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Monthly income: <strong className="text-foreground">${monthlyIncome.toLocaleString()}</strong>
        </p>
      </div>

      {/* Stacked bar visualization */}
      <div className="space-y-2">
        <div className="h-8 rounded-full overflow-hidden flex bg-muted/50 border border-border">
          {categories.map((cat) => {
            const pct = allocations[cat.id];
            return (
              <motion.div
                key={cat.id}
                className={`${cat.color} flex items-center justify-center overflow-hidden`}
                initial={false}
                animate={{ width: `${Math.max(0, (pct / Math.max(totalPct, 100)) * 100)}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                title={`${cat.label}: ${pct}%`}
              >
                {pct >= 8 && (
                  <span className="text-xs font-bold text-primary-foreground truncate px-1">
                    {cat.emoji}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span className={`font-bold ${overBudget ? "text-destructive" : "text-foreground"}`}>
            {totalPct}% allocated
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                {cat.emoji} {cat.label}
              </label>
              <div className="text-right">
                <span className="text-sm font-bold text-primary">
                  {allocations[cat.id]}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  (${Math.round((allocations[cat.id] / 100) * monthlyIncome).toLocaleString()})
                </span>
              </div>
            </div>
            <Slider
              min={0}
              max={60}
              step={1}
              value={[allocations[cat.id]]}
              onValueChange={(val) => handleChange(cat.id, val)}
              onValueCommit={() => playSnap()}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${totalPct}-${savingsRate}`}
          initial={{ scale: 0.97, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className={`p-4 rounded-xl border text-center ${
            overBudget
              ? "bg-destructive/5 border-destructive/20"
              : "bg-primary/5 border-primary/20"
          }`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              {overBudget ? (
                <AlertTriangle className="w-4 h-4 text-destructive" />
              ) : surplus >= 0 ? (
                <TrendingUp className="w-4 h-4 text-primary" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className="text-xs text-muted-foreground">Monthly Surplus</span>
            </div>
            <p className={`text-xl font-black ${
              overBudget || surplus < 0 ? "text-destructive" : "text-primary"
            }`}>
              ${Math.round(surplus).toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">10yr Growth (8%)</span>
            </div>
            <p className="text-xl font-black text-primary">
              ${Math.round(tenYearGrowth).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-muted-foreground italic text-center"
      >
        {overBudget
          ? "⚠️ You're over budget! Reduce some categories to stay within 100%."
          : perfect
          ? "🌟 Great allocation! 20%+ savings sets you up for long-term wealth."
          : savingsRate < 10
          ? "💡 Try increasing savings to at least 15-20% for financial security."
          : totalPct < 90
          ? "💡 You have unallocated income — consider increasing savings or an emergency fund."
          : "👍 Solid budget — experiment with different ratios to see the impact!"}
      </motion.div>
    </div>
  );
};
