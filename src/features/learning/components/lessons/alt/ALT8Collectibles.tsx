import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const ALT8Collectibles = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Collectibles & Tangible Assets", content: (
        <div className="space-y-4">
          <p>Collectibles — art, wine, vintage cars, watches — can appreciate significantly over time.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🎨 Fine art — avg 7-10% annual return for top pieces</div>
            <div className="p-3 rounded-lg bg-muted/40">🍷 Wine — 5-8% for investment-grade vintages</div>
            <div className="p-3 rounded-lg bg-muted/40">⌚ Luxury watches — highly brand-dependent</div>
            <div className="p-3 rounded-lg bg-muted/40">🏎️ Classic cars — requires expertise and storage</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "Appreciation Calculator", content: (
        <SliderSimulator
          title="Collectible Appreciation"
          description="Estimate long-term value growth"
          sliders={[
            { id: "purchase", label: "Purchase Price", min: 500, max: 100000, step: 500, defaultValue: 5000, unit: "$" },
            { id: "rate", label: "Annual Appreciation", min: 0, max: 15, step: 1, defaultValue: 7, unit: "%" },
            { id: "years", label: "Hold Period", min: 1, max: 30, step: 1, defaultValue: 10, unit: " yrs" },
          ]}
          calculateResult={(v) => {
            const future = v.purchase * Math.pow(1 + v.rate / 100, v.years);
            const gain = future - v.purchase;
            return {
              primary: `$${Math.round(future).toLocaleString()} future value`,
              secondary: `$${Math.round(gain).toLocaleString()} gain (${((gain / v.purchase) * 100).toFixed(0)}%)`,
              insight: "Remember: storage, insurance, and authentication costs reduce real returns",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Collectibles require deep domain expertise</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Factor in storage, insurance, and maintenance costs</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Highly illiquid — selling takes time</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Buy what you love — financial return is a bonus</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
