import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const PF4CreditScores = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Understanding Credit Scores",
      content: (
        <div className="space-y-4">
          <p>Your <strong>credit score</strong> is a 3-digit number (300–850) that tells lenders how reliable you are with borrowed money.</p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="p-3 rounded-xl bg-destructive/10 text-center"><p className="font-bold">300–579</p><p className="text-xs">Poor</p></div>
            <div className="p-3 rounded-xl bg-accent/10 text-center"><p className="font-bold">580–739</p><p className="text-xs">Fair–Good</p></div>
            <div className="p-3 rounded-xl bg-primary/10 text-center"><p className="font-bold">740–850</p><p className="text-xs">Excellent</p></div>
          </div>
        </div>
      ),
    },
    {
      id: "factors",
      title: "What Affects Your Score?",
      content: (
        <div className="space-y-3">
          <p>Five factors determine your FICO score:</p>
          <div className="space-y-2">
            <div className="flex justify-between p-3 rounded-lg bg-muted/40"><span>Payment History</span><span className="font-bold text-primary">35%</span></div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/40"><span>Credit Utilization</span><span className="font-bold text-primary">30%</span></div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/40"><span>Length of History</span><span className="font-bold text-primary">15%</span></div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/40"><span>Credit Mix</span><span className="font-bold text-primary">10%</span></div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/40"><span>New Credit</span><span className="font-bold text-primary">10%</span></div>
          </div>
        </div>
      ),
    },
    {
      id: "sort",
      title: "Rank the Factors",
      content: (
        <DragSortChallenge
          title="Credit Score Factors"
          description="Rank from highest impact (top) to lowest (bottom)"
          items={[
            { id: "payment", label: "Payment History (35%)" },
            { id: "utilization", label: "Credit Utilization (30%)" },
            { id: "length", label: "Length of History (15%)" },
            { id: "mix", label: "Credit Mix (10%)" },
            { id: "new", label: "New Credit Inquiries (10%)" },
          ]}
          correctOrder={["payment", "utilization", "length", "mix", "new"]}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Always pay on time — it's 35% of your score</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Keep credit utilization below 30%</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Don't close old accounts unnecessarily</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Check your credit report annually for free</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
