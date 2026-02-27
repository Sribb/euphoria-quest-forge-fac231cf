import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const CF3BalanceSheets = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "The Balance Sheet",
      content: (
        <div className="space-y-4">
          <p>A balance sheet is a snapshot of what a company <strong>owns</strong> and <strong>owes</strong> at a specific moment.</p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border mt-4">
            <p className="font-bold text-center text-lg">Assets = Liabilities + Equity</p>
            <p className="text-sm text-center text-muted-foreground mt-1">This equation always balances — hence the name!</p>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Balance Sheet Explorer",
      content: (
        <SliderSimulator
          title="Assets vs Liabilities"
          description="Adjust to see the equity impact"
          sliders={[
            { id: "assets", label: "Total Assets", min: 100000, max: 2000000, step: 50000, defaultValue: 1000000, unit: "$" },
            { id: "liabilities", label: "Total Liabilities", min: 0, max: 1500000, step: 50000, defaultValue: 400000, unit: "$" },
          ]}
          calculateResult={(v) => {
            const equity = v.assets - v.liabilities;
            const ratio = (v.liabilities / v.assets * 100).toFixed(0);
            return {
              primary: `$${equity.toLocaleString()} equity`,
              secondary: `Debt-to-asset ratio: ${ratio}%`,
              insight: Number(ratio) > 60 ? "High leverage — risky!" : Number(ratio) < 30 ? "Conservative balance sheet" : "Moderate leverage",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Assets = Liabilities + Equity (always)</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Equity = what shareholders actually own</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ High debt-to-assets = more financial risk</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Compare balance sheets across quarters for trends</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
