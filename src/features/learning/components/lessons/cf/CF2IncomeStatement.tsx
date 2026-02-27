import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const CF2IncomeStatement = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "The Income Statement",
      content: (
        <div className="space-y-4">
          <p>The income statement shows how much money a company <strong>made</strong> and <strong>spent</strong> over a period.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-primary/10">📈 Revenue (top line)</div>
            <div className="p-3 rounded-lg bg-muted/40">➖ Cost of Goods Sold (COGS)</div>
            <div className="p-3 rounded-lg bg-muted/40">= <strong>Gross Profit</strong></div>
            <div className="p-3 rounded-lg bg-muted/40">➖ Operating Expenses</div>
            <div className="p-3 rounded-lg bg-muted/40">= <strong>Operating Income</strong></div>
            <div className="p-3 rounded-lg bg-accent/10">= Net Income (bottom line) 💰</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Build an Income Statement",
      content: (
        <SliderSimulator
          title="Revenue to Profit"
          description="Adjust to see how costs affect the bottom line"
          sliders={[
            { id: "revenue", label: "Revenue", min: 100000, max: 1000000, step: 50000, defaultValue: 500000, unit: "$" },
            { id: "cogs", label: "COGS (% of Revenue)", min: 20, max: 80, step: 5, defaultValue: 40, unit: "%" },
            { id: "opex", label: "Operating Expenses", min: 50000, max: 300000, step: 25000, defaultValue: 150000, unit: "$" },
          ]}
          calculateResult={(v) => {
            const gross = v.revenue - v.revenue * (v.cogs / 100);
            const operating = gross - v.opex;
            const margin = (operating / v.revenue * 100).toFixed(1);
            return {
              primary: `$${Math.round(operating).toLocaleString()} operating income`,
              secondary: `Gross profit: $${Math.round(gross).toLocaleString()} · Margin: ${margin}%`,
              insight: Number(margin) > 20 ? "Strong operating margin!" : Number(margin) < 5 ? "Thin margins — watch costs carefully" : "Decent profitability",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Revenue is the top line, net income is the bottom line</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Gross margin shows production efficiency</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Operating margin shows core business profitability</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Compare margins year-over-year for trends</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
