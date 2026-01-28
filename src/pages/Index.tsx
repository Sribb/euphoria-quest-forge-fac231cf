import { useState } from "react";
import { TopNavigation } from "@/shared/components/TopNavigation";
import { GlobalAIAssistant } from "@/shared/components/GlobalAIAssistant";
import Dashboard from "./Dashboard";
import Learn from "./Learn";
import Trade from "./Trade";
import Games from "./Games";
import Certificates from "./Certificates";
import Profile from "./Profile";
import StockSearch from "./StockSearch";
import StockDetail from "./StockDetail";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [showStockSearch, setShowStockSearch] = useState(false);

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
        <GlobalAIAssistant />
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
        <GlobalAIAssistant />
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
      <GlobalAIAssistant />
    </div>
  );
};

export default Index;
