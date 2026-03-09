import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { BudgetImpactSimulator } from "../../interactive/BudgetImpactSimulator";

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
      title: "Can You Resist the Creep?",
      content: (
        <BudgetImpactSimulator
          title="🎯 Lifestyle Creep Simulator"
          description="Imagine you just got a raise to $6,000/month. Allocate your budget — can you keep savings at 20%+?"
          monthlyIncome={6000}
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
