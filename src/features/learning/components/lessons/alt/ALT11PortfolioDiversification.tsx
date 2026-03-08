import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const ALT11PortfolioDiversification = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro",
      title: "Alternatives in Your Portfolio",
      content: (
        <div className="space-y-4">
          <p>Alternative assets shine when traditional markets struggle. They provide <strong>diversification</strong> — returns that don't move in lockstep with stocks.</p>
          <p>The key metric is <strong>correlation</strong>: how closely two assets move together.</p>
          <div className="grid gap-3 mt-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="text-sm"><strong>Correlation +1.0</strong> — Moves identically (no diversification benefit)</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="text-sm"><strong>Correlation 0.0</strong> — No relationship (good diversification)</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border">
              <p className="text-sm"><strong>Correlation -1.0</strong> — Moves opposite (perfect hedge)</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sort",
      title: "Correlation with Stocks",
      content: (
        <DragSortChallenge
          title="Rank by Diversification Benefit"
          description="Rank these alternative assets from lowest correlation with stocks (best diversifier) to highest."
          items={[
            { id: "gold", label: "Gold — Traditional safe haven" },
            { id: "reits", label: "REITs — Real estate exposure" },
            { id: "crypto", label: "Crypto — Digital assets" },
            { id: "timber", label: "Timberland — Natural resource" },
            { id: "pe", label: "Private Equity — Unlisted companies" },
          ]}
          correctOrder={["timber", "gold", "crypto", "reits", "pe"]}
        />
      ),
    },
    {
      id: "sim",
      title: "Alternative Allocation Builder",
      content: (
        <SliderSimulator
          title="Portfolio Mix Simulator"
          description="See how adding alternatives affects your risk-return profile"
          sliders={[
            { id: "stocks", label: "Stocks Allocation", min: 0, max: 100, step: 5, defaultValue: 60, unit: "%" },
            { id: "bonds", label: "Bonds Allocation", min: 0, max: 100, step: 5, defaultValue: 30, unit: "%" },
            { id: "alts", label: "Alternatives Allocation", min: 0, max: 100, step: 5, defaultValue: 10, unit: "%" },
          ]}
          calculateResult={(v) => {
            const total = v.stocks + v.bonds + v.alts;
            const expectedReturn = (v.stocks * 10 + v.bonds * 4 + v.alts * 7) / Math.max(total, 1);
            const risk = Math.sqrt(v.stocks * v.stocks * 0.16 * 0.16 + v.bonds * v.bonds * 0.04 * 0.04 + v.alts * v.alts * 0.12 * 0.12) / Math.max(total, 1) * 100;
            const sharpe = risk > 0 ? ((expectedReturn - 2) / risk).toFixed(2) : "N/A";
            return {
              primary: `${expectedReturn.toFixed(1)}% expected return`,
              secondary: total !== 100
                ? `⚠️ Allocations total ${total}% — should be 100%`
                : `Est. volatility: ${risk.toFixed(1)}% | Sharpe: ${sharpe}`,
              insight: v.alts >= 15
                ? "Solid alternative allocation — institutional investors often use 15-30%."
                : v.alts > 0
                  ? "Even a small alternatives allocation can reduce portfolio volatility."
                  : "Consider adding 5-15% alternatives for better diversification.",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways",
      title: "Key Takeaways",
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Low correlation = better diversification benefit</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Institutional portfolios allocate 15-30% to alternatives</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Alternatives can reduce volatility without sacrificing returns</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Liquidity trade-off: many alternatives are harder to sell quickly</div>
        </div>
      ),
    },
  ];

  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
