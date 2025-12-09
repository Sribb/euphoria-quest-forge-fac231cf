import { useXPSystem } from "@/hooks/useXPSystem";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp } from "lucide-react";

export const XPOrb = () => {
  const { userStats, levelThresholds, getXPProgress, levelUpAnimation, clearLevelUpAnimation } = useXPSystem();

  const xpProgress = getXPProgress();
  const currentLevelData = levelThresholds?.find(l => l.level === userStats?.level);

  if (!userStats) return null;

  return (
    <div className="relative">
      {/* Level Up Animation Overlay */}
      {levelUpAnimation && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={clearLevelUpAnimation}
        >
          <div className="text-center p-8 bg-card border border-primary/30 rounded-3xl shadow-glow animate-scale-in">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-4xl font-bold text-white">{levelUpAnimation.newLevel}</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Level Up!</h2>
            <p className="text-lg text-foreground">{levelUpAnimation.title}</p>
            <p className="text-sm text-muted-foreground mt-4">Click anywhere to continue</p>
          </div>
        </div>
      )}

      {/* XP Orb Display */}
      <div className="relative group cursor-pointer">
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all" />
        
        {/* Main Orb */}
        <div className={cn(
          "relative w-20 h-20 rounded-full border-4 border-primary/50",
          "bg-gradient-to-br from-primary/30 to-primary/10",
          "flex flex-col items-center justify-center",
          "shadow-glow transition-transform group-hover:scale-105"
        )}>
          <span className="text-2xl font-bold text-primary">{userStats.level}</span>
          <Sparkles className="w-4 h-4 text-primary/70" />
        </div>

        {/* XP Progress Ring */}
        <svg 
          className="absolute inset-0 w-20 h-20 -rotate-90"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - xpProgress.percentage / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Hover Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">{currentLevelData?.title || "Investor"}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">XP Progress</span>
                <span className="font-medium">{xpProgress.current}/{xpProgress.required}</span>
              </div>
              <Progress value={xpProgress.percentage} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                Total XP: {userStats.experience_points}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
