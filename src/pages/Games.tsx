import { Trophy, Target, Brain, Zap, TrendingUp, BarChart3 } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { StockPredictionGame } from "@/components/games/StockPredictionGame";
import { TradingQuizGame } from "@/components/games/TradingQuizGame";
import { PortfolioRaceGame } from "@/components/games/PortfolioRaceGame";
import { MarketBattleGame } from "@/components/games/MarketBattleGame";
import { FinancialRPG } from "@/components/games/FinancialRPG";
import { InvestmentQuizAdventure } from "@/components/games/InvestmentQuizAdventure";
import { MarketTimingChallenge } from "@/components/games/MarketTimingChallenge";
import { DiversificationMaster } from "@/components/games/DiversificationMaster";
import { MarketLogicGame } from "@/components/games/MarketLogicGame";
import { ChartDecoderGame } from "@/components/games/ChartDecoderGame";
import { RiskRewardMatrix } from "@/components/games/RiskRewardMatrix";
import { TradeTacticianGame } from "@/components/games/TradeTacticianGame";
import { PortfolioLogicGame } from "@/components/games/PortfolioLogicGame";
import { MarketMindsetGame } from "@/components/games/MarketMindsetGame";

interface GamesProps {
  onNavigate: (tab: string) => void;
}

const iconMap: Record<string, any> = {
  target: Target,
  brain: Brain,
  trophy: Trophy,
  zap: Zap,
};

const Games = ({ onNavigate }: GamesProps) => {
  const [activeGame, setActiveGame] = useState<"stock-prediction" | "trading-quiz" | "portfolio-race" | "market-battle" | "financial-rpg" | "quiz-adventure" | "market-timing" | "diversification" | "market-logic" | "chart-decoder" | "risk-reward" | "trade-tactician" | "portfolio-logic" | "market-mindset" | null>(null);

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
      gameId === "stock-prediction" || gameId === "trading-quiz" || gameId === "portfolio-race" || 
      gameId === "market-battle" || gameId === "financial-rpg" || gameId === "quiz-adventure" || 
      gameId === "market-timing" || gameId === "diversification" || gameId === "market-logic" || 
      gameId === "chart-decoder" || gameId === "risk-reward" || gameId === "trade-tactician" || 
      gameId === "portfolio-logic" || gameId === "market-mindset"
    ) {
      setActiveGame(gameId);
    }
  };

  const handleCloseGame = () => {
    setActiveGame(null);
  };

  if (activeGame === "stock-prediction") {
    return <StockPredictionGame onClose={handleCloseGame} />;
  }

  if (activeGame === "trading-quiz") {
    return <TradingQuizGame onClose={handleCloseGame} />;
  }

  if (activeGame === "portfolio-race") {
    return <PortfolioRaceGame onClose={handleCloseGame} />;
  }

  if (activeGame === "market-battle") {
    return <MarketBattleGame onClose={handleCloseGame} />;
  }

  if (activeGame === "financial-rpg") {
    return <FinancialRPG onClose={handleCloseGame} />;
  }

  if (activeGame === "quiz-adventure") {
    return <InvestmentQuizAdventure onClose={handleCloseGame} />;
  }

  if (activeGame === "market-timing") {
    return <MarketTimingChallenge onClose={handleCloseGame} />;
  }

  if (activeGame === "diversification") {
    return <DiversificationMaster onClose={handleCloseGame} />;
  }

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
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Games</h1>
          <p className="text-muted-foreground">Learn investing through fun challenges</p>
        </div>
      </div>

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
          
          if (game.title.includes("Stock Prediction")) gameId = "stock-prediction";
          else if (game.title.includes("Trading Quiz")) gameId = "trading-quiz";
          else if (game.title.includes("Portfolio Race")) gameId = "portfolio-race";
          else if (game.title.includes("Market Battle")) gameId = "market-battle";
          else if (game.title.includes("Financial") || game.title.includes("Life")) gameId = "financial-rpg";
          else if (game.title.includes("Quiz") || game.title.includes("Adventure")) gameId = "quiz-adventure";
          else if (game.title.includes("Timing")) gameId = "market-timing";
          else if (game.title.includes("Diversification")) gameId = "diversification";

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
