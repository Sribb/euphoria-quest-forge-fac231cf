import { useState } from "react";
import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const PF1FinancialStartingPoint = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Your Financial Starting Point",
      content: (
        <div className="space-y-4">
          <p>Every financial journey starts with knowing where you stand right now.</p>
          <p>Your <strong>net worth</strong> is the simplest snapshot: everything you <span className="text-primary font-semibold">own</span> minus everything you <span className="text-destructive font-semibold">owe</span>.</p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border mt-4">
            <p className="text-sm font-medium">Net Worth = Assets − Liabilities</p>
          </div>
        </div>
      ),
    },
    {
      id: "assets",
      title: "What Counts as an Asset?",
      content: (
        <div className="space-y-3">
          <p>Assets are things with monetary value that you own:</p>
          <ul className="space-y-2 ml-4">
            <li>💰 Cash & savings accounts</li>
            <li>📈 Investments (stocks, bonds, retirement accounts)</li>
            <li>🏠 Property (home, car — at resale value)</li>
            <li>💎 Valuables (jewelry, collectibles)</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">Tip: Be realistic about values — use what you could actually sell things for today.</p>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Calculate Your Net Worth",
      content: (
        <SliderSimulator
          title="Net Worth Calculator"
          description="Adjust to estimate your financial position"
          sliders={[
            { id: "savings", label: "Savings & Cash", min: 0, max: 50000, step: 500, defaultValue: 5000, unit: "$" },
            { id: "investments", label: "Investments", min: 0, max: 100000, step: 1000, defaultValue: 2000, unit: "$" },
            { id: "debt", label: "Total Debt", min: 0, max: 100000, step: 1000, defaultValue: 15000, unit: "$" },
          ]}
          calculateResult={(v) => {
            const nw = v.savings + v.investments - v.debt;
            return {
              primary: `$${nw.toLocaleString()}`,
              secondary: nw >= 0 ? "Positive net worth — great start!" : "Negative — focus on reducing debt first",
              insight: nw < 0 ? "Most young adults start negative due to student loans. That's normal!" : "You're ahead of the curve!",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Net worth = Assets − Liabilities</div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Track it monthly to see progress</div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ A negative net worth isn't failure — it's a starting point</div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Growing net worth = building wealth over time</div>
          </div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
