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
    <nav className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-b border-border z-50 shadow-lg">
      <div className="max-w-[1920px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-xl shadow-glow">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Euphoria
            </h1>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 hover:scale-105"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stock Search */}
          <div className="w-80">
            <GlobalStockSearch onSelectStock={onSelectStock} />
          </div>
        </div>
      </div>
    </nav>
  );
};
