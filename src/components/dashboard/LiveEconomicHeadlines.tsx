import { Newspaper, TrendingUp, TrendingDown, Minus, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsArticle {
  title: string;
  source_id: string;
  pubDate: string;
  description: string;
  link: string;
  sentiment?: string[];
}

interface NewsDataResponse {
  results: NewsArticle[];
}

const fetchNewsData = async (): Promise<NewsArticle[]> => {
  const response = await fetch(
    "https://newsdata.io/api/1/latest?apikey=pub_0cb5b27a6dcb42c295b162ede2abfeba&q=economy%20OR%20finance&language=en"
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data: NewsDataResponse = await response.json();
  return data.results || [];
};

const getRelativeTime = (pubDate: string) => {
  const now = new Date();
  const published = new Date(pubDate);
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffHours > 24) {
    const days = Math.floor(diffHours / 24);
    return `${days}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMins > 0) {
    return `${diffMins}m ago`;
  } else {
    return "Just now";
  }
};

const getSentimentFromKeywords = (article: NewsArticle): "positive" | "negative" | "neutral" => {
  const text = `${article.title} ${article.description || ""}`.toLowerCase();
  const positiveWords = ["surge", "rally", "gains", "rise", "growth", "high", "strong", "boost"];
  const negativeWords = ["fall", "drop", "decline", "crisis", "uncertainty", "loss", "weak", "cut"];
  
  const hasPositive = positiveWords.some(word => text.includes(word));
  const hasNegative = negativeWords.some(word => text.includes(word));
  
  if (hasPositive && !hasNegative) return "positive";
  if (hasNegative && !hasPositive) return "negative";
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
    queryKey: ["economic-news"],
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
              const sentiment = getSentimentFromKeywords(article);
              return (
                <a
                  key={index}
                  href={article.link}
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
                      {article.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getRelativeTime(article.pubDate)}
                        </div>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {article.source_id}
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
          <span className="text-primary font-semibold">📡 Live Feed:</span> Headlines update automatically every 5 minutes via NewsData.io API
        </p>
      </div>
    </Card>
  );
};
