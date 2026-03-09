import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Trophy, Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBadgeProgress, BadgeWithProgress } from "../hooks/useBadgeProgress";
import { BADGE_CATEGORIES, RARITY_CONFIG, BadgeCategory } from "../data/badgeDefinitions";

export const BadgesShowcase = () => {
  const { badges, totalEarned, totalBadges, isLoading } = useBadgeProgress();
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = badges
    .filter(b => activeCategory === "all" || b.category === activeCategory)
    .filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase()));

  const earned = filtered.filter(b => b.earned);
  const locked = filtered.filter(b => !b.earned).sort((a, b) => b.progress - a.progress);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading badges...</div>;
  }

  return (
    <div className="space-y-6 pb-24 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-glow animate-pulse">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Badges</h1>
            <p className="text-sm text-muted-foreground">{totalEarned} of {totalBadges} earned</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary/10 border border-primary/20 rounded-full">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          <span className="text-xs md:text-sm font-semibold">{Math.round((totalEarned / totalBadges) * 100)}% Complete</span>
        </div>
      </div>

      {/* Overall progress */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Collection Progress</span>
          <span className="text-sm font-bold text-primary">{totalEarned}/{totalBadges}</span>
        </div>
        <Progress value={(totalEarned / totalBadges) * 100} className="h-3" />
        <div className="grid grid-cols-5 gap-2 mt-3">
          {Object.entries(RARITY_CONFIG).map(([key, cfg]) => {
            const count = badges.filter(b => b.rarity === key && b.earned).length;
            const total = badges.filter(b => b.rarity === key).length;
            return (
              <div key={key} className="text-center">
                <p className={cn("text-lg font-bold", cfg.text)}>{count}</p>
                <p className="text-[10px] text-muted-foreground">{cfg.label}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Search + Categories */}
      <div className="space-y-3 animate-fade-in">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search badges..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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
            {BADGE_CATEGORIES.map(cat => {
              const count = badges.filter(b => b.category === cat.id).length;
              const earnedCount = badges.filter(b => b.category === cat.id && b.earned).length;
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

      {/* Earned Badges */}
      {earned.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🏆</span> Earned ({earned.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {earned.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {locked.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Lock className="w-4 h-4" /> Locked ({locked.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {locked.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function BadgeCard({ badge }: { badge: BadgeWithProgress }) {
  const rarity = RARITY_CONFIG[badge.rarity];

  return (
    <Card
      className={cn(
        "relative p-4 flex flex-col items-center text-center transition-all duration-300 overflow-hidden group",
        badge.earned
          ? `bg-gradient-to-br ${rarity.bg} ${rarity.border} border-2 hover:-translate-y-1 hover:shadow-lg`
          : "bg-card/40 border-border/50 opacity-70 hover:opacity-90"
      )}
    >
      {/* Glow for earned */}
      {badge.earned && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-20 h-20 bg-white/5 rounded-full blur-2xl top-0 right-0 animate-pulse" />
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        "text-4xl mb-2 transition-transform group-hover:scale-110",
        !badge.earned && "grayscale opacity-50"
      )}>
        {badge.icon}
      </div>

      {/* Title */}
      <h3 className={cn("font-bold text-sm mb-1 line-clamp-1", badge.earned ? "" : "text-muted-foreground")}>
        {badge.title}
      </h3>

      {/* Rarity */}
      <Badge
        variant="outline"
        className={cn("text-[10px] mb-2", rarity.border, rarity.text)}
      >
        {rarity.label}
      </Badge>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2 leading-tight">
        {badge.description}
      </p>

      {/* Progress */}
      {!badge.earned && (
        <div className="w-full mt-auto">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{badge.requirement.label}</span>
            <span>{Math.round(badge.progress)}%</span>
          </div>
          <Progress value={badge.progress} className="h-1.5" />
        </div>
      )}

      {badge.earned && (
        <div className="mt-auto">
          <Badge className={cn("text-[10px] bg-gradient-to-r text-white", rarity.color)}>
            ✓ Earned
          </Badge>
        </div>
      )}
    </Card>
  );
}
