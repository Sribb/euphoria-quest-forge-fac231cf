import { useQuery } from "@tanstack/react-query";
import { getQuote, getCompanyProfile, tickerColor } from "@/lib/finnhub";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";

const WATCHLIST = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "SPY"];

interface Props { onSelect: (symbol: string) => void; }

export const WatchlistRow = ({ onSelect }: Props) => {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
      {WATCHLIST.map(s => <WatchlistCard key={s} symbol={s} onSelect={onSelect} />)}
    </div>
  );
};

function WatchlistCard({ symbol, onSelect }: { symbol: string; onSelect: (s: string) => void }) {
  const { data: quote, isLoading: ql } = useQuery({
    queryKey: ["quote", symbol], queryFn: () => getQuote(symbol), staleTime: 60000,
  });
  const { data: profile } = useQuery({
    queryKey: ["profile", symbol], queryFn: () => getCompanyProfile(symbol), staleTime: 300000,
  });

  if (ql) return <Skeleton className="w-[88px] h-[108px] rounded-[12px] flex-shrink-0" />;

  const positive = (quote?.dp ?? 0) >= 0;

  return (
    <button
      onClick={() => onSelect(symbol)}
      className="flex-shrink-0 w-[88px] rounded-[12px] border border-border/50 bg-muted/20 p-3 flex flex-col items-center gap-1.5 hover:border-primary/30 hover:bg-muted/30 transition-all relative overflow-hidden group"
    >
      {profile?.logo ? (
        <img
          src={profile.logo}
          alt={symbol}
          className="w-8 h-8 rounded-[8px] object-contain bg-white/10 p-0.5"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
        />
      ) : null}
      <div
        className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-white text-xs font-bold ${profile?.logo ? 'hidden' : ''}`}
        style={{ backgroundColor: tickerColor(symbol) }}
      >
        {symbol.slice(0, 2)}
      </div>
      <span className="text-xs font-bold text-foreground">{symbol}</span>
      <span className="text-xs font-semibold tabular-nums">${quote?.c?.toFixed(2)}</span>
      <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${positive ? 'text-emerald-400' : 'text-destructive'}`}>
        {positive ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
        {quote?.dp?.toFixed(2)}%
      </span>
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] transition-opacity ${positive ? 'bg-emerald-400' : 'bg-destructive'} opacity-60 group-hover:opacity-100`} />
    </button>
  );
}