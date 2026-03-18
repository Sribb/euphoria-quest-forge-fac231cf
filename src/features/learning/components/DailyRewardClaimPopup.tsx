import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Coins, Zap, Award, Crown, Gem, Target, Shirt, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type RewardRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

interface Reward {
  rarity: RewardRarity;
  name: string;
  description: string;
  value: number;
  icon: typeof Coins;
  type: string;
}

const REWARD_POOL: Reward[] = [
  { type: "coins", rarity: "common", name: "50 Coins", description: "Basic currency", value: 50, icon: Coins },
  { type: "coins", rarity: "common", name: "75 Coins", description: "Basic currency", value: 75, icon: Coins },
  { type: "xp_boost", rarity: "common", name: "10% XP Boost", description: "For 1 hour", value: 10, icon: Zap },
  { type: "coins", rarity: "uncommon", name: "100 Coins", description: "Nice bonus", value: 100, icon: Coins },
  { type: "xp_boost", rarity: "uncommon", name: "25% XP Boost", description: "For 2 hours", value: 25, icon: Zap },
  { type: "badge", rarity: "uncommon", name: "Daily Warrior", description: "Show dedication", value: 0, icon: Award },
  { type: "coins", rarity: "rare", name: "200 Coins", description: "Great reward!", value: 200, icon: Coins },
  { type: "xp_boost", rarity: "rare", name: "50% XP Boost", description: "For 4 hours", value: 50, icon: Zap },
  { type: "multiplier", rarity: "rare", name: "2x Streak Multiplier", description: "For 7 days", value: 2, icon: Target },
  { type: "coins", rarity: "epic", name: "500 Coins", description: "Amazing find!", value: 500, icon: Coins },
  { type: "badge", rarity: "epic", name: "Market Sage", description: "Legendary badge", value: 0, icon: Trophy },
  { type: "coins", rarity: "legendary", name: "1000 Coins", description: "JACKPOT!", value: 1000, icon: Crown },
  { type: "cosmetic", rarity: "legendary", name: "Golden Crown", description: "Ultimate prestige", value: 0, icon: Crown },
];

const RARITY_STYLES: Record<RewardRarity, { color: string; bg: string }> = {
  common: { color: "text-muted-foreground", bg: "bg-muted/30" },
  uncommon: { color: "text-emerald-400", bg: "bg-emerald-500/10" },
  rare: { color: "text-sky-400", bg: "bg-sky-500/10" },
  epic: { color: "text-amber-400", bg: "bg-amber-500/10" },
  legendary: { color: "text-yellow-300", bg: "bg-yellow-400/10" },
};

function pickReward(streakMultiplier = 1): Reward {
  const r = Math.random() * 100;
  const lc = Math.min(1 + streakMultiplier * 0.5, 5);
  const ec = Math.min(4 + streakMultiplier, 10);
  const rc = Math.min(10 + streakMultiplier * 2, 20);
  let rarity: RewardRarity;
  if (r < lc) rarity = "legendary";
  else if (r < lc + ec) rarity = "epic";
  else if (r < lc + ec + rc) rarity = "rare";
  else if (r < lc + ec + rc + 25) rarity = "uncommon";
  else rarity = "common";
  const pool = REWARD_POOL.filter((p) => p.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notificationId: string;
}

export const DailyRewardClaimPopup = ({ isOpen, onClose, notificationId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reward, setReward] = useState<Reward | null>(null);

  const claimMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("update-streak", {
        body: { userId: user?.id },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["streak"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      const streak = data?.streak?.current_streak || 0;
      const r = pickReward(Math.floor(streak / 7));
      setReward(r);

      // Mark the notification as read
      supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId)
        .then(() => queryClient.invalidateQueries({ queryKey: ["notifications"] }));

      const emojis: Record<string, string> = { common: "🎁", uncommon: "✨", rare: "💎", epic: "🌟", legendary: "👑" };
      toast.success(`${emojis[r.rarity]} ${r.rarity.toUpperCase()} — ${r.name}`);
    },
    onError: (err: any) => {
      toast.error("Failed to claim reward", { description: err.message });
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-xs w-full text-center space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {reward ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${RARITY_STYLES[reward.rarity].bg}`}
                >
                  <reward.icon className={`w-8 h-8 ${RARITY_STYLES[reward.rarity].color}`} />
                </motion.div>
                <p className={`text-xs font-bold uppercase tracking-widest ${RARITY_STYLES[reward.rarity].color}`}>
                  {reward.rarity}
                </p>
                <h3 className="text-xl font-bold text-foreground">{reward.name}</h3>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
                <Button onClick={onClose} className="w-full rounded-xl">
                  Nice!
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Daily Reward</h3>
                <p className="text-sm text-muted-foreground">
                  Claim your mystery reward and keep your streak alive!
                </p>
                <Button
                  onClick={() => claimMutation.mutate()}
                  disabled={claimMutation.isPending}
                  className="w-full rounded-xl"
                >
                  {claimMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Opening…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Claim Reward
                    </span>
                  )}
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
