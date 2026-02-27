import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const TR1WhatIsTrading = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "What Is Trading?", content: (
        <div className="space-y-4">
          <p><strong>Trading</strong> is buying and selling financial assets over shorter timeframes to profit from price changes.</p>
          <p>Unlike investing (buy and hold), traders actively seek opportunities in market movements.</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="font-bold mb-1">Trading</p>
              <ul className="text-sm space-y-1"><li>⏱️ Days to weeks</li><li>📊 Technical analysis</li><li>⚡ Active management</li></ul>
            </div>
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <p className="font-bold mb-1">Investing</p>
              <ul className="text-sm space-y-1"><li>📅 Years to decades</li><li>📋 Fundamental analysis</li><li>🧘 Passive approach</li></ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sort", title: "Trading vs Investing", content: (
        <DragSortChallenge
          title="Classify the Approach"
          description="Rank from most trading-oriented (top) to most investing-oriented (bottom)"
          items={[
            { id: "day", label: "Day trading stocks" },
            { id: "swing", label: "Swing trading (1–2 weeks)" },
            { id: "growth", label: "Growth stock portfolio (5+ years)" },
            { id: "index", label: "Index fund buy-and-hold" },
            { id: "scalp", label: "Scalping (minutes)" },
          ]}
          correctOrder={["scalp", "day", "swing", "growth", "index"]}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Trading = short-term, active profit-seeking</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Higher potential returns but also higher risk</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Requires discipline, strategy, and risk management</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Most successful traders have strict rules</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
