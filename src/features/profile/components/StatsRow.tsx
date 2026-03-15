import { TrendingUp, Flame, BookOpen, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDollar } from "@/lib/formatters";
import { motion } from "framer-motion";

interface StatsRowProps {
  portfolioValue: number;
  streak: number;
  lessonsCompleted: number;
  accuracy: number;
  rank: number;
}

const stats = [
  { key: "portfolio", icon: TrendingUp, label: "Portfolio", format: (v: number) => formatDollar(v, 0) },
  { key: "streak", icon: Flame, label: "Streak", format: (v: number) => `${v}d` },
  { key: "lessons", icon: BookOpen, label: "Lessons", format: (v: number) => `${v}` },
  { key: "accuracy", icon: Target, label: "Accuracy", format: (v: number) => `${v}%` },
  { key: "rank", icon: Trophy, label: "Rank", format: (v: number) => v > 0 ? `#${v}` : "—" },
];

export const StatsRow = ({ portfolioValue, streak, lessonsCompleted, accuracy, rank }: StatsRowProps) => {
  const values = [portfolioValue, streak, lessonsCompleted, accuracy, rank];

  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3 animate-fade-in">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative p-3 md:p-4 rounded-xl bg-card border border-border text-center group hover:border-primary/30 transition-colors"
          >
            <Icon className="w-4 h-4 mx-auto text-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <p className="text-base md:text-lg font-bold leading-none">
              {stat.format(values[i])}
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
