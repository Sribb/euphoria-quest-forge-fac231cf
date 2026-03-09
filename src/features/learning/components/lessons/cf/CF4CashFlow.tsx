import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const CF4CashFlow = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Cash Flow Statement",
      content: (
        <div className="space-y-4">
          <p>The cash flow statement tracks <strong>actual money</strong> moving in and out of a company. Profit on paper doesn't always mean cash in the bank.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-primary/10">🏭 <strong>Operating</strong> — from core business</div>
            <div className="p-3 rounded-lg bg-accent/10">🏗️ <strong>Investing</strong> — buying/selling assets</div>
            <div className="p-3 rounded-lg bg-muted/40">💳 <strong>Financing</strong> — debt & equity</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Free Cash Flow Calculator",
      content: (
        <SliderSimulator
          title="💵 Free Cash Flow"
          description="Calculate FCF — the money a company has left after keeping the business running"
          sliders={[
            { id: "opCash", label: "Operating Cash Flow", min: 50000, max: 1000000, step: 25000, defaultValue: 400000, unit: "$" },
            { id: "capex", label: "Capital Expenditures", min: 0, max: 500000, step: 25000, defaultValue: 150000, unit: "$" },
            { id: "revenue", label: "Total Revenue", min: 200000, max: 2000000, step: 50000, defaultValue: 800000, unit: "$" },
          ]}
          calculateResult={(v) => {
            const fcf = v.opCash - v.capex;
            const fcfMargin = ((fcf / v.revenue) * 100).toFixed(1);
            return {
              primary: `$${fcf.toLocaleString()} Free Cash Flow`,
              secondary: `FCF Margin: ${fcfMargin}% of revenue`,
              insight: Number(fcfMargin) > 20 ? "Excellent FCF generation — cash cow!" : fcf < 0 ? "⚠️ Negative FCF — company is burning cash" : "Decent cash generation",
            };
          }}
        />
      ),
    },
    {
      id: "sort",
      title: "Classify These Activities",
      content: (
        <DragSortChallenge
          title="Cash Flow Categories"
          description="Rank: Operating → Investing → Financing (most core to least)"
          items={[
            { id: "ops", label: "Revenue from customers" },
            { id: "inv", label: "Purchasing new equipment" },
            { id: "fin", label: "Issuing new shares" },
            { id: "ops2", label: "Paying employee salaries" },
            { id: "fin2", label: "Repaying a bank loan" },
          ]}
          correctOrder={["ops", "ops2", "inv", "fin", "fin2"]}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Cash flow ≠ profit — a profitable company can run out of cash</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Strong operating cash flow = healthy core business</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Negative investing CF often means growth spending</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Free Cash Flow = Operating CF − Capital Expenditures</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
