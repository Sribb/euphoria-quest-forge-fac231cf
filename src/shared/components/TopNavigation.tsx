import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEducatorRole } from "@/features/educator/hooks/useEducatorRole";
import { Menu, X, Home, BookOpen, TrendingUp, Gamepad2, Award, User, Users, GraduationCap, BarChart3 } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/euphoria-logo-button.png";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const studentNavItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "trade", label: "Trade", icon: TrendingUp },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "community", label: "Community", icon: Users },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "profile", label: "Profile", icon: User },
];

const educatorNavItems = [
  { id: "educator", label: "Classes", icon: GraduationCap },
  { id: "educator-analytics", label: "Analytics", icon: BarChart3 },
  { id: "community", label: "Community", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

export const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { hasEducatorAccess } = useEducatorRole();

  const navItems = hasEducatorAccess ? educatorNavItems : studentNavItems;

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.display_name || "Euphoria";

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-b border-border z-navigation">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              onClick={() => handleNavClick("profile")}
            />
            <h1 
              onClick={() => handleNavClick("profile")}
              className="text-lg md:text-xl font-semibold text-foreground cursor-pointer hover:scale-105 transition-transform truncate max-w-[120px] md:max-w-none"
            >
              {displayName}
            </h1>
            {hasEducatorAccess && (
              <span className="hidden md:inline-flex text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Educator
              </span>
            )}
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
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
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border shadow-lg animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all duration-300",
                      activeTab === item.id
                        ? "bg-gradient-primary text-white shadow-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-navigation safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-[56px] active:scale-95",
                    isActive
                      ? "bg-gradient-primary text-white shadow-glow scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Mobile menu overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
          style={{ top: '56px' }}
        />
      )}
    </>
  );
};
