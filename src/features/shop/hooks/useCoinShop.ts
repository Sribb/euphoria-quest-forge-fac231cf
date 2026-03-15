import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  category: "power-up" | "avatar" | "profile";
  itemType: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  metadata: Record<string, any>;
}

export function useCoinShop() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // User's coin balance
  const { data: profile } = useQuery({
    queryKey: ["shop-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("coins").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  // User's inventory
  const { data: inventory } = useQuery({
    queryKey: ["user-inventory", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_inventory")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Active power-ups
  const { data: activePowerups } = useQuery({
    queryKey: ["active-powerups", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("active_powerups")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .gte("expires_at", new Date().toISOString());
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Purchase item
  const purchaseMutation = useMutation({
    mutationFn: async (item: ShopItem) => {
      if (!user) throw new Error("Not logged in");
      const balance = profile?.coins || 0;
      if (balance < item.price) throw new Error("Not enough coins");

      // Deduct coins
      const { error: coinError } = await supabase.rpc("increment_coins", {
        user_id_param: user.id,
        amount: -item.price,
      });
      if (coinError) throw coinError;

      // Log transaction
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: -item.price,
        balance_after: balance - item.price,
        transaction_type: "spend_shop",
        description: `Purchased ${item.name}`,
        item_id: item.id,
      });

      // Handle power-up activation
      if (item.category === "power-up") {
        await handlePowerUpPurchase(item);
      } else {
        // Add to inventory
        await supabase.from("user_inventory").insert({
          user_id: user.id,
          item_type: item.itemType,
          item_id: item.id,
          quantity: 1,
          metadata: item.metadata as unknown as Json,
        });
      }

      return item;
    },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ["shop-profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["active-powerups"] });
      queryClient.invalidateQueries({ queryKey: ["user-xp-stats"] });
      toast.success(`Purchased ${item.name}!`, { description: `${item.icon} Added to your inventory` });
    },
    onError: (err: Error) => {
      if (err.message === "Not enough coins") {
        toast.error("Not enough Euphorium!", { description: "Complete lessons and challenges to earn more." });
      } else {
        toast.error("Purchase failed", { description: err.message });
      }
    },
  });

  async function handlePowerUpPurchase(item: ShopItem) {
    if (!user) return;

    switch (item.itemType) {
      case "double_xp": {
        const durationMin = item.metadata.duration_minutes || 60;
        const expiresAt = new Date(Date.now() + durationMin * 60 * 1000).toISOString();
        await supabase.from("active_powerups").insert({
          user_id: user.id,
          powerup_type: "double_xp",
          expires_at: expiresAt,
        });
        break;
      }
      case "streak_freeze": {
        const uses = item.metadata.uses || 1;
        // Add freezes to the streaks table
        const { data: currentStreak } = await supabase
          .from("streaks")
          .select("streak_freezes")
          .eq("user_id", user.id)
          .single();
        await supabase
          .from("streaks")
          .update({ streak_freezes: (currentStreak?.streak_freezes || 0) + uses })
          .eq("user_id", user.id);
        break;
      }
      case "heart_refill": {
        await supabase
          .from("user_hearts")
          .update({ hearts_remaining: 5, hearts_earned_today: 0 })
          .eq("user_id", user.id);
        break;
      }
      case "hint": {
        const uses = item.metadata.uses || 1;
        // Store hints in inventory
        const { data: existing } = await supabase
          .from("user_inventory")
          .select("id, quantity")
          .eq("user_id", user.id)
          .eq("item_type", "hint")
          .eq("used_at", null as any)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("user_inventory")
            .update({ quantity: existing.quantity + uses })
            .eq("id", existing.id);
        } else {
          await supabase.from("user_inventory").insert({
            user_id: user.id,
            item_type: "hint",
            item_id: item.id,
            quantity: uses,
            metadata: item.metadata as unknown as Json,
          });
        }
        break;
      }
    }
  }

  const coins = profile?.coins || 0;
  const hasDoubleXP = (activePowerups || []).some(p => p.powerup_type === "double_xp");
  const hintCount = inventory?.filter(i => i.item_type === "hint" && !i.used_at).reduce((s, i) => s + i.quantity, 0) || 0;
  const streakFreezeCount = 0; // read from streaks table separately
  const ownedItemIds = new Set(inventory?.map(i => i.item_id) || []);

  return {
    coins,
    inventory: inventory || [],
    activePowerups: activePowerups || [],
    hasDoubleXP,
    hintCount,
    ownedItemIds,
    purchase: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
  };
}
