import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  onDailyRewards?: () => void;
}

export const DashboardHeader = ({ onDailyRewards }: DashboardHeaderProps) => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Investor";

  return (
    <div className="flex items-center justify-between py-6 px-8 bg-gradient-to-r from-background via-card/50 to-background border-b border-border/50">
      <div className="relative">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{displayName}</span>
        </h1>
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary shadow-glow animate-pulse" />
      </div>
      
      <Button
        onClick={onDailyRewards}
        className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground px-6 py-3 rounded-xl shadow-glow transition-all duration-300 hover:shadow-glow-soft hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <Gift className="w-5 h-5 mr-2 animate-bounce" />
        <span className="font-semibold">Daily Rewards</span>
      </Button>
    </div>
  );
};
