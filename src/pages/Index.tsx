import { useState, useEffect } from "react";
import { DuoSidebar } from "@/shared/components/DuoSidebar";
import { PersonalizedWelcomeOverlay } from "@/shared/components/PersonalizedWelcomeOverlay";
import { AnimatePresence } from "framer-motion";
import { GlobalAIAssistant } from "@/shared/components/GlobalAIAssistant";
import { useEducatorRole } from "@/features/educator/hooks/useEducatorRole";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "./Dashboard";
import Feed from "./Feed";
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
  const { onboarding } = useOnboarding();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!onboarding) return;
    const prefs = onboarding.preferences as Record<string, unknown> | null;
    const welcomeSeen = prefs?.welcome_seen === true;
    if (!welcomeSeen) setShowWelcome(true);
  }, [onboarding]);

  const handleWelcomeComplete = async (navigateTo?: string) => {
    setShowWelcome(false);
    if (navigateTo) {
      setActiveTab(navigateTo);
    }
    // Mark welcome as seen in the database
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const currentPrefs = (onboarding?.preferences as Record<string, unknown>) || {};
        await supabase
          .from("user_onboarding")
          .update({ preferences: { ...currentPrefs, welcome_seen: true } })
          .eq("user_id", data.user.id);
      }
    } catch (e) {
      console.error("Failed to mark welcome as seen", e);
    }
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
      case "feed":
        return <Feed onNavigate={handleNavigate} />;
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
        {showWelcome && <PersonalizedWelcomeOverlay onComplete={handleWelcomeComplete} />}
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
