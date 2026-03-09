import { BeginnerLessonTemplate, LessonSlide } from "../BeginnerLessonTemplate";
import { DragSortChallenge } from "../../interactive/DragSortChallenge";
import { SliderSimulator } from "../../interactive/SliderSimulator";

export const TR7OrderTypes = ({ onComplete }: { onComplete: () => void }) => {
  const slides: LessonSlide[] = [
    {
      id: "intro", title: "Order Types", content: (
        <div className="space-y-4">
          <p>How you enter a trade matters as much as what you trade. Different order types give you different levels of control.</p>
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-muted/40"><strong>Market Order</strong> — Buy/sell immediately at current price</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Limit Order</strong> — Buy/sell only at your specified price or better</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Stop Loss</strong> — Sell automatically if price drops to a level</div>
            <div className="p-3 rounded-lg bg-muted/40"><strong>Stop Limit</strong> — Combines stop trigger with a limit price</div>
          </div>
        </div>
      ),
    },
    {
      id: "sim", title: "Limit Order Savings", content: (
        <SliderSimulator
          title="💰 Market vs Limit Order"
          description="See how much a limit order can save you on slippage"
          sliders={[
            { id: "marketPrice", label: "Current Market Price", min: 10, max: 500, step: 5, defaultValue: 100, unit: "$" },
            { id: "limitPrice", label: "Your Limit Price", min: 10, max: 500, step: 1, defaultValue: 97, unit: "$" },
            { id: "shares", label: "Shares to Buy", min: 10, max: 500, step: 10, defaultValue: 100 },
          ]}
          calculateResult={(v) => {
            const savings = (v.marketPrice - v.limitPrice) * v.shares;
            const pctSaved = ((v.marketPrice - v.limitPrice) / v.marketPrice * 100).toFixed(1);
            return {
              primary: savings > 0 ? `$${savings.toLocaleString()} saved` : `$${Math.abs(savings).toLocaleString()} premium`,
              secondary: `Market: $${(v.marketPrice * v.shares).toLocaleString()} vs Limit: $${(v.limitPrice * v.shares).toLocaleString()}`,
              insight: savings > 0 ? `That's ${pctSaved}% better entry — patience pays!` : "Limit above market = you'd get filled at market price anyway.",
            };
          }}
        />
      ),
    },
    {
      id: "sort", title: "Speed vs Control", content: (
        <DragSortChallenge
          title="Order Type Ranking"
          description="Rank from fastest execution (top) to most price control (bottom)"
          items={[
            { id: "market", label: "Market Order (instant)" },
            { id: "stop", label: "Stop Loss (triggered)" },
            { id: "limit", label: "Limit Order (set price)" },
            { id: "stoplimit", label: "Stop Limit (most precise)" },
          ]}
          correctOrder={["market", "stop", "limit", "stoplimit"]}
        />
      ),
    },
    {
      id: "takeaways", title: "Key Takeaways", content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Market orders = speed, limit orders = price control</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Always use stop losses to manage risk</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Limit orders prevent overpaying in volatile markets</div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">✅ Practice with paper trading before using real money</div>
        </div>
      ),
    },
  ];
  return <BeginnerLessonTemplate slides={slides} onComplete={onComplete} />;
};
