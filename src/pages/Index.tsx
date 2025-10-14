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

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "learn":
        return <Learn onNavigate={handleNavigate} selectedLesson={selectedLesson} onLessonSelect={setSelectedLesson} />;
      case "trade":
        return <Trade onNavigate={handleNavigate} />;
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
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {renderContent()}
      </div>
      <Navigation activeTab={activeTab} onTabChange={handleNavigate} />
    </div>
  );
};

export default Index;
