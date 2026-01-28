import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DashboardHeader = () => {
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
    <div className="py-6 px-8 bg-gradient-to-r from-background via-card/50 to-background border-b border-border/50">
      <div className="relative">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="text-primary">{displayName}</span>
        </h1>
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary shadow-glow animate-pulse" />
      </div>
    </div>
  );
};
