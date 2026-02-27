import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const TR6MovingAverages = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Moving Averages", content: (
        <div className="space-y-4">
          <p>A <strong>moving average</strong> smooths price data to reveal the underlying trend.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40"><strong>SMA</strong> — Simple Moving Average. Equal weight to all periods.</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>EMA</strong> — Exponential MA. More weight to recent prices.</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Common periods: 20 (short-term), 50 (medium), 200 (long-term)</p>
        </div>
      ),
    },
    {
      id: "sim", title: "MA Period Impact", content: (
        <SliderSimulator
          title="Moving Average Sensitivity"
          description="See how the period affects responsiveness"
          sliders={[
            { id: "period", label: "MA Period (days)", min: 5, max: 200, step: 5, defaultValue: 50 },
            { id: "volatility", label: "Market Volatility", min: 1, max: 10, step: 1, defaultValue: 5 },
          ]}
          calculateResult={(v) => {
            const lag = (v.period / 2).toFixed(0);
            const smoothing = Math.min(100, v.period * 0.5).toFixed(0);
            return {
              primary: `${lag}-day lag · ${smoothing}% noise reduction`,
              secondary: v.period <= 20 ? "Fast — good for short-term trading" : v.period >= 100 ? "Slow — best for long-term trends" : "Medium-term trend following",
              insight: v.volatility > 7 ? "High volatility? Use longer periods to filter noise" : "Lower volatility allows shorter MAs",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Short MA crosses above long MA = Golden Cross (bullish)</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Short MA crosses below long MA = Death Cross (bearish)</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ 200-day MA is the most watched by institutions</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ MAs are lagging indicators — they confirm, not predict</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
