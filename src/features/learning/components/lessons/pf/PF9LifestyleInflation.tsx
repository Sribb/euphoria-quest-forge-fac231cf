import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const PF9LifestyleInflation = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "The Lifestyle Inflation Trap",
      content: (
        <div className="space-y-4">
          <p><strong>Lifestyle inflation</strong> happens when your spending rises every time your income rises.</p>
          <p>You get a raise → you upgrade your car → bigger apartment → fancier dinners → and somehow you still have nothing saved.</p>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 mt-4">
            <p className="text-sm">⚠️ Earning more doesn't automatically mean building wealth</p>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Save Your Raise",
      content: (
        <SliderSimulator
          title="Raise Impact Calculator"
          description="What happens if you save part of every raise?"
          sliders={[
            { id: "salary", label: "Current Salary", min: 40000, max: 150000, step: 5000, defaultValue: 60000, unit: "$" },
            { id: "raise", label: "Annual Raise %", min: 1, max: 15, step: 1, defaultValue: 5, unit: "%" },
            { id: "savePercent", label: "% of Raise You Save", min: 0, max: 100, step: 10, defaultValue: 50, unit: "%" },
          ]}
          calculateResult={(v) => {
            const raiseAmount = v.salary * (v.raise / 100);
            const saved = raiseAmount * (v.savePercent / 100);
            const after10 = saved * ((Math.pow(1.07, 10) - 1) / 0.07);
            return {
              primary: `$${Math.round(saved).toLocaleString()}/year saved`,
              secondary: `Invested at 7% → $${Math.round(after10).toLocaleString()} in 10 years`,
              insight: v.savePercent >= 50 ? "Saving half your raise is a wealth-building superpower!" : "Try increasing the save percentage!",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Save at least 50% of every raise</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Wait 30 days before lifestyle upgrades</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Automate savings increases with pay bumps</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Wealth = what you keep, not what you earn</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
