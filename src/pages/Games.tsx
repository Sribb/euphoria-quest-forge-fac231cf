import { Trophy, Target, Brain, Zap } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { StockPredictionGame } from "@/components/games/StockPredictionGame";
import { TradingQuizGame } from "@/components/games/TradingQuizGame";
import { PortfolioRaceGame } from "@/components/games/PortfolioRaceGame";

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
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const { data: games = [] } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  const handlePlayGame = (gameId: string) => {
    setActiveGame(gameId);
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

      <div className="grid gap-4">
        {games.map((game, index) => {
          const Icon = Trophy;
          let gameId = "";
          
          if (game.title.includes("Stock Prediction")) gameId = "stock-prediction";
          else if (game.title.includes("Trading Quiz")) gameId = "trading-quiz";
          else if (game.title.includes("Portfolio Race")) gameId = "portfolio-race";

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
    </div>
  );
};

export default Games;
