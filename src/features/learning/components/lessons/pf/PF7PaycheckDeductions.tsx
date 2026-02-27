import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const PF7PaycheckDeductions = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Understanding Your Paycheck",
      content: (
        <div className="space-y-4">
          <p>Your <strong>gross pay</strong> isn't what you take home. Several deductions reduce it to your <strong>net pay</strong>.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🏛️ <strong>Federal Income Tax</strong> — 10–37% depending on bracket</div>
            <div className="p-3 rounded-lg bg-muted/40">🏥 <strong>FICA</strong> — Social Security (6.2%) + Medicare (1.45%)</div>
            <div className="p-3 rounded-lg bg-muted/40">🏠 <strong>State Tax</strong> — varies by state (0–13%)</div>
            <div className="p-3 rounded-lg bg-muted/40">💊 <strong>Benefits</strong> — health insurance, 401(k)</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Paycheck Calculator",
      content: (
        <SliderSimulator
          title="Gross to Net Pay"
          description="See how deductions affect your take-home pay"
          sliders={[
            { id: "gross", label: "Annual Salary", min: 30000, max: 200000, step: 5000, defaultValue: 60000, unit: "$" },
            { id: "taxRate", label: "Effective Tax Rate", min: 10, max: 40, step: 1, defaultValue: 22, unit: "%" },
            { id: "k401", label: "401(k) Contribution", min: 0, max: 20, step: 1, defaultValue: 6, unit: "%" },
          ]}
          calculateResult={(v) => {
            const fica = v.gross * 0.0765;
            const tax = v.gross * (v.taxRate / 100);
            const retirement = v.gross * (v.k401 / 100);
            const net = v.gross - fica - tax - retirement;
            return {
              primary: `$${Math.round(net / 12).toLocaleString()}/month take-home`,
              secondary: `$${Math.round(tax).toLocaleString()} tax · $${Math.round(fica).toLocaleString()} FICA · $${Math.round(retirement).toLocaleString()} 401(k)`,
              insight: v.k401 > 0 ? `Your 401(k) saves ~$${Math.round(retirement * v.taxRate / 100).toLocaleString()} in taxes!` : "Consider contributing to a 401(k) for tax savings",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Gross pay ≠ take-home pay</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ FICA is 7.65% — unavoidable</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Pre-tax 401(k) contributions reduce taxable income</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Budget based on net pay, not gross</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
