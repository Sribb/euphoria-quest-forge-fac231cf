import { BookOpen, TrendingUp, Gamepad2, BarChart3, Users, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface QuickAccessTilesProps {
  onNavigate: (tab: string) => void;
}

const tiles = [
  {
    id: "learn",
    title: "Continue Learning",
    description: "3 lessons remaining",
    icon: BookOpen,
    progress: 65,
    gradient: "bg-gradient-primary",
    color: "text-primary",
  },
  {
    id: "trade",
    title: "Portfolio",
    description: "+12.5% this week",
    icon: TrendingUp,
    progress: 78,
    gradient: "bg-gradient-success",
    color: "text-success",
  },
  {
    id: "games",
    title: "Play & Earn",
    description: "5 new challenges",
    icon: Gamepad2,
    progress: 45,
    gradient: "bg-gradient-gold",
    color: "text-warning",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "View insights",
    icon: BarChart3,
    progress: 90,
    gradient: "bg-gradient-primary",
    color: "text-primary",
  },
];

export const QuickAccessTiles = ({ onNavigate }: QuickAccessTilesProps) => {
  return (
    <div className="grid grid-cols-2 gap-5">
      {tiles.map((tile, index) => {
        const Icon = tile.icon;
        return (
          <Card
            key={tile.id}
            className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in rounded-2xl"
            style={{ animationDelay: `${200 + index * 50}ms` }}
            onClick={() => onNavigate(tile.id)}
          >
            <div className={`w-14 h-14 rounded-xl ${tile.gradient} flex items-center justify-center mb-4 shadow-glow`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h4 className="font-bold mb-2 text-lg">{tile.title}</h4>
            <p className="text-sm text-muted-foreground mb-4">{tile.description}</p>
            <Progress value={tile.progress} className="h-2.5" />
          </Card>
        );
      })}
    </div>
  );
};
