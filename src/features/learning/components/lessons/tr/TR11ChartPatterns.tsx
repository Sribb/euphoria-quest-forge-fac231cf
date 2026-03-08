import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const TR11ChartPatterns = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Chart Patterns That Repeat",
      content: (
        <div className="space-y-4">
          <p>Price action creates recognizable shapes that traders have cataloged for over a century.</p>
          <p>Patterns fall into two categories:</p>
          <div className="grid gap-3 mt-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold">🔄 Continuation Patterns</p>
              <p className="text-sm text-muted-foreground mt-1">Flags, pennants, triangles — the trend pauses then resumes.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold">↩️ Reversal Patterns</p>
              <p className="text-sm text-muted-foreground mt-1">Head & shoulders, double tops/bottoms — the trend is about to change.</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">⚠️ No pattern is 100% reliable. Always use confirmation signals.</p>
        </div>
      ),
    },
    {
      id: "sort",
      title: "Classify the Patterns",
      content: (
        <DragSortChallenge
          title="Pattern Reliability"
          description="Rank these chart patterns from most to least reliable based on historical success rates."
          items={[
            { id: "hs", label: "Head & Shoulders — Classic reversal" },
            { id: "flag", label: "Bull Flag — Continuation after rally" },
            { id: "double", label: "Double Bottom — Reversal at support" },
            { id: "wedge", label: "Rising Wedge — Bearish breakdown" },
            { id: "pennant", label: "Pennant — Brief consolidation" },
          ]}
          correctOrder={["hs", "double", "flag", "wedge", "pennant"]}
        />
      ),
    },
    {
      id: "sim",
      title: "Pattern Breakout Calculator",
      content: (
        <SliderSimulator
          title="Measured Move Target"
          description="Chart patterns have 'measured move' targets based on the pattern height"
          sliders={[
            { id: "entry", label: "Breakout Entry Price", min: 10, max: 500, step: 1, defaultValue: 100, unit: "$" },
            { id: "height", label: "Pattern Height", min: 1, max: 50, step: 0.5, defaultValue: 15, unit: "$" },
            { id: "winrate", label: "Est. Success Rate", min: 40, max: 80, step: 5, defaultValue: 65, unit: "%" },
          ]}
          calculateResult={(v) => {
            const target = v.entry + v.height;
            const stopLoss = v.entry - (v.height * 0.5);
            const riskReward = v.height / (v.height * 0.5);
            const expectedValue = (v.winrate / 100 * v.height) - ((1 - v.winrate / 100) * v.height * 0.5);
            return {
              primary: `Target: $${target.toFixed(2)}`,
              secondary: `Stop loss: $${stopLoss.toFixed(2)} | R:R = ${riskReward.toFixed(1)}:1`,
              insight: expectedValue > 0
                ? `Positive expected value of $${expectedValue.toFixed(2)} per share`
                : "Negative expected value — consider passing on this trade.",
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
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Patterns repeat because human psychology repeats</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Measured moves give objective price targets</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Always set a stop loss based on pattern invalidation</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Volume confirmation increases pattern reliability</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
