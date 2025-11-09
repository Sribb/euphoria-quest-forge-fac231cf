import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickOverviewGrid } from "@/components/dashboard/QuickOverviewGrid";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { EconomicCalendarNative } from "@/components/dashboard/EconomicCalendarNative";
import { LiveEconomicHeadlines } from "@/components/dashboard/LiveEconomicHeadlines";
import { useAuth } from "@/hooks/useAuth";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Dashboard = ({ onNavigate, onStockSearch }: DashboardProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Custom Header with Username and Daily Rewards */}
      <DashboardHeader onDailyRewards={() => onNavigate("profile")} />
      
      {/* Main Content - Full Width Grid Layout */}
      <div className="px-8 py-8 space-y-8">
        {/* Quick Overview Grid - 4 Compact Modules */}
        <div className="animate-fade-in">
          <QuickOverviewGrid />
        </div>
        
        {/* AI Insights Panel - Replaces Old Widgets */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <AIInsightsPanel />
        </div>
        
        {/* Economic Data Section - Full Width Grid */}
        <div className="grid lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <EconomicCalendarNative />
          <LiveEconomicHeadlines />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
