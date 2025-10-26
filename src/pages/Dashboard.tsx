import { UserSummary } from "@/components/dashboard/UserSummary";
import { StreakPanel } from "@/components/dashboard/StreakPanel";
import { QuickAccessTiles } from "@/components/dashboard/QuickAccessTiles";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { MarketTrends } from "@/components/dashboard/MarketTrends";
import { EconomicNews } from "@/components/dashboard/EconomicNews";
import { EconomicCalendar } from "@/components/dashboard/EconomicCalendar";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Dashboard = ({ onNavigate, onStockSearch }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-[1920px] mx-auto px-8 lg:px-12 space-y-8 pb-12">
        <UserSummary onNavigate={onNavigate} />
        
        {/* Center the Daily Rewards */}
        <div className="max-w-5xl mx-auto">
          <StreakPanel />
        </div>
        
        {/* Multi-column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MarketTrends />
          <div className="space-y-8">
            <QuickAccessTiles onNavigate={onNavigate} />
            <AISuggestions />
          </div>
        </div>
        
        {/* Economic Dashboard Section */}
        <div className="space-y-8 mt-8">
          <h2 className="text-3xl font-bold text-center">Economic Dashboard</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EconomicNews />
            <EconomicCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
