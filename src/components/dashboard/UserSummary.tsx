import { Crown, Flame, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserSummaryProps {
  onNavigate?: (tab: string) => void;
}

export const UserSummary = ({ onNavigate }: UserSummaryProps = {}) => {
  const { user, signOut } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
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
      
      return {
        ...profileData,
        streak: streakData,
      };
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.display_name || "Euphoria User";
  const level = profile?.level || 1;
  const coins = profile?.coins || 0;
  const streak = profile?.streak?.current_streak || 0;

  return (
    <Card className="p-6 bg-gradient-hero border-0 shadow-md animate-fade-in">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 border-4 border-primary shadow-glow">
          <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt="User" />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">Welcome, {displayName}!</h2>
            <div title="View Premium">
              <Crown 
                className="w-5 h-5 text-warning animate-bounce-subtle cursor-pointer hover:scale-110 transition-transform" 
                onClick={() => onNavigate?.("settings")}
              />
            </div>
          </div>
          <p className="text-muted-foreground">Ready to learn and grow today?</p>
          
          <div className="flex items-center gap-4 mt-3">
            <Badge variant="secondary" className="gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold">{streak} Day Streak</span>
            </Badge>
            <Badge className="bg-gradient-gold text-warning-foreground">
              Level {level}
            </Badge>
            <Badge className="bg-gradient-success text-success-foreground">
              {coins} Coins
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};
