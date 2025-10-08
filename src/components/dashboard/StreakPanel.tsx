import { Flame, Gift, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const StreakPanel = () => {
  const currentStreak = 7;
  const nextMilestone = 10;
  const progress = (currentStreak / nextMilestone) * 100;

  return (
    <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500 animate-bounce-subtle" />
          <h3 className="text-xl font-bold">Daily Streak</h3>
        </div>
        <Trophy className="w-5 h-5 text-warning" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{currentStreak} days</span>
            <span className="text-muted-foreground">Next: {nextMilestone} days</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="flex gap-2">
          {[3, 7, 10, 14, 30].map((day) => (
            <div
              key={day}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                currentStreak >= day
                  ? "bg-gradient-success text-success-foreground shadow-md scale-105"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span className="text-xs font-bold">{day}d</span>
            </div>
          ))}
        </div>

        <Button className="w-full bg-gradient-gold hover:opacity-90 transition-opacity">
          <Gift className="w-4 h-4 mr-2" />
          Claim Today's Reward
        </Button>
      </div>
    </Card>
  );
};
