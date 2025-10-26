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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-24 pt-20">
        <UserSummary onNavigate={onNavigate} />
        <StreakPanel />
        <MarketTrends />
        
        {/* Economic Dashboard Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">Economic Dashboard</h2>
          <EconomicNews />
          <EconomicCalendar />
        </div>
        
        <QuickAccessTiles onNavigate={onNavigate} />
        <AISuggestions />
      </div>
    </div>
  );
};

export default Dashboard;
