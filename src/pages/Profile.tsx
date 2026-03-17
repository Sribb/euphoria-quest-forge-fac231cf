import { useState, useRef, useEffect } from "react";
import { User, Settings as SettingsIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";

import { formatDollar } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Profile components
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { StatsRow } from "@/features/profile/components/StatsRow";
import { RecentActivity } from "@/features/profile/components/RecentActivity";
import { PortfolioBreakdown } from "@/features/profile/components/PortfolioBreakdown";
import { SettingsTab } from "@/features/profile/components/SettingsTab";

interface ProfileProps {
  onNavigate: (tab: string) => void;
}

const TABS = [
  { id: "profile" as const, label: "Profile", icon: User },
  { id: "settings" as const, label: "Settings", icon: SettingsIcon },
] as const;

type TabId = (typeof TABS)[number]["id"];

const Profile = ({ onNavigate }: ProfileProps) => {
  const { user } = useAuth();
  const { onboarding, placementLesson, refetch: refetchOnboarding } = useOnboarding();
  
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Update indicator position
  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeTab]);

  // Data queries
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: portfolio } = useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("portfolios").select("*").eq("user_id", user?.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: streak } = useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("streaks").select("*").eq("user_id", user?.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: lessonProgress } = useQuery({
    queryKey: ["profile-lessons", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_lesson_progress").select("*").eq("user_id", user?.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: orders } = useQuery({
    queryKey: ["profile-orders", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(20);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: gameSessions } = useQuery({
    queryKey: ["profile-games", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("game_sessions").select("*").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(20);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: portfolioAssets } = useQuery({
    queryKey: ["profile-assets", portfolio?.id],
    queryFn: async () => {
      const { data } = await supabase.from("portfolio_assets").select("*").eq("portfolio_id", portfolio!.id);
      return data || [];
    },
    enabled: !!portfolio?.id,
  });

  const { data: posts } = useQuery({
    queryKey: ["profile-posts", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("id, content, created_at").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(10);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Computed stats
  const completedLessons = lessonProgress?.filter((l) => l.completed) || [];
  const quizScores = lessonProgress?.filter((l) => l.quiz_score != null).map((l) => l.quiz_score!) || [];
  const accuracy = quizScores.length ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

  // Activity dates for graph
  const lessonDates = (lessonProgress || []).filter((l) => l.completed).map((l) => l.updated_at || l.created_at);
  const tradeDates = (orders || []).filter((o) => o.status === "filled").map((o) => o.created_at);
  const gameDates = (gameSessions || []).map((g) => g.created_at);

  // Recent activity timeline
  const recentItems = [
    ...(completedLessons || []).slice(0, 5).map((l) => ({
      id: `lesson-${l.id}`,
      type: "lesson" as const,
      title: `Completed lesson`,
      timestamp: l.updated_at || l.created_at,
    })),
    ...(orders || []).filter((o) => o.status === "filled").slice(0, 5).map((o) => ({
      id: `trade-${o.id}`,
      type: "trade" as const,
      title: `${o.side === "buy" ? "Bought" : "Sold"} ${o.quantity} ${o.symbol}`,
      timestamp: o.created_at,
    })),
    ...(gameSessions || []).slice(0, 5).map((g) => ({
      id: `game-${g.id}`,
      type: "game" as const,
      title: `Game session (Score: ${g.score})`,
      timestamp: g.created_at,
    })),
    ...(posts || []).slice(0, 3).map((p) => ({
      id: `post-${p.id}`,
      type: "post" as const,
      title: (p.content || "").slice(0, 50) || "New post",
      timestamp: p.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="pb-24 pt-2 md:pt-4 max-w-3xl mx-auto">
      {/* Profile Header (always visible) */}
      {profile && user && (
        <ProfileHeader profile={profile} userId={user.id} email={user.email || ""} />
      )}

      {/* Tab Navigation with sliding indicator */}
      <div className="relative mt-6 mb-5">
        <div className="flex relative border-b border-border">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[tab.id] = el; }}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors relative",
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
          {/* Animated indicator */}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-primary rounded-full"
            animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "profile" && (
          <div className="space-y-4">
            <StatsRow
              portfolioValue={Number(portfolio?.total_value) || 0}
              streak={streak?.current_streak || 0}
              lessonsCompleted={completedLessons.length}
              accuracy={accuracy}
              rank={0}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActivityGraph
                lessonDates={lessonDates}
                tradeDates={tradeDates}
                gameDates={gameDates}
              />
              <PortfolioBreakdown
                assets={(portfolioAssets || []) as any}
                cashBalance={Number(portfolio?.cash_balance) || 0}
              />
            </div>


            <RecentActivity items={recentItems} />
          </div>
        )}

        {activeTab === "settings" && (
          <SettingsTab
            userId={user?.id || ""}
            onboarding={onboarding}
            placementLesson={placementLesson}
            refetchOnboarding={refetchOnboarding}
          />
        )}

      </motion.div>
    </div>
  );
};

export default Profile;
