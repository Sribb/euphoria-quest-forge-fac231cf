import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Zap, User } from "lucide-react";
import KineticText from "./KineticText";
import InteractiveSticker from "./InteractiveSticker";
import SliderSticker from "./SliderSticker";
import RadialFlare from "./RadialFlare";
import SlotMachineCounter from "./SlotMachineCounter";
import SwipeUpIndicator from "./SwipeUpIndicator";
import StoryProgressBar from "./StoryProgressBar";
import { Button } from "@/components/ui/button";

interface StorySegment {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  backgroundGradient: string;
  videoUrl?: string;
  interaction?: {
    type: "poll" | "quiz" | "slider";
    question: string;
    emoji?: string;
    options?: Array<{
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

export interface StoryData {
  id: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  segments: StorySegment[];
  createdAt: Date;
}

interface StoryCardProps {
  story: StoryData;
  isActive: boolean;
  onComplete: () => void;
  onSimulate: (data: StorySegment["simulation"]) => void;
  xp: number;
  onXPGain: (amount: number) => void;
}

const SEGMENT_DURATION = 6000; // 6 seconds per segment

const StoryCard = ({ story, isActive, onComplete, onSimulate, xp, onXPGain }: StoryCardProps) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showFlare, setShowFlare] = useState(false);
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentSegment = story.segments[currentSegmentIndex];
  const totalSegments = story.segments.length;

  // Progress timer
  useEffect(() => {
    if (!isActive || isPaused || isLongPress) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      return;
    }

    // If interaction exists and not complete, pause at 80%
    if (currentSegment?.interaction && !interactionComplete && progress >= 80) {
      return;
    }

    const interval = 50;
    const increment = (interval / SEGMENT_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const maxProgress = currentSegment?.interaction && !interactionComplete ? 80 : 100;
        if (prev >= maxProgress) {
          if (prev >= 100) {
            // Move to next segment
            if (currentSegmentIndex < totalSegments - 1) {
              setCurrentSegmentIndex((i) => i + 1);
              setInteractionComplete(false);
              return 0;
            } else {
              onComplete();
              return 100;
            }
          }
          return prev;
        }
        return Math.min(prev + increment, maxProgress);
      });
    }, interval);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isActive, isPaused, isLongPress, currentSegmentIndex, totalSegments, interactionComplete, currentSegment?.interaction, progress, onComplete]);

  // Reset on story change
  useEffect(() => {
    setCurrentSegmentIndex(0);
    setProgress(0);
    setInteractionComplete(false);
  }, [story.id]);

  // Handle tap navigation
  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isLongPress) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const tapX = clientX - rect.left;
    const tapZone = tapX / rect.width;

    if (tapZone < 0.3) {
      // Tap left - go back
      if (currentSegmentIndex > 0) {
        setCurrentSegmentIndex((i) => i - 1);
        setProgress(0);
        setInteractionComplete(false);
      }
    } else if (tapZone > 0.7) {
      // Tap right - go forward
      if (currentSegmentIndex < totalSegments - 1) {
        setCurrentSegmentIndex((i) => i + 1);
        setProgress(0);
        setInteractionComplete(false);
      } else {
        onComplete();
      }
    }
  }, [currentSegmentIndex, totalSegments, isLongPress, onComplete]);

  // Long press to pause
  const handlePressStart = useCallback(() => {
    longPressTimeoutRef.current = setTimeout(() => {
      setIsLongPress(true);
      setIsPaused(true);
    }, 200);
  }, []);

  const handlePressEnd = useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
    if (isLongPress) {
      setIsLongPress(false);
      setIsPaused(false);
    }
  }, [isLongPress]);

  const handleAnswer = (optionId: string, isCorrect?: boolean) => {
    setInteractionComplete(true);
    if (isCorrect) {
      setShowFlare(true);
      onXPGain(25);
    }
  };

  const handleSliderAnswer = (value: number) => {
    setInteractionComplete(true);
    if (value > 60) {
      setShowFlare(true);
      onXPGain(15);
    }
  };

  const handleSimulate = () => {
    if (currentSegment?.simulation) {
      setShowFlare(true);
      onXPGain(50);
      setTimeout(() => onSimulate(currentSegment.simulation), 500);
    }
  };

  const handleSwipeUp = () => {
    if (currentSegment?.simulation) {
      handleSimulate();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black select-none"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleTap}
    >
      {/* Radial Flare Effect */}
      <RadialFlare
        isActive={showFlare}
        color="green"
        onComplete={() => setShowFlare(false)}
      />

      {/* Video Background */}
      {currentSegment?.videoUrl && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={currentSegment.videoUrl}
          muted={isMuted}
          autoPlay
          loop
          playsInline
        />
      )}

      {/* Gradient Background */}
      <div
        className={`absolute inset-0 ${currentSegment?.backgroundGradient || "bg-black"}`}
        style={{ opacity: currentSegment?.videoUrl ? 0.6 : 0.5 }}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Top Bar: Progress + Author */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-2 pb-4 bg-gradient-to-b from-black/60 to-transparent">
        {/* Segmented Progress Bar */}
        <div className="mb-3">
          <StoryProgressBar
            segments={totalSegments}
            currentSegment={currentSegmentIndex}
            progress={progress}
            isPaused={isPaused || isLongPress}
          />
        </div>

        {/* Author info */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 p-0.5">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                {story.author.avatar ? (
                  <img src={story.author.avatar} alt={story.author.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-white/70" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{story.author.name}</span>
              {story.author.verified && (
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span className="text-white/50 text-xs">
                {Math.floor((Date.now() - story.createdAt.getTime()) / 3600000)}h
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* XP Counter */}
      <motion.div
        className="absolute top-20 right-4 z-20"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-emerald-500/30">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <SlotMachineCounter
            value={xp}
            suffix=" XP"
            className="text-emerald-400 font-bold text-xs"
          />
        </div>
      </motion.div>

      {/* Pause indicator */}
      <AnimatePresence>
        {isLongPress && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
            >
              <div className="flex gap-1">
                <div className="w-1.5 h-8 bg-white rounded-full" />
                <div className="w-1.5 h-8 bg-white rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 pb-28 z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSegment?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto"
          >
            {/* Title and content */}
            <div className="space-y-3 mb-6">
              <KineticText variant="headline" className="text-white text-3xl md:text-4xl">
                {currentSegment?.title}
              </KineticText>
              {currentSegment?.subtitle && (
                <KineticText variant="subtitle" delay={0.2} className="text-violet-300">
                  {currentSegment?.subtitle}
                </KineticText>
              )}
              <KineticText variant="body" delay={0.4} className="text-white/80 text-base">
                {currentSegment?.content}
              </KineticText>
            </div>

            {/* Interactive sticker */}
            {currentSegment?.interaction && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-5"
              >
                {currentSegment.interaction.type === "slider" ? (
                  <SliderSticker
                    question={currentSegment.interaction.question}
                    emoji={currentSegment.interaction.emoji || "🔥"}
                    onAnswer={handleSliderAnswer}
                    disabled={interactionComplete}
                  />
                ) : (
                  <InteractiveSticker
                    type={currentSegment.interaction.type}
                    question={currentSegment.interaction.question}
                    options={currentSegment.interaction.options || []}
                    onAnswer={handleAnswer}
                    disabled={interactionComplete}
                  />
                )}
              </motion.div>
            )}

            {/* Simulate button */}
            {currentSegment?.simulation && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSimulate();
                  }}
                  className="w-full py-5 text-base font-bold bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 border-0 rounded-xl shadow-lg shadow-violet-500/25"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Simulate: {currentSegment.simulation.action.toUpperCase()} {currentSegment.simulation.shares} {currentSegment.simulation.symbol}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe Up Indicator */}
      {currentSegment?.simulation && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center pointer-events-auto">
          <SwipeUpIndicator
            label="Swipe up for portfolio"
            onSwipeUp={handleSwipeUp}
          />
        </div>
      )}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Tap zones visual hint (development only) */}
      {/* <div className="absolute inset-0 pointer-events-none flex">
        <div className="w-[30%] h-full border-r border-white/10" />
        <div className="w-[40%] h-full" />
        <div className="w-[30%] h-full border-l border-white/10" />
      </div> */}
    </div>
  );
};

export default StoryCard;
