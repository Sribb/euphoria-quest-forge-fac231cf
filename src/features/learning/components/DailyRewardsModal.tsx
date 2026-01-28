import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, Star, Coins, Flame, Trophy, Sparkles, Zap, Target, Award, Crown, Gem, Shirt } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  // Common rewards (60% chance)
  { type: 'coins', rarity: 'common', name: '50 Coins', description: 'Basic currency', value: 50, icon: Coins },
  { type: 'coins', rarity: 'common', name: '75 Coins', description: 'Basic currency', value: 75, icon: Coins },
  { type: 'xp_boost', rarity: 'common', name: '10% XP Boost', description: 'For 1 hour', value: 10, icon: Zap },
  
  // Uncommon rewards (25% chance)
  { type: 'coins', rarity: 'uncommon', name: '100 Coins', description: 'Nice bonus', value: 100, icon: Coins },
  { type: 'xp_boost', rarity: 'uncommon', name: '25% XP Boost', description: 'For 2 hours', value: 25, icon: Zap },
  { type: 'badge', rarity: 'uncommon', name: 'Daily Warrior', description: 'Show your dedication', value: 0, icon: Award },
  
  // Rare rewards (10% chance)
  { type: 'coins', rarity: 'rare', name: '200 Coins', description: 'Great reward!', value: 200, icon: Coins },
  { type: 'xp_boost', rarity: 'rare', name: '50% XP Boost', description: 'For 4 hours', value: 50, icon: Zap },
  { type: 'cosmetic', rarity: 'rare', name: 'Neon Avatar Frame', description: 'Stand out', value: 0, icon: Shirt },
  { type: 'multiplier', rarity: 'rare', name: '2x Streak Multiplier', description: 'For 7 days', value: 2, icon: Target },
  
  // Epic rewards (4% chance)
  { type: 'coins', rarity: 'epic', name: '500 Coins', description: 'Amazing find!', value: 500, icon: Coins },
  { type: 'xp_boost', rarity: 'epic', name: '100% XP Boost', description: 'For 24 hours', value: 100, icon: Zap },
  { type: 'badge', rarity: 'epic', name: 'Market Sage', description: 'Legendary trader badge', value: 0, icon: Trophy },
  
  // Legendary rewards (1% chance)
  { type: 'coins', rarity: 'legendary', name: '1000 Coins', description: 'JACKPOT!', value: 1000, icon: Crown },
  { type: 'cosmetic', rarity: 'legendary', name: 'Golden Crown', description: 'Ultimate prestige', value: 0, icon: Crown },
  { type: 'multiplier', rarity: 'legendary', name: '3x Streak Multiplier', description: 'For 30 days', value: 3, icon: Gem },
];

