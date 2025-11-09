import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "trade", label: "Trade" },
  { id: "games", label: "Games" },
  { id: "analytics", label: "AI Analytics" },
  { id: "certificates", label: "Certificates" },
  { id: "profile", label: "Profile" },
];

export const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-b border-border z-navigation">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Euphoria
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                activeTab === item.id
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
