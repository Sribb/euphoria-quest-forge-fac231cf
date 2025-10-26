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
    <Card className="p-10 bg-gradient-hero border-0 shadow-lg rounded-2xl animate-fade-in">
      <div className="flex items-center justify-between">
        {/* Left: User Info */}
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20 border-4 border-primary shadow-glow">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt="User" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">Welcome, {displayName}!</h2>
              <div title="View Premium">
                <Crown 
                  className="w-6 h-6 text-warning animate-bounce-subtle cursor-pointer hover:scale-110 transition-transform" 
                  onClick={() => onNavigate?.("settings")}
                />
              </div>
            </div>
            <p className="text-muted-foreground text-lg">Ready to learn and grow today?</p>
            
            <div className="flex items-center gap-4 mt-4">
              <Badge className="bg-gradient-gold text-warning-foreground text-sm px-4 py-1.5">
                Level {level}
              </Badge>
              <Badge className="bg-gradient-success text-success-foreground text-sm px-4 py-1.5">
                {coins} Coins
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Streak & Logout */}
        <div className="flex items-center gap-6">
          <Badge variant="secondary" className="gap-2 px-6 py-3 text-base">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{streak} Day Streak</span>
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="hover:bg-destructive/10 hover:text-destructive h-12 w-12"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
