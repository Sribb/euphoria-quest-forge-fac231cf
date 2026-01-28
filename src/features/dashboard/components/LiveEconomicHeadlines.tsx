import { Newspaper, TrendingUp, TrendingDown, Minus, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  url: string;
  time: string;
  impact: "high" | "medium" | "low";
  publishedAt: string;
}

const fetchNewsData = async (): Promise<NewsItem[]> => {
  const { data, error } = await supabase.functions.invoke('fetch-economic-news');
  
  if (error) {
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
  
  if (!data?.success) {
    throw new Error(data?.error || 'Failed to fetch news');
  }
  
  return data.data || [];
};

const getSentimentFromImpact = (impact: string): "positive" | "negative" | "neutral" => {
  if (impact === "high") return "negative";
  if (impact === "low") return "positive";
  return "neutral";
};

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "negative":
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    default:
      return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive": return "border-green-500/20 bg-green-500/5";
    case "negative": return "border-destructive/20 bg-destructive/5";
    default: return "border-border bg-card/50";
  }
};

export const LiveEconomicHeadlines = () => {
  const { data: headlines, isLoading, isError } = useQuery({
    queryKey: ["economic-news-live"],
    queryFn: fetchNewsData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  return (
    <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Newspaper className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Live Economic Headlines</h3>
          <p className="text-sm text-muted-foreground">Real-time global market updates</p>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-border">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">Unable to Load News</h4>
            <p className="text-sm text-muted-foreground">
              Failed to fetch live headlines. Please check your connection or try again later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {headlines?.slice(0, 10).map((article, index) => {
              const sentiment = getSentimentFromImpact(article.impact);
              return (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-4 rounded-xl border ${getSentimentColor(sentiment)} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getSentimentIcon(sentiment)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2 leading-snug hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                      {article.summary && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {article.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.time}
                        </div>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {article.source}
                        </Badge>
                        <Badge 
                          variant={article.impact === "high" ? "destructive" : article.impact === "medium" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {article.impact} impact
                        </Badge>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 backdrop-blur-sm">
        <p className="text-xs text-center text-muted-foreground">
          <span className="text-primary font-semibold">📡 Live Feed:</span> Headlines update automatically every 5 minutes
        </p>
      </div>
    </Card>
  );
};
