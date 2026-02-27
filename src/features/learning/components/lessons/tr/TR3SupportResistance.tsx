import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";

export const TR3SupportResistance = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Support & Resistance", content: (
        <div className="space-y-4">
          <p><strong>Support</strong> is a price level where buying pressure prevents further decline. Think of it as a floor.</p>
          <p><strong>Resistance</strong> is where selling pressure prevents further rise. Think of it as a ceiling.</p>
          <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border">
            <div className="flex justify-between items-center"><span className="text-destructive font-bold">Resistance — $150</span><span>🚫 Sellers step in</span></div>
            <div className="h-8 flex items-center justify-center text-muted-foreground">↕ Trading range</div>
            <div className="flex justify-between items-center"><span className="text-primary font-bold">Support — $120</span><span>✅ Buyers step in</span></div>
          </div>
        </div>
      ),
    },
    {
      id: "rules", title: "Trading Rules", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-muted/40">📈 <strong>Buy near support</strong> — price bounces up</div>
          <div className="p-3 rounded-lg bg-muted/40">📉 <strong>Sell near resistance</strong> — price gets rejected</div>
          <div className="p-3 rounded-lg bg-muted/40">💥 <strong>Breakout</strong> — when price smashes through a level</div>
          <div className="p-3 rounded-lg bg-muted/40">🔄 <strong>Role reversal</strong> — broken resistance becomes support</div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mt-2">
            <p className="text-sm">💡 The more times a level is tested, the stronger it becomes — until it breaks.</p>
          </div>
        </div>
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Support = floor, Resistance = ceiling</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ More touches = stronger level</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Breakouts create new trading ranges</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Always set stops beyond key levels</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
