import { Flame, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LearnView = "home" | "trade" | "courses";

interface CourseTopNavProps {
  activeView: LearnView;
  onViewChange: (view: LearnView) => void;
}

export const CourseTopNav = ({ activeView, onViewChange }: CourseTopNavProps) => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile-stats", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("coins, experience_points, level")
        .eq("id", user!.id)
        .single();
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
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const streak = streakData?.current_streak ?? 0;
  const gems = profile?.coins ?? 0;

  const tabs: { id: LearnView; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "trade", label: "Trade" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-6 h-16 border-b border-border/40">
        <div className="flex items-center gap-6 h-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={cn(
                "text-sm font-semibold transition-colors relative h-full flex items-center",
                activeView === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              )}
            >
              {tab.label}
              {activeView === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-orange-500">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Gem className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary">{gems}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
