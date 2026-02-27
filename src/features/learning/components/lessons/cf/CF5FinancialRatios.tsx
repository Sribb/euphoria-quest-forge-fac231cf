import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const CF5FinancialRatios = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Financial Ratios",
      content: (
        <div className="space-y-4">
          <p>Ratios turn raw numbers into <strong>comparable metrics</strong>. They let you evaluate any company regardless of size.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40"><strong>P/E Ratio</strong> — Price ÷ Earnings per share</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>ROE</strong> — Net Income ÷ Equity</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Current Ratio</strong> — Current Assets ÷ Current Liabilities</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Debt/Equity</strong> — Total Debt ÷ Total Equity</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Ratio Calculator",
      content: (
        <SliderSimulator
          title="Key Ratio Calculator"
          description="Input company financials to compute ratios"
          sliders={[
            { id: "netIncome", label: "Net Income", min: 10000, max: 500000, step: 10000, defaultValue: 100000, unit: "$" },
            { id: "equity", label: "Total Equity", min: 50000, max: 2000000, step: 50000, defaultValue: 500000, unit: "$" },
            { id: "debt", label: "Total Debt", min: 0, max: 1000000, step: 50000, defaultValue: 200000, unit: "$" },
          ]}
          calculateResult={(v) => {
            const roe = ((v.netIncome / v.equity) * 100).toFixed(1);
            const de = (v.debt / v.equity).toFixed(2);
            return {
              primary: `ROE: ${roe}%`,
              secondary: `Debt/Equity: ${de}x`,
              insight: Number(roe) > 15 ? "Strong ROE — efficient use of equity!" : "Below average ROE — room to improve",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Ratios make companies comparable</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ ROE measures return on shareholder investment</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ High D/E ratio = more leverage risk</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Always compare ratios within the same industry</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
