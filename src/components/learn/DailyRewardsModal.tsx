import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, Star, Coins, Flame, Trophy, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyRewardsModal = ({ isOpen, onClose }: DailyRewardsModalProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateStreakMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("update-streak", {
        body: { userId: user?.id },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["streak", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      
      const newStreak = data?.streak?.current_streak || 0;
      const coinsEarned = data?.coinsEarned || 50;
      
      if (newStreak === 1) {
        toast.success("🎉 Daily reward claimed!", {
          description: `You earned ${coinsEarned} coins! Streak started!`,
          duration: 4000,
        });
      } else if ([3, 7, 10, 14, 30].includes(newStreak)) {
        toast.success(`🏆 ${newStreak}-day streak milestone!`, {
          description: `You earned ${coinsEarned} coins + ${newStreak * 10} bonus coins!`,
          duration: 5000,
        });
      } else {
        toast.success(`🔥 ${newStreak}-day streak!`, {
          description: `You earned ${coinsEarned} coins! Keep it up!`,
          duration: 4000,
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to claim daily reward", {
        description: error.message || "Please try again later",
      });
    },
  });

  const currentStreak = streakData?.current_streak || 0;
  const lastLoginDate = streakData?.last_login_date;
  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = lastLoginDate === today;
  
  const nextMilestone = [3, 7, 10, 14, 30].find(m => m > currentStreak) || 30;
  const daysUntilMilestone = nextMilestone - currentStreak;

  const dailyReward = 50;
  const milestoneBonus = [3, 7, 10, 14, 30].includes(currentStreak + 1) ? (currentStreak + 1) * 10 : 0;
  const tomorrowReward = dailyReward + ([3, 7, 10, 14, 30].includes(currentStreak + 1) ? milestoneBonus : 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-primary/20">
        {/* Animated Header */}
        <div className="relative p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[url('/sparkle-pattern.svg')] opacity-10 animate-pulse" />
          <Sparkles className="absolute top-4 right-4 w-8 h-8 text-primary animate-bounce" />
          <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-primary animate-bounce delay-150" />
          
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center mb-2">
              Daily Rewards
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              Come back every day to claim your rewards and build your streak!
            </p>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          {/* Current Streak Display */}
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-glow">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</h3>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next milestone</span>
                <span className="font-semibold">{nextMilestone} days</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500 shadow-glow"
                  style={{ width: `${(currentStreak / nextMilestone) * 100}%` }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {daysUntilMilestone} more day{daysUntilMilestone !== 1 ? 's' : ''} to milestone bonus!
              </p>
            </div>
          </Card>

          {/* Today's Reward */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={cn(
              "p-6 transition-all duration-300",
              isClaimedToday 
                ? "bg-success/10 border-success/20" 
                : "bg-primary/5 border-primary/20 ring-2 ring-primary/30 shadow-glow"
            )}>
              <div className="text-center space-y-3">
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-full flex items-center justify-center",
                  isClaimedToday 
                    ? "bg-success/20" 
                    : "bg-gradient-to-br from-primary to-primary/70 shadow-glow animate-pulse"
                )}>
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Today's Reward</h4>
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                    <Coins className="w-5 h-5" />
                    {dailyReward + milestoneBonus}
                  </div>
                  {milestoneBonus > 0 && (
                    <p className="text-xs text-yellow-500 font-semibold mt-1">
                      +{milestoneBonus} Milestone Bonus!
                    </p>
                  )}
                </div>
                {isClaimedToday && (
                  <div className="text-sm text-success font-semibold">
                    ✓ Claimed
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-muted/30 border-muted">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-muted-foreground">Tomorrow</h4>
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-muted-foreground">
                    <Coins className="w-5 h-5" />
                    {tomorrowReward}
                  </div>
                  {[3, 7, 10, 14, 30].includes(currentStreak + 1) && (
                    <p className="text-xs text-yellow-500/70 font-semibold mt-1">
                      Milestone reward!
                    </p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available in 24h
                </div>
              </div>
            </Card>
          </div>

          {/* Current Coins */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">
              Your balance: <span className="font-bold text-foreground">{profile?.coins || 0}</span> coins
            </span>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => updateStreakMutation.mutate()}
            disabled={isClaimedToday || updateStreakMutation.isPending}
            className={cn(
              "w-full h-14 text-lg font-semibold transition-all duration-300",
              isClaimedToday 
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gradient-primary shadow-glow hover:shadow-glow-soft hover:scale-105"
            )}
          >
            {updateStreakMutation.isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Claiming...
              </>
            ) : isClaimedToday ? (
              <>
                <Gift className="w-5 h-5 mr-2" />
                Claimed Today ✓
              </>
            ) : (
              <>
                <Gift className="w-5 h-5 mr-2 animate-bounce" />
                Claim Daily Reward
              </>
            )}
          </Button>

          {isClaimedToday && (
            <p className="text-xs text-center text-muted-foreground">
              💡 Come back tomorrow to continue your streak and earn more rewards!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
