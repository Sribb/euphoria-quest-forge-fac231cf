import { Flame, Gift, Trophy, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const StreakPanel = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [timeUntilReset, setTimeUntilReset] = useState("");

  // Fetch user's streak data
  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Countdown timer for next claim
  useEffect(() => {
    if (!streakData?.last_login_date) return;

    const updateCountdown = () => {
      const now = new Date();
      const lastClaim = new Date(streakData.last_login_date);
      const tomorrow = new Date(lastClaim);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeUntilReset("Available now!");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [streakData?.last_login_date]);

  const updateStreakMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('update-streak', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["streak", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      
      const newStreak = data?.streak?.current_streak || 0;
      
      if (newStreak === 1) {
        toast.success("🔥 Daily reward claimed! Streak started!", {
          description: "Come back tomorrow to keep your streak going!",
          duration: 4000,
        });
      } else if ([3, 7, 10, 14, 30].includes(newStreak)) {
        toast.success(`🎉 ${newStreak}-day streak milestone!`, {
          description: `You earned ${newStreak * 10} bonus coins!`,
          duration: 5000,
        });
      } else {
        toast.success(`🔥 Daily reward claimed! ${newStreak}-day streak!`, {
          description: "Keep it up! Next milestone coming soon.",
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
  const nextMilestone = [3, 7, 10, 14, 30].find(m => m > currentStreak) || 30;
  const progress = (currentStreak / nextMilestone) * 100;
  const isClaimedToday = streakData?.last_login_date === new Date().toISOString().split('T')[0];

  return (
    <Card className="p-10 animate-fade-in shadow-lg rounded-2xl" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-500 animate-bounce-subtle" />
          <h3 className="text-3xl font-bold">Daily Rewards</h3>
        </div>
        <Trophy className="w-7 h-7 text-warning" />
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-base mb-3">
            <span className="text-muted-foreground font-semibold text-lg">
              {currentStreak} day streak 🔥
            </span>
            <span className="text-muted-foreground text-lg">
              Next milestone: {nextMilestone} days
            </span>
          </div>
          <Progress value={progress} className="h-4" />
        </div>

        <div className="flex gap-4">
          {[3, 7, 10, 14, 30].map((day) => (
            <div
              key={day}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                currentStreak >= day
                  ? "bg-gradient-success text-success-foreground shadow-md scale-105"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Gift className="w-6 h-6" />
              <span className="text-sm font-bold">{day}d</span>
              <span className="text-xs">+{day * 10}</span>
            </div>
          ))}
        </div>

        {isClaimedToday && (
          <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-xl">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-base text-muted-foreground">
              Next claim in: <span className="font-bold">{timeUntilReset}</span>
            </span>
          </div>
        )}

        <Button 
          className="w-full bg-gradient-gold hover:opacity-90 transition-all disabled:opacity-50 h-12 text-base"
          onClick={() => updateStreakMutation.mutate()}
          disabled={updateStreakMutation.isPending || isClaimedToday}
        >
          <Gift className="w-5 h-5 mr-2" />
          {updateStreakMutation.isPending 
            ? "Claiming..." 
            : isClaimedToday 
            ? "Claimed Today ✓" 
            : "Claim Daily Reward"
          }
        </Button>
      </div>
    </Card>
  );
};
