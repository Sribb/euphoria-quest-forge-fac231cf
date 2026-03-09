import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";
import { RiskReturnExplorer } from "../../interactive/RiskReturnExplorer";

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
      title: "Build Your Portfolio Mix",
      content: (
        <RiskReturnExplorer
          title="🎯 Alternative Allocation Builder"
          description="Mix bonds, stocks, and crypto to see risk-return tradeoffs — imagine crypto as your 'alternatives' bucket."
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
