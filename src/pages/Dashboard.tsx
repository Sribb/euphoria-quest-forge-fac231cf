import { UserSummary } from "@/components/dashboard/UserSummary";
import { StreakPanel } from "@/components/dashboard/StreakPanel";
import { QuickAccessTiles } from "@/components/dashboard/QuickAccessTiles";
import { AISuggestions } from "@/components/dashboard/AISuggestions";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  return (
    <div className="space-y-6 pb-24">
      <UserSummary />
      <StreakPanel />
      <QuickAccessTiles onNavigate={onNavigate} />
      <AISuggestions />
    </div>
  );
};

export default Dashboard;
