import { Sparkles, ArrowRight, TrendingUp, Target, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AISuggestionsProps {
  onNavigate?: (tab: string) => void;
}

export const AISuggestions = ({ onNavigate }: AISuggestionsProps) => {
  const { user } = useAuth();
  const { session, aiPrices, activeEvents } = useAIMarket(user?.id);

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: assets } = useQuery({
    queryKey: ["portfolio_assets", portfolio?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_assets")
        .select("*")
        .eq("portfolio_id", portfolio?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!portfolio?.id,
  });

  // Generate AI-powered suggestions based on actual data
  const generateSuggestions = () => {
    const suggestions = [];

    // Market trend suggestions
    if (session) {
      if (session.market_trend === 'bullish') {
        suggestions.push({
          id: 'trend-bullish',
          title: "Market is Bullish",
          description: `AI detects strong upward momentum. Consider increasing positions in growth stocks.`,
          action: "View AI Market",
          icon: <TrendingUp className="w-5 h-5 text-success" />,
          onClick: () => onNavigate?.('trade'),
        });
      } else if (session.market_trend === 'bearish') {
        suggestions.push({
          id: 'trend-bearish',
          title: "Market Correction Detected",
          description: `AI suggests defensive positioning. Consider taking profits or hedging positions.`,
          action: "Analyze Trades",
          icon: <Brain className="w-5 h-5 text-warning" />,
          onClick: () => onNavigate?.('trade'),
        });
      }
    }

    // Active event suggestions
    if (activeEvents && activeEvents.length > 0) {
      const event = activeEvents[0];
      suggestions.push({
        id: 'market-event',
        title: `Market Event: ${event.title}`,
        description: event.description.substring(0, 100) + '...',
        action: "View Details",
        icon: <Sparkles className="w-5 h-5 text-primary animate-pulse" />,
        badge: event.severity,
        onClick: () => onNavigate?.('trade'),
      });
    }

    // Portfolio suggestions
    if (assets && assets.length > 0) {
      const totalValue = assets.reduce((sum, a) => sum + (Number(a.current_price) * Number(a.quantity)), 0);
      const topAsset = assets.reduce((max, a) => {
        const value = Number(a.current_price) * Number(a.quantity);
        const maxValue = Number(max.current_price) * Number(max.quantity);
        return value > maxValue ? a : max;
      });
      const topAssetValue = Number(topAsset.current_price) * Number(topAsset.quantity);
      const concentration = (topAssetValue / totalValue) * 100;

      if (concentration > 40) {
        suggestions.push({
          id: 'diversify',
          title: "Portfolio Concentration Risk",
          description: `${topAsset.asset_name} represents ${concentration.toFixed(0)}% of your portfolio. Consider diversifying.`,
          action: "Review Portfolio",
          icon: <Target className="w-5 h-5 text-warning" />,
          onClick: () => onNavigate?.('trade'),
        });
      }
    }

    // Top performing AI stock suggestion
    if (aiPrices && aiPrices.length > 0) {
      const topGainer = aiPrices.reduce((max, p) => {
        const maxChange = ((Number(max.current_price) - Number(max.previous_price)) / Number(max.previous_price)) * 100;
        const pChange = ((Number(p.current_price) - Number(p.previous_price)) / Number(p.previous_price)) * 100;
        return pChange > maxChange ? p : max;
      });
      
      const changePercent = ((Number(topGainer.current_price) - Number(topGainer.previous_price)) / Number(topGainer.previous_price)) * 100;
      
      if (changePercent > 2) {
        suggestions.push({
          id: 'top-gainer',
          title: `${topGainer.symbol} Gaining Momentum`,
          description: `Up ${changePercent.toFixed(2)}% with strong AI sentiment (${(Number(topGainer.ai_sentiment) * 100).toFixed(0)}%). Consider analyzing.`,
          action: "Trade Now",
          icon: <TrendingUp className="w-5 h-5 text-success" />,
          onClick: () => onNavigate?.('trade'),
        });
      }
    }

    // Default suggestions if no data
    if (suggestions.length === 0) {
      suggestions.push({
        id: 'start-ai',
        title: "Start Your AI Market Session",
        description: "Initialize your personal AI-driven market to receive real-time insights and predictions.",
        action: "Start Trading",
        icon: <Brain className="w-5 h-5 text-primary animate-pulse" />,
        onClick: () => onNavigate?.('trade'),
      });
    }

    return suggestions.slice(0, 3);
  };

  const suggestions = generateSuggestions();

  return (
    <Card className="p-6 bg-gradient-hero border-0 shadow-md animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="text-xl font-bold">AI Insights</h3>
        {session && (
          <Badge variant="secondary" className="ml-auto">
            AI Active
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-md cursor-pointer hover-scale"
            onClick={suggestion.onClick}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{suggestion.title}</h4>
                  {suggestion.badge && (
                    <Badge variant="outline" className="text-xs">
                      {suggestion.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary">
                  {suggestion.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
