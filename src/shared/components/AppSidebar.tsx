import { Home, BookOpen, LineChart, Users, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { playNav } from "@/lib/soundEffects";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "trade", label: "Trade", icon: LineChart },
  { id: "community", label: "Social", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

export const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const handleClick = (id: string) => {
    onTabChange(id);
    playNav();
  };

  const firstName = profile?.display_name?.split(" ")[0] || "User";
  const initials = firstName[0]?.toUpperCase() || "U";

  return (
    <aside
      className="fixed left-0 flex flex-col z-40"
      style={{
        top: 60,
        bottom: 0,
        width: 240,
        backgroundColor: "hsl(240, 15%, 8%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === "messages" && activeTab === "community");
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "w-full flex items-center text-left transition-all duration-150 cursor-pointer",
                isActive
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              )}
              style={{
                height: 48,
                paddingLeft: 16,
                gap: 12,
                borderLeft: isActive ? "3px solid hsl(var(--primary))" : "3px solid transparent",
                backgroundColor: isActive ? "rgba(124,58,237,0.1)" : "transparent",
              }}
            >
              <Icon className="shrink-0" style={{ width: 20, height: 20 }} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom profile link */}
      <div style={{ padding: "0 16px 24px" }}>
        <button
          onClick={() => handleClick("profile")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-[8px] transition-all cursor-pointer",
            activeTab === "profile"
              ? "bg-primary/10 text-primary"
              : "text-foreground/60 hover:text-foreground hover:bg-[rgba(255,255,255,0.04)]"
          )}
        >
          <div
            className="flex items-center justify-center bg-primary/20 text-primary font-bold shrink-0"
            style={{ width: 28, height: 28, borderRadius: 14, fontSize: 12 }}
          >
            {initials}
          </div>
          <span className="text-sm font-medium truncate">{firstName}</span>
        </button>
      </div>
    </aside>
  );
};
