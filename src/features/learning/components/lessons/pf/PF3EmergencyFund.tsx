import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const PF3EmergencyFund = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Your Financial Safety Net",
      content: (
        <div className="space-y-4">
          <p>An <strong>emergency fund</strong> is money set aside for life's surprises — job loss, medical bills, car repairs.</p>
          <p>Without one, a single unexpected expense can spiral into debt.</p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border">
            <p className="font-semibold">Rule of thumb: 3–6 months of essential expenses</p>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "How Much Do You Need?",
      content: (
        <SliderSimulator
          title="Emergency Fund Calculator"
          description="Calculate your ideal safety net"
          sliders={[
            { id: "expenses", label: "Monthly Expenses", min: 1000, max: 8000, step: 250, defaultValue: 3000, unit: "$" },
            { id: "months", label: "Months of Coverage", min: 1, max: 12, step: 1, defaultValue: 4, unit: " mo" },
          ]}
          calculateResult={(v) => ({
            primary: `$${(v.expenses * v.months).toLocaleString()}`,
            secondary: `${v.months} months of coverage at $${v.expenses.toLocaleString()}/mo`,
            insight: v.months < 3 ? "Aim for at least 3 months" : v.months >= 6 ? "Excellent cushion!" : "Solid target!",
          })}
        />
      ),
    },
    {
      id: "where",
      title: "Where to Keep It",
      content: (
        <div className="space-y-3">
          <p>Your emergency fund should be <strong>liquid</strong> (easy to access) but separate from everyday spending:</p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ High-yield savings account (best option)</div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Money market account</div>
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">❌ Not in stocks — too volatile</div>
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">❌ Not under your mattress — no interest</div>
          </div>
        </div>
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Start with $1,000 — then build to 3–6 months</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Keep it in a high-yield savings account</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Only use for true emergencies</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Replenish it after every withdrawal</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
