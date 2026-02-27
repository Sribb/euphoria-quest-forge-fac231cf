import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";

export const TR4TrendLines = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Trend Lines & Direction", content: (
        <div className="space-y-4">
          <p>A <strong>trend</strong> is the general direction of price movement. "The trend is your friend" is a core trading maxim.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-primary/10">📈 <strong>Uptrend</strong> — Higher highs + higher lows</div>
            <div className="p-3 rounded-lg bg-destructive/10">📉 <strong>Downtrend</strong> — Lower highs + lower lows</div>
            <div className="p-3 rounded-lg bg-muted/40">➡️ <strong>Sideways</strong> — Range-bound, no clear direction</div>
          </div>
        </div>
      ),
    },
    {
      id: "draw", title: "Drawing Trend Lines", content: (
        <div className="space-y-3">
          <p>To draw a valid trend line:</p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-muted/40">1️⃣ Connect at least <strong>2 swing lows</strong> (uptrend) or <strong>2 swing highs</strong> (downtrend)</div>
            <div className="p-3 rounded-lg bg-muted/40">2️⃣ The more touches, the more valid the line</div>
            <div className="p-3 rounded-lg bg-muted/40">3️⃣ A break of the trend line signals potential reversal</div>
            <div className="p-3 rounded-lg bg-muted/40">4️⃣ Steeper angles break more easily than gentle ones</div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-2">
            <p className="text-sm">💡 Trade in the direction of the trend on your timeframe</p>
          </div>
        </div>
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Trade with the trend, not against it</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Need at least 2 points to draw a trend line</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Trend line break ≠ instant reversal (wait for confirmation)</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Use multiple timeframes to confirm the trend</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
