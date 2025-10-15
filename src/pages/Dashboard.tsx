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
    <div className="space-y-6 pb-24">
      <UserSummary onNavigate={onNavigate} />
      <StreakPanel />
      <MarketTrends />
      <EconomicNews />
      <EconomicCalendar />
      <QuickAccessTiles onNavigate={onNavigate} />
      <AISuggestions />
    </div>
  );
};

export default Dashboard;
