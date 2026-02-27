import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";

export const CF4CashFlow = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Cash Flow Statement",
      content: (
        <div className="space-y-4">
          <p>The cash flow statement tracks <strong>actual money</strong> moving in and out of a company. Profit on paper doesn't always mean cash in the bank.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-primary/10">🏭 <strong>Operating</strong> — from core business</div>
            <div className="p-3 rounded-lg bg-accent/10">🏗️ <strong>Investing</strong> — buying/selling assets</div>
            <div className="p-3 rounded-lg bg-muted/40">💳 <strong>Financing</strong> — debt & equity</div>
          </div>
        </div>
      ),
    },
    {
      id: "sort",
      title: "Classify These Activities",
      content: (
        <DragSortChallenge
          title="Cash Flow Categories"
          description="Rank: Operating → Investing → Financing (most core to least)"
          items={[
            { id: "ops", label: "Revenue from customers" },
            { id: "inv", label: "Purchasing new equipment" },
            { id: "fin", label: "Issuing new shares" },
            { id: "ops2", label: "Paying employee salaries" },
            { id: "fin2", label: "Repaying a bank loan" },
          ]}
          correctOrder={["ops", "ops2", "inv", "fin", "fin2"]}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Cash flow ≠ profit — a profitable company can run out of cash</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Strong operating cash flow = healthy core business</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Negative investing CF often means growth spending</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Free Cash Flow = Operating CF − Capital Expenditures</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
