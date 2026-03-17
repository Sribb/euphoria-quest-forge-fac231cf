import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuote, getCompanyProfile, getBasicMetrics, getRecommendations, getCompanyNews, tickerColor } from "@/lib/finnhub";
import { ArrowLeft, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TradeModal } from "./TradeModal";

interface Props {
  symbol: string;
  onBack: () => void;
}

const INTERVALS = [
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
  { label: "1M", value: "M" },
  { label: "3M", value: "3M" },
  { label: "1Y", value: "12M" },
];

export const StockDetailModal = ({ symbol, onBack }: Props) => {
  const [interval, setInterval] = useState("D");
  const [tradeMode, setTradeMode] = useState<"BUY" | "SELL" | null>(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  const { data: quote } = useQuery({ queryKey: ["quote", symbol], queryFn: () => getQuote(symbol), staleTime: 60000 });
  const { data: profile } = useQuery({ queryKey: ["profile", symbol], queryFn: () => getCompanyProfile(symbol), staleTime: 300000 });
  const { data: metrics } = useQuery({ queryKey: ["metrics", symbol], queryFn: () => getBasicMetrics(symbol), staleTime: 300000 });
  const { data: recs } = useQuery({ queryKey: ["recs", symbol], queryFn: () => getRecommendations(symbol), staleTime: 300000 });
  const { data: news } = useQuery({ queryKey: ["news", symbol], queryFn: () => getCompanyNews(symbol), staleTime: 300000 });

  const positive = (quote?.dp ?? 0) >= 0;
  const fresh = (quote as any)?._fresh;
  const chartUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tv_${symbol}&symbol=${symbol}&interval=${interval}&hidesidetoolbar=1&hidetoptoolbar=0&symboledit=0&saveimage=0&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=exchange&withdateranges=1&showpopupbutton=0&locale=en&hide_side_toolbar=1`;

  const totalAnalysts = recs ? recs.strongBuy + recs.buy + recs.hold + recs.sell + recs.strongSell : 0;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-5 h-5" /></Button>
        <div className="flex items-center gap-2 flex-1">
          {profile?.logo ? (
            <img src={profile.logo} alt={symbol} className="w-10 h-10 rounded-full object-contain bg-white" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: tickerColor(symbol) }}>
              {symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <div className="font-bold text-lg">{profile?.name || symbol}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{symbol}</span>
              {profile?.finnhubIndustry && <Badge variant="outline" className="text-[10px] py-0">{profile.finnhubIndustry}</Badge>}
              <div className={`w-2 h-2 rounded-full ${fresh ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="px-4 py-3">
        <div className="text-3xl font-bold">${quote?.c?.toFixed(2) ?? '—'}</div>
        <div className={`text-sm font-medium flex items-center gap-1 ${positive ? 'text-success' : 'text-destructive'}`}>
          {positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          ${Math.abs(quote?.d ?? 0).toFixed(2)} ({quote?.dp?.toFixed(2)}%)
        </div>
      </div>

      {/* Interval Toggle */}
      <div className="flex gap-1 px-4 mb-2">
        {INTERVALS.map((i) => (
          <button
            key={i.value}
            onClick={() => { setInterval(i.value); setChartLoaded(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${interval === i.value ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
          >
            {i.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-4 mb-4 relative">
        {!chartLoaded && <Skeleton className="h-[280px] rounded-xl" />}
        <iframe
          src={chartUrl}
          className={`w-full h-[280px] rounded-xl border-0 ${chartLoaded ? '' : 'absolute opacity-0'}`}
          onLoad={() => setChartLoaded(true)}
          title={`${symbol} chart`}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-4">
        {[
          { label: "52W High", value: metrics?.['52WeekHigh']?.toFixed(2) },
          { label: "52W Low", value: metrics?.['52WeekLow']?.toFixed(2) },
          { label: "Beta", value: metrics?.beta?.toFixed(2) },
          { label: "P/E", value: metrics?.peNormalizedAnnual?.toFixed(1) },
        ].map((s) => (
          <div key={s.label} className="bg-card/60 border border-border rounded-lg p-2.5 text-center">
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
            <div className="text-sm font-semibold mt-0.5">{s.value ?? '—'}</div>
          </div>
        ))}
      </div>

      {/* Analyst Sentiment */}
      {recs && totalAnalysts > 0 && (
        <div className="px-4 mb-4">
          <h3 className="text-sm font-semibold mb-2">Wall St. Analysts</h3>
          <div className="flex h-3 rounded-full overflow-hidden">
            {[
              { count: recs.strongBuy, color: 'bg-emerald-700' },
              { count: recs.buy, color: 'bg-emerald-500' },
              { count: recs.hold, color: 'bg-yellow-500' },
              { count: recs.sell, color: 'bg-red-500' },
              { count: recs.strongSell, color: 'bg-red-700' },
            ].map((seg, i) => seg.count > 0 ? (
              <div key={i} className={`${seg.color}`} style={{ width: `${(seg.count / totalAnalysts) * 100}%` }} />
            ) : null)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Based on {totalAnalysts} analysts</p>
        </div>
      )}

      {/* News */}
      {news && news.length > 0 && (
        <div className="px-4 mb-4">
          <h3 className="text-sm font-semibold mb-2">Latest News</h3>
          <div className="space-y-2">
            {news.slice(0, 3).map((n, i) => (
              <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" className="flex gap-3 p-3 rounded-lg bg-card/60 border border-border hover:border-primary/40 transition-colors">
                {n.image && <img src={n.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-2">{n.headline}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    {n.source} • {new Date(n.datetime * 1000).toLocaleDateString()}
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Buy/Sell Buttons */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-20 flex gap-3 safe-area-bottom">
        <Button onClick={() => setTradeMode("BUY")} className="flex-1 bg-success hover:bg-success/90 text-white font-bold">BUY</Button>
        <Button onClick={() => setTradeMode("SELL")} variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10 font-bold">SELL</Button>
      </div>

      {tradeMode && (
        <TradeModal symbol={symbol} initialMode={tradeMode} currentPrice={quote?.c ?? 0} onClose={() => setTradeMode(null)} />
      )}
    </div>
  );
};
