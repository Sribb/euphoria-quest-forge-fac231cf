import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const CF7COGSMargins = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "COGS & Profit Margins",
      content: (
        <div className="space-y-4">
          <p><strong>Cost of Goods Sold (COGS)</strong> is the direct cost to produce what you sell — materials, labor, manufacturing.</p>
          <p>Lower COGS = higher <strong>gross margin</strong> = more money left for everything else.</p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border mt-4">
            <p className="text-sm font-medium">Gross Margin = (Revenue − COGS) ÷ Revenue × 100</p>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Margin Calculator",
      content: (
        <SliderSimulator
          title="Gross Margin Simulator"
          description="See how COGS impacts profitability"
          sliders={[
            { id: "revenue", label: "Revenue per Unit", min: 10, max: 500, step: 10, defaultValue: 100, unit: "$" },
            { id: "cogs", label: "COGS per Unit", min: 5, max: 400, step: 5, defaultValue: 40, unit: "$" },
            { id: "units", label: "Units Sold", min: 100, max: 10000, step: 100, defaultValue: 1000 },
          ]}
          calculateResult={(v) => {
            const margin = ((v.revenue - v.cogs) / v.revenue * 100).toFixed(1);
            const grossProfit = (v.revenue - v.cogs) * v.units;
            return {
              primary: `${margin}% gross margin`,
              secondary: `Gross profit: $${grossProfit.toLocaleString()}`,
              insight: Number(margin) > 50 ? "Software-like margins! Very efficient" : Number(margin) < 20 ? "Thin margins — volume is critical" : "Healthy margins for most industries",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ COGS = direct costs of production</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Gross margin shows pricing power</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Software companies have 70%+ margins; grocery stores ~25%</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Declining margins = red flag for investors</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
