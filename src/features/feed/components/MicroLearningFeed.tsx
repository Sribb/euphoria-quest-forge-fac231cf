import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FeedCard, FeedCardData } from "./FeedCard";
import { generateFeedCards } from "../utils/generateCards";
import { Zap, Flame, Trophy, ChevronDown, Filter } from "lucide-react";
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

  // Generate cards when lessons load
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
    // Load more when near end
    if (newIndex >= feedCards.length - 5 && lessons.length > 0) {
      const moreCards = generateFeedCards(lessons, 20);
      setFeedCards((prev) => [...prev, ...moreCards.map((c, i) => ({ ...c, id: `${c.id}-ext-${prev.length + i}` }))]);
    }
  }, [activeCardIndex, feedCards.length, lessons]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-120px)] md:h-[calc(100vh-48px)] flex flex-col">
      {/* Floating stats bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-xl rounded-t-3xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">{sessionXP} XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className={cn("w-4 h-4", streak > 0 ? "text-warning" : "text-muted-foreground")} />
            <span className={cn("text-sm font-bold", streak > 0 ? "text-warning" : "text-muted-foreground")}>
              {streak} streak
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-xs font-bold text-foreground"
          >
            <Filter className="w-3 h-3" />
            {pathwayFilters.find((f) => f.id === selectedPathway)?.label}
            <ChevronDown className={cn("w-3 h-3 transition-transform", showFilters && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-card/60 backdrop-blur-sm"
          >
            <div className="flex flex-wrap gap-2 p-3">
              {pathwayFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedPathway(f.id);
                    setShowFilters(false);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                    selectedPathway === f.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {feedCards.map((card, idx) => (
          <div
            key={card.id}
            className="h-full snap-start"
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

      {/* Scroll hint */}
      {activeCardIndex === 0 && feedCards.length > 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
          <span className="text-xs font-medium">Scroll to learn</span>
        </motion.div>
      )}
    </div>
  );
};
