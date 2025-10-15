import { User, Award, TrendingUp, Target, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileProps {
  onNavigate: (tab: string) => void;
}

const Profile = ({ onNavigate }: ProfileProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      setDisplayName(data.display_name || "");
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: streak } = useQuery({
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

  const { data: userAchievements } = useQuery({
    queryKey: ["userAchievements", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          *,
          achievements(*)
        `)
        .eq("user_id", user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (newDisplayName: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: newDisplayName })
        .eq("id", user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
      toast.success("Profile updated!");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const portfolioReturn = portfolio
    ? ((Number(portfolio.total_value) - 10000) / 10000) * 100
    : 0;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your investing journey</p>
        </div>
      </div>

      <Card className="p-6 bg-gradient-hero border-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold text-white">
              {displayName ? displayName[0].toUpperCase() : "E"}
            </div>
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-48"
                  />
                  <Button
                    size="sm"
                    onClick={() => updateProfileMutation.mutate(displayName)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <h2 className="text-2xl font-bold">{displayName || "Euphoria User"}</h2>
              )}
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge>Level {profile?.level || 1}</Badge>
                <Badge variant="outline">{profile?.coins || 0} coins</Badge>
              </div>
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Portfolio Value</span>
          </div>
          <p className="text-2xl font-bold">
            ${portfolio?.total_value.toLocaleString() || "0"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {portfolioReturn >= 0 ? "+" : ""}{portfolioReturn.toFixed(2)}% return
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Current Streak</span>
          </div>
          <p className="text-2xl font-bold">{streak?.current_streak || 0} days</p>
          <p className="text-sm text-muted-foreground mt-1">
            Longest: {streak?.longest_streak || 0} days
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Achievements
        </h3>
        {userAchievements && userAchievements.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {userAchievements.map((ua) => {
              const achievement = ua.achievements as any;
              return (
                <div
                  key={ua.id}
                  className="p-4 bg-gradient-hero rounded-lg border border-primary/20"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="font-bold text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Earned {new Date(ua.earned_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Complete games and lessons to earn achievements!
          </p>
        )}
      </Card>
    </div>
  );
};

export default Profile;
