import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Trophy, Sparkles, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBadgeProgress, BadgeWithProgress } from "../hooks/useBadgeProgress";
import { BADGE_CATEGORIES, RARITY_CONFIG, BadgeCategory } from "../data/badgeDefinitions";
import { EuphoriaIcon } from "@/components/icons/EuphoriaIcon";

const NEXT_ACHIEVABLE_COUNT = 6;

export const BadgesShowcase = () => {
  const { badges, totalEarned, totalBadges, isLoading } = useBadgeProgress();
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [showAllLocked, setShowAllLocked] = useState(false);

  const filtered = badges
    .filter(b => activeCategory === "all" || b.category === activeCategory)
    .filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase()));

  const earned = filtered.filter(b => b.earned);
  const locked = filtered.filter(b => !b.earned).sort((a, b) => b.progress - a.progress);
  const nextAchievable = locked.slice(0, NEXT_ACHIEVABLE_COUNT);
  const remainingLocked = locked.slice(NEXT_ACHIEVABLE_COUNT);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading badges...</div>;
  }

  return (
    <div className="space-y-6 pb-24 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-[12px] bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
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
      <Card className="p-4 border-border/60">
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
                <p className={cn("text-lg font-bold tabular-nums", cfg.text)}>{count}<span className="text-xs text-muted-foreground font-normal">/{total}</span></p>
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
                  <EuphoriaIcon name={cat.icon} size={16} />
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
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <EuphoriaIcon name="trophy" size={20} /> Earned ({earned.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {earned.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Next Achievable */}
      {nextAchievable.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Almost There
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {nextAchievable.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Remaining Locked — collapsed by default */}
      {remainingLocked.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowAllLocked(prev => !prev)}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>{showAllLocked ? "Hide" : "Show"} Locked ({remainingLocked.length})</span>
            {showAllLocked ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showAllLocked && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {remainingLocked.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
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
          ? cn("border-2 hover:-translate-y-1 hover:shadow-lg", rarity.border, rarity.bg)
          : "bg-card/30 border-border/40 blur-[0.5px] opacity-50 hover:opacity-70 hover:blur-0"
      )}
    >
      {/* Shimmer border effect for earned badges */}
      {badge.earned && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          <div
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-[spin_4s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, ${rarity.text.replace('text-', '').includes('amber') ? 'rgba(251,191,36,0.15)' : rarity.text.replace('text-', '').includes('purple') ? 'rgba(192,132,252,0.15)' : rarity.text.replace('text-', '').includes('blue') ? 'rgba(96,165,250,0.15)' : rarity.text.replace('text-', '').includes('emerald') ? 'rgba(52,211,153,0.15)' : 'rgba(148,163,184,0.1)'} 25%, transparent 50%)`,
            }}
          />
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        "text-4xl mb-2 transition-transform group-hover:scale-110 relative z-[1]",
        !badge.earned && "grayscale"
      )}>
        {badge.icon}
      </div>

      {/* Title */}
      <h3 className={cn("font-bold text-sm mb-1 line-clamp-1 relative z-[1]", badge.earned ? "" : "text-muted-foreground")}>
        {badge.title}
      </h3>

      {/* Rarity badge with colored border */}
      <Badge
        variant="outline"
        className={cn("text-[10px] mb-2 relative z-[1]", rarity.border, rarity.text)}
      >
        {rarity.label}
      </Badge>

      {/* Description */}
      <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2 leading-tight relative z-[1]">
        {badge.description}
      </p>

      {/* Progress for locked */}
      {!badge.earned && (
        <div className="w-full mt-auto relative z-[1]">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>{badge.requirement.label}</span>
            <span className="tabular-nums">{Math.round(badge.progress)}%</span>
          </div>
          <Progress value={badge.progress} className="h-1.5" />
        </div>
      )}

      {badge.earned && (
        <div className="mt-auto relative z-[1]">
          <Badge className={cn("text-[10px] bg-gradient-to-r text-white border-0", rarity.color)}>
            ✓ Earned
          </Badge>
        </div>
      )}
    </Card>
  );
}
