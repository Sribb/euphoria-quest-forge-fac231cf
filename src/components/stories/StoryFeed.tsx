import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import StoryCard, { StoryData } from "./StoryCard";
import PortfolioOverlay from "./PortfolioOverlay";

// Sample stories data with multi-segment support
const SAMPLE_STORIES: StoryData[] = [
  {
    id: "1",
    author: { name: "MarketMaster", verified: true },
    createdAt: new Date(Date.now() - 2 * 3600000),
    segments: [
      {
        id: "1-1",
        title: "The Fed Just Dropped a Bomb",
        subtitle: "Rate Cuts Incoming? 📉",
        content: "Interest rates are about to change everything. Smart money is already moving.",
        backgroundGradient: "bg-gradient-to-br from-violet-900 via-purple-900 to-black",
        interaction: {
          type: "quiz",
          question: "When rates drop, what happens to growth stocks?",
          options: [
            { id: "a", text: "They moon 🚀", isCorrect: true },
            { id: "b", text: "They crash 📉", isCorrect: false },
            { id: "c", text: "Nothing changes", isCorrect: false },
          ],
        },
      },
      {
        id: "1-2",
        title: "Position Yourself NOW",
        subtitle: "Before the crowd catches on 💡",
        content: "Growth ETFs are the play. QQQ specifically has the best risk/reward.",
        backgroundGradient: "bg-gradient-to-br from-purple-900 via-violet-900 to-black",
        simulation: {
          symbol: "QQQ",
          action: "buy",
          shares: 10,
          price: 450.25,
        },
      },
    ],
  },
  {
    id: "2",
    author: { name: "CryptoKing", verified: true },
    createdAt: new Date(Date.now() - 5 * 3600000),
    segments: [
      {
        id: "2-1",
        title: "Bitcoin ETF Changed Everything",
        subtitle: "Institutional money is flooding in 🔥",
        content: "The halving just happened. You know what comes next.",
        backgroundGradient: "bg-gradient-to-br from-orange-900 via-red-900 to-black",
        interaction: {
          type: "slider",
          question: "How bullish are you on BTC?",
          emoji: "🚀",
        },
      },
      {
        id: "2-2",
        title: "The Setup is Perfect",
        content: "Every cycle, same pattern. Don't miss this one.",
        backgroundGradient: "bg-gradient-to-br from-red-900 via-orange-900 to-black",
        interaction: {
          type: "poll",
          question: "BTC price by end of year?",
          options: [
            { id: "a", text: "$150K+", votes: 2341 },
            { id: "b", text: "$100K-$150K", votes: 1567 },
            { id: "c", text: "$80K-$100K", votes: 423 },
            { id: "d", text: "Under $80K", votes: 189 },
          ],
        },
      },
      {
        id: "2-3",
        title: "My Move",
        subtitle: "DCA into spot BTC 📊",
        content: "Not financial advice, but this is exactly what I'm doing.",
        backgroundGradient: "bg-gradient-to-br from-amber-900 via-orange-900 to-black",
        simulation: {
          symbol: "BTC",
          action: "buy",
          shares: 0.1,
          price: 68500.0,
        },
      },
    ],
  },
  {
    id: "3",
    author: { name: "DividendQueen" },
    createdAt: new Date(Date.now() - 8 * 3600000),
    segments: [
      {
        id: "3-1",
        title: "The Dividend Play Nobody Sees",
        subtitle: "Passive Income Unlocked 💰",
        content: "While everyone chases meme stocks, this boring dividend aristocrat is printing money.",
        backgroundGradient: "bg-gradient-to-br from-emerald-900 via-teal-900 to-black",
        interaction: {
          type: "quiz",
          question: "What's the 'Rule of 72'?",
          options: [
            { id: "a", text: "Max stocks in a portfolio", isCorrect: false },
            { id: "b", text: "Years to double money", isCorrect: true },
            { id: "c", text: "Minimum retirement age", isCorrect: false },
          ],
        },
      },
      {
        id: "3-2",
        title: "JNJ: 62 Years of Dividend Growth",
        content: "Through wars, recessions, and pandemics. Still paying. Still growing.",
        backgroundGradient: "bg-gradient-to-br from-teal-900 via-emerald-900 to-black",
        simulation: {
          symbol: "JNJ",
          action: "buy",
          shares: 15,
          price: 155.5,
        },
      },
    ],
  },
  {
    id: "4",
    author: { name: "TechTrader", verified: true },
    createdAt: new Date(Date.now() - 1 * 3600000),
    segments: [
      {
        id: "4-1",
        title: "NVIDIA's Secret Weapon",
        subtitle: "AI Domination Continues 🤖",
        content: "Everyone's talking about chips, but the real alpha is in the software moat.",
        backgroundGradient: "bg-gradient-to-br from-cyan-900 via-blue-900 to-black",
        interaction: {
          type: "slider",
          question: "How confident in NVDA?",
          emoji: "🎯",
        },
      },
      {
        id: "4-2",
        title: "The Moat Gets Wider",
        content: "CUDA ecosystem, enterprise partnerships, data center dominance.",
        backgroundGradient: "bg-gradient-to-br from-blue-900 via-cyan-900 to-black",
        interaction: {
          type: "poll",
          question: "NVDA by EOY?",
          options: [
            { id: "a", text: "$200+", votes: 847 },
            { id: "b", text: "$150-$200", votes: 1203 },
            { id: "c", text: "$120-$150", votes: 456 },
          ],
        },
      },
      {
        id: "4-3",
        title: "Adding to my position",
        subtitle: "Long-term conviction play",
        content: "This is a 10-year hold for me. The AI revolution is just starting.",
        backgroundGradient: "bg-gradient-to-br from-indigo-900 via-blue-900 to-black",
        simulation: {
          symbol: "NVDA",
          action: "buy",
          shares: 5,
          price: 145.0,
        },
      },
    ],
  },
];

