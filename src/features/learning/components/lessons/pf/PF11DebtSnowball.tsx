import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { BudgetImpactSimulator } from "../../interactive/BudgetImpactSimulator";
import { CompoundGrowthExplorer } from "../../interactive/CompoundGrowthExplorer";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const PF11DebtSnowball = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Debt Payoff Strategies",
      content: (
        <div className="space-y-4">
          <p>Two popular methods dominate the debt payoff world:</p>
          <div className="grid gap-3 mt-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold">❄️ Snowball Method</p>
              <p className="text-sm text-muted-foreground mt-1">Pay off the <strong>smallest balance</strong> first. Quick wins build momentum.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold">🏔️ Avalanche Method</p>
              <p className="text-sm text-muted-foreground mt-1">Pay off the <strong>highest interest rate</strong> first. Saves the most money.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sort",
      title: "Avalanche Order",
      content: (
        <DragSortChallenge
          title="Rank by Interest Rate"
          description="Using the avalanche method, which debt should you attack first? Rank highest interest to lowest."
          items={[
            { id: "cc", label: "Credit Card — 22% APR" },
            { id: "personal", label: "Personal Loan — 12% APR" },
            { id: "car", label: "Car Loan — 6% APR" },
            { id: "student", label: "Student Loan — 4.5% APR" },
            { id: "mortgage", label: "Mortgage — 3.5% APR" },
          ]}
          correctOrder={["cc", "personal", "car", "student", "mortgage"]}
        />
      ),
    },
    {
      id: "sim",
      title: "Extra Payment Impact",
      content: (
        <SliderSimulator
          title="Extra Payment Calculator"
          description="See how extra monthly payments shrink your debt timeline"
          sliders={[
            { id: "balance", label: "Total Debt Balance", min: 1000, max: 50000, step: 500, defaultValue: 15000, unit: "$" },
            { id: "rate", label: "Avg Interest Rate", min: 3, max: 25, step: 0.5, defaultValue: 12, unit: "%" },
            { id: "extra", label: "Extra Monthly Payment", min: 0, max: 500, step: 25, defaultValue: 100, unit: "$" },
          ]}
          calculateResult={(v) => {
            const monthlyRate = v.rate / 100 / 12;
            const minPayment = Math.max(v.balance * 0.02, 25);
            const totalPayment = minPayment + v.extra;
            const monthsWithExtra = monthlyRate > 0
              ? Math.ceil(Math.log(totalPayment / (totalPayment - v.balance * monthlyRate)) / Math.log(1 + monthlyRate))
              : Math.ceil(v.balance / totalPayment);
            const monthsWithout = monthlyRate > 0
              ? Math.ceil(Math.log(minPayment / (minPayment - v.balance * monthlyRate)) / Math.log(1 + monthlyRate))
              : Math.ceil(v.balance / minPayment);
            const saved = Math.max(0, monthsWithout - monthsWithExtra);
            return {
              primary: `${Math.min(monthsWithExtra, 360)} months`,
              secondary: `That's ${saved} months sooner than minimum payments`,
              insight: v.extra >= 200 ? "Aggressive payoff! You'll save thousands in interest." : "Even small extra payments compound over time.",
            };
          }}
        />
      ),
    },
    {
      id: "redirect",
      title: "After Debt: Redirect Your Money",
      content: (
        <CompoundGrowthExplorer
          title="🚀 Post-Debt Growth"
          description="Once debt is gone, redirect those payments into investing. See how that money grows!"
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Snowball = motivation through quick wins</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Avalanche = mathematically optimal (less interest)</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Any extra payment accelerates freedom</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ The best method is the one you stick with</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
