import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Dashboard from "./Dashboard";
import Learn from "./Learn";
import Trade from "./Trade";
import Games from "./Games";
import Analytics from "./Analytics";
import Community from "./Community";
import Certificates from "./Certificates";
import Profile from "./Profile";
import Settings from "./Settings";
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

  // Show onboarding if user is logged in and hasn't completed it
  if (user && !isLoading && !hasCompletedOnboarding) {
    return <Onboarding onComplete={() => window.location.reload()} />;
  }

  // Show stock detail page
  if (selectedStock) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 animate-fade-in">
        <div className="max-w-2xl mx-auto px-4">
          <StockDetail symbol={selectedStock} onBack={handleBackToStockSearch} />
        </div>
        <Navigation activeTab={activeTab} onTabChange={handleNavigate} onSelectStock={handleStockSelect} />
      </div>
    );
  }

  // Show stock search page
  if (showStockSearch) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 animate-fade-in">
        <div className="max-w-2xl mx-auto px-4">
          <StockSearch 
            onNavigate={handleNavigate}
            onSelectStock={handleStockSelect}
            onBack={handleBackFromStockSearch}
          />
        </div>
        <Navigation activeTab={activeTab} onTabChange={handleNavigate} onSelectStock={handleStockSelect} />
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
      case "settings":
        return <Settings onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} onStockSearch={() => setShowStockSearch(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4 animate-fade-in" key={activeTab}>
        {renderContent()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={handleNavigate} onSelectStock={handleStockSelect} />
    </div>
  );
};

export default Index;
