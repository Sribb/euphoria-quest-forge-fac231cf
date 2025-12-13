import { useState } from "react";
import { TopNavigation } from "@/components/TopNavigation";
import Dashboard from "./Dashboard";
import Learn from "./Learn";
import Trade from "./Trade";
import Games from "./Games";
import Analytics from "./Analytics";
import Community from "./Community";
import Certificates from "./Certificates";
import Profile from "./Profile";
import Onboarding from "./Onboarding";
import StockSearch from "./StockSearch";
import StockDetail from "./StockDetail";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [showStockSearch, setShowStockSearch] = useState(false);
  const { user } = useAuth();
  const { hasCompletedOnboarding, isLoading } = useOnboarding();

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setShowStockSearch(false);
    setSelectedStock(null);
  };

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    setShowStockSearch(false);
  };

  const handleBackToStockSearch = () => {
    setSelectedStock(null);
    setShowStockSearch(true);
  };

  const handleBackFromStockSearch = () => {
    setShowStockSearch(false);
    setActiveTab("trade");
  };

  const handleBackFromLesson = () => {
    setSelectedLesson(null);
  };

  const getBackButtonProps = () => {
    if (selectedStock) {
      return { show: true, onBack: handleBackToStockSearch, label: "Back to Search" };
    }
    if (showStockSearch) {
      return { show: true, onBack: handleBackFromStockSearch, label: "Back to Trade" };
    }
    if (selectedLesson) {
      return { show: true, onBack: handleBackFromLesson, label: "Back to Lessons" };
    }
    if (activeTab !== "dashboard") {
      return { show: true, onBack: () => handleNavigate("dashboard"), label: "Home" };
    }
    return { show: false };
  };

  const backProps = getBackButtonProps();

  // Show loading while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show onboarding if user is logged in and hasn't completed it
  if (user && !hasCompletedOnboarding) {
    return <Onboarding onComplete={() => window.location.reload()} />;
  }

  // Show stock detail page
  if (selectedStock) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation activeTab={activeTab} onTabChange={handleNavigate} />
        <div className="pt-20 px-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <StockDetail symbol={selectedStock} onBack={handleBackToStockSearch} />
          </div>
        </div>
      </div>
    );
  }

  // Show stock search page
  if (showStockSearch) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation activeTab={activeTab} onTabChange={handleNavigate} />
        <div className="pt-20 px-6">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <StockSearch 
              onNavigate={handleNavigate}
              onSelectStock={handleStockSelect}
              onBack={handleBackFromStockSearch}
            />
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} onStockSearch={() => setShowStockSearch(true)} />;
      case "learn":
        return <Learn onNavigate={handleNavigate} selectedLesson={selectedLesson} onLessonSelect={setSelectedLesson} />;
      case "trade":
        return <Trade onNavigate={handleNavigate} onStockSearch={() => setShowStockSearch(true)} />;
      case "games":
        return <Games onNavigate={handleNavigate} />;
      case "analytics":
        return <Analytics onNavigate={handleNavigate} />;
      case "community":
        return <Community onNavigate={handleNavigate} />;
      case "certificates":
        return <Certificates onNavigate={handleNavigate} />;
      case "profile":
        return <Profile onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} onStockSearch={() => setShowStockSearch(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation activeTab={activeTab} onTabChange={handleNavigate} />
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto animate-fade-in" key={activeTab}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
