import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const PF8FinancialGoals = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Setting Financial Goals",
      content: (
        <div className="space-y-4">
          <p>Goals without a plan are just wishes. Use the <strong>SMART</strong> framework:</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40"><strong>S</strong>pecific — "Save $5,000" not "save more"</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>M</strong>easurable — track progress monthly</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>A</strong>chievable — stretch but realistic</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>R</strong>elevant — aligned with your values</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>T</strong>ime-bound — set a deadline</div>
          </div>
        </div>
      ),
    },
    {
      id: "sort",
      title: "Prioritize These Goals",
      content: (
        <DragSortChallenge
          title="Goal Priority"
          description="Rank from highest financial priority (top) to lowest (bottom)"
          items={[
            { id: "emergency", label: "Build emergency fund" },
            { id: "highdebt", label: "Pay off high-interest debt" },
            { id: "retirement", label: "Start retirement savings" },
            { id: "vacation", label: "Save for vacation" },
            { id: "luxury", label: "Buy a luxury watch" },
          ]}
          correctOrder={["highdebt", "emergency", "retirement", "vacation", "luxury"]}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Use SMART goals for clarity</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Eliminate high-interest debt first</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Build emergency fund before investing</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Balance short-term wants with long-term needs</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
