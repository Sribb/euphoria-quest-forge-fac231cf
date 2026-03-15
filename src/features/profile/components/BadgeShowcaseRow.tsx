import { motion } from "framer-motion";
import { BadgeWithProgress } from "@/features/badges/hooks/useBadgeProgress";
import { RARITY_CONFIG } from "@/features/badges/data/badgeDefinitions";
import { cn } from "@/lib/utils";

interface BadgeShowcaseRowProps {
  badges: BadgeWithProgress[];
  onViewAll: () => void;
}

export const BadgeShowcaseRow = ({ badges, onViewAll }: BadgeShowcaseRowProps) => {
  const earned = badges.filter((b) => b.earned).slice(0, 8);

  if (!earned.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-card border border-border text-center text-sm text-muted-foreground"
      >
        Complete challenges to earn badges!
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Top Badges</h3>
        <button
          onClick={onViewAll}
          className="text-xs text-primary font-medium hover:underline"
        >
          View All →
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {earned.map((badge, i) => {
          const rarity = RARITY_CONFIG[badge.rarity];
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center text-center border p-1.5",
                `bg-gradient-to-br ${rarity.bg} ${rarity.border}`
              )}
              title={badge.title}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-[9px] font-semibold mt-0.5 truncate w-full">{badge.title.split(" ")[0]}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
