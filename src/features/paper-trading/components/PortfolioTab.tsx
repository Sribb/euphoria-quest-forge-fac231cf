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

  if (isLoading) return <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-[12px]" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Portfolio Value", value: `$${portfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-primary" },
          { label: "Total Return", value: `${positive ? '+' : ''}$${totalReturn.toFixed(2)} (${returnPct.toFixed(1)}%)`, icon: DollarSign, color: positive ? "text-emerald-400" : "text-destructive" },
          { label: "Cash Available", value: `$${data.paper_cash.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: Briefcase, color: "text-foreground" },
          { label: "Open Positions", value: `${symbols.length}`, icon: PieChart, color: "text-foreground" },
        ].map((c) => (
          <div key={c.label} className="bg-muted/20 border border-border/40 rounded-[12px] p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <c.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground font-medium">{c.label}</span>
            </div>
            <div className={`text-base font-bold tabular-nums ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Holdings */}
      {symbols.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground">No trades yet</p>
          <p className="text-sm text-muted-foreground">Make your first trade and start building your portfolio</p>
          <Button onClick={() => onSwitchTab("discover")} variant="gradient" className="rounded-xl mt-2">
            Make Your First Trade
          </Button>
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground mb-3 tracking-wide uppercase">Your Positions</h3>
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
          <div className="space-y-3 bg-destructive/5 border border-destructive/20 rounded-[12px] p-5">
            <p className="text-sm text-muted-foreground">This will reset your cash to $10,000 and clear all positions and history. This cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <Button variant="destructive" size="sm" className="rounded-[8px]" onClick={() => { reset(); setShowReset(false); }}>Confirm Reset</Button>
              <Button variant="outline" size="sm" className="rounded-[8px]" onClick={() => setShowReset(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowReset(true)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
            Reset Portfolio
          </button>
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
    <button onClick={() => onSelect(symbol)} className="w-full flex items-center gap-3 px-3 py-3 rounded-[12px] hover:bg-muted/20 transition-all">
      {profile?.logo ? (
        <img src={profile.logo} alt={symbol} className="w-9 h-9 rounded-[8px] object-contain bg-white/10 p-0.5" />
      ) : (
        <div className="w-9 h-9 rounded-[8px] flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: tickerColor(symbol) }}>
          {symbol.slice(0, 2)}
        </div>
      )}
      <div className="flex-1 text-left">
        <div className="font-semibold text-sm">{symbol}</div>
        <div className="text-xs text-muted-foreground">{holding.shares} shares @ avg ${holding.avgCost.toFixed(2)}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold tabular-nums">${(price * holding.shares).toFixed(2)}</div>
        <div className={`text-xs font-semibold flex items-center justify-end gap-0.5 tabular-nums ${positive ? 'text-emerald-400' : 'text-destructive'}`}>
          {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {positive ? '+' : ''}${pnl.toFixed(2)} ({pnlPct.toFixed(1)}%)
        </div>
      </div>
    </button>
  );
}