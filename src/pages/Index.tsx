import { useState, useEffect } from "react";
import { DuoSidebar } from "@/shared/components/DuoSidebar";
import { PersonalizedWelcomeOverlay } from "@/shared/components/PersonalizedWelcomeOverlay";
import { AnimatePresence } from "framer-motion";
import { GlobalAIAssistant } from "@/shared/components/GlobalAIAssistant";
import { AmbientBackground } from "@/shared/components/AmbientBackground";
import { useEducatorRole } from "@/features/educator/hooks/useEducatorRole";
import { useIsMobile } from "@/hooks/use-mobile";
import Dashboard from "./Dashboard";
import Feed from "./Feed";
import Learn from "./Learn";
import Trade from "./Trade";
import Games from "./Games";
import Community from "./Community";
import Certificates from "./Certificates";

import Profile from "./Profile";
import { CoinShop } from "@/features/shop/components/CoinShop";
import StockSearch from "./StockSearch";
import StockDetail from "./StockDetail";
import { EducatorHome } from "@/features/educator/pages/EducatorHome";
import { EducatorDashboard } from "@/features/educator/pages/EducatorDashboard";
import { LtiSetupWizard } from "@/features/educator/components/LtiSetupWizard";
import { DataDeletionPanel } from "@/features/educator/components/DataDeletionPanel";
import {
  AdminHub, SchoolAdminDashboard, DistrictExecutiveDashboard, UsageAnalytics,
  LearningOutcomeReports, EquityAnalysis, TeacherActivityMonitoring, SchoolBenchmarks,
  LicenseManagement, SSOConfiguration, RosteringConsole, ContentApproval,
  DistrictAnnouncements, APIAccessManagement, CustomBranding, ComplianceReports,
} from "@/features/admin";

const Index = () => {
  const { hasEducatorAccess } = useEducatorRole();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(hasEducatorAccess ? "educator" : "dashboard");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("euphoria_welcome_seen");
    if (!seen) setShowWelcome(true);
  }, []);

  const handleWelcomeComplete = (navigateTo?: string) => {
    localStorage.setItem("euphoria_welcome_seen", "true");
    setShowWelcome(false);
    if (navigateTo) {
      setActiveTab(navigateTo);
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
      case "educator-lti":
        return <LtiSetupWizard onBack={() => handleNavigate("educator")} />;
      case "educator-data-deletion":
        return <DataDeletionPanel onBack={() => handleNavigate("educator")} />;
      case "admin-hub":
        return <AdminHub onNavigate={handleNavigate} onBack={() => handleNavigate("educator")} />;
      case "admin-school-dashboard":
        return <SchoolAdminDashboard onBack={() => handleNavigate("admin-hub")} />;
      case "admin-district-dashboard":
        return <DistrictExecutiveDashboard onBack={() => handleNavigate("admin-hub")} />;
      case "admin-usage-analytics":
        return <UsageAnalytics onBack={() => handleNavigate("admin-hub")} />;
      case "admin-learning-outcomes":
        return <LearningOutcomeReports onBack={() => handleNavigate("admin-hub")} />;
      case "admin-equity":
        return <EquityAnalysis onBack={() => handleNavigate("admin-hub")} />;
      case "admin-teacher-activity":
        return <TeacherActivityMonitoring onBack={() => handleNavigate("admin-hub")} />;
      case "admin-benchmarks":
        return <SchoolBenchmarks onBack={() => handleNavigate("admin-hub")} />;
      case "admin-licenses":
        return <LicenseManagement onBack={() => handleNavigate("admin-hub")} />;
      case "admin-sso":
        return <SSOConfiguration onBack={() => handleNavigate("admin-hub")} />;
      case "admin-rostering":
        return <RosteringConsole onBack={() => handleNavigate("admin-hub")} />;
      case "admin-content-approval":
        return <ContentApproval onBack={() => handleNavigate("admin-hub")} />;
      case "admin-announcements":
        return <DistrictAnnouncements onBack={() => handleNavigate("admin-hub")} />;
      case "admin-api":
        return <APIAccessManagement onBack={() => handleNavigate("admin-hub")} />;
      case "admin-branding":
        return <CustomBranding onBack={() => handleNavigate("admin-hub")} />;
      case "admin-compliance":
        return <ComplianceReports onBack={() => handleNavigate("admin-hub")} />;
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
      case "shop":
        return <CoinShop onNavigate={handleNavigate} />;
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
    <div className="min-h-screen bg-background flex relative">
      <AmbientBackground />
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
