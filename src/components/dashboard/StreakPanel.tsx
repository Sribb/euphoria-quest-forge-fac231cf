import { Flame, Gift, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEffect } from "react";

export const StreakPanel = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  // Auto-update streak on component mount
  useEffect(() => {
    if (user?.id && streakData) {
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = streakData.last_login_date;
      
      // Only update if not already updated today
      if (lastLogin !== today) {
        updateStreakMutation.mutate();
      }
    }
  }, [user?.id, streakData?.last_login_date]);

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
      
      if (data?.streak?.current_streak && [3, 7, 10, 14, 30].includes(data.streak.current_streak)) {
        toast.success(`🎉 ${data.streak.current_streak}-day streak! You earned ${data.streak.current_streak * 10} coins!`);
      }
    },
    onError: () => {
      toast.error("Failed to update streak");
    },
  });

  const currentStreak = streakData?.current_streak || 0;
  const nextMilestone = [3, 7, 10, 14, 30].find(m => m > currentStreak) || 30;
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

        <Button 
          className="w-full bg-gradient-gold hover:opacity-90 transition-opacity"
          onClick={() => updateStreakMutation.mutate()}
          disabled={updateStreakMutation.isPending || streakData?.last_login_date === new Date().toISOString().split('T')[0]}
        >
          <Gift className="w-4 h-4 mr-2" />
          {streakData?.last_login_date === new Date().toISOString().split('T')[0] 
            ? "Already Claimed Today" 
            : "Claim Today's Reward"
          }
        </Button>
      </div>
    </Card>
  );
};
