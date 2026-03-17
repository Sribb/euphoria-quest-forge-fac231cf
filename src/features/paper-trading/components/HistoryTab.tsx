import { usePaperTrading, PaperTrade } from "@/hooks/usePaperTrading";
import { Badge } from "@/components/ui/badge";

export const HistoryTab = () => {
  const { data } = usePaperTrading();
  const trades = data.paper_trades;

  if (trades.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="text-4xl">📋</div>
        <p className="font-semibold">No trades yet</p>
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
    <div className="space-y-4">
      {Object.entries(groups).map(([date, trades]) => (
        <div key={date}>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 sticky top-0 bg-background py-1">{date}</h4>
          <div className="space-y-1">
            {trades.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg bg-card/40">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] px-1.5 py-0 ${t.type === "BUY" ? 'bg-success/20 text-success border-success/30' : 'bg-destructive/20 text-destructive border-destructive/30'}`}>
                      {t.type}
                    </Badge>
                    <span className="font-bold text-sm">{t.symbol}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.shares} shares @ ${t.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${t.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(t.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                  {t.type === "SELL" && t.pnl !== undefined && (
                    <div className={`text-xs font-medium ${t.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
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
