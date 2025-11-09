import { Trophy, ArrowLeft, Brain, Users, Coins, TrendingUp } from "lucide-react";
import { useState } from "react";
import { LifeSimInvestorGame } from "@/components/games/LifeSimInvestorGame";
import { TrendMasterGame } from "@/components/games/TrendMasterGame";
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
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handlePlayGame = (game: string) => {
    setActiveGame(game);
  };

  const handleCloseGame = () => {
    setActiveGame(null);
  };

  if (activeGame === "life-sim") {
    return <LifeSimInvestorGame onClose={handleCloseGame} />;
  }

  if (activeGame === "trend-master") {
    return <TrendMasterGame onClose={handleCloseGame} />;
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

      <div className="grid gap-4">
        {/* Life Sim Game */}
        <div className="animate-fade-in">
          <Card className="p-6 bg-gradient-primary text-white hover-lift cursor-pointer smooth-transition border-0" onClick={() => handlePlayGame("life-sim")}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center shadow-glow">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-xl">Life Sim: Investor Journey</h3>
                  <Badge className="bg-white/20">Epic</Badge>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  Live a full investing life from age 22 to retirement! Make career moves, buy homes, manage portfolios, and face real market events. Your choices shape your financial destiny.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Coins className="w-4 h-4" />
                    <span className="font-bold">Variable Rewards</span>
                  </div>
                  <Badge variant="outline" className="bg-white/10 border-white/30">Immersive</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Trend Master Game */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card className="p-6 bg-gradient-accent hover-lift cursor-pointer smooth-transition border-0" onClick={() => handlePlayGame("trend-master")}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shadow-glow">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-xl">Trend Master</h3>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Master the art of reading stock charts! Identify 20+ real chart patterns from uptrends to head-and-shoulders. Interactive charts, instant feedback, and mentor-style explanations help you see markets like a pro.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="font-bold">20+ Patterns</span>
                  </div>
                  <Badge variant="outline">Interactive</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Games;
