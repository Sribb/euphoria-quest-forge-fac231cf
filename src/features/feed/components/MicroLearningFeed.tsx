import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FeedCard, FeedCardData } from "./FeedCard";
import { generateFeedCards } from "../utils/generateCards";
import { Zap, Flame, ChevronDown, Filter } from "lucide-react";
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
  const [selectedPathway, setSelectedPathway] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
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
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  }, [activeCardIndex, feedCards]);

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
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-white/50 text-sm">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-120px)] md:h-[calc(100vh-48px)] flex flex-col bg-black">
      {/* Floating top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-white text-xs font-bold">{sessionXP}</span>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl border",
            streak > 0 ? "bg-orange-500/20 border-orange-500/30" : "bg-black/40 border-white/10"
          )}>
            <Flame className={cn("w-3.5 h-3.5", streak > 0 ? "text-orange-400" : "text-white/40")} />
            <span className={cn("text-xs font-bold", streak > 0 ? "text-orange-400" : "text-white/40")}>
              {streak}🔥
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white text-xs font-bold"
        >
          <Filter className="w-3 h-3" />
          {pathwayFilters.find((f) => f.id === selectedPathway)?.label}
          <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} />
        </button>
      </div>

      {/* Filter dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-3 z-30 p-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 min-w-[160px]"
          >
            {pathwayFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedPathway(f.id);
                  setShowFilters(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all",
                  selectedPathway === f.id
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory"
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
