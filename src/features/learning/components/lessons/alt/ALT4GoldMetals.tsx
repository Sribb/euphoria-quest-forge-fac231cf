import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const ALT4GoldMetals = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Gold & Precious Metals", content: (
        <div className="space-y-4">
          <p>Gold has been a <strong>store of value</strong> for thousands of years. It's the classic "safe haven" during uncertainty.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🥇 <strong>Gold</strong> — inflation hedge, crisis safe haven</div>
            <div className="p-3 rounded-lg bg-muted/40">🥈 <strong>Silver</strong> — industrial + precious metal</div>
            <div className="p-3 rounded-lg bg-muted/40">💎 <strong>Platinum</strong> — rarer, industrial uses</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Ways to invest: ETFs (GLD), mining stocks, physical bullion</p>
        </div>
      ),
    },
    {
      id: "sim", title: "Gold Allocation", content: (
        <SliderSimulator
          title="Portfolio Gold Allocation"
          description="See how gold allocation affects portfolio stability"
          sliders={[
            { id: "portfolio", label: "Total Portfolio", min: 10000, max: 500000, step: 10000, defaultValue: 100000, unit: "$" },
            { id: "goldPct", label: "Gold Allocation", min: 0, max: 30, step: 1, defaultValue: 10, unit: "%" },
          ]}
          calculateResult={(v) => {
            const goldValue = v.portfolio * (v.goldPct / 100);
            const stockValue = v.portfolio - goldValue;
            return {
              primary: `$${goldValue.toLocaleString()} in gold`,
              secondary: `$${stockValue.toLocaleString()} in other assets`,
              insight: v.goldPct > 20 ? "Heavy allocation — gold doesn't produce income" : v.goldPct < 5 ? "Small hedge — may not provide meaningful protection" : "5-15% is the commonly recommended range",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Gold is a hedge, not a growth investment</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ 5–15% allocation is typical</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Gold tends to rise when stocks fall</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ ETFs are the easiest way to own gold</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
