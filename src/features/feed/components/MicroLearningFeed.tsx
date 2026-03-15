import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FeedCard, FeedCardData } from "./FeedCard";
import { generateFeedCards } from "../utils/generateCards";
import { Zap, Flame, ChevronDown, Filter, Trophy } from "lucide-react";
import { EuphoriaSpinner } from "@/shared/components/EuphoriaSpinner";
import { cn } from "@/lib/utils";

interface MicroLearningFeedProps {
  onNavigate: (tab: string) => void;
}

const pathwayFilters = [
  { id: "all", label: "All Topics" },
  { id: "investing", label: "Investing" },
  { id: "corporate-finance", label: "Corp Finance" },
  { id: "personal-finance", label: "Personal" },
  { id: "trading", label: "Trading" },
  { id: "alternative-assets", label: "Alt Assets" },
];

export const MicroLearningFeed = ({ onNavigate }: MicroLearningFeedProps) => {
  const { user } = useAuth();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [feedCards, setFeedCards] = useState<FeedCardData[]>([]);
  const [sessionXP, setSessionXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedPathway, setSelectedPathway] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showStreakPulse, setShowStreakPulse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["feed-lessons", selectedPathway],
    queryFn: async () => {
      let query = supabase.from("lessons").select("id, title, description, pathway, difficulty, order_index").order("order_index");
      if (selectedPathway !== "all") {
        query = query.eq("pathway", selectedPathway);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (lessons.length > 0) {
      const cards = generateFeedCards(lessons, 40);
      setFeedCards(cards);
      setActiveCardIndex(0);
    }
  }, [lessons]);

  const handleCardComplete = useCallback((correct: boolean) => {
    const card = feedCards[activeCardIndex];
    if (correct && card) {
      setSessionXP((prev) => prev + card.xpReward);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        if (next % 5 === 0) {
          setShowStreakPulse(true);
          setTimeout(() => setShowStreakPulse(false), 2000);
        }
        return next;
      });
    } else {
      setStreak(0);
    }
  }, [activeCardIndex, feedCards, bestStreak]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardHeight = container.clientHeight;
    const newIndex = Math.round(container.scrollTop / cardHeight);
    if (newIndex !== activeCardIndex && newIndex < feedCards.length) {
      setActiveCardIndex(newIndex);
    }
    if (newIndex >= feedCards.length - 5 && lessons.length > 0) {
      const moreCards = generateFeedCards(lessons, 20);
      setFeedCards((prev) => [...prev, ...moreCards.map((c, i) => ({ ...c, id: `${c.id}-ext-${prev.length + i}` }))]);
    }
  }, [activeCardIndex, feedCards.length, lessons]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <EuphoriaSpinner size="lg" label="Loading your feed..." />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-120px)] md:h-[calc(100vh-48px)] flex flex-col bg-black">
      {/* ── Top HUD: clean, integrated bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* XP */}
          <motion.div
            key={sessionXP}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xl border border-white/[0.06]"
          >
            <Zap className="w-3 h-3 text-yellow-400/80" />
            <span className="text-white/70 text-[11px] font-bold tabular-nums">{sessionXP}</span>
          </motion.div>

          {/* Streak */}
          <motion.div
            animate={showStreakPulse ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.5 }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg backdrop-blur-xl border",
              streak >= 5 ? "bg-orange-500/10 border-orange-500/15" : "bg-black/60 border-white/[0.06]"
            )}
          >
            <Flame className={cn("w-3 h-3", streak >= 5 ? "text-orange-400" : streak > 0 ? "text-orange-400/60" : "text-white/20")} />
            <span className={cn("text-[11px] font-bold tabular-nums", streak > 0 ? "text-orange-400/80" : "text-white/20")}>{streak}</span>
          </motion.div>

          {/* Best streak */}
          {bestStreak >= 5 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-xl border border-white/[0.06]">
              <Trophy className="w-2.5 h-2.5 text-yellow-400/60" />
              <span className="text-white/30 text-[10px] font-bold">{bestStreak}</span>
            </div>
          )}
        </div>

        {/* Filter */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xl border border-white/[0.06] text-white/60 text-[11px] font-bold"
        >
          <Filter className="w-3 h-3" />
          {pathwayFilters.find((f) => f.id === selectedPathway)?.label}
          <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} />
        </button>
      </div>

      {/* Streak milestone */}
      <AnimatePresence>
        {showStreakPulse && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500/80 to-amber-500/80 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-bold">{streak} streak! 🔥</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-12 right-3 z-30 p-1.5 rounded-xl bg-black/90 backdrop-blur-xl border border-white/[0.08] min-w-[150px]"
          >
            {pathwayFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => { setSelectedPathway(f.id); setShowFilters(false); }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold transition-all",
                  selectedPathway === f.id
                    ? "bg-white/[0.08] text-white"
                    : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
                )}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 pointer-events-none">
        {feedCards.slice(Math.max(0, activeCardIndex - 3), activeCardIndex + 4).map((_, i) => {
          const realIdx = Math.max(0, activeCardIndex - 3) + i;
          return (
            <div
              key={realIdx}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                realIdx === activeCardIndex ? "h-5 bg-white/40" : "h-1 bg-white/10"
              )}
            />
          );
        })}
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {feedCards.map((card, idx) => (
          <div key={card.id} className="h-full w-full snap-start snap-always" style={{ minHeight: "100%" }}>
            <FeedCard card={card} onComplete={handleCardComplete} isActive={idx === activeCardIndex} />
          </div>
        ))}
      </div>
    </div>
  );
};
