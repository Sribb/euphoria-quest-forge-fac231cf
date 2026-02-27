import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const CF8WorkingCapital = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Working Capital",
      content: (
        <div className="space-y-4">
          <p><strong>Working capital</strong> measures a company's ability to pay short-term obligations.</p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border mt-4">
            <p className="font-bold text-center">Working Capital = Current Assets − Current Liabilities</p>
          </div>
          <p className="text-sm text-muted-foreground">Positive = company can cover its bills. Negative = potential cash crunch.</p>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Working Capital Calculator",
      content: (
        <SliderSimulator
          title="Liquidity Check"
          description="Adjust current assets and liabilities"
          sliders={[
            { id: "ca", label: "Current Assets", min: 50000, max: 1000000, step: 25000, defaultValue: 500000, unit: "$" },
            { id: "cl", label: "Current Liabilities", min: 50000, max: 800000, step: 25000, defaultValue: 300000, unit: "$" },
          ]}
          calculateResult={(v) => {
            const wc = v.ca - v.cl;
            const ratio = (v.ca / v.cl).toFixed(2);
            return {
              primary: `$${wc.toLocaleString()} working capital`,
              secondary: `Current ratio: ${ratio}x`,
              insight: Number(ratio) > 2 ? "Very liquid — maybe too much idle cash?" : Number(ratio) < 1 ? "Warning: can't cover short-term debts!" : "Healthy liquidity position",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Working capital = short-term financial health</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Current ratio &gt; 1.5 is generally healthy</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Too much working capital = inefficient use of cash</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Monitor it quarterly for cash flow planning</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
