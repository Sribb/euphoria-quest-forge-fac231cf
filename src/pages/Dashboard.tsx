import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { QuickOverviewGrid } from "@/features/dashboard/components/QuickOverviewGrid";
import { AIInsightsPanel } from "@/features/dashboard/components/AIInsightsPanel";
import { EconomicCalendarNative } from "@/features/dashboard/components/EconomicCalendarNative";
import { LiveEconomicHeadlines } from "@/features/dashboard/components/LiveEconomicHeadlines";
import { DailyRewardsModal } from "@/features/learning/components/DailyRewardsModal";
import { SeasonalBanner } from "@/features/dashboard/components/SeasonalBanner";
import { XPOrb } from "@/features/dashboard/components/XPOrb";
import { RealtimeIndicator } from "@/features/dashboard/components/RealtimeIndicator";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Dashboard = ({ onNavigate, onStockSearch }: DashboardProps) => {
  const { user } = useAuth();
  const [showDailyRewards, setShowDailyRewards] = useState(false);

  // Check if user has claimed today's reward
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

  // Auto-show daily rewards modal once per day
  useEffect(() => {
    if (!streakData || !user?.id) return;
    
    const lastLogin = streakData.last_login_date;
    const today = new Date().toDateString();
    const storageKey = `daily_rewards_shown_${user.id}_${today}`;
    
    // Check if user hasn't logged in today AND hasn't seen the modal today
    if (!lastLogin || new Date(lastLogin).toDateString() !== today) {
      const alreadyShown = localStorage.getItem(storageKey);
      if (!alreadyShown) {
        setShowDailyRewards(true);
        localStorage.setItem(storageKey, 'true');
      }
    }
  }, [streakData, user?.id]);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Custom Header with Username */}
      <DashboardHeader />
      
      {/* Main Content - Full Width Grid Layout */}
      <div className="px-8 py-8 space-y-8">
        {/* Top Bar with XP Orb and Realtime Indicator */}
        <div className="flex items-center justify-between animate-fade-in">
          <XPOrb />
          <RealtimeIndicator />
        </div>

        {/* Seasonal Event Banner */}
        <SeasonalBanner />

        {/* Quick Overview Grid - 4 Compact Modules */}
        <div className="animate-fade-in">
          <QuickOverviewGrid onNavigate={onNavigate} />
        </div>
        
        {/* AI Insights Panel - Replaces Old Widgets */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <AIInsightsPanel onNavigate={onNavigate} />
        </div>
        
        {/* Economic Data Section - Full Width Grid */}
        <div className="grid lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <EconomicCalendarNative />
          <LiveEconomicHeadlines />
        </div>
      </div>

      {/* Daily Rewards Modal - Auto-popup */}
      <DailyRewardsModal 
        isOpen={showDailyRewards} 
        onClose={() => setShowDailyRewards(false)} 
      />
    </div>
  );
};

export default Dashboard;
