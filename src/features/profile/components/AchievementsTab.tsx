import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Search, Trophy, Sparkles, Star, Coins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBadgeProgress, BadgeWithProgress } from "@/features/badges/hooks/useBadgeProgress";
import { BADGE_CATEGORIES, RARITY_CONFIG, BadgeCategory } from "@/features/badges/data/badgeDefinitions";
import { motion } from "framer-motion";

export const AchievementsTab = () => {
  const { badges, totalEarned, totalBadges, isLoading } = useBadgeProgress();
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = badges
    .filter((b) => activeCategory === "all" || b.category === activeCategory)
    .filter((b) => !search || b.title.toLowerCase().includes(search.toLowerCase()));

  const earned = filtered.filter((b) => b.earned);
  const locked = filtered.filter((b) => !b.earned).sort((a, b) => b.progress - a.progress);

  // Points breakdown
  const xpFromBadges = totalEarned * 25;
  const coinsFromBadges = totalEarned * 10;

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading achievements...</div>;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4 text-center">
            <Trophy className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{totalEarned}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-4 text-center">
            <Sparkles className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{Math.round((totalEarned / totalBadges) * 100)}%</p>
            <p className="text-xs text-muted-foreground">Complete</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 text-center">
            <Star className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{xpFromBadges}</p>
            <p className="text-xs text-muted-foreground">XP from Badges</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="p-4 text-center">
            <Coins className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{coinsFromBadges}</p>
            <p className="text-xs text-muted-foreground">Coins from Badges</p>
          </Card>
        </motion.div>
      </div>

      {/* Progress bar */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Collection Progress</span>
          <span className="text-sm font-bold text-primary">{totalEarned}/{totalBadges}</span>
        </div>
        <Progress value={(totalEarned / totalBadges) * 100} className="h-3" />
        <div className="grid grid-cols-5 gap-2 mt-3">
          {Object.entries(RARITY_CONFIG).map(([key, cfg]) => {
            const count = badges.filter((b) => b.rarity === key && b.earned).length;
            const total = badges.filter((b) => b.rarity === key).length;
            return (
              <div key={key} className="text-center">
                <p className={cn("text-lg font-bold", cfg.text)}>{count}<span className="text-xs text-muted-foreground font-normal">/{total}</span></p>
                <p className="text-[10px] text-muted-foreground">{cfg.label}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Search + Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search achievements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              )}
            >
              All ({badges.length})
            </button>
            {BADGE_CATEGORIES.map((cat) => {
              const count = badges.filter((b) => b.category === cat.id).length;
              const earnedCount = badges.filter((b) => b.category === cat.id && b.earned).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5",
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="opacity-60">({earnedCount}/{count})</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Earned */}
      {earned.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <span>🏆</span> Earned ({earned.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {earned.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <AchievementCard badge={badge} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Locked ({locked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {locked.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <AchievementCard badge={badge} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function AchievementCard({ badge }: { badge: BadgeWithProgress }) {
  const rarity = RARITY_CONFIG[badge.rarity];
  // Estimate rarity percentage based on tier
  const rarityPercent: Record<string, string> = {
    common: "82%", uncommon: "45%", rare: "18%", epic: "5%", legendary: "1%",
  };

  return (
    <Card
      className={cn(
        "relative p-3.5 flex flex-col items-center text-center transition-all duration-300 overflow-hidden group",
        badge.earned
          ? `bg-gradient-to-br ${rarity.bg} ${rarity.border} border-2 hover:-translate-y-0.5 hover:shadow-md`
          : "bg-card/40 border-border/50 opacity-70 hover:opacity-90"
      )}
    >
      {badge.earned && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-16 h-16 bg-white/5 rounded-full blur-2xl top-0 right-0 animate-pulse" />
        </div>
      )}

      <div className={cn("text-3xl mb-1.5 transition-transform group-hover:scale-110", !badge.earned && "grayscale opacity-50")}>
        {badge.icon}
      </div>

      <h3 className={cn("font-bold text-xs mb-1 line-clamp-1", badge.earned ? "" : "text-muted-foreground")}>
        {badge.title}
      </h3>

      <div className="flex items-center gap-1.5 mb-1.5">
        <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0", rarity.border, rarity.text)}>
          {rarity.label}
        </Badge>
        <span className="text-[9px] text-muted-foreground">
          {rarityPercent[badge.rarity] || "50%"} of users
        </span>
      </div>

      <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2 leading-tight">
        {badge.description}
      </p>

      {!badge.earned && (
        <div className="w-full mt-auto">
          <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
            <span>{badge.requirement.label}</span>
            <span>{Math.round(badge.progress)}%</span>
          </div>
          <Progress value={badge.progress} className="h-1.5" />
        </div>
      )}

      {badge.earned && (
        <Badge className={cn("text-[9px] mt-auto bg-gradient-to-r text-white", rarity.color)}>
          ✓ Earned
        </Badge>
      )}
    </Card>
  );
}
