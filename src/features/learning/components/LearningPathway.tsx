import { useState } from "react";
import { ChallengeModal } from "./ChallengeModal";
import { Trophy, Lock, ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
}

interface LearningPathwayProps {
  lessons: Lesson[];
  onLessonSelect: (lessonId: string) => void;
  completedCount: number;
  totalCount: number;
  pathwayTitle?: string;
  pathwayColor?: string;
  onBack?: () => void;
}

// Smooth sine-wave curve
const getX = (index: number) => Math.sin((index / 3) * Math.PI) * 90;

export const LearningPathway = ({
  lessons,
  onLessonSelect,
  completedCount,
  totalCount,
  pathwayTitle,
  pathwayColor,
  onBack,
}: LearningPathwayProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleNodeClick = (lesson: Lesson) => {
    if (!lesson.is_locked) setSelectedLesson(lesson);
  };

  const handleStartChallenge = () => {
    if (selectedLesson) {
      onLessonSelect(selectedLesson.id);
      setSelectedLesson(null);
    }
  };

  const completedLessons = lessons.filter((l) => l.completed).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      </div>

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h1 className="text-xl font-black text-foreground tracking-tight">
                  {pathwayTitle || "Learning Path"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {completedLessons} of {lessons.length} complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-3.5 py-1.5 rounded-full">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-base font-black text-primary">{progressPercentage}%</span>
            </div>
          </div>
          <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pathway */}
      <div className="max-w-2xl mx-auto px-8 py-10 pb-40">
        <div className="flex flex-col items-center gap-5">
          {lessons.map((lesson, index) => {
            const isNextLesson =
              !lesson.is_locked &&
              !lesson.completed &&
              index === lessons.findIndex((l) => !l.is_locked && !l.completed);
            const x = getX(index);
            const isHovered = hovered === lesson.id;
            const isChallengeLevel = (index + 1) % 10 === 0;

            // Section divider every 5 lessons (but not on challenge levels)
            const showDivider = index > 0 && index % 5 === 0 && !isChallengeLevel;
            const sectionNumber = Math.floor(index / 5) + 1;
            const sectionLabels = ["The Intro", "Building Blocks", "Core Skills", "Advanced", "Mastery", "Expert"];

            return (
              <div key={lesson.id} className="flex flex-col items-center w-full">
                {showDivider && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: index * 0.03, duration: 0.4 }}
                    className="flex items-center gap-4 w-full max-w-xs mb-6 mt-2"
                  >
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      {sectionLabels[sectionNumber - 1] || `Section ${sectionNumber}`}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  </motion.div>
                )}

                {/* Challenge level node */}
                {isChallengeLevel ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20, x }}
                    animate={{ opacity: 1, y: 0, x }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className="relative flex flex-col items-center my-4"
                  >
                    {isHovered && !lesson.is_locked && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute -top-[76px] bg-card border border-border rounded-2xl px-4 py-2.5 shadow-lg z-20 min-w-[200px] text-center pointer-events-none"
                      >
                        <p className="text-sm font-black text-foreground">⚡ {lesson.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Challenge Level</p>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-card border-b border-r border-border rotate-45" />
                      </motion.div>
                    )}

                    <button
                      onClick={() => handleNodeClick(lesson)}
                      onMouseEnter={() => setHovered(lesson.id)}
                      onMouseLeave={() => setHovered(null)}
                      disabled={lesson.is_locked}
                      className={cn(
                        "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 z-10",
                        lesson.completed
                          ? "bg-gradient-to-br from-warning to-warning/70 shadow-lg shadow-warning/20 hover:scale-110 hover:-translate-y-1 cursor-pointer border-4 border-warning/50"
                          : lesson.is_locked
                          ? "bg-muted border-4 border-border cursor-not-allowed opacity-40"
                          : isNextLesson
                          ? "bg-warning/20 border-4 border-warning cursor-pointer hover:scale-110 hover:-translate-y-1 ring-4 ring-warning/20"
                          : "bg-card border-4 border-warning/30 hover:border-warning/60 hover:scale-110 hover:-translate-y-1 cursor-pointer"
                      )}
                    >
                      {lesson.completed ? (
                        <Trophy className="w-10 h-10 text-warning-foreground" />
                      ) : lesson.is_locked ? (
                        <Lock className="w-8 h-8 text-muted-foreground" />
                      ) : (
                        <Zap className="w-10 h-10 text-warning" />
                      )}
                    </button>

                    <span className="mt-2 text-xs font-black text-warning uppercase tracking-widest">
                      Challenge
                    </span>
                  </motion.div>
                ) : (
                  /* Regular lesson node */
                  <motion.div
                    initial={{ opacity: 0, y: 20, x }}
                    animate={{ opacity: 1, y: 0, x }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                    className="relative flex flex-col items-center"
                  >
                    {isHovered && !lesson.is_locked && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute -top-[72px] bg-card border border-border rounded-2xl px-4 py-2.5 shadow-lg z-20 min-w-[180px] text-center pointer-events-none"
                      >
                        <p className="text-sm font-black text-foreground line-clamp-2">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{lesson.duration} · {lesson.difficulty}</p>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-card border-b border-r border-border rotate-45" />
                      </motion.div>
                    )}

                    <button
                      onClick={() => handleNodeClick(lesson)}
                      onMouseEnter={() => setHovered(lesson.id)}
                      onMouseLeave={() => setHovered(null)}
                      disabled={lesson.is_locked}
                      className={cn(
                        "relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200 z-10",
                        lesson.completed &&
                          "bg-primary shadow-lg shadow-primary/25 hover:scale-110 hover:-translate-y-1 cursor-pointer border-[3px] border-primary/60",
                        lesson.is_locked &&
                          "bg-muted border-[3px] border-border cursor-not-allowed opacity-40",
                        isNextLesson &&
                          "bg-primary/20 border-[3px] border-primary cursor-pointer hover:scale-110 hover:-translate-y-1 ring-4 ring-primary/20 shadow-md shadow-primary/15",
                        !lesson.completed && !lesson.is_locked && !isNextLesson &&
                          "bg-card border-[3px] border-border/80 shadow-md hover:border-primary/50 hover:scale-110 hover:-translate-y-1 cursor-pointer"
                      )}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="w-8 h-8 text-primary-foreground" strokeWidth={2.5} />
                      ) : lesson.is_locked ? (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      ) : (
                        <span className="text-xl font-black text-foreground">{lesson.order_index}</span>
                      )}
                    </button>

                    <div className="flex gap-0.5 mt-1.5 h-4">
                      {isNextLesson ? (
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">Start</span>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}

          {progressPercentage === 100 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg">
                <Trophy className="w-12 h-12 text-warning-foreground" />
              </div>
              <h3 className="text-xl font-black text-foreground mt-3">Path Complete! 🎉</h3>
              <p className="text-sm text-muted-foreground mt-1">You've mastered every lesson</p>
            </motion.div>
          )}
        </div>
      </div>

      {selectedLesson && (
        <ChallengeModal
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onStart={handleStartChallenge}
          title={selectedLesson.title}
          description={selectedLesson.description}
          duration={selectedLesson.duration}
          difficulty={selectedLesson.difficulty}
          orderIndex={selectedLesson.order_index}
          isCompleted={selectedLesson.completed}
          stars={0}
        />
      )}
    </div>
  );
};
