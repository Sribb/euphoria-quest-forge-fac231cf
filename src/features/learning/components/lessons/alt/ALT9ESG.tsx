import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const ALT9ESG = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "ESG Investing", content: (
        <div className="space-y-4">
          <p><strong>ESG</strong> (Environmental, Social, Governance) investing considers ethical factors alongside financial returns.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-primary/10">🌍 <strong>Environmental</strong> — carbon emissions, renewable energy, waste</div>
            <div className="p-3 rounded-lg bg-accent/10">👥 <strong>Social</strong> — labor practices, diversity, community impact</div>
            <div className="p-3 rounded-lg bg-muted/40">⚖️ <strong>Governance</strong> — board diversity, executive pay, transparency</div>
          </div>
        </div>
      ),
    },
    {
      id: "sort", title: "ESG Score Factors", content: (
        <DragSortChallenge
          title="ESG Priority"
          description="Rank by typical investor importance (most → least)"
          items={[
            { id: "carbon", label: "Carbon footprint reduction" },
            { id: "diversity", label: "Board diversity" },
            { id: "labor", label: "Fair labor practices" },
            { id: "transparency", label: "Financial transparency" },
            { id: "community", label: "Community engagement" },
          ]}
          correctOrder={["carbon", "transparency", "labor", "diversity", "community"]}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ ESG doesn't sacrifice returns — often enhances them</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ $30+ trillion in global ESG assets</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Watch for "greenwashing" — verify ESG claims</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ ESG ETFs make it easy to invest responsibly</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
