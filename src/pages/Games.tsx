import { Trophy, ArrowLeft, Brain, Users } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { MarketLogicGame } from "@/components/games/MarketLogicGame";
import { ChartDecoderGame } from "@/components/games/ChartDecoderGame";
import { RiskRewardMatrix } from "@/components/games/RiskRewardMatrix";
import { TradeTacticianGame } from "@/components/games/TradeTacticianGame";
import { PortfolioLogicGame } from "@/components/games/PortfolioLogicGame";
import { MarketMindsetGame } from "@/components/games/MarketMindsetGame";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GamesProps {
  onNavigate: (tab: string) => void;
}

const Games = ({ onNavigate }: GamesProps) => {
  const { user } = useAuth();
  const { session, competitors, activeEvents } = useAIMarket(user?.id);
  const [activeGame, setActiveGame] = useState<"market-logic" | "chart-decoder" | "risk-reward" | "trade-tactician" | "portfolio-logic" | "market-mindset" | null>(null);

  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data;
    },
    retry: 2,
    staleTime: 60000,
  });

  const handlePlayGame = (gameId: string) => {
    if (
      gameId === "market-logic" || gameId === "chart-decoder" || gameId === "risk-reward" || 
      gameId === "trade-tactician" || gameId === "portfolio-logic" || gameId === "market-mindset"
    ) {
      setActiveGame(gameId);
    }
  };

  const handleCloseGame = () => {
    setActiveGame(null);
  };

  if (activeGame === "market-logic") {
    return <MarketLogicGame onClose={handleCloseGame} />;
  }

  if (activeGame === "chart-decoder") {
    return <ChartDecoderGame onClose={handleCloseGame} />;
  }

  if (activeGame === "risk-reward") {
    return <RiskRewardMatrix onClose={handleCloseGame} />;
  }

  if (activeGame === "trade-tactician") {
    return <TradeTacticianGame onClose={handleCloseGame} />;
  }

  if (activeGame === "portfolio-logic") {
    return <PortfolioLogicGame onClose={handleCloseGame} />;
  }

  if (activeGame === "market-mindset") {
    return <MarketMindsetGame onClose={handleCloseGame} />;
  }

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex items-center gap-3 animate-fade-in">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate('dashboard')}
          className="hover-scale"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Games</h1>
          <p className="text-muted-foreground">Learn investing through fun challenges</p>
        </div>
      </div>

      {/* AI Competitor Challenge Section */}
      {session && competitors && competitors.length > 0 && (
        <Card className="p-6 bg-gradient-accent border-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">AI Competitor Challenge</h3>
              <p className="text-sm text-muted-foreground">
                Compete against {competitors.length} AI traders in real-time
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onNavigate('trade')}
            >
              Join Challenge
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {competitors.slice(0, 4).map((comp, idx) => (
              <div
                key={comp.id}
                className="p-3 rounded-lg bg-card/50 border border-border animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{comp.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {comp.strategy_type}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Capital: ${Number(comp.capital).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Market Events Impact on Games */}
      {activeEvents && activeEvents.length > 0 && (
        <Card className="p-4 bg-warning/5 border-warning animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-warning" />
            <h4 className="font-semibold text-sm">Active Market Event</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {activeEvents[0].description} - Test your skills in the AI Market!
          </p>
        </Card>
      )}

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-card animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {games.map((game, index) => {
          const Icon = Trophy;
          let gameId = "";
          
          if (game.title.includes("Market Logic")) gameId = "market-logic";
          else if (game.title.includes("Chart Decoder")) gameId = "chart-decoder";
          else if (game.title.includes("Risk/Reward")) gameId = "risk-reward";
          else if (game.title.includes("Trade Tactician")) gameId = "trade-tactician";
          else if (game.title.includes("Portfolio Logic")) gameId = "portfolio-logic";
          else if (game.title.includes("Market Mindset")) gameId = "market-mindset";

          return (
            <div
              key={game.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <GameCard
                title={game.title}
                description={game.description}
                difficulty={game.difficulty as "Easy" | "Medium" | "Hard"}
                reward={game.base_reward}
                icon={<Icon className="w-7 h-7 text-white" />}
                onClick={() => handlePlayGame(gameId)}
              />
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Games;
