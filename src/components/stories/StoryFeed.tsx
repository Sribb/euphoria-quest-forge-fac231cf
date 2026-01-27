import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import StoryCard from "./StoryCard";
import PortfolioOverlay from "./PortfolioOverlay";

interface StoryData {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  backgroundGradient: string;
  interaction?: {
    type: "poll" | "quiz";
    question: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect?: boolean;
      votes?: number;
    }>;
  };
  simulation?: {
    symbol: string;
    action: "buy" | "sell";
    shares: number;
    price: number;
  };
}

// Sample stories data
const SAMPLE_STORIES: StoryData[] = [
  {
    id: "1",
    title: "The Fed Just Dropped a Bomb",
    subtitle: "Rate Cuts Incoming? 📉",
    content: "Interest rates are about to change everything. Smart money is already moving. Are you positioned correctly?",
    backgroundGradient: "bg-gradient-to-br from-violet-900 via-purple-900 to-black",
    interaction: {
      type: "quiz",
      question: "When rates drop, what typically happens to growth stocks?",
      options: [
        { id: "a", text: "They moon 🚀", isCorrect: true },
        { id: "b", text: "They crash 📉", isCorrect: false },
        { id: "c", text: "Nothing changes", isCorrect: false },
        { id: "d", text: "Depends on the sector", isCorrect: false },
      ],
    },
    simulation: {
      symbol: "QQQ",
      action: "buy",
      shares: 10,
      price: 450.25,
    },
  },
  {
    id: "2",
    title: "NVIDIA's Secret Weapon",
    subtitle: "AI Domination Continues 🤖",
    content: "Everyone's talking about chips, but the real alpha is in the software moat they're building.",
    backgroundGradient: "bg-gradient-to-br from-emerald-900 via-teal-900 to-black",
    interaction: {
      type: "poll",
      question: "Where do you think NVDA goes by end of year?",
      options: [
        { id: "a", text: "$1,500+", votes: 847 },
        { id: "b", text: "$1,200-$1,500", votes: 1203 },
        { id: "c", text: "$1,000-$1,200", votes: 456 },
        { id: "d", text: "Under $1,000", votes: 234 },
      ],
    },
    simulation: {
      symbol: "NVDA",
      action: "buy",
      shares: 5,
      price: 1150.00,
    },
  },
  {
    id: "3",
    title: "The Dividend Play Nobody Sees",
    subtitle: "Passive Income Unlocked 💰",
    content: "While everyone chases meme stocks, this boring dividend aristocrat is printing money.",
    backgroundGradient: "bg-gradient-to-br from-amber-900 via-orange-900 to-black",
    interaction: {
      type: "quiz",
      question: "What's the 'Rule of 72'?",
      options: [
        { id: "a", text: "Max stocks in a portfolio", isCorrect: false },
        { id: "b", text: "Years to double money at given rate", isCorrect: true },
        { id: "c", text: "Minimum retirement age", isCorrect: false },
        { id: "d", text: "Tax bracket threshold", isCorrect: false },
      ],
    },
    simulation: {
      symbol: "JNJ",
      action: "buy",
      shares: 15,
      price: 155.50,
    },
  },
  {
    id: "4",
    title: "Crypto Winter is Over?",
    subtitle: "Bitcoin ETF Changed Everything 🔥",
    content: "Institutional money is flooding in. The halving just happened. You know what comes next.",
    backgroundGradient: "bg-gradient-to-br from-orange-900 via-red-900 to-black",
    interaction: {
      type: "poll",
      question: "Are you bullish on Bitcoin for 2024?",
      options: [
        { id: "a", text: "EXTREMELY bullish 🐂", votes: 2341 },
        { id: "b", text: "Cautiously optimistic", votes: 1567 },
        { id: "c", text: "Neutral", votes: 423 },
        { id: "d", text: "Still bearish 🐻", votes: 189 },
      ],
    },
    simulation: {
      symbol: "BTC",
      action: "buy",
      shares: 0.1,
      price: 68500.00,
    },
  },
  {
    id: "5",
    title: "The Short Squeeze Setup",
    subtitle: "High Risk, Higher Reward ⚡",
    content: "Short interest is through the roof. One catalyst and this thing explodes. Are you brave enough?",
    backgroundGradient: "bg-gradient-to-br from-red-900 via-pink-900 to-black",
    interaction: {
      type: "quiz",
      question: "What triggers a short squeeze?",
      options: [
        { id: "a", text: "Low trading volume", isCorrect: false },
        { id: "b", text: "Shorts forced to cover at higher prices", isCorrect: true },
        { id: "c", text: "Company announces layoffs", isCorrect: false },
        { id: "d", text: "Interest rates rise", isCorrect: false },
      ],
    },
    simulation: {
      symbol: "GME",
      action: "buy",
      shares: 50,
      price: 25.75,
    },
  },
];

