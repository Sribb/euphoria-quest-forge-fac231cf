import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Gift, Coins, Flame, Sparkles, Zap, Target, Award, Crown, Gem, Shirt, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RewardType = 'coins' | 'xp_boost' | 'badge' | 'cosmetic' | 'multiplier';
type RewardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface Reward {
  type: RewardType;
  rarity: RewardRarity;
  name: string;
  description: string;
  value: number;
  icon: typeof Coins;
}

const REWARD_POOL: Reward[] = [
  { type: 'coins', rarity: 'common', name: '50 Coins', description: 'Basic currency', value: 50, icon: Coins },
  { type: 'coins', rarity: 'common', name: '75 Coins', description: 'Basic currency', value: 75, icon: Coins },
  { type: 'xp_boost', rarity: 'common', name: '10% XP Boost', description: 'For 1 hour', value: 10, icon: Zap },
  { type: 'coins', rarity: 'uncommon', name: '100 Coins', description: 'Nice bonus', value: 100, icon: Coins },
  { type: 'xp_boost', rarity: 'uncommon', name: '25% XP Boost', description: 'For 2 hours', value: 25, icon: Zap },
  { type: 'badge', rarity: 'uncommon', name: 'Daily Warrior', description: 'Show your dedication', value: 0, icon: Award },
  { type: 'coins', rarity: 'rare', name: '200 Coins', description: 'Great reward!', value: 200, icon: Coins },
  { type: 'xp_boost', rarity: 'rare', name: '50% XP Boost', description: 'For 4 hours', value: 50, icon: Zap },
  { type: 'cosmetic', rarity: 'rare', name: 'Neon Avatar Frame', description: 'Stand out', value: 0, icon: Shirt },
  { type: 'multiplier', rarity: 'rare', name: '2x Streak Multiplier', description: 'For 7 days', value: 2, icon: Target },
  { type: 'coins', rarity: 'epic', name: '500 Coins', description: 'Amazing find!', value: 500, icon: Coins },
  { type: 'xp_boost', rarity: 'epic', name: '100% XP Boost', description: 'For 24 hours', value: 100, icon: Zap },
  { type: 'badge', rarity: 'epic', name: 'Market Sage', description: 'Legendary trader badge', value: 0, icon: Trophy },
  { type: 'coins', rarity: 'legendary', name: '1000 Coins', description: 'JACKPOT!', value: 1000, icon: Crown },
  { type: 'cosmetic', rarity: 'legendary', name: 'Golden Crown', description: 'Ultimate prestige', value: 0, icon: Crown },
  { type: 'multiplier', rarity: 'legendary', name: '3x Streak Multiplier', description: 'For 30 days', value: 3, icon: Gem },
];

const RARITY_META: Record<RewardRarity, { label: string; color: string; border: string; bg: string; glow: string }> = {
  common: { label: 'Common', color: 'hsl(180,15%,55%)', border: 'hsla(180,15%,55%,0.25)', bg: 'hsla(180,15%,55%,0.06)', glow: 'none' },
  uncommon: { label: 'Uncommon', color: 'hsl(172,60%,50%)', border: 'hsla(172,60%,50%,0.3)', bg: 'hsla(172,60%,50%,0.08)', glow: '0 0 12px hsla(172,60%,50%,0.25)' },
  rare: { label: 'Rare', color: 'hsl(190,80%,55%)', border: 'hsla(190,80%,55%,0.35)', bg: 'hsla(190,80%,55%,0.1)', glow: '0 0 16px hsla(190,80%,55%,0.3)' },
  epic: { label: 'Epic', color: 'hsl(45,90%,55%)', border: 'hsla(45,90%,55%,0.4)', bg: 'hsla(45,90%,55%,0.1)', glow: '0 0 20px hsla(45,90%,55%,0.35)' },
  legendary: { label: 'Legendary', color: 'hsl(42,100%,60%)', border: 'hsla(42,100%,60%,0.6)', bg: 'hsla(42,100%,60%,0.12)', glow: '0 0 30px hsla(42,100%,60%,0.5)' },
};

