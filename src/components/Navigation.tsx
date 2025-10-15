import {
  Home,
  BookOpen,
  TrendingUp,
  Gamepad2,
  BarChart3,
  Users,
  Award,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalStockSearch } from "./GlobalStockSearch";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSelectStock: (symbol: string) => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "trade", label: "Trade", icon: TrendingUp },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "community", label: "Community", icon: Users },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Navigation = ({ activeTab, onTabChange, onSelectStock }: NavigationProps) => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <GlobalStockSearch onSelectStock={onSelectStock} />
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-bounce-subtle")} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
    </>
  );
};
