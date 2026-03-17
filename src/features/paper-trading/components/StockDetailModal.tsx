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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-2xl z-10 border-b border-border/50">
        <button onClick={onBack} className="w-9 h-9 rounded-[8px] flex items-center justify-center hover:bg-muted/60 transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          {profile?.logo ? (
            <img src={profile.logo} alt={symbol} className="w-10 h-10 rounded-[10px] object-contain bg-white/10 p-1" />
          ) : (
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: tickerColor(symbol) }}>
              {symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg leading-tight">{profile?.name || symbol}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-muted-foreground font-medium">{symbol}</span>
              {profile?.finnhubIndustry && (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/30 text-primary/80">{profile.finnhubIndustry}</Badge>
              )}
              <div className={`w-1.5 h-1.5 rounded-full ${fresh ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground/40'}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Price */}
        <div className="px-6 py-5">
          <div className="text-4xl font-bold tracking-tight">${quote?.c?.toFixed(2) ?? '—'}</div>
          <div className={`text-sm font-semibold flex items-center gap-1 mt-1 ${positive ? 'text-emerald-400' : 'text-destructive'}`}>
            {positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            ${Math.abs(quote?.d ?? 0).toFixed(2)} ({quote?.dp?.toFixed(2)}%)
          </div>
        </div>

        {/* Interval Toggle */}
        <div className="flex gap-1.5 px-6 mb-3">
          {INTERVALS.map((i) => (
            <button
              key={i.value}
              onClick={() => { setInterval(i.value); setChartLoaded(false); }}
              className={`px-4 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
                interval === i.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="px-6 mb-6 relative">
          {!chartLoaded && <Skeleton className="h-[320px] rounded-[12px]" />}
          <iframe
            src={chartUrl}
            className={`w-full h-[320px] rounded-[12px] border border-border/30 ${chartLoaded ? '' : 'absolute opacity-0'}`}
            onLoad={() => setChartLoaded(true)}
            title={`${symbol} chart`}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 px-6 mb-6">
          {[
            { label: "52W High", value: metrics?.['52WeekHigh']?.toFixed(2) },
            { label: "52W Low", value: metrics?.['52WeekLow']?.toFixed(2) },
            { label: "Beta", value: metrics?.beta?.toFixed(2) },
            { label: "P/E", value: metrics?.peNormalizedAnnual?.toFixed(1) },
          ].map((s) => (
            <div key={s.label} className="bg-muted/30 border border-border/40 rounded-[12px] p-3.5 text-center">
              <div className="text-[11px] text-muted-foreground font-medium">{s.label}</div>
              <div className="text-base font-bold mt-1">{s.value ?? '—'}</div>
            </div>
          ))}
        </div>

        {/* Analyst Sentiment */}
        {recs && totalAnalysts > 0 && (
          <div className="px-6 mb-6">
            <h3 className="text-sm font-bold mb-3">Wall St. Analysts</h3>
            <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
              {[
                { count: recs.strongBuy, color: 'bg-emerald-600' },
                { count: recs.buy, color: 'bg-emerald-400' },
                { count: recs.hold, color: 'bg-amber-400' },
                { count: recs.sell, color: 'bg-red-400' },
                { count: recs.strongSell, color: 'bg-red-600' },
              ].map((seg, i) => seg.count > 0 ? (
                <div key={i} className={`${seg.color} rounded-full`} style={{ width: `${(seg.count / totalAnalysts) * 100}%` }} />
              ) : null)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Based on {totalAnalysts} analysts</p>
          </div>
        )}

        {/* News */}
        {news && news.length > 0 && (
          <div className="px-6 mb-6">
            <h3 className="text-sm font-bold mb-3">Latest News</h3>
            <div className="space-y-2.5">
              {news.slice(0, 3).map((n, i) => (
                <a
                  key={i}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 p-4 rounded-[12px] bg-muted/20 border border-border/40 hover:border-primary/30 hover:bg-muted/30 transition-all group"
                >
                  {n.image && <img src={n.image} alt="" className="w-14 h-14 rounded-[8px] object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{n.headline}</div>
                    <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                      {n.source} · {new Date(n.datetime * 1000).toLocaleDateString()}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buy/Sell Buttons — pinned bottom, offset for 220px sidebar */}
      <div className="fixed bottom-0 left-[220px] right-0 px-6 py-4 bg-background/80 backdrop-blur-2xl border-t border-border/50 z-20 flex gap-3">
        <Button
          onClick={() => setTradeMode("BUY")}
          className="flex-1 h-[52px] bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base rounded-[12px] shadow-lg shadow-emerald-500/20 transition-all"
        >
          BUY
        </Button>
        <Button
          onClick={() => setTradeMode("SELL")}
          variant="outline"
          className="flex-1 h-[52px] border-destructive/60 text-destructive hover:bg-destructive/10 font-bold text-base rounded-[12px] transition-all"
        >
          SELL
        </Button>
      </div>

      {tradeMode && (
        <TradeModal symbol={symbol} initialMode={tradeMode} currentPrice={quote?.c ?? 0} onClose={() => setTradeMode(null)} />
      )}
    </div>
  );
};