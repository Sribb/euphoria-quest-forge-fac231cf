import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const TR9PaperTrading = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Paper Trading", content: (
        <div className="space-y-4">
          <p><strong>Paper trading</strong> means practicing trades with fake money in real market conditions. It's how every serious trader starts.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-primary/10">✅ Zero financial risk</div>
            <div className="p-3 rounded-lg bg-primary/10">✅ Test strategies in real-time</div>
            <div className="p-3 rounded-lg bg-primary/10">✅ Build confidence before going live</div>
            <div className="p-3 rounded-lg bg-muted/40">⚠️ Doesn't replicate emotional pressure of real money</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "P&L Simulator", content: (
        <SliderSimulator
          title="Trade Outcome Calculator"
          description="Simulate a trade to see potential P&L"
          sliders={[
            { id: "entry", label: "Entry Price", min: 10, max: 500, step: 5, defaultValue: 100, unit: "$" },
            { id: "exit", label: "Exit Price", min: 10, max: 500, step: 5, defaultValue: 115, unit: "$" },
            { id: "shares", label: "Shares", min: 1, max: 100, step: 1, defaultValue: 10 },
          ]}
          calculateResult={(v) => {
            const pnl = (v.exit - v.entry) * v.shares;
            const pct = ((v.exit - v.entry) / v.entry * 100).toFixed(1);
            return {
              primary: `${pnl >= 0 ? "+" : ""}$${pnl.toLocaleString()} P&L`,
              secondary: `${pct}% return on ${v.shares} shares`,
              insight: pnl > 0 ? "Winning trade! Would your stop loss have survived?" : pnl < 0 ? "Losing trade — was your stop loss in place?" : "Flat — commissions would make this a loss",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Paper trade for at least 3 months before real money</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Keep a trading journal — log every decision</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Track win rate and average risk/reward</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Our Trade tab lets you practice risk-free!</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
