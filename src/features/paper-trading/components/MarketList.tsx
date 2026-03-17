import { useQuery } from "@tanstack/react-query";
import { getQuote, getCompanyProfile, tickerColor } from "@/lib/finnhub";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";

const WATCHLIST = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "SPY"];

interface Props { onSelect: (symbol: string) => void; }

export const MarketList = ({ onSelect }: Props) => {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Markets Today</h3>
      {WATCHLIST.map(s => <MarketRow key={s} symbol={s} onSelect={onSelect} />)}
    </div>
  );
};

function MarketRow({ symbol, onSelect }: { symbol: string; onSelect: (s: string) => void }) {
  const { data: quote, isLoading } = useQuery({
    queryKey: ["quote", symbol], queryFn: () => getQuote(symbol), staleTime: 60000,
  });
  const { data: profile } = useQuery({
    queryKey: ["profile", symbol], queryFn: () => getCompanyProfile(symbol), staleTime: 300000,
  });

  if (isLoading) return <Skeleton className="h-14 rounded-lg" />;

  const positive = (quote?.dp ?? 0) >= 0;

  return (
    <button
      onClick={() => onSelect(symbol)}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
    >
      {profile?.logo ? (
        <img src={profile.logo} alt={symbol} className="w-9 h-9 rounded-full object-contain bg-white" />
      ) : (
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: tickerColor(symbol) }}>
          {symbol.slice(0, 2)}
        </div>
      )}
      <div className="flex-1 text-left">
        <div className="font-semibold text-sm">{symbol}</div>
        <div className="text-xs text-muted-foreground truncate">{profile?.name || symbol}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">${quote?.c?.toFixed(2)}</div>
        <div className={`text-xs font-medium flex items-center justify-end gap-0.5 ${positive ? 'text-success' : 'text-destructive'}`}>
          {positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {quote?.dp?.toFixed(2)}%
        </div>
      </div>
    </button>
  );
}
