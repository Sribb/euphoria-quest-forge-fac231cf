import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { QuickOverviewGrid } from "@/features/dashboard/components/QuickOverviewGrid";
import { AIInsightsPanel } from "@/features/dashboard/components/AIInsightsPanel";
import { EconomicCalendarNative } from "@/features/dashboard/components/EconomicCalendarNative";
import { LiveEconomicHeadlines } from "@/features/dashboard/components/LiveEconomicHeadlines";
import { DailyRewardsModal } from "@/features/learning/components/DailyRewardsModal";
import { SeasonalBanner } from "@/features/dashboard/components/SeasonalBanner";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <DashboardHeader />

      <motion.div
        className="px-4 md:px-8 py-5 md:py-8 space-y-6"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp}>
          <SeasonalBanner />
        </motion.div>

        <motion.div variants={fadeUp}>
          <QuickOverviewGrid onNavigate={onNavigate} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <AIInsightsPanel onNavigate={onNavigate} />
        </motion.div>

        {/* Combined Economic Section */}
        <motion.div variants={fadeUp}>
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Economic Calendar</TabsTrigger>
              <TabsTrigger value="headlines">Live Headlines</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar">
              <EconomicCalendarNative />
            </TabsContent>
            <TabsContent value="headlines">
              <LiveEconomicHeadlines />
            </TabsContent>
          </Tabs>
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
