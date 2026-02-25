import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { playTradeExecuted } from "@/lib/soundEffects";

interface RealtimeUpdate {
  table: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, unknown>;
  old: Record<string, unknown>;
}

export const useRealtimePortfolio = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<RealtimeUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    console.log("[Realtime] Setting up portfolio subscription for user:", user.id);

    const channel = supabase
      .channel("portfolio-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "portfolios",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("[Realtime] Portfolio update:", payload);
          setLastUpdate({
            table: "portfolios",
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new as Record<string, unknown>,
            old: payload.old as Record<string, unknown>,
          });
          queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "portfolio_assets",
        },
        (payload) => {
          console.log("[Realtime] Asset update:", payload);
          setLastUpdate({
            table: "portfolio_assets",
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: payload.new as Record<string, unknown>,
            old: payload.old as Record<string, unknown>,
          });
          queryClient.invalidateQueries({ queryKey: ["portfolio-assets"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("[Realtime] Order update:", payload);
          const newOrder = payload.new as Record<string, unknown>;
          
          // Show toast for order status changes
          if (payload.eventType === "UPDATE" && newOrder.status) {
            const status = newOrder.status as string;
            if (status === "filled") {
              toast.success(`Order for ${newOrder.symbol} has been filled!`);
              playTradeExecuted();
            } else if (status === "cancelled") {
              toast.info(`Order for ${newOrder.symbol} was cancelled`);
            }
          }
          
          setLastUpdate({
            table: "orders",
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: newOrder,
            old: payload.old as Record<string, unknown>,
          });
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("[Realtime] Profile update:", payload);
          const newProfile = payload.new as Record<string, unknown>;
          const oldProfile = payload.old as Record<string, unknown>;
          
          // Check for level up
          if (payload.eventType === "UPDATE" && 
              newProfile.level && oldProfile.level &&
              (newProfile.level as number) > (oldProfile.level as number)) {
            toast.success(`🎉 Level Up! You're now level ${newProfile.level}!`);
          }
          
          setLastUpdate({
            table: "profiles",
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
            new: newProfile,
            old: oldProfile,
          });
          queryClient.invalidateQueries({ queryKey: ["user-xp-stats"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
      )
      .subscribe((status) => {
        console.log("[Realtime] Subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      console.log("[Realtime] Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    isConnected,
    lastUpdate,
  };
};
