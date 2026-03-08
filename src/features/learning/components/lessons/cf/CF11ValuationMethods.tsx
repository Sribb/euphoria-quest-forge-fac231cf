import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const CF11ValuationMethods = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "How Companies Are Valued",
      content: (
        <div className="space-y-4">
          <p>Company valuation answers one question: <strong>"What is this business worth?"</strong></p>
          <p>Analysts use multiple methods because no single approach is perfect:</p>
          <div className="grid gap-3 mt-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold">📊 DCF (Discounted Cash Flow)</p>
              <p className="text-sm text-muted-foreground mt-1">Projects future cash flows and discounts them to present value.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold">📈 Comparable Company Analysis</p>
              <p className="text-sm text-muted-foreground mt-1">Compares multiples (P/E, EV/EBITDA) to similar public companies.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold">🏷️ Precedent Transactions</p>
              <p className="text-sm text-muted-foreground mt-1">Looks at prices paid for similar companies in past M&A deals.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sort",
      title: "Valuation Method Selection",
      content: (
        <DragSortChallenge
          title="When to Use Each Method"
          description="Rank these valuation methods from most to least appropriate for a stable, profitable company with predictable cash flows."
          items={[
            { id: "dcf", label: "DCF — Detailed cash flow projections" },
            { id: "comps", label: "Comparable Companies — Market multiples" },
            { id: "precedent", label: "Precedent Transactions — Past deals" },
            { id: "asset", label: "Asset-Based — Liquidation value" },
          ]}
          correctOrder={["dcf", "comps", "precedent", "asset"]}
        />
      ),
    },
    {
      id: "sim",
      title: "Simple DCF Calculator",
      content: (
        <SliderSimulator
          title="DCF Valuation"
          description="Estimate a company's value using discounted cash flows"
          sliders={[
            { id: "cashflow", label: "Annual Free Cash Flow", min: 100000, max: 10000000, step: 100000, defaultValue: 1000000, unit: "$" },
            { id: "growth", label: "Growth Rate", min: 0, max: 15, step: 0.5, defaultValue: 5, unit: "%" },
            { id: "discount", label: "Discount Rate", min: 5, max: 20, step: 0.5, defaultValue: 10, unit: "%" },
          ]}
          calculateResult={(v) => {
            const terminalMultiple = 1 / ((v.discount - v.growth) / 100);
            const value = v.cashflow * terminalMultiple;
            const peEquivalent = terminalMultiple;
            return {
              primary: `$${(value / 1000000).toFixed(1)}M`,
              secondary: `Implied P/E multiple: ${peEquivalent.toFixed(1)}x`,
              insight: v.growth >= v.discount
                ? "⚠️ Growth can't exceed discount rate in a perpetuity model!"
                : value > v.cashflow * 25
                  ? "High valuation — market expects strong sustained growth."
                  : "Conservative valuation — typical for mature businesses.",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ DCF is the gold standard for intrinsic value</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Comps give a quick market-based sanity check</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Higher growth rate = higher valuation (but more risk)</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Always use multiple methods and triangulate</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
