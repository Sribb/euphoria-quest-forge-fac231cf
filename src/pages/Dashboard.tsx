import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { QuickOverviewGrid } from "@/features/dashboard/components/QuickOverviewGrid";
import { StreakCard } from "@/features/dashboard/components/StreakCard";
import { SpacedRepetitionPanel } from "@/features/dashboard/components/SpacedRepetitionPanel";
import { DailyChallengeCard } from "@/features/daily-challenge/components/DailyChallengeCard";
import { LiveEconomicHeadlines } from "@/features/dashboard/components/LiveEconomicHeadlines";
import { LeaderboardPanel } from "@/features/leaderboard/components/LeaderboardPanel";
import { DailyRewardsModal } from "@/features/learning/components/DailyRewardsModal";
import { SeasonalBanner } from "@/features/dashboard/components/SeasonalBanner";
import { DailyPnLCard } from "@/features/dashboard/components/DailyPnLCard";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Dashboard = ({ onNavigate, onStockSearch }: DashboardProps) => {
  const { user } = useAuth();
  const [showDailyRewards, setShowDailyRewards] = useState(false);

  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!streakData || !user?.id) return;
    const lastLogin = streakData.last_login_date;
    const today = new Date().toDateString();
    const storageKey = `daily_rewards_shown_${user.id}_${today}`;
    if (!lastLogin || new Date(lastLogin).toDateString() !== today) {
      const alreadyShown = localStorage.getItem(storageKey);
      if (!alreadyShown) {
        setShowDailyRewards(true);
        localStorage.setItem(storageKey, 'true');
      }
    }
  }, [streakData, user?.id]);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <DashboardHeader />

      <motion.div
        className="px-4 md:px-8 pb-8 space-y-6"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp}>
          <SeasonalBanner />
        </motion.div>

        <motion.div variants={fadeUp}>
          <DailyPnLCard />
        </motion.div>

        <motion.div variants={fadeUp}>
          <DailyChallengeCard />
        </motion.div>

        <motion.div variants={fadeUp}>
          <StreakCard />
        </motion.div>

        <motion.div variants={fadeUp}>
          <SpacedRepetitionPanel />
        </motion.div>

        <motion.div variants={fadeUp}>
          <QuickOverviewGrid onNavigate={onNavigate} />
        </motion.div>


        {/* Market Intel */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Market Intel</h3>
          </div>
          <LiveEconomicHeadlines />
        </motion.div>
      </motion.div>

      <DailyRewardsModal 
        isOpen={showDailyRewards} 
        onClose={() => setShowDailyRewards(false)} 
      />
    </div>
  );
};

export default Dashboard;
