import { useQuery } from "@tanstack/react-query";
import { usePaperTrading } from "@/hooks/usePaperTrading";
import { getQuote, getCompanyProfile, tickerColor } from "@/lib/finnhub";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Briefcase, PieChart } from "lucide-react";
import { useState } from "react";

interface Props { onSelectStock: (s: string) => void; onSwitchTab: (t: string) => void; }

export const PortfolioTab = ({ onSelectStock, onSwitchTab }: Props) => {
  const { data, reset, isLoading } = usePaperTrading();
  const [showReset, setShowReset] = useState(false);
  const symbols = Object.keys(data.paper_holdings);

  // Fetch current prices for all holdings
  const { data: prices, isLoading: pricesLoading } = useQuery({
    queryKey: ["portfolio-prices", symbols.join(",")],
    queryFn: async () => {
      const results: Record<string, number> = {};
      for (const s of symbols) {
        const q = await getQuote(s);
        results[s] = q.c;
      }
      return results;
    },
    enabled: symbols.length > 0,
    staleTime: 60000,
  });

  const portfolioValue = symbols.reduce((sum, s) => {
    const price = prices?.[s] ?? data.paper_holdings[s].avgCost;
    return sum + data.paper_holdings[s].shares * price;
  }, 0) + data.paper_cash;

  const totalReturn = portfolioValue - 10000;
  const returnPct = ((portfolioValue - 10000) / 10000) * 100;
  const positive = totalReturn >= 0;

  if (isLoading) return <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Portfolio Value", value: `$${portfolioValue.toFixed(2)}`, icon: TrendingUp, color: "text-primary" },
          { label: "Total Return", value: `${positive ? '+' : ''}$${totalReturn.toFixed(2)} (${returnPct.toFixed(1)}%)`, icon: DollarSign, color: positive ? "text-success" : "text-destructive" },
          { label: "Cash Available", value: `$${data.paper_cash.toFixed(2)}`, icon: Briefcase, color: "text-foreground" },
          { label: "Open Positions", value: `${symbols.length}`, icon: PieChart, color: "text-foreground" },
        ].map((c) => (
          <div key={c.label} className="bg-card/60 border border-border rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-1">
              <c.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{c.label}</span>
            </div>
            <div className={`text-base font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Holdings */}
      {symbols.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="text-4xl">📊</div>
          <p className="font-semibold">No positions yet</p>
          <p className="text-sm text-muted-foreground">Head to Discover to make your first trade</p>
          <Button onClick={() => onSwitchTab("discover")} variant="outline">Explore Stocks</Button>
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-semibold mb-2">Your Positions</h3>
          <div className="space-y-1">
            {symbols.map((s) => (
              <HoldingRow key={s} symbol={s} holding={data.paper_holdings[s]} currentPrice={prices?.[s]} onSelect={onSelectStock} />
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="pt-4 text-center">
        {showReset ? (
          <div className="space-y-2 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <p className="text-sm">This will reset your cash to $10,000 and clear all positions and history. This cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <Button variant="destructive" size="sm" onClick={() => { reset(); setShowReset(false); }}>Confirm Reset</Button>
              <Button variant="outline" size="sm" onClick={() => setShowReset(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowReset(true)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Reset Portfolio</button>
        )}
      </div>
    </div>
  );
};

function HoldingRow({ symbol, holding, currentPrice, onSelect }: { symbol: string; holding: { shares: number; avgCost: number }; currentPrice?: number; onSelect: (s: string) => void }) {
  const { data: profile } = useQuery({ queryKey: ["profile", symbol], queryFn: () => getCompanyProfile(symbol), staleTime: 300000 });
  const price = currentPrice ?? holding.avgCost;
  const pnl = (price - holding.avgCost) * holding.shares;
  const pnlPct = ((price - holding.avgCost) / holding.avgCost) * 100;
  const positive = pnl >= 0;

  return (
    <button onClick={() => onSelect(symbol)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
      {profile?.logo ? (
        <img src={profile.logo} alt={symbol} className="w-9 h-9 rounded-full object-contain bg-white" />
      ) : (
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: tickerColor(symbol) }}>
          {symbol.slice(0, 2)}
        </div>
      )}
      <div className="flex-1 text-left">
        <div className="font-semibold text-sm">{symbol}</div>
        <div className="text-xs text-muted-foreground">{holding.shares} shares @ avg ${holding.avgCost.toFixed(2)}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">${(price * holding.shares).toFixed(2)}</div>
        <div className={`text-xs font-medium flex items-center justify-end gap-0.5 ${positive ? 'text-success' : 'text-destructive'}`}>
          {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {positive ? '+' : ''}${pnl.toFixed(2)} ({pnlPct.toFixed(1)}%)
        </div>
      </div>
    </button>
  );
}
