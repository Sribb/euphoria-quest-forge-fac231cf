import { Newspaper, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Headline {
  id: number;
  title: string;
  timestamp: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
}

const HEADLINES: Headline[] = [
  {
    id: 1,
    title: "U.S. Jobless Claims Fall to 4-Month Low",
    timestamp: "2h ago",
    source: "Reuters",
    sentiment: "positive"
  },
  {
    id: 2,
    title: "Oil Prices Surge as OPEC Extends Production Cuts",
    timestamp: "3h ago",
    source: "Bloomberg",
    sentiment: "positive"
  },
  {
    id: 3,
    title: "Federal Reserve Signals Possible Rate Pause in December",
    timestamp: "4h ago",
    source: "Financial Times",
    sentiment: "neutral"
  },
  {
    id: 4,
    title: "Tech Sector Rallies on Strong Earnings Reports",
    timestamp: "5h ago",
    source: "CNBC",
    sentiment: "positive"
  },
  {
    id: 5,
    title: "European Markets Close Mixed Amid Economic Uncertainty",
    timestamp: "6h ago",
    source: "Wall Street Journal",
    sentiment: "neutral"
  },
  {
    id: 6,
    title: "Gold Reaches New High as Investors Seek Safe Haven",
    timestamp: "7h ago",
    source: "MarketWatch",
    sentiment: "positive"
  }
];

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
        <div className="space-y-3">
          {HEADLINES.map((headline, index) => (
            <div
              key={headline.id}
              className={`p-4 rounded-xl border ${getSentimentColor(headline.sentiment)} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getSentimentIcon(headline.sentiment)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2 leading-snug hover:text-primary transition-colors">
                    {headline.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {headline.timestamp}
                    </div>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {headline.source}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 backdrop-blur-sm">
        <p className="text-xs text-center text-muted-foreground">
          <span className="text-primary font-semibold">📡 Live Feed:</span> Headlines update automatically to keep you informed of market-moving events
        </p>
      </div>
    </Card>
  );
};
