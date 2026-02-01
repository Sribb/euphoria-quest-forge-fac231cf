import { Trophy, Brain, Users, Coins, TrendingUp, Globe, Wallet, Gamepad2, Zap, Play } from "lucide-react";
import { useState } from "react";
import { LifeSimInvestorGame } from "@/features/games/components/LifeSimInvestorGame";
import { TrendMasterGame } from "@/features/games/components/TrendMasterGame";
import { AICompetitorGame } from "@/features/games/components/AICompetitorGame";
import { MarketReactionGame } from "@/features/games/components/MarketReactionGame";
import { BudgetBalancerGame } from "@/features/games/components/BudgetBalancerGame";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GamesProps {
  onNavigate: (tab: string) => void;
}

const Games = ({ onNavigate }: GamesProps) => {
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

  if (activeGame === "ai-competitor") {
    return <AICompetitorGame onClose={handleCloseGame} />;
  }

  if (activeGame === "market-reaction") {
    return <MarketReactionGame onClose={handleCloseGame} />;
  }

  if (activeGame === "budget-balancer") {
    return <BudgetBalancerGame onClose={handleCloseGame} />;
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex items-center gap-3 md:gap-4 animate-fade-in">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-soft">
          <Gamepad2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold truncate">Investment Games</h1>
          <p className="text-sm md:text-base text-muted-foreground truncate">Learn investing through interactive challenges</p>
        </div>
      </div>

      {/* Featured Games Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Trend Master - Featured */}
        <Card className="lg:col-span-2 p-6 bg-gradient-primary text-white border-0 shadow-glow-soft animate-fade-in overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row gap-6 items-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center shadow-glow flex-shrink-0">
              <TrendingUp className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <h3 className="font-bold text-2xl">Trend Master</h3>
                <Badge className="bg-white/20 text-white border-0">Featured</Badge>
              </div>
              <p className="text-white/90 mb-4 max-w-xl">
                Master the art of reading stock charts! Identify 20+ real chart patterns from uptrends to 
                head-and-shoulders. Interactive charts, instant feedback, and mentor-style explanations.
              </p>
              <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-5 h-5" />
                  <span className="font-bold">20+ Patterns</span>
                </div>
                <Badge variant="outline" className="bg-white/10 border-white/30 text-white">Educational</Badge>
                <Badge variant="outline" className="bg-white/10 border-white/30 text-white">Interactive</Badge>
              </div>
            </div>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg gap-2 px-8"
              onClick={() => handlePlayGame("trend-master")}
            >
              <Play className="w-5 h-5" />
              Start Game
            </Button>
          </div>
        </Card>

        {/* Market Reaction Game - NEW */}
        <Card className="p-6 bg-gradient-accent border-0 shadow-md animate-fade-in hover-lift cursor-pointer smooth-transition" onClick={() => handlePlayGame("market-reaction")}>
          <div className="flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-glow-soft">
                <Globe className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-xl">Market Reaction</h3>
                  <Badge className="bg-success/20 text-success border-0">New!</Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Real-world news scenarios test your market instincts. Will the Fed rate cut cause a rally or crash? 
              Predict bullish, bearish, or neutral reactions and learn how global events move markets.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-5 h-5 text-warning" />
                <span className="font-bold text-primary">15 Scenarios</span>
              </div>
              <Button size="sm" className="gap-2">
                <Play className="w-4 h-4" />
                Play Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Budget Balancer Game - NEW */}
        <Card className="p-6 bg-gradient-accent border-0 shadow-md animate-fade-in hover-lift cursor-pointer smooth-transition" onClick={() => handlePlayGame("budget-balancer")}>
          <div className="flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-success/20 flex items-center justify-center shadow-glow-soft">
                <Wallet className="w-7 h-7 text-success" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-xl">Budget Balancer</h3>
                  <Badge className="bg-success/20 text-success border-0">New!</Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Master the 50/30/20 rule! Balance needs, wants, and savings across life scenarios. 
              Fresh graduate? Family of four? Entrepreneur? Learn budgeting strategies that work.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Coins className="w-5 h-5 text-success" />
                <span className="font-bold text-success">3 Challenges</span>
              </div>
              <Button size="sm" className="gap-2">
                <Play className="w-4 h-4" />
                Play Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Life Sim Game */}
        <Card className="p-6 bg-gradient-accent border-0 shadow-md animate-fade-in hover-lift cursor-pointer smooth-transition" onClick={() => handlePlayGame("life-sim")}>
          <div className="flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-glow-soft">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-xl">Life Sim: Investor Journey</h3>
                  <Badge variant="secondary">Epic</Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Live a full investing life from age 22 to retirement! Make career moves, buy homes, 
              manage portfolios, and face real market events. Your choices shape your financial destiny.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Coins className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary">40+ Years</span>
              </div>
              <Button size="sm" className="gap-2">
                <Play className="w-4 h-4" />
                Play Now
              </Button>
            </div>
          </div>
        </Card>

        {/* AI Competitor Game */}
        <Card className="p-6 bg-gradient-accent border-0 shadow-md animate-fade-in hover-lift cursor-pointer smooth-transition" onClick={() => handlePlayGame("ai-competitor")}>
          <div className="flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center shadow-glow-soft">
                <Brain className="w-7 h-7 text-purple-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-xl">AI Challenge</h3>
                  <Badge variant="secondary">Competitive</Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 flex-1">
              Compete against 4 AI traders with unique strategies: Momentum Mike, Value Victor, 
              Aggressive Amy, and Conservative Chris. Can you outperform the algorithms?
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-purple-500">4 AI Opponents</span>
              </div>
              <Button size="sm" className="gap-2">
                <Play className="w-4 h-4" />
                Play Now
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Games;
