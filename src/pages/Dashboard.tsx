import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickOverviewGrid } from "@/components/dashboard/QuickOverviewGrid";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { EconomicCalendarNative } from "@/components/dashboard/EconomicCalendarNative";
import { LiveEconomicHeadlines } from "@/components/dashboard/LiveEconomicHeadlines";
import { DailyRewardsModal } from "@/components/learn/DailyRewardsModal";
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
