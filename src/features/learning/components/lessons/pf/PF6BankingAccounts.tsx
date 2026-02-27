import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const PF6BankingAccounts = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Banking & Savings Accounts",
      content: (
        <div className="space-y-4">
          <p>Choosing the right bank account can earn you <strong>hundreds of dollars</strong> per year — or cost you in fees.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🏦 <strong>Checking</strong> — daily spending, bill pay</div>
            <div className="p-3 rounded-lg bg-muted/40">💰 <strong>Savings</strong> — emergency fund, short-term goals</div>
            <div className="p-3 rounded-lg bg-muted/40">📈 <strong>High-Yield Savings</strong> — 10–25x more interest</div>
            <div className="p-3 rounded-lg bg-muted/40">⏰ <strong>CD</strong> — locked rate for a fixed term</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "APY Makes a Difference",
      content: (
        <SliderSimulator
          title="High-Yield vs Regular Savings"
          description="Compare what your money earns in different accounts"
          sliders={[
            { id: "balance", label: "Savings Balance", min: 1000, max: 50000, step: 1000, defaultValue: 10000, unit: "$" },
            { id: "apy", label: "APY (Annual %)", min: 0, max: 6, step: 0.25, defaultValue: 4.5, unit: "%" },
          ]}
          calculateResult={(v) => {
            const earned = v.balance * (v.apy / 100);
            const bigBank = v.balance * 0.01;
            return {
              primary: `$${Math.round(earned).toLocaleString()}/year`,
              secondary: `vs $${Math.round(bigBank).toLocaleString()}/year at a big bank (0.01% APY)`,
              insight: `That's $${Math.round(earned - bigBank).toLocaleString()} more per year just by switching!`,
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Use high-yield savings for your emergency fund</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Avoid accounts with monthly fees</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Keep only 1–2 months of expenses in checking</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ FDIC insures up to $250,000 per account</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
