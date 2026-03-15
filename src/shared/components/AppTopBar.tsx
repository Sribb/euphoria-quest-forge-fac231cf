import { useState, useRef, useEffect } from "react";
import { Search, Bell, Flame, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logo from "@/assets/euphoria-logo-button.png";

interface AppTopBarProps {
  onNavigate: (tab: string) => void;
}

export const AppTopBar = ({ onNavigate }: AppTopBarProps) => {
  const { user, signOut } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const { data: streakData } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-notifications", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      return count || 0;
    },
    enabled: !!user?.id,
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const streak = streakData?.current_streak ?? 0;
  const initials = (profile?.display_name || "U")[0].toUpperCase();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[hsl(240,15%,6%)]"
      style={{ height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Left: Logo */}
      <div className="flex items-center" style={{ paddingLeft: 24 }}>
        <img src={logo} alt="Euphoria" className="object-contain" style={{ height: 32 }} />
      </div>

      {/* Center: Search */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="relative" style={{ width: 400 }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search lessons, topics, users..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            style={{
              height: 40,
              paddingLeft: 36,
              paddingRight: 16,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>
      </div>

      {/* Right: Streak, Bell, Avatar */}
      <div className="flex items-center" style={{ gap: 16, paddingRight: 24 }}>
        {/* Streak */}
        <div className="flex items-center" style={{ gap: 4 }}>
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-bold text-emerald-400">{streak}</span>
        </div>

        {/* Bell */}
        <button
          onClick={() => onNavigate("community")}
          className="relative p-1 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Bell className="text-foreground/70" style={{ width: 20, height: 20 }} />
          {unreadCount > 0 && (
            <span
              className="absolute flex items-center justify-center bg-destructive text-destructive-foreground font-bold"
              style={{
                top: -2,
                right: -4,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                fontSize: 10,
                paddingLeft: 4,
                paddingRight: 4,
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="flex items-center justify-center bg-primary/20 text-primary font-bold cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
            style={{ width: 32, height: 32, borderRadius: 16, fontSize: 14 }}
          >
            {initials}
          </button>

          {avatarOpen && (
            <div
              className="absolute right-0 bg-[hsl(240,15%,10%)] shadow-xl shadow-black/40 z-50"
              style={{
                top: 40,
                width: 180,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              {[
                { label: "Profile", icon: User, action: () => { onNavigate("profile"); setAvatarOpen(false); } },
                { label: "Settings", icon: Settings, action: () => { onNavigate("profile"); setAvatarOpen(false); } },
                { label: "Log Out", icon: LogOut, action: () => { signOut(); setAvatarOpen(false); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 text-sm text-foreground/80 hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
                  style={{ height: 40, paddingLeft: 16, paddingRight: 16 }}
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
