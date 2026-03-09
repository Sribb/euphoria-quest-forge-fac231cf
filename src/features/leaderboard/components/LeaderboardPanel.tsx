import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Globe, Crown, ChevronUp, ChevronDown, Minus, Medal, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeaderboard, type LeaderboardScope, type LeaderboardEntry } from "../hooks/useLeaderboard";
import { getDivisionMeta, anonymizeName, PROMOTION_ZONE, LEAGUE_SIZE, DEMOTION_ZONE, getWeekEnd } from "../constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState as useReactState } from "react";

export function LeaderboardPanel() {
  const [scope, setScope] = useState<LeaderboardScope>("league");
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
      <Tabs value={scope} onValueChange={(v) => setScope(v as LeaderboardScope)}>
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-md">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-foreground">Leaderboard</h3>
            </div>
          </div>
          <TabsList className="w-full bg-muted/50">
            <TabsTrigger value="league" className="flex-1 text-xs gap-1">
              <Crown className="h-3 w-3" /> League
            </TabsTrigger>
            <TabsTrigger value="class" className="flex-1 text-xs gap-1">
              <Users className="h-3 w-3" /> Class
            </TabsTrigger>
            <TabsTrigger value="global" className="flex-1 text-xs gap-1">
              <Globe className="h-3 w-3" /> Global
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="league" className="m-0">
          <LeagueView />
        </TabsContent>
        <TabsContent value="class" className="m-0">
          <ClassView selectedClassId={selectedClassId} setSelectedClassId={setSelectedClassId} />
        </TabsContent>
        <TabsContent value="global" className="m-0">
          <GlobalView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeagueView() {
  const { entries, isLoading, leagueMeta } = useLeaderboard("league");
  const division = getDivisionMeta(leagueMeta?.division || "bronze");
  const [weekCountdown, setWeekCountdown] = useReactState("");

  useEffect(() => {
    const update = () => {
      const end = getWeekEnd();
      const ms = end.getTime() - Date.now();
      if (ms <= 0) { setWeekCountdown("Resetting..."); return; }
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      setWeekCountdown(`${d}d ${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Division badge */}
      <div className={cn("px-5 py-4 flex items-center justify-between", division.bg)}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{division.emoji}</span>
          <div>
            <h4 className={cn("font-bold text-sm", division.color)}>{division.label} League</h4>
            <p className="text-[10px] text-muted-foreground">
              Top {PROMOTION_ZONE} promote • Bottom {DEMOTION_ZONE} demote
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Resets in</p>
          <p className="text-xs font-bold text-foreground">{weekCountdown}</p>
        </div>
      </div>

      {/* Division progress bar */}
      <div className="px-5 py-2 flex items-center gap-1">
        {["bronze", "silver", "gold", "diamond"].map((d) => {
          const meta = getDivisionMeta(d);
          const isCurrent = d === leagueMeta?.division;
          return (
            <div key={d} className="flex-1 flex flex-col items-center gap-0.5">
              <span className={cn("text-xs", isCurrent ? "opacity-100" : "opacity-30")}>{meta.emoji}</span>
              <div className={cn("h-1 w-full rounded-full", isCurrent ? "bg-primary" : "bg-muted")} />
            </div>
          );
        })}
      </div>

      <LeaderboardList entries={entries} isLoading={isLoading} isLeague showZones />
    </div>
  );
}

function ClassView({
  selectedClassId,
  setSelectedClassId,
}: {
  selectedClassId: string;
  setSelectedClassId: (v: string) => void;
}) {
  const { entries, isLoading, userClasses } = useLeaderboard("class", selectedClassId);

  return (
    <div>
      <div className="px-5 py-3 border-b border-border/30">
        {userClasses.length > 0 ? (
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {userClasses.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  {c.class_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-2">
            Join a class to see class rankings!
          </p>
        )}
      </div>
      {selectedClassId && <LeaderboardList entries={entries} isLoading={isLoading} />}
    </div>
  );
}

function GlobalView() {
  const { entries, isLoading } = useLeaderboard("global");
  return <LeaderboardList entries={entries} isLoading={isLoading} anonymize />;
}

function LeaderboardList({
  entries,
  isLoading,
  anonymize = false,
  isLeague = false,
  showZones = false,
}: {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  anonymize?: boolean;
  isLeague?: boolean;
  showZones?: boolean;
}) {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="p-5 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-7 w-7 rounded-full bg-muted" />
            <div className="flex-1 h-4 bg-muted rounded" />
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
        No participants yet. Start earning XP!
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {entries.map((entry, i) => {
        const rankDiff = entry.previousRank != null ? entry.previousRank - entry.rank : 0;
        const isCurrentUser = entry.userId === user?.id;
        const inPromotionZone = showZones && entry.rank <= PROMOTION_ZONE;
        const inDemotionZone = showZones && entry.rank > LEAGUE_SIZE - DEMOTION_ZONE;
        const displayName = anonymize
          ? anonymizeName(entry.displayName, isCurrentUser)
          : isCurrentUser
          ? "You"
          : entry.displayName || "Trader";

        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className={cn(
              "flex items-center gap-3 px-5 py-2.5 border-b border-border/20 transition-colors",
              isCurrentUser && "bg-primary/5",
              inPromotionZone && "border-l-2 border-l-emerald-500",
              inDemotionZone && "border-l-2 border-l-red-500"
            )}
          >
            {/* Rank */}
            <div className="w-7 flex-shrink-0 text-center">
              {entry.rank === 1 ? (
                <span className="text-lg">🥇</span>
              ) : entry.rank === 2 ? (
                <span className="text-lg">🥈</span>
              ) : entry.rank === 3 ? (
                <span className="text-lg">🥉</span>
              ) : (
                <span className="text-xs font-bold text-muted-foreground">#{entry.rank}</span>
              )}
            </div>

            {/* Avatar */}
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
              isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {entry.avatarUrl ? (
                <img src={entry.avatarUrl} className="h-8 w-8 rounded-full object-cover" alt="" />
              ) : (
                (displayName || "?").charAt(0).toUpperCase()
              )}
            </div>

            {/* Name & Level */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium truncate",
                isCurrentUser ? "text-primary font-bold" : "text-foreground"
              )}>
                {displayName}
                {isCurrentUser && <Sparkles className="inline h-3 w-3 ml-1 text-primary" />}
              </p>
              <p className="text-[10px] text-muted-foreground">Lv. {entry.level}</p>
            </div>

            {/* Movement indicator */}
            {rankDiff !== 0 && (
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-bold",
                rankDiff > 0 ? "text-emerald-500" : "text-red-500"
              )}>
                {rankDiff > 0 ? (
                  <><ChevronUp className="h-3 w-3" />{rankDiff}</>
                ) : (
                  <><ChevronDown className="h-3 w-3" />{Math.abs(rankDiff)}</>
                )}
              </div>
            )}
            {rankDiff === 0 && entry.previousRank != null && (
              <Minus className="h-3 w-3 text-muted-foreground/40" />
            )}

            {/* XP */}
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-foreground">
                {entry.xp.toLocaleString()}
              </p>
              <p className="text-[9px] text-muted-foreground">XP</p>
            </div>
          </motion.div>
        );
      })}

      {/* Zone legends */}
      {showZones && entries.length > 0 && (
        <div className="px-5 py-3 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Promotion zone
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Demotion zone
          </span>
        </div>
      )}
    </div>
  );
}
