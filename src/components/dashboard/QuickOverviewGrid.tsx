import { TrendingUp, Target, BookOpen, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePortfolioValue } from "@/hooks/usePortfolioValue";
import { formatDollar } from "@/lib/formatters";

export const QuickOverviewGrid = () => {
  const { totalValue } = usePortfolioValue();
  
  const portfolioChange = 3.2; // Mock data
  const userLevel = 12;
  const userXP = 2450;
  const nextLevelXP = 3000;
  const xpProgress = (userXP / nextLevelXP) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Market Overview */}
      <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-bold text-foreground">Market Overview</h4>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">S&P 500</span>
            <span className="text-sm font-semibold text-green-500">+0.8%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">NASDAQ</span>
            <span className="text-sm font-semibold text-green-500">+1.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Your Portfolio</span>
            <span className="text-sm font-semibold text-primary">+{portfolioChange}%</span>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
            <div className="text-2xl font-bold text-foreground">{formatDollar(totalValue, 2)}</div>
          </div>
        </div>
      </Card>

      {/* User Progress */}
      <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h4 className="font-bold text-foreground">Your Progress</h4>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Level {userLevel}</span>
              <span className="text-sm font-semibold text-primary">{userXP} / {nextLevelXP} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-card/50 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Lessons</div>
              <div className="text-lg font-bold text-foreground">24/30</div>
            </div>
            <div className="p-2 bg-card/50 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">Streak</div>
              <div className="text-lg font-bold text-primary">7 days</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Lesson */}
      <Card className="p-6 bg-gradient-surface border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift cursor-pointer group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <BookOpen className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
          </div>
          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Next Lesson</h4>
        </div>
        <div className="space-y-3">
          <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            Options Trading Basics
          </h5>
          <p className="text-sm text-muted-foreground">
            Learn the fundamentals of call and put options, strike prices, and expiration dates.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>⏱️ 15 min</span>
            <span>•</span>
            <span>📊 Intermediate</span>
          </div>
        </div>
      </Card>

      {/* AI Tip of the Day */}
      <Card className="p-6 bg-gradient-accent border-border shadow-glow-soft hover:shadow-glow transition-all duration-300 hover-lift">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <h4 className="font-bold text-foreground">AI Tip of the Day</h4>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-foreground font-medium leading-relaxed">
            "Consider dollar-cost averaging into your positions rather than timing the market. 
            This strategy reduces the impact of volatility and removes emotional decision-making."
          </p>
          <div className="pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              💡 Personalized based on your trading patterns
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
