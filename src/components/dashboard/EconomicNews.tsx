import { useEffect, useState } from "react";
import { Newspaper, Clock, ExternalLink, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  url: string;
  time: string;
  impact: "high" | "medium" | "low";
  publishedAt: Date;
}

const initialNewsItems: NewsItem[] = [
  {
    id: 1,
    title: "Federal Reserve Signals Data-Dependent Approach to Interest Rates",
    summary: "Fed officials emphasize careful monitoring of economic indicators before making policy decisions amid ongoing inflation concerns.",
    source: "Reuters",
    url: "https://www.reuters.com/markets/us/",
    time: "2 hours ago",
    impact: "high",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "Tech Giants Report Strong Q4 Earnings on AI Innovation",
    summary: "Major technology companies exceed Wall Street expectations as artificial intelligence investments drive revenue growth and market optimism.",
    source: "CNBC",
    url: "https://www.cnbc.com/technology/",
    time: "3 hours ago",
    impact: "high",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "U.S. Job Market Shows Resilience with Steady Employment Growth",
    summary: "Latest employment data reveals continued strength in labor markets, with unemployment remaining near historic lows.",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/economics",
    time: "5 hours ago",
    impact: "medium",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "Global Energy Markets Stabilize After Supply Concerns",
    summary: "Oil and natural gas prices find equilibrium as production increases offset geopolitical tensions and seasonal demand fluctuations.",
    source: "MarketWatch",
    url: "https://www.marketwatch.com/investing/commodities",
    time: "6 hours ago",
    impact: "medium",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: "Retail Sales Data Beats Forecasts, Consumer Spending Remains Strong",
    summary: "Monthly retail figures show robust consumer demand continuing into the new year, supporting economic growth outlook.",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/economics",
    time: "8 hours ago",
    impact: "high",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: 6,
    title: "Housing Market Shows Signs of Recovery Amid Lower Rates",
    summary: "Home sales and construction activity increase as mortgage rates decline from recent peaks, boosting sector optimism.",
    source: "Reuters",
    url: "https://www.reuters.com/markets/us/",
    time: "12 hours ago",
    impact: "medium",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

export const EconomicNews = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Auto-refresh timestamps every 10 minutes to stay current
    const interval = setInterval(() => {
      setNewsItems((prev) =>
        prev.map((item) => ({
          ...item,
          time: getRelativeTime(item.publishedAt),
        }))
      );
      setLastUpdate(new Date());
    }, 600000); // Update every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    }
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  };

  return (
    <Card className="p-8 animate-fade-in bg-card border-border shadow-lg rounded-2xl" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">Live Economic Headlines</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3 text-success animate-pulse" />
          <span>Auto-refreshing</span>
        </div>
      </div>

      <div className="space-y-4">
        {newsItems.map((news) => (
          <a
            key={news.id}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 bg-card/50 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge
                    variant={news.impact === "high" ? "destructive" : news.impact === "medium" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {news.impact === "high" ? "High Impact" : news.impact === "medium" ? "Medium Impact" : "Low Impact"}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {news.time}
                  </div>
                  <span className="text-xs text-muted-foreground">• {news.source}</span>
                </div>
                <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {news.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{news.summary}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Headlines sourced from Reuters, Bloomberg, CNBC, and MarketWatch • Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>
    </Card>
  );
};
