import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";

export const TR2CandlestickBasics = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Candlestick Charts", content: (
        <div className="space-y-4">
          <p>Candlestick charts are the <strong>language of traders</strong>. Each candle shows four prices for a time period:</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-primary/10 text-center"><p className="font-bold">Open</p><p className="text-xs">Starting price</p></div>
            <div className="p-3 rounded-lg bg-primary/10 text-center"><p className="font-bold">Close</p><p className="text-xs">Ending price</p></div>
            <div className="p-3 rounded-lg bg-muted/40 text-center"><p className="font-bold">High</p><p className="text-xs">Top wick</p></div>
            <div className="p-3 rounded-lg bg-muted/40 text-center"><p className="font-bold">Low</p><p className="text-xs">Bottom wick</p></div>
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <div className="text-center"><div className="w-8 h-16 bg-primary/60 rounded mx-auto" /><p className="text-xs mt-1">Bullish (up)</p></div>
            <div className="text-center"><div className="w-8 h-16 bg-destructive/60 rounded mx-auto" /><p className="text-xs mt-1">Bearish (down)</p></div>
          </div>
        </div>
      ),
    },
    {
      id: "patterns", title: "Key Patterns", content: (
        <div className="space-y-3">
          <p>Single-candle patterns to recognize:</p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-muted/40"><strong>Doji</strong> — Open ≈ Close. Indecision in the market.</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Hammer</strong> — Small body, long lower wick. Potential reversal up.</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Shooting Star</strong> — Small body, long upper wick. Potential reversal down.</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Engulfing</strong> — Large candle swallows previous. Strong signal.</div>
          </div>
        </div>
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Green/bullish = close &gt; open</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Wicks show rejection of prices</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Patterns work best with volume confirmation</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Never trade a pattern in isolation</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
