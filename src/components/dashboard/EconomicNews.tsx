import { Newspaper, Clock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: 1,
    title: "Fed Signals Potential Rate Cuts in 2024",
    summary: "Federal Reserve officials indicate possibility of interest rate reductions as inflation moderates toward 2% target.",
    source: "Federal Reserve",
    time: "2 hours ago",
    impact: "high",
  },
  {
    id: 2,
    title: "Tech Sector Leads Market Rally on AI Optimism",
    summary: "Technology stocks surge as artificial intelligence innovations drive investor enthusiasm and revenue growth projections.",
    source: "Market Watch",
    time: "4 hours ago",
    impact: "medium",
  },
  {
    id: 3,
    title: "Employment Report Shows Robust Job Growth",
    summary: "U.S. economy adds 216,000 jobs in December, exceeding expectations and demonstrating continued labor market strength.",
    source: "Bureau of Labor Statistics",
    time: "1 day ago",
    impact: "high",
  },
  {
    id: 4,
    title: "Energy Prices Decline Amid Global Supply Increase",
    summary: "Crude oil prices fall as OPEC+ production increases and demand concerns weigh on market sentiment.",
    source: "Energy Information Administration",
    time: "1 day ago",
    impact: "medium",
  },
];

export const EconomicNews = () => {
  return (
    <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Economic News & Updates</h3>
        </div>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {newsItems.map((news) => (
          <div
            key={news.id}
            className="p-4 bg-gradient-hero rounded-lg border border-border hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      news.impact === "high"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {news.impact === "high" ? "High Impact" : "Medium Impact"}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {news.time}
                  </div>
                </div>
                <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {news.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">{news.summary}</p>
                <p className="text-xs text-muted-foreground">Source: {news.source}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
