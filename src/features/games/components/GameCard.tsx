import { Trophy, Coins, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  reward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  onClick: () => void;
}

export const GameCard = ({ title, description, icon, reward, difficulty, onClick }: GameCardProps) => {
  const difficultyColors = {
    Easy: "bg-success",
    Medium: "bg-warning",
    Hard: "bg-destructive",
  };

  return (
    <Card className="p-5 hover-lift cursor-pointer smooth-transition" onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          {icon}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg">{title}</h3>
            <Badge className={difficultyColors[difficulty]}>{difficulty}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Coins className="w-4 h-4 text-warning" />
                <span className="font-bold">{reward}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-primary" />
                <span className="font-bold">+10 XP</span>
              </div>
            </div>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 smooth-transition">
              Play Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
