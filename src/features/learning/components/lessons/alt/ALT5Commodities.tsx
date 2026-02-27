import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const ALT5Commodities = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Commodities", content: (
        <div className="space-y-4">
          <p><strong>Commodities</strong> are raw materials traded on exchanges — oil, wheat, copper, natural gas.</p>
          <p>Their prices are driven by <strong>supply and demand</strong> fundamentals rather than company performance.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🛢️ Energy — oil, natural gas</div>
            <div className="p-3 rounded-lg bg-muted/40">🌾 Agriculture — wheat, corn, coffee</div>
            <div className="p-3 rounded-lg bg-muted/40">⛏️ Metals — copper, aluminum</div>
          </div>
        </div>
      ),
    },
    {
      id: "sort", title: "Supply & Demand Factors", content: (
        <DragSortChallenge
          title="Price Impact"
          description="Rank from strongest price driver (top) to weakest (bottom)"
          items={[
            { id: "weather", label: "Severe weather / natural disaster" },
            { id: "geopolitics", label: "Geopolitical conflict (war)" },
            { id: "demand", label: "Global economic growth" },
            { id: "tech", label: "New extraction technology" },
            { id: "seasonal", label: "Seasonal patterns" },
          ]}
          correctOrder={["geopolitics", "weather", "demand", "seasonal", "tech"]}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Commodities are driven by supply/demand, not earnings</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Great inflation hedge — prices rise with costs</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Access via ETFs or commodity futures</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Highly cyclical — timing matters more than stocks</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
