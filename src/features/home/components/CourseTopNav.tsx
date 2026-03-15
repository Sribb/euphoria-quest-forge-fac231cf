import { Flame, Gem, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/euphoria-logo-button.png";

interface CourseTopNavProps {
  activeView: "home" | "courses";
  onViewChange: (view: "home" | "courses") => void;
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
  const energy = 5; // Static hearts for now

  return (
    <div className="w-full">
      {/* Main nav */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-border/40">
        {/* Left: Logo + tabs */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Euphoria" className="w-8 h-8 object-contain" />
            <span className="text-lg font-extrabold text-foreground tracking-tight">Euphoria</span>
          </div>

          <nav className="flex items-center gap-1">
            {(["home", "courses"] as const).map((view) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={cn(
                  "relative px-4 py-2 text-sm font-bold capitalize transition-colors",
                  activeView === view
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {view}
                {activeView === view && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-primary" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Stats pills + menu */}
        <div className="flex items-center gap-2">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-orange-500">{streak}</span>
          </div>

          {/* Gems / Euphorium */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Gem className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary">{gems}</span>
          </div>

          {/* Energy / Hearts */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span className="text-xs font-bold text-emerald-500">{energy}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
