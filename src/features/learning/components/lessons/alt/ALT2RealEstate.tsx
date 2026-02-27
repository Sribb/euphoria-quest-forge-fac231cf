import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const ALT2RealEstate = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Real Estate Investing", content: (
        <div className="space-y-4">
          <p>Real estate generates returns through <strong>rental income</strong> and <strong>property appreciation</strong>.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">🏠 Direct ownership (buy properties)</div>
            <div className="p-3 rounded-lg bg-muted/40">📈 REITs (buy shares of property portfolios)</div>
            <div className="p-3 rounded-lg bg-muted/40">🤝 Crowdfunding platforms</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "Rental Yield Calculator", content: (
        <SliderSimulator
          title="Rental Property Returns"
          description="Calculate your annual rental yield"
          sliders={[
            { id: "price", label: "Property Price", min: 100000, max: 1000000, step: 25000, defaultValue: 300000, unit: "$" },
            { id: "rent", label: "Monthly Rent", min: 500, max: 5000, step: 100, defaultValue: 2000, unit: "$" },
            { id: "expenses", label: "Monthly Expenses", min: 200, max: 2000, step: 100, defaultValue: 600, unit: "$" },
          ]}
          calculateResult={(v) => {
            const annual = (v.rent - v.expenses) * 12;
            const yield_ = (annual / v.price * 100).toFixed(1);
            return {
              primary: `${yield_}% net rental yield`,
              secondary: `$${annual.toLocaleString()}/year net income`,
              insight: Number(yield_) > 6 ? "Strong yield for real estate!" : Number(yield_) < 3 ? "Low yield — appreciation would need to carry returns" : "Average yield — typical for stable markets",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Real estate provides income + appreciation</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ REITs offer real estate exposure without buying property</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Always account for vacancy, repairs, and taxes</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Location is the #1 factor in real estate</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
