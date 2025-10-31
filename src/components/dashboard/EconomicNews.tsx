import { useEffect, useState } from "react";
import { Newspaper, Clock, ExternalLink, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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


export const EconomicNews = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNews = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase.functions.invoke('fetch-economic-news');

      if (fetchError) throw fetchError;

      if (data?.success && data?.data) {
        setNewsItems(data.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(data?.error || 'Failed to fetch news');
      }
    } catch (err) {
      console.error('Error fetching economic news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      toast({
        title: "Failed to load news",
        description: "Unable to fetch latest economic headlines. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNews();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchNews();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);


  return (
    <Card className="p-6 animate-fade-in bg-card border-border" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Live Economic Headlines</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3 h-3 text-success animate-pulse" />
          <span>Auto-refreshing</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 bg-card/50 rounded-lg border border-border">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {newsItems.map((news) => (
          <a
            key={news.id}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-card/50 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
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
      )}

      {!isLoading && !error && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Real-time headlines powered by Alpha Vantage • Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refreshes every 5 minutes
          </p>
        </div>
      )}
    </Card>
  );
};
