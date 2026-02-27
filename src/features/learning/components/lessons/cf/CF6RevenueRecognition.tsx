import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const CF6RevenueRecognition = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Revenue Recognition",
      content: (
        <div className="space-y-4">
          <p><strong>When</strong> does a sale count as revenue? Not always when cash arrives.</p>
          <p>Under accrual accounting, revenue is recognized when it's <strong>earned</strong>, not when it's received.</p>
          <div className="p-4 rounded-xl bg-muted/40 border border-border mt-4">
            <p className="text-sm">Example: A gym sells a 12-month membership for $1,200. They recognize $100/month, not $1,200 upfront.</p>
          </div>
        </div>
      ),
    },
    {
      id: "sort",
      title: "When Is Revenue Recognized?",
      content: (
        <DragSortChallenge
          title="Revenue Timing"
          description="Rank from earliest to latest revenue recognition"
          items={[
            { id: "contract", label: "Contract signed" },
            { id: "delivered", label: "Product delivered" },
            { id: "invoiced", label: "Invoice sent" },
            { id: "paid", label: "Cash received" },
            { id: "earned", label: "Service performed" },
          ]}
          correctOrder={["contract", "earned", "delivered", "invoiced", "paid"]}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Revenue ≠ cash received</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Recognized when earned and realizable</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Subscription revenue is spread over the contract</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Aggressive recognition can inflate earnings</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
