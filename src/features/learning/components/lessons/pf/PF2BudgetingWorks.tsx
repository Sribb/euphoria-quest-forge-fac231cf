import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const PF2BudgetingWorks = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Budgeting That Actually Works",
      content: (
        <div className="space-y-4">
          <p>A budget isn't about restriction — it's about <strong>giving every dollar a job</strong>.</p>
          <p>The most popular framework is the <span className="text-primary font-semibold">50/30/20 rule</span>:</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-primary/10 text-center"><p className="text-2xl font-black">50%</p><p className="text-xs">Needs</p></div>
            <div className="p-3 rounded-xl bg-accent/10 text-center"><p className="text-2xl font-black">30%</p><p className="text-xs">Wants</p></div>
            <div className="p-3 rounded-xl bg-muted text-center"><p className="text-2xl font-black">20%</p><p className="text-xs">Savings</p></div>
          </div>
        </div>
      ),
    },
    {
      id: "sim",
      title: "Build Your Budget",
      content: (
        <SliderSimulator
          title="50/30/20 Budget Planner"
          description="Enter your monthly income to see the breakdown"
          sliders={[
            { id: "income", label: "Monthly Income", min: 1000, max: 10000, step: 250, defaultValue: 4000, unit: "$" },
          ]}
          calculateResult={(v) => ({
            primary: `Needs: $${(v.income * 0.5).toLocaleString()}`,
            secondary: `Wants: $${(v.income * 0.3).toLocaleString()} · Savings: $${(v.income * 0.2).toLocaleString()}`,
            insight: `Saving $${(v.income * 0.2).toLocaleString()}/mo = $${(v.income * 0.2 * 12).toLocaleString()}/year!`,
          })}
        />
      ),
    },
    {
      id: "sort",
      title: "Classify These Expenses",
      content: (
        <DragSortChallenge
          title="Needs vs Wants"
          description="Rank from most essential (top) to least essential (bottom)"
          items={[
            { id: "rent", label: "Rent / Housing" },
            { id: "food", label: "Groceries" },
            { id: "streaming", label: "Streaming Subscriptions" },
            { id: "insurance", label: "Health Insurance" },
            { id: "dining", label: "Dining Out" },
          ]}
          correctOrder={["rent", "insurance", "food", "dining", "streaming"]}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ 50% Needs · 30% Wants · 20% Savings</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Track spending for one month to find leaks</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Automate savings — pay yourself first</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ A budget is a plan, not a punishment</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
