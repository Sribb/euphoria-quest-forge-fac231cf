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
  { id: "all", label: "All" },
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
    // Infinite load
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
      {/* Floating top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* XP counter */}
          <motion.div
            key={sessionXP}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-white text-xs font-black tabular-nums">{sessionXP}</span>
          </motion.div>

          {/* Streak */}
          <motion.div
            animate={showStreakPulse ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border",
              streak >= 5 ? "bg-orange-500/20 border-orange-500/30" :
              streak > 0 ? "bg-black/50 border-white/10" : "bg-black/50 border-white/10"
            )}
          >
            <Flame className={cn("w-3.5 h-3.5", streak >= 5 ? "text-orange-400" : streak > 0 ? "text-orange-300" : "text-white/30")} />
            <span className={cn("text-xs font-black", streak > 0 ? "text-orange-400" : "text-white/30")}>
              {streak}
            </span>
          </motion.div>

          {/* Best streak badge */}
          {bestStreak >= 5 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <span className="text-white/50 text-[10px] font-black">{bestStreak}</span>
            </div>
          )}
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-white text-xs font-black"
        >
          <Filter className="w-3 h-3" />
          {pathwayFilters.find((f) => f.id === selectedPathway)?.label}
          <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} />
        </button>
      </div>

      {/* Streak milestone popup */}
      <AnimatePresence>
        {showStreakPulse && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500/90 to-amber-500/90 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-black">{streak} streak! 🔥 Keep going!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-3 z-30 p-2 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 min-w-[160px]"
          >
            {pathwayFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedPathway(f.id);
                  setShowFilters(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-xs font-black transition-all",
                  selectedPathway === f.id
                    ? "bg-white/15 text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
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
                "w-1 rounded-full transition-all duration-300",
                realIdx === activeCardIndex ? "h-6 bg-white/60" : "h-1.5 bg-white/15"
              )}
            />
          );
        })}
      </div>

      {/* Full-screen scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {feedCards.map((card, idx) => (
          <div
            key={card.id}
            className="h-full w-full snap-start snap-always"
            style={{ minHeight: "100%" }}
          >
            <FeedCard
              card={card}
              onComplete={handleCardComplete}
              isActive={idx === activeCardIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
