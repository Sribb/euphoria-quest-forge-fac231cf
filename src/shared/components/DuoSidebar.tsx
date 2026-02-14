import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEducatorRole } from "@/features/educator/hooks/useEducatorRole";
import {
  Home,
  BookOpen,
  Dumbbell,
  Gamepad2,
  Award,
  User,
  Users,
  GraduationCap,
  BarChart3,
  Gift,
  Menu,
  X,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import logo from "@/assets/euphoria-logo-button.png";

interface DuoSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const studentNavItems = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "feed", label: "Feed", icon: PlayCircle },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "trade", label: "Practice", icon: Dumbbell },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "community", label: "Social", icon: Users },
  { id: "certificates", label: "Awards", icon: Award },
  { id: "profile", label: "Profile", icon: User },
];

const educatorNavItems = [
  { id: "educator", label: "Classes", icon: GraduationCap },
  { id: "educator-analytics", label: "Analytics", icon: BarChart3 },
  { id: "community", label: "Social", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

export const DuoSidebar = ({ activeTab, onTabChange }: DuoSidebarProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { hasEducatorAccess } = useEducatorRole();

  const navItems = hasEducatorAccess ? educatorNavItems : studentNavItems;

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileOpen(false);
  };

  // Mobile: bottom tab bar (top 5 items)
  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-card/95 backdrop-blur-xl border-b border-border z-navigation flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="text-base font-bold text-foreground">Euphoria</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile bottom tabs */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-navigation safe-area-bottom">
          <div className="flex items-center justify-around px-1 py-1.5">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-[52px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    isActive && "bg-primary/15"
                  )}>
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] font-bold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile dropdown for remaining items */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
              style={{ top: '56px' }}
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed top-14 left-0 right-0 bg-card border-b border-border shadow-lg z-50 animate-fade-in">
              <div className="p-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold transition-all duration-200",
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop: left sidebar
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-card border-r border-border z-navigation flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
        <span className="text-lg font-extrabold text-foreground tracking-tight">Euphoria</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-bold text-[15px] transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary shadow-md shadow-primary/10 -translate-y-0.5"
                  : "text-foreground bg-muted/40 shadow-sm hover:bg-muted/70 hover:-translate-y-0.5 hover:shadow-md"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User section at bottom */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => handleNavClick("profile")}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
            activeTab === "profile"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold truncate">
            {profile?.display_name || "Profile"}
          </span>
        </button>
      </div>
    </aside>
  );
};
