import { User, Settings, Award, Trophy, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfileProps {
  onNavigate: (tab: string) => void;
}

const Profile = ({ onNavigate }: ProfileProps) => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile-full", user?.id],
    queryFn: async () => {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (profileError) throw profileError;

      const { data: streakData } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      const { data: achievementsData } = await supabase
        .from("user_achievements")
        .select(`
          *,
          achievements(*)
        `)
        .eq("user_id", user?.id);
      
      return {
        ...profileData,
        streak: streakData,
        user_achievements: achievementsData || [],
      };
    },
    enabled: !!user?.id,
  });

  const { data: lessonCount = 0 } = useQuery({
    queryKey: ["completed-lessons", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("user_lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .eq("completed", true);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.display_name || "Euphoria User";
  const level = profile?.level || 1;
  const coins = profile?.coins || 0;
  const streak = profile?.streak?.current_streak || 0;
  const achievements = profile?.user_achievements || [];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your learning journey</p>
        </div>
      </div>

      <Card className="p-6 bg-gradient-hero border-0 shadow-lg animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-4 border-primary shadow-glow">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt="User" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
            <p className="text-muted-foreground">Level {level} Investor</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-card rounded-lg">
            <div className="text-2xl font-bold">{lessonCount}</div>
            <div className="text-xs text-muted-foreground">Lessons</div>
          </div>
          <div className="text-center p-3 bg-card rounded-lg">
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center p-3 bg-card rounded-lg">
            <div className="text-2xl font-bold">{coins}</div>
            <div className="text-xs text-muted-foreground">Coins</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h3 className="text-lg font-bold mb-4">Achievements ({achievements.length})</h3>
        <div className="space-y-3">
          {achievements.length > 0 ? (
            achievements.map((userAchievement: any, index: number) => {
              const achievement = userAchievement.achievements;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gradient-hero rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-success flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Complete lessons and games to earn achievements!
            </p>
          )}
        </div>
      </Card>

      <Button className="w-full" variant="outline">
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </Button>
    </div>
  );
};

export default Profile;
