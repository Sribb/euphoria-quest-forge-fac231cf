import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const ALT3REITs = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "REITs Explained", content: (
        <div className="space-y-4">
          <p>A <strong>REIT</strong> (Real Estate Investment Trust) lets you invest in real estate like buying a stock.</p>
          <p>REITs must distribute <strong>90%+ of taxable income</strong> as dividends, making them income powerhouses.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🏢 Office REITs</div>
            <div className="p-3 rounded-lg bg-muted/40">🏬 Retail REITs (malls, shopping centers)</div>
            <div className="p-3 rounded-lg bg-muted/40">🏥 Healthcare REITs</div>
            <div className="p-3 rounded-lg bg-muted/40">📱 Data Center REITs</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "REIT Dividend Income", content: (
        <SliderSimulator
          title="REIT Income Calculator"
          description="See how much dividend income REITs can generate"
          sliders={[
            { id: "invested", label: "Amount Invested", min: 1000, max: 100000, step: 1000, defaultValue: 20000, unit: "$" },
            { id: "yield", label: "Dividend Yield", min: 2, max: 10, step: 0.5, defaultValue: 5, unit: "%" },
          ]}
          calculateResult={(v) => {
            const annual = v.invested * (v.yield / 100);
            const monthly = annual / 12;
            return {
              primary: `$${Math.round(annual).toLocaleString()}/year`,
              secondary: `$${Math.round(monthly).toLocaleString()}/month in dividends`,
              insight: v.yield > 7 ? "High yield — check if it's sustainable" : "Solid income stream from real estate exposure",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ REITs must pay 90%+ of income as dividends</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Trade on stock exchanges — fully liquid</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Dividends are taxed as ordinary income</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Diversify across REIT types for stability</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