const RARITY_COLORS = {
  common: { bg: 'from-slate-500/10 to-slate-600/10', border: 'border-slate-500/30', text: 'text-slate-400', glow: 'shadow-slate-500/20' },
  uncommon: { bg: 'from-green-500/10 to-emerald-600/10', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/30' },
  rare: { bg: 'from-blue-500/10 to-cyan-600/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/40' },
  epic: { bg: 'from-purple-500/10 to-violet-600/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/50' },
  legendary: { bg: 'from-yellow-500/10 to-orange-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-yellow-500/60' },
};

const getRandomReward = (streakMultiplier: number = 1): Reward => {
  const rand = Math.random() * 100;
  let rarity: RewardRarity;
  
  // Adjust chances based on streak
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

export const DailyRewardsModal = ({ isOpen, onClose }: DailyRewardsModalProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [claimedReward, setClaimedReward] = useState<Reward | null>(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);

  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateStreakMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("update-streak", {
        body: { userId: user?.id },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["streak", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      
      const newStreak = data?.streak?.current_streak || 0;
      const streakMultiplier = Math.floor(newStreak / 7);
      const reward = getRandomReward(streakMultiplier);
      
      setClaimedReward(reward);
      setShowRewardAnimation(true);
      
      const coinsEarned = reward.type === 'coins' ? reward.value : 50;
      const milestoneBonus = [3, 7, 10, 14, 30].includes(newStreak) ? newStreak * 10 : 0;
      
      // Show toast based on reward rarity
      const rarityEmojis = {
        common: '🎁',
        uncommon: '✨',
        rare: '💎',
        epic: '🌟',
        legendary: '👑'
      };
      
      toast.success(`${rarityEmojis[reward.rarity]} ${reward.rarity.toUpperCase()} REWARD!`, {
        description: `You got ${reward.name}! ${milestoneBonus > 0 ? `+${milestoneBonus} milestone bonus coins!` : ''}`,
        duration: 5000,
      });
      
      setTimeout(() => setShowRewardAnimation(false), 3000);
    },
    onError: (error: any) => {
      toast.error("Failed to claim daily reward", {
        description: error.message || "Please try again later",
      });
    },
  });

  const currentStreak = streakData?.current_streak || 0;
  const lastLoginDate = streakData?.last_login_date;
  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = lastLoginDate === today;
  
  const nextMilestone = [3, 7, 10, 14, 30].find(m => m > currentStreak) || 30;
  const daysUntilMilestone = nextMilestone - currentStreak;
  const streakMultiplier = Math.floor(currentStreak / 7) + 1;

  // Generate preview rewards
  const previewCommon = REWARD_POOL.filter(r => r.rarity === 'common')[0];
  const previewUncommon = REWARD_POOL.filter(r => r.rarity === 'uncommon')[0];
  const previewRare = REWARD_POOL.filter(r => r.rarity === 'rare')[0];
  const previewEpic = REWARD_POOL.filter(r => r.rarity === 'epic')[0];
  const previewLegendary = REWARD_POOL.filter(r => r.rarity === 'legendary')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-primary/20 max-h-[90vh] overflow-y-auto">
        {/* Animated Header */}
        <div className="relative p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-[url('/sparkle-pattern.svg')] opacity-10 animate-pulse" />
          
          {/* Floating sparkles */}
          {[
            { top: '8%', left: '12%' },
            { top: '25%', left: '78%' },
            { top: '45%', left: '6%' },
            { top: '18%', left: '45%' },
            { top: '55%', left: '85%' },
            { top: '35%', left: '25%' },
          ].map((pos, i) => (
            <Sparkles 
              key={i}
              className={cn(
                "absolute w-4 h-4 text-primary",
                i % 2 === 0 ? "animate-pulse" : "animate-bounce"
              )}
              style={{
                top: pos.top,
                left: pos.left,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${1.5 + (i * 0.4)}s`
              }}
            />
          ))}
          
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent animate-pulse">
              Daily Rewards
            </DialogTitle>
            <p className="text-center text-muted-foreground text-lg">
              Claim rewards daily • Build streaks • Unlock rare items
            </p>
          </DialogHeader>
        </div>

        {/* Reward Animation Overlay */}
        {showRewardAnimation && claimedReward && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
            <div className="text-center space-y-6 animate-scale-in">
              <div className={cn(
                "w-32 h-32 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br border-4 animate-bounce",
                RARITY_COLORS[claimedReward.rarity].bg,
                RARITY_COLORS[claimedReward.rarity].border,
                RARITY_COLORS[claimedReward.rarity].glow
              )}>
                <claimedReward.icon className="w-16 h-16 text-white" />
              </div>
              <div>
                <p className={cn(
                  "text-sm font-bold uppercase tracking-wider mb-2",
                  RARITY_COLORS[claimedReward.rarity].text
                )}>
                  {claimedReward.rarity}
                </p>
                <h3 className="text-3xl font-bold mb-2">{claimedReward.name}</h3>
                <p className="text-muted-foreground">{claimedReward.description}</p>
              </div>
              
              {/* Particle effects */}
              <div className="relative w-full h-20">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-2 h-2 rounded-full animate-ping",
                      RARITY_COLORS[claimedReward.rarity].text
                    )}
                    style={{
                      left: `${50 + (Math.cos(i * 30 * Math.PI / 180) * 40)}%`,
                      top: `${50 + (Math.sin(i * 30 * Math.PI / 180) * 40)}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-8 space-y-6">
          {/* Current Streak Display */}
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-glow animate-pulse">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</h3>
                  <p className="text-sm text-muted-foreground">Current Streak • {streakMultiplier}x luck multiplier</p>
                </div>
              </div>
              <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
            </div>
            
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Next milestone</span>
                <span className="font-semibold">{nextMilestone} days (+{nextMilestone * 10} bonus coins)</span>
              </div>
              <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 transition-all duration-500 shadow-glow animate-pulse"
                  style={{ width: `${(currentStreak / nextMilestone) * 100}%` }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {daysUntilMilestone} more day{daysUntilMilestone !== 1 ? 's' : ''} to unlock milestone bonus!
              </p>
            </div>
          </Card>

          {/* Possible Rewards Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Possible Rewards
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {[previewCommon, previewUncommon, previewRare, previewEpic, previewLegendary].map((reward, i) => (
                <Card 
                  key={i}
                  className={cn(
                    "p-4 transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br border-2",
                    RARITY_COLORS[reward.rarity].bg,
                    RARITY_COLORS[reward.rarity].border,
                    `hover:${RARITY_COLORS[reward.rarity].glow}`
                  )}
                >
                  <div className="text-center space-y-2">
                    <div className={cn(
                      "w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-background to-muted"
                    )}>
                      <reward.icon className={cn("w-6 h-6", RARITY_COLORS[reward.rarity].text)} />
                    </div>
                    <p className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      RARITY_COLORS[reward.rarity].text
                    )}>
                      {reward.rarity}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Higher streaks increase chances for rare rewards!
            </p>
          </div>

          {/* Current Coins & Status */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-500 animate-bounce" />
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p className="text-xl font-bold">{profile?.coins || 0} coins</p>
              </div>
            </div>
            
            {isClaimedToday && (
              <div className="flex items-center gap-2 text-success">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-semibold">Claimed Today</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button
            onClick={() => updateStreakMutation.mutate()}
            disabled={isClaimedToday || updateStreakMutation.isPending}
            className={cn(
              "w-full h-16 text-xl font-bold transition-all duration-300 relative overflow-hidden group",
              isClaimedToday 
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-primary via-purple-500 to-primary shadow-glow hover:shadow-glow-soft hover:scale-105"
            )}
          >
            {!isClaimedToday && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
            
            {updateStreakMutation.isPending ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Opening Reward...
              </>
            ) : isClaimedToday ? (
              <>
                <Gift className="w-6 h-6 mr-2" />
                Come Back Tomorrow!
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-2 animate-bounce" />
                Claim Mystery Reward
              </>
            )}
          </Button>

          {isClaimedToday ? (
            <p className="text-sm text-center text-muted-foreground">
              💡 Return in 24 hours to continue your streak and unlock better rewards!
            </p>
          ) : (
            <p className="text-sm text-center text-muted-foreground">
              🎲 Each day brings a new mystery reward based on your streak!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};