interface StoryFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoryFeed = ({ isOpen, onClose }: StoryFeedProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    balance: 10000,
    positions: [] as Array<{ symbol: string; shares: number; value: number; change: number }>,
    xpGained: 0,
  });
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentStory = SAMPLE_STORIES[currentStoryIndex];

  // Navigate to next/previous story
  const goToNextStory = useCallback(() => {
    if (currentStoryIndex < SAMPLE_STORIES.length - 1) {
      setDirection(1);
      setCurrentStoryIndex((i) => i + 1);
    } else {
      onClose();
    }
  }, [currentStoryIndex, onClose]);

  const goToPrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setDirection(-1);
      setCurrentStoryIndex((i) => i - 1);
    }
  }, [currentStoryIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNextStory();
      if (e.key === "ArrowLeft") goToPrevStory();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNextStory, goToPrevStory, onClose]);

  // Swipe handling
  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const swipeThreshold = 50;
      const swipeVelocity = 500;

      // Horizontal swipe for story navigation
      if (Math.abs(info.velocity.x) > swipeVelocity || Math.abs(info.offset.x) > swipeThreshold) {
        if (info.offset.x > 0) {
          goToPrevStory();
        } else {
          goToNextStory();
        }
      }

      // Vertical swipe up for portfolio
      if (info.offset.y < -swipeThreshold && info.velocity.y < -swipeVelocity) {
        setShowPortfolio(true);
      }
    },
    [goToNextStory, goToPrevStory]
  );

  const handleXPGain = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const handleSimulate = (simulation: { symbol: string; action: string; shares: number; price: number } | undefined) => {
    if (!simulation) return;

    const newPosition = {
      symbol: simulation.symbol,
      shares: simulation.shares,
      value: simulation.shares * simulation.price,
      change: Number((Math.random() * 10 - 2).toFixed(2)),
    };

    setPortfolioData((prev) => ({
      balance: prev.balance + newPosition.value * (1 + newPosition.change / 100),
      positions: [...prev.positions.slice(-2), newPosition],
      xpGained: 50,
    }));

    setShowPortfolio(true);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      scale: 0.95,
      opacity: 0,
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      scale: 0.95,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-14 right-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Story indicator pills (horizontal for story groups) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex gap-1.5">
            {SAMPLE_STORIES.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentStoryIndex ? 1 : -1);
                  setCurrentStoryIndex(index);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentStoryIndex
                    ? "w-6 bg-white"
                    : index < currentStoryIndex
                    ? "w-2 bg-white/70"
                    : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Stories container with swipe */}
          <motion.div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStoryIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                <StoryCard
                  story={currentStory}
                  isActive={true}
                  onComplete={goToNextStory}
                  onSimulate={handleSimulate}
                  xp={xp}
                  onXPGain={handleXPGain}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Side navigation hints */}
          <div className="absolute inset-y-0 left-0 w-12 z-40 opacity-0 hover:opacity-100 transition-opacity">
            {currentStoryIndex > 0 && (
              <button
                onClick={goToPrevStory}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </button>
            )}
          </div>

          <div className="absolute inset-y-0 right-0 w-12 z-40 opacity-0 hover:opacity-100 transition-opacity">
            {currentStoryIndex < SAMPLE_STORIES.length - 1 && (
              <button
                onClick={goToNextStory}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )}
          </div>

          {/* Portfolio Overlay */}
          <PortfolioOverlay
            isOpen={showPortfolio}
            onClose={() => setShowPortfolio(false)}
            balance={portfolioData.balance}
            positions={portfolioData.positions}
            xpGained={portfolioData.xpGained}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryFeed;
