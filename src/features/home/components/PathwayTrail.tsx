import { useState } from "react";
import { Lock, CheckCircle2, Play, Trophy, Star, Crown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  order_index: number;
  is_locked: boolean;
  completed: boolean;
  progress: number;
  skippedByPlacement?: boolean;
  legendary_completed?: boolean;
}

interface PathwayTrailProps {
  lessons: Lesson[];
  onLessonSelect: (lessonId: string) => void;
  onLegendarySelect?: (lessonId: string) => void;
  pathwayTitle: string;
}

// Section labels by group of 5
const LEVEL_LABELS = [
  "Introduction",
  "Building Blocks",
  "Core Concepts",
  "Applied Skills",
  "Advanced Topics",
];

// Winding X offset for stagger effect
const getNodeX = (index: number): number => {
  const amplitude = 80;
  return Math.sin((index / 2.5) * Math.PI) * amplitude;
};

export const PathwayTrail = ({
  lessons,
  onLessonSelect,
  onLegendarySelect,
  pathwayTitle,
}: PathwayTrailProps) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const firstUnlockedIncomplete = lessons.findIndex((l) => !l.is_locked && !l.completed);

  const handleNodeClick = (lesson: Lesson, index: number) => {
    if (lesson.is_locked) return;
    const isNext = index === firstUnlockedIncomplete;
    if (isNext || !lesson.completed) {
      setActivePopover(activePopover === lesson.id ? null : lesson.id);
    } else if (lesson.completed) {
      // Completed lessons can be replayed
      setActivePopover(activePopover === lesson.id ? null : lesson.id);
    }
  };

  const handleContinue = (lessonId: string) => {
    setActivePopover(null);
    onLessonSelect(lessonId);
  };

  return (
    <div className="relative pb-32">
      {/* Light content area */}
      <div className="p-8 md:p-12">
        {lessons.map((lesson, index) => {
          const isNext = index === firstUnlockedIncomplete;
          const isChallengeLevel = (index + 1) % 10 === 0;
          const isCapstone = index === lessons.length - 1;
          const isLegendary = lesson.legendary_completed;
          const x = getNodeX(index);

          // Level banner every 5 lessons
          const showLevelBanner = index % 5 === 0;
          const levelNumber = Math.floor(index / 5) + 1;
          const levelTitle = LEVEL_LABELS[levelNumber - 1] || `Section ${levelNumber}`;

          // Reward decoration after every 5 lessons (between sections)
          const showRewardDecoration = index > 0 && index % 5 === 0;

          return (
            <div key={lesson.id} className="flex flex-col items-center">
              {/* Reward decoration between sections */}
              {showRewardDecoration && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="my-6 flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="w-px h-4 bg-border/40" />
                </motion.div>
              )}

              {/* Level banner */}
              {showLevelBanner && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="w-full max-w-sm mx-auto mb-8 mt-2"
                >
                  <div className="rounded-xl border border-primary/30 bg-primary/5 px-6 py-3 text-center">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-0.5">
                      Level {levelNumber}
                    </p>
                    <p className="text-sm font-bold text-foreground">{levelTitle}</p>
                  </div>
                </motion.div>
              )}

              {/* Node */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, x }}
                transition={{ delay: index * 0.03, duration: 0.35, ease: "easeOut" }}
                className="relative flex flex-col items-center mb-5"
              >
                {/* Connecting line to next node */}
                {index < lessons.length - 1 && (
                  <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-px h-[40px] bg-gradient-to-b from-border/60 to-transparent z-0" />
                )}

                {/* Active lesson pulse ring */}
                {isNext && (
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <div className="w-[86px] h-[86px] rounded-full border-2 border-primary/40 animate-ping" style={{ animationDuration: "2s" }} />
                  </div>
                )}

                {/* The disc */}
                <button
                  onClick={() => handleNodeClick(lesson, index)}
                  disabled={lesson.is_locked}
                  data-tutorial={isNext ? "first-lesson" : undefined}
                  className={cn(
                    "relative w-[70px] h-[70px] rounded-full flex items-center justify-center z-10 transition-all duration-200",
                    // 3D shadow effect
                    "shadow-[0_6px_0_0_rgba(0,0,0,0.15)]",
                    // States
                    isCapstone && !lesson.is_locked
                      ? "bg-gradient-to-br from-primary via-accent to-primary border-2 border-primary/60 hover:scale-110 hover:-translate-y-1 cursor-pointer shadow-[0_6px_0_0_hsl(var(--primary)/0.4)]"
                      : isChallengeLevel && !lesson.is_locked
                      ? "bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-500/60 hover:scale-110 hover:-translate-y-1 cursor-pointer shadow-[0_6px_0_0_rgba(217,119,6,0.4)]"
                      : isLegendary
                      ? "bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-400/60 hover:scale-110 hover:-translate-y-1 cursor-pointer shadow-[0_6px_0_0_rgba(217,119,6,0.4)] ring-2 ring-amber-400/20"
                      : lesson.completed
                      ? "bg-primary border-2 border-primary/60 hover:scale-110 hover:-translate-y-1 cursor-pointer shadow-[0_6px_0_0_hsl(var(--primary)/0.4)]"
                      : isNext
                      ? "bg-emerald-500 border-2 border-emerald-400/60 hover:scale-110 hover:-translate-y-1 cursor-pointer shadow-[0_6px_0_0_rgba(16,185,129,0.4)]"
                      : lesson.is_locked
                      ? "bg-muted border-2 border-border cursor-not-allowed opacity-50 shadow-[0_6px_0_0_rgba(0,0,0,0.08)]"
                      : "bg-card border-2 border-border/80 hover:scale-110 hover:-translate-y-1 cursor-pointer shadow-[0_6px_0_0_rgba(0,0,0,0.1)]"
                  )}
                >
                  {/* Lock icon for locked */}
                  {lesson.is_locked && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-muted-foreground/20 border border-border flex items-center justify-center z-20">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  )}

                  {isCapstone && !lesson.is_locked ? (
                    <Crown className="w-8 h-8 text-primary-foreground" />
                  ) : isChallengeLevel && !lesson.is_locked ? (
                    <Zap className="w-7 h-7 text-white" />
                  ) : isLegendary ? (
                    <Star className="w-7 h-7 text-white fill-white" />
                  ) : lesson.completed ? (
                    <CheckCircle2 className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
                  ) : isNext ? (
                    <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                  ) : lesson.is_locked ? (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <span className="text-base font-bold text-foreground">{lesson.order_index}</span>
                  )}
                </button>

                {/* Lesson title label */}
                <p className={cn(
                  "mt-2.5 text-xs font-medium text-center max-w-[120px] leading-tight",
                  lesson.is_locked ? "text-muted-foreground/50" : isNext ? "text-foreground font-bold" : "text-muted-foreground"
                )}>
                  {lesson.title}
                </p>

                {isNext && (
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-0.5">Current</span>
                )}

                {/* Popover */}
                <AnimatePresence>
                  {activePopover === lesson.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-[90px] z-30 w-64"
                    >
                      {/* Arrow */}
                      <div className="flex justify-center mb-[-6px] relative z-10">
                        <div className="w-3 h-3 rotate-45 bg-card border-l border-t border-border/60" />
                      </div>
                      <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-xl shadow-black/20">
                        <h4 className="font-semibold text-foreground text-sm">{lesson.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{lesson.duration} · {lesson.difficulty}</p>

                        <Button
                          onClick={() => handleContinue(lesson.id)}
                          className="w-full mt-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold rounded-xl"
                        >
                          {lesson.completed ? "Review" : "Continue"}
                        </Button>

                        {lesson.completed && !lesson.legendary_completed && onLegendarySelect && (
                          <Button
                            onClick={() => {
                              setActivePopover(null);
                              onLegendarySelect(lesson.id);
                            }}
                            variant="outline"
                            className="w-full mt-2 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 font-bold rounded-xl"
                          >
                            <Star className="w-4 h-4 mr-1.5" /> Legendary Challenge
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
