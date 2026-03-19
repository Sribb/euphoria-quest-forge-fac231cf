import { usePaperTrading, PaperTrade } from "@/hooks/usePaperTrading";
import { TrendingUp } from "lucide-react";

export const HistoryTab = () => {
  const { data } = usePaperTrading();
  const trades = data.paper_trades;

  if (trades.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">No trades yet</p>
        <p className="text-sm text-muted-foreground">Make your first trade on the Discover tab.</p>
      </div>
    );
  }

  // Group by date
  const groups: Record<string, PaperTrade[]> = {};
  trades.forEach((t) => {
    const d = new Date(t.timestamp);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    let label: string;
    if (d.toDateString() === today.toDateString()) label = "Today";
    else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else label = d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([date, trades]) => (
        <div key={date}>
          <h4 className="text-xs font-bold text-muted-foreground mb-2.5 sticky top-0 bg-background py-1 tracking-wide uppercase">{date}</h4>
          <div className="space-y-1.5">
            {trades.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] bg-muted/15 border border-border/30">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${
                      t.type === "BUY"
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : 'bg-destructive/15 text-destructive border border-destructive/20'
                    }`}>
                      {t.type}
                    </span>
                    <span className="font-bold text-sm">{t.symbol}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{t.shares} shares @ ${t.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold tabular-nums">${t.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(t.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                  {t.type === "SELL" && t.pnl !== undefined && (
                    <div className={`text-xs font-semibold tabular-nums ${t.pnl >= 0 ? 'text-emerald-400' : 'text-destructive'}`}>
                      {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};