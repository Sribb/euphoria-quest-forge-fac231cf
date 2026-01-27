import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Zap } from "lucide-react";
import KineticText from "./KineticText";
import InteractiveSticker from "./InteractiveSticker";
import RadialFlare from "./RadialFlare";
import SlotMachineCounter from "./SlotMachineCounter";
import { Button } from "@/components/ui/button";

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

interface StoryCardProps {
  story: StoryData;
  isActive: boolean;
  onSimulate: (data: StoryData["simulation"]) => void;
  xp: number;
  onXPGain: (amount: number) => void;
}

const StoryCard = ({ story, isActive, onSimulate, xp, onXPGain }: StoryCardProps) => {
  const [showFlare, setShowFlare] = useState(false);
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Progress bar animation
  useEffect(() => {
    if (!isActive || isPaused || interactionComplete) return;

    const duration = 8000; // 8 seconds per story
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, isPaused, interactionComplete]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
    setInteractionComplete(false);
  }, [story.id]);

  const handleAnswer = (optionId: string, isCorrect?: boolean) => {
    setInteractionComplete(true);
    if (isCorrect) {
      setShowFlare(true);
      onXPGain(25);
    }
  };

  const handleSimulate = () => {
    if (story.simulation) {
      setShowFlare(true);
      onXPGain(50);
      setTimeout(() => onSimulate(story.simulation), 500);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Radial Flare Effect */}
      <RadialFlare
        isActive={showFlare}
        color="green"
        onComplete={() => setShowFlare(false)}
      />

      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${story.backgroundGradient}`}
        style={{ opacity: 0.4 }}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-8 right-4 z-20 flex gap-2">
        <motion.button
          onClick={() => setIsPaused(!isPaused)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </motion.button>
        <motion.button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* XP Counter */}
      <motion.div
        className="absolute top-8 left-4 z-20"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-emerald-500/30">
          <Zap className="w-4 h-4 text-emerald-400" />
          <SlotMachineCounter
            value={xp}
            suffix=" XP"
            className="text-emerald-400 font-bold text-sm"
          />
        </div>
      </motion.div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 pb-32 z-10">
        {/* Title and content */}
        <div className="space-y-4 mb-8">
          <KineticText variant="headline" className="text-white">
            {story.title}
          </KineticText>
          {story.subtitle && (
            <KineticText variant="subtitle" delay={0.3} className="text-violet-300">
              {story.subtitle}
            </KineticText>
          )}
          <KineticText variant="body" delay={0.5} className="text-white/80">
            {story.content}
          </KineticText>
        </div>

        {/* Interactive sticker */}
        {story.interaction && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <InteractiveSticker
              type={story.interaction.type}
              question={story.interaction.question}
              options={story.interaction.options}
              onAnswer={handleAnswer}
              disabled={interactionComplete}
            />
          </motion.div>
        )}

        {/* Simulate button */}
        {story.simulation && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              onClick={handleSimulate}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 border-0 rounded-xl shadow-lg shadow-violet-500/25"
            >
              <Zap className="w-5 h-5 mr-2" />
              Simulate: {story.simulation.action.toUpperCase()} {story.simulation.shares} {story.simulation.symbol}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};

export default StoryCard;
