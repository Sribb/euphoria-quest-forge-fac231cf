import { UserSummary } from "@/components/dashboard/UserSummary";
import { StreakPanel } from "@/components/dashboard/StreakPanel";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { MarketTrends } from "@/components/dashboard/MarketTrends";
import { EconomicNews } from "@/components/dashboard/EconomicNews";
import { EconomicCalendar } from "@/components/dashboard/EconomicCalendar";
import { LearningHub } from "@/components/dashboard/LearningHub";
import { GamesHub } from "@/components/dashboard/GamesHub";
import { PortfolioHub } from "@/components/dashboard/PortfolioHub";
import { AnalyticsPreview } from "@/components/dashboard/AnalyticsPreview";
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
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-20">
        {/* Header Section */}
        <div className="animate-fade-in mb-6">
          <UserSummary onNavigate={onNavigate} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Primary Widgets */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Row - Streak & Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <StreakPanel />
              <PortfolioHub onNavigate={onNavigate} />
            </div>

            {/* Learning & Games Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
              <LearningHub onNavigate={onNavigate} />
              <GamesHub onNavigate={onNavigate} />
            </div>

            {/* Market Trends Section */}
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <MarketTrends />
            </div>

            {/* Economic Dashboard */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "250ms" }}>
              <h2 className="text-2xl font-bold">Economic Dashboard</h2>
              <div className="grid grid-cols-1 gap-6">
                <EconomicNews />
                <EconomicCalendar />
              </div>
            </div>
          </div>

          {/* Right Column - AI & Analytics */}
          <div className="lg:col-span-4 space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <AnalyticsPreview onNavigate={onNavigate} />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "350ms" }}>
              <AISuggestions onNavigate={onNavigate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
