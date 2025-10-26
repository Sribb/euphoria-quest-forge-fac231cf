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
    <div className="min-h-screen bg-background pt-32">
      <div className="max-w-[1920px] mx-auto px-12 lg:px-16 pb-20">
        {/* User Summary Section */}
        <div className="mb-12">
          <UserSummary onNavigate={onNavigate} />
        </div>
        
        {/* Daily Rewards Section - Centered and Wider */}
        <div className="max-w-6xl mx-auto mb-16">
          <StreakPanel />
        </div>
        
        {/* Multi-column Grid Layout with More Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <MarketTrends />
          <div className="space-y-10">
            <QuickAccessTiles onNavigate={onNavigate} />
            <AISuggestions />
          </div>
        </div>
        
        {/* Economic Dashboard Section - Full Width */}
        <div className="space-y-10 mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">Economic Dashboard</h2>
            <p className="text-muted-foreground text-lg">Stay informed with live market data and economic events</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <EconomicNews />
            <EconomicCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
