import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const ALT6Crypto = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Cryptocurrency Basics", content: (
        <div className="space-y-4">
          <p><strong>Cryptocurrency</strong> is digital money secured by cryptography on decentralized networks (blockchains).</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40">₿ <strong>Bitcoin</strong> — digital gold, store of value</div>
            <div className="p-3 rounded-lg bg-muted/40">⟠ <strong>Ethereum</strong> — programmable blockchain, smart contracts</div>
            <div className="p-3 rounded-lg bg-muted/40">🪙 <strong>Stablecoins</strong> — pegged to USD (USDC, USDT)</div>
          </div>
          <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 mt-2">
            <p className="text-sm">⚠️ Crypto is extremely volatile — only invest what you can afford to lose</p>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "Volatility Comparison", content: (
        <SliderSimulator
          title="Crypto vs Traditional Assets"
          description="Compare potential swings over a year"
          sliders={[
            { id: "invested", label: "Amount Invested", min: 1000, max: 50000, step: 1000, defaultValue: 5000, unit: "$" },
            { id: "volatility", label: "Annual Volatility %", min: 10, max: 100, step: 5, defaultValue: 60, unit: "%" },
          ]}
          calculateResult={(v) => {
            const bestCase = v.invested * (1 + v.volatility / 100);
            const worstCase = v.invested * (1 - v.volatility / 100);
            return {
              primary: `Range: $${Math.round(Math.max(0, worstCase)).toLocaleString()} – $${Math.round(bestCase).toLocaleString()}`,
              secondary: `S&P 500 typical range: $${Math.round(v.invested * 0.85).toLocaleString()} – $${Math.round(v.invested * 1.15).toLocaleString()}`,
              insight: v.volatility > 50 ? "That's 3-4x more volatile than stocks!" : "Lower than typical crypto volatility",
            };
          }}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Crypto is speculative — not a stable investment</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Bitcoin and Ethereum are the most established</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Keep crypto to 1–5% of portfolio max</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Use cold wallets for security; never share keys</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