// Scale multiplier for rarity tiers
const RARITY_SCALE: Record<RewardRarity, number> = {
  common: 0.85,
  uncommon: 0.92,
  rare: 1.0,
  epic: 1.08,
  legendary: 1.18,
};

const getRandomReward = (streakMultiplier: number = 1): Reward => {
  const rand = Math.random() * 100;
  let rarity: RewardRarity;
  const legendaryChance = Math.min(1 + (streakMultiplier * 0.5), 5);
  const epicChance = Math.min(4 + (streakMultiplier * 1), 10);
  const rareChance = Math.min(10 + (streakMultiplier * 2), 20);
  const uncommonChance = 25;
  if (rand < legendaryChance) rarity = 'legendary';
  else if (rand < legendaryChance + epicChance) rarity = 'epic';
  else if (rand < legendaryChance + epicChance + rareChance) rarity = 'rare';
  else if (rand < legendaryChance + epicChance + rareChance + uncommonChance) rarity = 'uncommon';
  else rarity = 'common';
  const pool = REWARD_POOL.filter(r => r.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
};

// Animated counter hook
function useCountUp(target: number, duration = 1200, active = true) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    if (!active) { setValue(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, active]);
  return value;
}

export const DailyRewardsModal = ({ isOpen, onClose }: DailyRewardsModalProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [claimedReward, setClaimedReward] = useState<Reward | null>(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [progressFill, setProgressFill] = useState(0);

  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("streaks").select("*").eq("user_id", user?.id).single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("coins").eq("id", user?.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const currentStreak = streakData?.current_streak || 0;
  const lastLoginDate = streakData?.last_login_date;
  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = lastLoginDate === today;
  const nextMilestone = [3, 7, 10, 14, 30].find(m => m > currentStreak) || 30;
  const daysUntilMilestone = nextMilestone - currentStreak;
  const streakMultiplier = Math.floor(currentStreak / 7) + 1;
  const targetProgress = (currentStreak / nextMilestone) * 100;

  const animatedStreak = useCountUp(currentStreak, 1400, isOpen);
  const animatedCoins = useCountUp(profile?.coins || 0, 1600, isOpen);

  // Animate progress bar on open
  useEffect(() => {
    if (isOpen) {
      setProgressFill(0);
      const t = setTimeout(() => setProgressFill(targetProgress), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen, targetProgress]);

  const updateStreakMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("update-streak", { body: { userId: user?.id } });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["streak", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      const newStreak = data?.streak?.current_streak || 0;
      const reward = getRandomReward(Math.floor(newStreak / 7));
      setClaimedReward(reward);
      setShowRewardAnimation(true);
      const milestoneBonus = [3, 7, 10, 14, 30].includes(newStreak) ? newStreak * 10 : 0;
      const emojis: Record<string, string> = { common: '🎁', uncommon: '✨', rare: '💎', epic: '🌟', legendary: '👑' };
      toast.success(`${emojis[reward.rarity]} ${reward.rarity.toUpperCase()} REWARD!`, {
        description: `You got ${reward.name}! ${milestoneBonus > 0 ? `+${milestoneBonus} milestone bonus coins!` : ''}`,
        duration: 5000,
      });
      setTimeout(() => setShowRewardAnimation(false), 3000);
    },
    onError: (error: any) => {
      toast.error("Failed to claim daily reward", { description: error.message || "Please try again later" });
    },
  });

  const previewRewards = (['common', 'uncommon', 'rare', 'epic', 'legendary'] as RewardRarity[]).map(
    r => REWARD_POOL.find(p => p.rarity === r)!
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg p-0 overflow-hidden border-0 max-h-[92vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(165deg, hsl(220,30%,8%) 0%, hsl(225,35%,6%) 50%, hsl(230,25%,4%) 100%)',
          fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        }}
      >
        {/* Reward reveal overlay */}
        <AnimatePresence>
          {showRewardAnimation && claimedReward && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md"
              style={{ background: 'hsla(225,35%,6%,0.95)' }}
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="text-center space-y-5 px-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-28 h-28 mx-auto rounded-full flex items-center justify-center border-2"
                  style={{
                    background: RARITY_META[claimedReward.rarity].bg,
                    borderColor: RARITY_META[claimedReward.rarity].border,
                    boxShadow: RARITY_META[claimedReward.rarity].glow,
                  }}
                >
                  <claimedReward.icon className="w-14 h-14" style={{ color: RARITY_META[claimedReward.rarity].color }} />
                </motion.div>
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: RARITY_META[claimedReward.rarity].color, fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
                  {claimedReward.rarity}
                </p>
                <h3 className="text-2xl font-bold" style={{ color: 'hsl(40,80%,85%)', fontFamily: "'EB Garamond', 'Georgia', serif" }}>
                  {claimedReward.name}
                </h3>
                <p className="text-sm" style={{ color: 'hsla(210,15%,70%,0.7)' }}>{claimedReward.description}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 space-y-5">
          {/* ─── Header ─── */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center pt-2 pb-1">
            <h2 style={{ fontFamily: "'EB Garamond', 'Georgia', serif", color: 'hsl(42,70%,72%)', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '0.02em' }}>
              Daily Rewards
            </h2>
            <p className="text-xs mt-1" style={{ color: 'hsla(210,15%,60%,0.6)', fontFamily: "'SF Mono', 'Fira Code', monospace", letterSpacing: '0.1em' }}>
              CLAIM • STREAK • UNLOCK
            </p>
          </motion.div>

          {/* ─── Coin Wallet ─── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex items-center justify-center gap-3 py-3"
          >
            <Coins className="w-7 h-7" style={{ color: 'hsl(42,90%,60%)' }} />
            <span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: '2rem', fontWeight: 800, color: 'hsl(42,80%,75%)', letterSpacing: '-0.02em' }}>
              {animatedCoins.toLocaleString()}
            </span>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'hsla(42,50%,65%,0.5)', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>coins</span>
          </motion.div>

          {/* ─── Streak Card (premium glass) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsla(220,30%,15%,0.6) 0%, hsla(225,25%,10%,0.8) 100%)',
              border: '1px solid hsla(42,60%,50%,0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px hsla(225,40%,5%,0.5), inset 0 1px 0 hsla(42,60%,60%,0.08)',
            }}
          >
            {/* Glass highlight */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsla(42,60%,60%,0.15), transparent)' }} />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, hsl(25,90%,50%), hsl(40,95%,55%))', boxShadow: '0 4px 16px hsla(35,90%,50%,0.3)' }}
                >
                  <Flame className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: '2.25rem', fontWeight: 900, color: 'hsl(40,80%,85%)', lineHeight: 1 }}>
                      {animatedStreak}
                    </span>
                    <span className="text-sm" style={{ color: 'hsla(210,15%,60%,0.6)', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
                      day{currentStreak !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'hsla(172,40%,55%,0.7)', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
                    {streakMultiplier}× luck multiplier
                  </p>
                </div>
              </div>
              {isClaimedToday && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'hsla(172,60%,40%,0.12)', border: '1px solid hsla(172,60%,40%,0.2)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'hsl(172,60%,50%)' }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'hsl(172,60%,55%)', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>Claimed</span>
                </div>
              )}
            </div>

            {/* Gold progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]" style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
                <span style={{ color: 'hsla(210,15%,60%,0.5)' }}>NEXT MILESTONE</span>
                <span style={{ color: 'hsl(42,60%,65%)' }}>{currentStreak}/{nextMilestone}</span>
              </div>
              <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: 'hsla(220,25%,18%,0.8)' }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progressFill}%`,
                    background: 'linear-gradient(90deg, hsl(35,80%,45%), hsl(42,95%,55%), hsl(35,80%,45%))',
                    boxShadow: '0 0 12px hsla(42,90%,55%,0.4)',
                    transition: 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
                {/* Pulsing tip */}
                {progressFill > 2 && (
                  <div
                    className="absolute top-0 bottom-0 w-3 rounded-full animate-pulse"
                    style={{
                      left: `calc(${progressFill}% - 6px)`,
                      background: 'hsl(42,100%,70%)',
                      boxShadow: '0 0 8px hsl(42,100%,60%), 0 0 16px hsla(42,100%,60%,0.5)',
                      transition: 'left 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                )}
              </div>
              <p className="text-[10px] text-center" style={{ color: 'hsla(210,15%,55%,0.4)', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
                {daysUntilMilestone} day{daysUntilMilestone !== 1 ? 's' : ''} until +{nextMilestone * 10} bonus
              </p>
            </div>
          </motion.div>

          {/* ─── Reward Tiers (growing size) ─── */}
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.15em] text-center" style={{ color: 'hsla(210,15%,55%,0.4)', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
              Possible Rewards
            </p>
            <div className="flex items-end justify-center gap-2.5 pt-2 pb-1">
              {previewRewards.map((reward, i) => {
                const meta = RARITY_META[reward.rarity];
                const scale = RARITY_SCALE[reward.rarity];
                const isLegendary = reward.rarity === 'legendary';
                return (
                  <motion.div
                    key={reward.rarity}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center gap-1.5"
                    style={{ transform: `scale(${scale})` }}
                  >
                    <motion.div
                      animate={isLegendary ? { boxShadow: [meta.glow, '0 0 40px hsla(42,100%,60%,0.7)', meta.glow] } : {}}
                      transition={isLegendary ? { duration: 2, repeat: Infinity } : {}}
                      className="rounded-xl flex items-center justify-center border"
                      style={{
                        width: `${44 + i * 6}px`,
                        height: `${44 + i * 6}px`,
                        background: meta.bg,
                        borderColor: meta.border,
                        boxShadow: meta.glow,
                      }}
                    >
                      <reward.icon
                        style={{ color: meta.color, width: `${18 + i * 2}px`, height: `${18 + i * 2}px` }}
                      />
                    </motion.div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: meta.color, fontFamily: "'SF Mono', 'Fira Code', monospace" }}
                    >
                      {meta.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-[10px] text-center" style={{ color: 'hsla(210,15%,50%,0.35)', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
              Higher streaks unlock rarer drops
            </p>
          </div>

          {/* ─── Claim Button ─── */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            onClick={() => updateStreakMutation.mutate()}
            disabled={isClaimedToday || updateStreakMutation.isPending}
            className="w-full relative overflow-hidden rounded-xl font-bold text-lg py-4 border-0 outline-none disabled:opacity-40 disabled:cursor-not-allowed group"
            style={{
              background: isClaimedToday
                ? 'hsla(220,20%,18%,0.6)'
                : 'linear-gradient(135deg, hsl(35,75%,40%), hsl(42,90%,50%), hsl(38,80%,42%))',
              color: isClaimedToday ? 'hsla(210,15%,50%,0.5)' : 'hsl(225,30%,8%)',
              boxShadow: isClaimedToday ? 'none' : '0 4px 20px hsla(42,80%,45%,0.3)',
              fontFamily: "'EB Garamond', 'Georgia', serif",
              letterSpacing: '0.04em',
            }}
          >
            {/* Shimmer sweep */}
            {!isClaimedToday && (
              <div
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]"
                style={{
                  background: 'linear-gradient(90deg, transparent, hsla(0,0%,100%,0.25), transparent)',
                  transition: 'transform 0.7s ease',
                }}
              />
            )}
            {/* Soft pulse overlay */}
            {!isClaimedToday && !updateStreakMutation.isPending && (
              <div className="absolute inset-0 animate-pulse rounded-xl" style={{ background: 'hsla(42,90%,60%,0.08)' }} />
            )}

            <span className="relative z-10 flex items-center justify-center gap-2">
              {updateStreakMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Opening...
                </>
              ) : isClaimedToday ? (
                <>
                  <Gift className="w-5 h-5" />
                  Return Tomorrow
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Claim Mystery Reward
                </>
              )}
            </span>
          </motion.button>

          {/* Footer hint */}
          <p className="text-[10px] text-center pb-1" style={{ color: 'hsla(210,15%,50%,0.3)', fontFamily: "'SF Mono', 'Fira Code', monospace" }}>
            {isClaimedToday
              ? 'Return in 24h to continue your streak'
              : 'Each day brings a mystery reward based on your streak'
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
