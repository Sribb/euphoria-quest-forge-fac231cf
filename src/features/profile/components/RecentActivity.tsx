import { BookOpen, TrendingUp, MessageSquare, Trophy, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ActivityItem {
  id: string;
  type: "lesson" | "trade" | "post" | "achievement" | "game";
  title: string;
  timestamp: string;
}

interface RecentActivityProps {
  items: ActivityItem[];
}

const icons = {
  lesson: { icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
  trade: { icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
  post: { icon: MessageSquare, color: "text-violet-500 bg-violet-500/10" },
  achievement: { icon: Trophy, color: "text-amber-500 bg-amber-500/10" },
  game: { icon: Gamepad2, color: "text-pink-500 bg-pink-500/10" },
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" });
}

export const RecentActivity = ({ items }: RecentActivityProps) => {
  if (!items.length) {
    return (
      <div className="p-4 rounded-xl bg-card border border-border text-center text-sm text-muted-foreground">
        No recent activity yet. Start learning to build your timeline!
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
      <div className="space-y-0">
        {items.slice(0, 8).map((item, i) => {
          const cfg = icons[item.type];
          const Icon = cfg.icon;
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 py-2.5",
                i < items.length - 1 && "border-b border-border/50"
              )}
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(item.timestamp)}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
