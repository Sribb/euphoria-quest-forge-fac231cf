import { UserSummary } from "@/components/dashboard/UserSummary";
import { StreakPanel } from "@/components/dashboard/StreakPanel";
import { QuickAccessTiles } from "@/components/dashboard/QuickAccessTiles";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { AIWelcomeCard } from "@/components/dashboard/AIWelcomeCard";
import { MarketTrends } from "@/components/dashboard/MarketTrends";
import { EconomicNews } from "@/components/dashboard/EconomicNews";
import { EconomicCalendar } from "@/components/dashboard/EconomicCalendar";
import { useAuth } from "@/hooks/useAuth";
import { useAIMarket } from "@/hooks/useAIMarket";

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onStockSearch?: () => void;
}

const Dashboard = ({ onNavigate, onStockSearch }: DashboardProps) => {
  const { user } = useAuth();
  const { session } = useAIMarket(user?.id);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="animate-fade-in">
        <UserSummary onNavigate={onNavigate} />
      </div>
      
      {/* Streak Panel */}
      <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <StreakPanel />
      </div>
      
      {/* AI Welcome Card - Show if no active AI session */}
      {!session && (
        <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <AIWelcomeCard onNavigate={onNavigate} />
        </div>
      )}
      
      {/* Market Trends - Full Width */}
      <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <MarketTrends />
      </div>
      
      {/* Economic Dashboard Section - Grid Layout */}
      <div className="space-y-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h2 className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
          Economic Dashboard
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <EconomicNews />
          <EconomicCalendar />
        </div>
      </div>
      
      {/* Quick Access & AI Suggestions - Grid Layout */}
      <div className="grid lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <QuickAccessTiles onNavigate={onNavigate} />
        <AISuggestions onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default Dashboard;
