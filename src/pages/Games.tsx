import { Gamepad2, Brain, Target, Zap } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";

interface GamesProps {
  onNavigate: (tab: string) => void;
}

const games = [
  {
    id: 1,
    title: "Investment Quiz Adventure",
    description: "Test your knowledge and earn rewards with scenario-based questions",
    icon: <Brain className="w-7 h-7 text-white" />,
    reward: 50,
    difficulty: "Easy" as const,
  },
  {
    id: 2,
    title: "Market Battle",
    description: "Catch the right investments before they hit the ground",
    icon: <Target className="w-7 h-7 text-white" />,
    reward: 75,
    difficulty: "Medium" as const,
  },
  {
    id: 3,
    title: "Portfolio Builder",
    description: "Build and manage a portfolio through market events",
    icon: <Zap className="w-7 h-7 text-white" />,
    reward: 100,
    difficulty: "Hard" as const,
  },
];

const Games = ({ onNavigate }: GamesProps) => {
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
              icon={game.icon}
              reward={game.reward}
              difficulty={game.difficulty}
              onClick={handleGameClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
