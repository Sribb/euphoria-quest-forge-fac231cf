import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const ALT5Commodities = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Commodities", content: (
        <div className="space-y-4">
          <p><strong>Commodities</strong> are raw materials traded on exchanges — oil, wheat, copper, natural gas.</p>
          <p>Their prices are driven by <strong>supply and demand</strong> fundamentals rather than company performance.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🛢️ Energy — oil, natural gas</div>
            <div className="p-3 rounded-lg bg-muted/40">🌾 Agriculture — wheat, corn, coffee</div>
            <div className="p-3 rounded-lg bg-muted/40">⛏️ Metals — copper, aluminum</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "Inflation Hedge Calculator", content: (
        <SliderSimulator
          title="🛡️ Commodity Inflation Hedge"
          description="Compare portfolio value with and without commodity allocation during inflation"
          sliders={[
            { id: "portfolio", label: "Portfolio Value", min: 10000, max: 200000, step: 5000, defaultValue: 50000, unit: "$" },
            { id: "commodityPct", label: "Commodity Allocation", min: 0, max: 30, step: 1, defaultValue: 10, unit: "%" },
            { id: "inflation", label: "Inflation Rate", min: 2, max: 12, step: 0.5, defaultValue: 6, unit: "%" },
          ]}
          calculateResult={(v) => {
            const stockReturn = 10 - v.inflation * 0.8; // stocks underperform during high inflation
            const commodityReturn = v.inflation * 1.2; // commodities tend to track inflation
            const blendedReturn = ((100 - v.commodityPct) / 100) * stockReturn + (v.commodityPct / 100) * commodityReturn;
            const pureStockValue = v.portfolio * (1 + stockReturn / 100);
            const blendedValue = v.portfolio * (1 + blendedReturn / 100);
            return {
              primary: `${blendedReturn.toFixed(1)}% blended return`,
              secondary: `Portfolio: $${Math.round(blendedValue).toLocaleString()} vs $${Math.round(pureStockValue).toLocaleString()} (stocks only)`,
              insight: v.inflation > 5 ? "Commodities shine during high inflation — they're a natural hedge!" : "In low inflation, stocks alone may outperform.",
            };
          }}
        />
      ),
    },
    {
      id: "sort", title: "Supply & Demand Factors", content: (
        <DragSortChallenge
          title="Price Impact"
          description="Rank from strongest price driver (top) to weakest (bottom)"
          items={[
            { id: "weather", label: "Severe weather / natural disaster" },
            { id: "geopolitics", label: "Geopolitical conflict (war)" },
            { id: "demand", label: "Global economic growth" },
            { id: "tech", label: "New extraction technology" },
            { id: "seasonal", label: "Seasonal patterns" },
          ]}
          correctOrder={["geopolitics", "weather", "demand", "seasonal", "tech"]}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Commodities are driven by supply/demand, not earnings</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Great inflation hedge — prices rise with costs</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Access via ETFs or commodity futures</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Highly cyclical — timing matters more than stocks</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