interface StoryFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoryFeed = ({ isOpen, onClose }: StoryFeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    balance: 10000,
    positions: [] as Array<{ symbol: string; shares: number; value: number; change: number }>,
    xpGained: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "up" | "down") => {
    if (direction === "up" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "down" && currentIndex < SAMPLE_STORIES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handle touch/wheel scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;
      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;

      if (Math.abs(diff) > 50) {
        isScrolling = true;
        if (diff > 0) {
          handleScroll("down");
        } else {
          handleScroll("up");
        }
        setTimeout(() => {
          isScrolling = false;
        }, 500);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      isScrolling = true;
      
      if (e.deltaY > 0) {
        handleScroll("down");
      } else {
        handleScroll("up");
      }
      
      setTimeout(() => {
        isScrolling = false;
      }, 500);
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("wheel", handleWheel);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowUp") handleScroll("up");
      if (e.key === "ArrowDown") handleScroll("down");
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, onClose]);

  const handleXPGain = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const handleSimulate = (simulation: StoryData["simulation"]) => {
    if (!simulation) return;

    const newPosition = {
      symbol: simulation.symbol,
      shares: simulation.shares,
      value: simulation.shares * simulation.price,
      change: (Math.random() * 10 - 2).toFixed(2) as unknown as number,
    };

    setPortfolioData((prev) => ({
      balance: prev.balance + newPosition.value * (1 + newPosition.change / 100),
      positions: [...prev.positions.slice(-2), newPosition],
      xpGained: 50,
    }));

    setShowPortfolio(true);
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
            className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Story indicator dots */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
            {SAMPLE_STORIES.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-2 h-6"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="absolute left-1/2 -translate-x-1/2 top-20 z-40">
            <motion.button
              onClick={() => handleScroll("up")}
              className={`p-2 rounded-full bg-white/10 backdrop-blur-sm ${
                currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20"
              }`}
              disabled={currentIndex === 0}
              whileHover={currentIndex > 0 ? { scale: 1.1 } : {}}
              whileTap={currentIndex > 0 ? { scale: 0.9 } : {}}
            >
              <ChevronUp className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40">
            <motion.button
              onClick={() => handleScroll("down")}
              className={`p-2 rounded-full bg-white/10 backdrop-blur-sm ${
                currentIndex === SAMPLE_STORIES.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-white/20"
              }`}
              disabled={currentIndex === SAMPLE_STORIES.length - 1}
              whileHover={currentIndex < SAMPLE_STORIES.length - 1 ? { scale: 1.1 } : {}}
              whileTap={currentIndex < SAMPLE_STORIES.length - 1 ? { scale: 0.9 } : {}}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          {/* Stories container */}
          <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="absolute inset-0"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <StoryCard
                  story={SAMPLE_STORIES[currentIndex]}
                  isActive={true}
                  onSimulate={handleSimulate}
                  xp={xp}
                  onXPGain={handleXPGain}
                />
              </motion.div>
            </AnimatePresence>
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
