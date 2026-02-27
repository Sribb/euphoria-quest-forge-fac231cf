import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const TR5VolumeAnalysis = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Volume Analysis", content: (
        <div className="space-y-4">
          <p><strong>Volume</strong> is the number of shares traded in a period. It confirms price movements.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-primary/10">📈 Price up + high volume = <strong>strong bullish signal</strong></div>
            <div className="p-3 rounded-lg bg-destructive/10">📉 Price down + high volume = <strong>strong bearish signal</strong></div>
            <div className="p-3 rounded-lg bg-muted/40">📈 Price up + low volume = <strong>weak move, be cautious</strong></div>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "Volume-Price Relationship", content: (
        <SliderSimulator
          title="Volume Signal Strength"
          description="See how volume affects signal reliability"
          sliders={[
            { id: "price", label: "Price Change (%)", min: -10, max: 10, step: 1, defaultValue: 3, unit: "%" },
            { id: "volume", label: "Volume vs Average", min: 50, max: 500, step: 25, defaultValue: 150, unit: "%" },
          ]}
          calculateResult={(v) => {
            const strength = Math.abs(v.price) * (v.volume / 100);
            const direction = v.price > 0 ? "Bullish" : v.price < 0 ? "Bearish" : "Neutral";
            return {
              primary: `${direction} — ${strength.toFixed(1)} signal strength`,
              secondary: `${v.volume}% of average volume`,
              insight: v.volume > 200 ? "Unusually high volume — institutional activity likely!" : v.volume < 75 ? "Low volume — move may not sustain" : "Normal volume confirmation",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Volume confirms price direction</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ High volume = conviction, low volume = doubt</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Volume spikes often precede big moves</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Divergence (price up, volume down) = warning</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
