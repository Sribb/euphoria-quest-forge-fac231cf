import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const PF5GoodVsBadDebt = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Good Debt vs. Bad Debt",
      content: (
        <div className="space-y-4">
          <p>Not all debt is created equal. Some debt <strong>builds wealth</strong>, while other debt <strong>destroys it</strong>.</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="font-bold text-primary mb-2">Good Debt</p>
              <ul className="text-sm space-y-1"><li>🎓 Student loans</li><li>🏠 Mortgage</li><li>💼 Business loan</li></ul>
            </div>
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="font-bold text-destructive mb-2">Bad Debt</p>
              <ul className="text-sm space-y-1"><li>💳 Credit cards</li><li>🚗 Luxury car loans</li><li>🛍️ Consumer debt</li></ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "The Cost of Interest",
      content: (
        <SliderSimulator
          title="Interest Rate Comparison"
          description="See how interest rates change the total cost"
          sliders={[
            { id: "principal", label: "Amount Borrowed", min: 1000, max: 50000, step: 1000, defaultValue: 10000, unit: "$" },
            { id: "rate", label: "Interest Rate", min: 1, max: 30, step: 1, defaultValue: 5, unit: "%" },
            { id: "years", label: "Repayment Period", min: 1, max: 30, step: 1, defaultValue: 5, unit: " yrs" },
          ]}
          calculateResult={(v) => {
            const total = v.principal * Math.pow(1 + v.rate / 100, v.years);
            const interest = total - v.principal;
            return {
              primary: `$${Math.round(interest).toLocaleString()} in interest`,
              secondary: `Total repaid: $${Math.round(total).toLocaleString()}`,
              insight: v.rate > 15 ? "High-interest debt is an emergency — pay it off fast!" : "Lower rates mean manageable debt",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Good debt appreciates in value or earns more than it costs</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Bad debt depreciates and carries high interest</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Pay off highest-interest debt first (avalanche method)</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Avoid carrying credit card balances</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
