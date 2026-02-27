import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const TR8RiskManagement = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Risk Management", content: (
        <div className="space-y-4">
          <p>The #1 rule of trading: <strong>protect your capital</strong>. Even the best strategy fails without risk management.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🎯 Never risk more than <strong>1–2%</strong> of your account per trade</div>
            <div className="p-3 rounded-lg bg-muted/40">📊 Use a <strong>risk/reward ratio</strong> of at least 1:2</div>
            <div className="p-3 rounded-lg bg-muted/40">🛑 Always set a <strong>stop loss</strong> before entering</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "Position Size Calculator", content: (
        <SliderSimulator
          title="Position Sizing"
          description="Calculate the right position size for your risk tolerance"
          sliders={[
            { id: "account", label: "Account Size", min: 1000, max: 100000, step: 1000, defaultValue: 25000, unit: "$" },
            { id: "risk", label: "Risk per Trade", min: 0.5, max: 5, step: 0.5, defaultValue: 1, unit: "%" },
            { id: "stopDist", label: "Stop Loss Distance", min: 1, max: 20, step: 1, defaultValue: 5, unit: "%" },
          ]}
          calculateResult={(v) => {
            const riskAmount = v.account * (v.risk / 100);
            const positionSize = riskAmount / (v.stopDist / 100);
            return {
              primary: `$${Math.round(positionSize).toLocaleString()} position size`,
              secondary: `Risking $${Math.round(riskAmount).toLocaleString()} (${v.risk}% of account)`,
              insight: v.risk > 2 ? "⚠️ Risking over 2% — aggressive!" : "Conservative risk — sustainable approach",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Risk 1–2% per trade maximum</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Position size = Risk amount ÷ Stop distance</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ A 50% loss requires a 100% gain to recover</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Surviving drawdowns is more important than big wins</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
