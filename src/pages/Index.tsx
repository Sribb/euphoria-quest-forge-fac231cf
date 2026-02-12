import { useState, useEffect } from "react";
import { DuoSidebar } from "@/shared/components/DuoSidebar";
import { OnboardingTutorial } from "@/shared/components/OnboardingTutorial";
import { AnimatePresence } from "framer-motion";
import { GlobalAIAssistant } from "@/shared/components/GlobalAIAssistant";
import { useEducatorRole } from "@/features/educator/hooks/useEducatorRole";
import { useIsMobile } from "@/hooks/use-mobile";
import Dashboard from "./Dashboard";
import Learn from "./Learn";
import Trade from "./Trade";
import Games from "./Games";
import Community from "./Community";
import Certificates from "./Certificates";
import Rewards from "./Rewards";
import Profile from "./Profile";
import StockSearch from "./StockSearch";
import StockDetail from "./StockDetail";
import { EducatorHome } from "@/features/educator/pages/EducatorHome";
import { EducatorDashboard } from "@/features/educator/pages/EducatorDashboard";

const Index = () => {
  const { hasEducatorAccess } = useEducatorRole();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(hasEducatorAccess ? "educator" : "dashboard");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("euphoria_tutorial_seen");
    if (!seen) setShowTutorial(true);
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem("euphoria_tutorial_seen", "true");
    setShowTutorial(false);
  };

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

  const renderContent = () => {
    if (selectedStock) {
      return <StockDetail symbol={selectedStock} onBack={handleBackToStockSearch} />;
    }
    if (showStockSearch) {
      return (
        <StockSearch
          onNavigate={handleNavigate}
          onSelectStock={handleStockSelect}
          onBack={handleBackFromStockSearch}
        />
      );
    }

    switch (activeTab) {
      case "educator":
        return <EducatorHome onNavigate={handleNavigate} />;
      case "educator-analytics":
        return <EducatorDashboard onBack={() => handleNavigate("educator")} />;
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} onStockSearch={() => setShowStockSearch(true)} />;
      case "learn":
        return <Learn onNavigate={handleNavigate} selectedLesson={selectedLesson} onLessonSelect={setSelectedLesson} />;
      case "trade":
        return <Trade onNavigate={handleNavigate} onStockSearch={() => setShowStockSearch(true)} />;
      case "games":
        return <Games onNavigate={handleNavigate} />;
      case "rewards":
        return <Rewards onNavigate={handleNavigate} />;
      case "community":
        return <Community onNavigate={handleNavigate} />;
      case "certificates":
        return <Certificates onNavigate={handleNavigate} />;
      case "profile":
        return <Profile onNavigate={handleNavigate} />;
      default:
        return hasEducatorAccess
          ? <EducatorHome onNavigate={handleNavigate} />
          : <Dashboard onNavigate={handleNavigate} onStockSearch={() => setShowStockSearch(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AnimatePresence>
        {showTutorial && <OnboardingTutorial onComplete={handleTutorialComplete} />}
      </AnimatePresence>
      <DuoSidebar activeTab={activeTab} onTabChange={handleNavigate} />
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20 px-4' : 'ml-[220px] px-6 py-6'}`}>
        <div className="max-w-6xl mx-auto animate-fade-in" key={activeTab}>
          {renderContent()}
        </div>
      </main>
      <GlobalAIAssistant />
    </div>
  );
};

export default Index;
