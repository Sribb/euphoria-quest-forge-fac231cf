import { useQuery } from "@tanstack/react-query";
import { getQuote, getCompanyProfile } from "@/lib/finnhub";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "SPY", "QQQ", "BTC-USD"];

interface TickerCardProps {
  symbol: string;
  onSelect: (s: string) => void;
}

const TickerCard = ({ symbol, onSelect }: TickerCardProps) => {
  const { data: quote, isLoading } = useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => getQuote(symbol),
    staleTime: 60000,
  });

  if (isLoading) return <Skeleton className="w-36 h-20 rounded-xl flex-shrink-0" />;

  const price = quote?.c ?? 0;
  const change = quote?.dp ?? 0;
  const positive = change >= 0;

  return (
    <motion.button
      onClick={() => onSelect(symbol)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex-shrink-0 w-36 p-3.5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm hover:border-border/70 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-foreground">{symbol}</span>
        <div className={`flex items-center gap-0.5 ${positive ? "text-success" : "text-destructive"}`}>
          {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          <span className="text-[10px] font-semibold">{change.toFixed(2)}%</span>
        </div>
      </div>
      <p className="text-sm font-bold text-foreground">${price.toFixed(2)}</p>
      {/* Mini sparkline bar */}
      <div className="mt-2 h-1 rounded-full bg-muted/50 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${positive ? "bg-success" : "bg-destructive"}`}
          style={{ width: `${Math.min(100, Math.abs(change) * 10 + 30)}%` }}
        />
      </div>
    </motion.button>
  );
};

interface MarketTickerProps {
  onSelect: (symbol: string) => void;
}

export const MarketTicker = ({ onSelect }: MarketTickerProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">Market</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {TICKERS.map((s) => (
          <TickerCard key={s} symbol={s} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};
