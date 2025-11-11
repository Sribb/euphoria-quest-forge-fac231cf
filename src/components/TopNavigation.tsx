import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TopNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "learn", label: "Learn" },
  { id: "trade", label: "Trade" },
  { id: "games", label: "Games" },
  { id: "analytics", label: "Analytics" },
  { id: "community", label: "Community" },
  { id: "certificates", label: "Certificates" },
  { id: "profile", label: "Profile" },
];

export const TopNavigation = ({ activeTab, onTabChange }: TopNavigationProps) => {
  const { user } = useAuth();

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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-b border-border z-navigation">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">{displayName.charAt(0).toUpperCase()}</span>
          </div>
          <h1 
            onClick={() => onTabChange("profile")}
            className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
          >
            {displayName}
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
