import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock, TrendingUp, Shield, Sparkles } from "lucide-react";

interface ReflectionArrow {
  id: string;
  label: string;
  icon: React.ReactNode;
  position: { top: string; left: string };
  rotation: number;
  confirmMessage: string;
}

interface Lesson1ReflectionSlideProps {
  onComplete: () => void;
}

export const Lesson1ReflectionSlide = ({ onComplete }: Lesson1ReflectionSlideProps) => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [selectedArrows, setSelectedArrows] = useState<Set<string>>(new Set());
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [allExplored, setAllExplored] = useState(false);

  const arrows: ReflectionArrow[] = [
    {
      id: "time",
      label: "Time",
      icon: <Clock className="w-4 h-4" />,
      position: { top: "25%", left: "20%" },
      rotation: 45,
      confirmMessage: "Correct. Time amplifies every financial decision you make.",
    },
    {
      id: "compounding",
      label: "Compounding",
      icon: <TrendingUp className="w-4 h-4" />,
      position: { top: "40%", left: "75%" },
      rotation: -30,
      confirmMessage: "Yes. Growth builds on growth, creating exponential results.",
    },
    {
      id: "risk",
      label: "Risk Exposure",
      icon: <Shield className="w-4 h-4" />,
      position: { top: "60%", left: "15%" },
      rotation: 60,
      confirmMessage: "Right. Higher risk opens the door to higher potential returns.",
    },
    {
      id: "early",
      label: "Starting Early",
      icon: <Sparkles className="w-4 h-4" />,
      position: { top: "70%", left: "80%" },
      rotation: -45,
      confirmMessage: "Exactly. Early decisions matter more than perfect decisions.",
    },
  ];

  useEffect(() => {
    // Animate question fade in
    const questionTimer = setTimeout(() => setShowQuestion(true), 500);
    // Animate arrows after question
    const arrowsTimer = setTimeout(() => setShowArrows(true), 1500);
    
    return () => {
      clearTimeout(questionTimer);
      clearTimeout(arrowsTimer);
    };
  }, []);

  useEffect(() => {
    if (selectedArrows.size === arrows.length) {
      setAllExplored(true);
    }
  }, [selectedArrows, arrows.length]);

  const handleArrowClick = (arrow: ReflectionArrow) => {
    setSelectedArrows((prev) => new Set([...prev, arrow.id]));
    setActiveMessage(arrow.confirmMessage);
    
    // Clear message after delay
    setTimeout(() => setActiveMessage(null), 2500);
  };

  return (
    <div className="relative min-h-[600px] bg-slate-950 rounded-2xl overflow-hidden">
      {/* Dimmed chart background placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-90">
        {/* Simulated chart lines in background */}
        <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
          <defs>
            <linearGradient id="savingLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="investingLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Saving line - relatively flat */}
          <path
            d="M 0 400 Q 200 390 400 380 T 800 360 T 1200 350"
            fill="none"
            stroke="url(#savingLine)"
            strokeWidth="3"
          />
          {/* Investing line - exponential curve */}
          <path
            d="M 0 450 Q 200 420 400 350 T 800 200 T 1200 50"
            fill="none"
            stroke="url(#investingLine)"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Interactive arrows */}
      <AnimatePresence>
        {showArrows && arrows.map((arrow, index) => (
          <motion.button
            key={arrow.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
            onClick={() => handleArrowClick(arrow)}
            className={`absolute z-20 group cursor-pointer ${
              selectedArrows.has(arrow.id) 
                ? "pointer-events-none" 
                : ""
            }`}
            style={{ top: arrow.position.top, left: arrow.position.left }}
          >
            <motion.div
              animate={selectedArrows.has(arrow.id) ? {} : { 
                y: [0, -5, 0],
                rotate: [arrow.rotation - 5, arrow.rotation + 5, arrow.rotation - 5]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                selectedArrows.has(arrow.id)
                  ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                  : "bg-slate-800/80 border-slate-600 text-slate-300 hover:bg-slate-700/80 hover:border-primary hover:text-primary"
              }`}
            >
              <ArrowUpRight 
                className="w-5 h-5" 
                style={{ transform: `rotate(${arrow.rotation}deg)` }}
              />
              {arrow.icon}
              <span className="font-medium text-sm">{arrow.label}</span>
              {selectedArrows.has(arrow.id) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1 text-emerald-400"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Central question */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-2xl"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-slate-100 leading-tight mb-6">
                Why did these two choices end so differently?
              </h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-400"
              >
                Tap each concept to explore
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation message */}
        <AnimatePresence>
          {activeMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 max-w-md"
            >
              <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl px-6 py-4 backdrop-blur-sm">
                <p className="text-emerald-200 text-center font-medium">
                  {activeMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button - appears when all explored */}
        <AnimatePresence>
          {allExplored && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={onComplete}
              className="absolute bottom-12 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              See the Insight
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {arrows.map((arrow) => (
          <motion.div
            key={arrow.id}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              selectedArrows.has(arrow.id) ? "bg-emerald-400" : "bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
