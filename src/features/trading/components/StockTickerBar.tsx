import { useQuery } from "@tanstack/react-query";
import { getQuote } from "@/lib/finnhub";
import { ArrowUp, ArrowDown } from "lucide-react";

const TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "SPY", "QQQ"];

const TickerItem = ({ symbol }: { symbol: string }) => {
  const { data: quote } = useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => getQuote(symbol),
    staleTime: 60000,
  });

  const price = quote?.c ?? 0;
  const change = quote?.dp ?? 0;
  const positive = change >= 0;

  return (
    <div className="flex items-center gap-3 flex-shrink-0 px-4">
      <span className="text-xs font-bold text-foreground">{symbol}</span>
      <span className="text-xs font-mono text-foreground/80">${price.toFixed(2)}</span>
      <div className={`flex items-center gap-0.5 ${positive ? "text-success" : "text-destructive"}`}>
        {positive ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
        <span className="text-[10px] font-semibold">{change.toFixed(2)}%</span>
      </div>
    </div>
  );
};

export const StockTickerBar = () => {
  return (
    <div className="w-full overflow-hidden border-b border-border/30 bg-muted/20 backdrop-blur-sm">
      <div className="flex items-center h-9 animate-marquee whitespace-nowrap">
        {/* Duplicate items for seamless scroll */}
        {[...TICKERS, ...TICKERS].map((s, i) => (
          <TickerItem key={`${s}-${i}`} symbol={s} />
        ))}
      </div>
    </div>
  );
};
