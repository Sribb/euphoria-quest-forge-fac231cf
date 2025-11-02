import { Gamepad2, Trophy, Star, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface GamesHubProps {
  onNavigate: (tab: string) => void;
}

export const GamesHub = ({ onNavigate }: GamesHubProps) => {
  const { user } = useAuth();

  const { data: gameStats } = useQuery({
    queryKey: ["game_stats", user?.id],
    queryFn: async () => {
      const { data: sessions } = await supabase
        .from("game_sessions")
        .select("*")
        .eq("user_id", user?.id);

      const totalGames = sessions?.length || 0;
      const avgScore = sessions?.reduce((sum, s) => sum + (s.score || 0), 0) / totalGames || 0;
      const highScore = Math.max(...(sessions?.map(s => s.score || 0) || [0]));

      return {
        totalGames,
        avgScore: Math.round(avgScore),
        highScore,
      };
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          Games Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-primary/10 rounded-lg text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold">{gameStats?.totalGames || 0}</p>
            <p className="text-xs text-muted-foreground">Played</p>
          </div>
          <div className="p-3 bg-warning/10 rounded-lg text-center">
            <Star className="w-5 h-5 text-warning mx-auto mb-1" />
            <p className="text-lg font-bold">{gameStats?.avgScore || 0}</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="p-3 bg-success/10 rounded-lg text-center">
            <Target className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-lg font-bold">{gameStats?.highScore || 0}</p>
            <p className="text-xs text-muted-foreground">High Score</p>
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-1">Practice makes perfect!</p>
          <p className="text-xs text-muted-foreground">
            Play games to sharpen your trading skills and earn rewards
          </p>
        </div>

        <Button 
          className="w-full" 
          onClick={() => onNavigate("games")}
        >
          Play Games
        </Button>
      </CardContent>
    </Card>
  );
};
