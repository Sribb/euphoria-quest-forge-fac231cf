import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { XPOrb } from "./XPOrb";
import { RealtimeIndicator } from "./RealtimeIndicator";
import { motion } from "framer-motion";

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
    <div className="px-4 md:px-8 py-5 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Welcome back, <span className="text-primary">{displayName}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's your overview</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <XPOrb />
          <RealtimeIndicator />
        </div>
      </div>
    </div>
  );
};
