import { useQuery } from "@tanstack/react-query";
import { getQuote } from "@/lib/finnhub";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const TICKERS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "SPY", "QQQ"];

const TickerItem = ({ symbol }: { symbol: string }) => {
  const { data: quote } = useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => getQuote(symbol),
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  const price = quote?.c ?? 0;
  const change = quote?.dp ?? 0;
  const positive = change >= 0;

  return (
    <div className="flex items-center gap-3 flex-shrink-0 px-5">
      <span className="text-xs font-bold text-foreground">{symbol}</span>
      <span className="text-xs font-mono text-foreground/80">${price.toFixed(2)}</span>
      <div className={`flex items-center gap-0.5 ${positive ? "text-success" : "text-destructive"}`}>
        {positive ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
        <span className="text-[10px] font-semibold">{Math.abs(change).toFixed(2)}%</span>
      </div>
    </div>
  );
};

export const StockTickerBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="w-full overflow-hidden border border-border/30 rounded-xl bg-muted/10 backdrop-blur-sm relative"
    >
      {/* Left fade mask */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      {/* Right fade mask */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex items-center h-10 animate-marquee whitespace-nowrap">
        {/* Triple duplicate for seamless infinite loop */}
        {[...TICKERS, ...TICKERS, ...TICKERS].map((s, i) => (
          <TickerItem key={`${s}-${i}`} symbol={s} />
        ))}
      </div>
    </motion.div>
  );
};
