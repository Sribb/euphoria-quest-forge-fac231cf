import { Gamepad2, Brain, Target, Zap } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GamesProps {
  onNavigate: (tab: string) => void;
}

const gameIcons: Record<string, React.ReactNode> = {
  "Investment Quiz Adventure": <Brain className="w-7 h-7 text-white" />,
  "Market Battle": <Target className="w-7 h-7 text-white" />,
  "Portfolio Builder": <Zap className="w-7 h-7 text-white" />,
};

const Games = ({ onNavigate }: GamesProps) => {
  const { data: games = [] } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("base_reward");
      
      if (error) throw error;
      return data;
    },
  });

  const handleGameClick = () => {
    console.log("Starting game...");
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Games</h1>
          <p className="text-muted-foreground">Learn while having fun and earn rewards</p>
        </div>
      </div>

      <div className="space-y-4">
        {games.map((game, index) => (
          <div
            key={game.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <GameCard
              title={game.title}
              description={game.description}
              icon={gameIcons[game.title] || <Gamepad2 className="w-7 h-7 text-white" />}
              reward={game.base_reward}
              difficulty={game.difficulty as "Easy" | "Medium" | "Hard"}
              onClick={handleGameClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
