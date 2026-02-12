import { useState } from "react";
import { ChallengeModal } from "./ChallengeModal";
import { Trophy, Award, Lock, Star, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import mascot from "@/assets/mascot.png";

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
  stars?: number;
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

const DuoButton = ({
  lesson,
  index,
  isNext,
  onClick,
}: {
  lesson: Lesson;
  index: number;
  isNext: boolean;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const stars = lesson.stars || (lesson.completed ? 3 : 0);

  // Zigzag pattern: alternate left and right
  const xOffset = Math.sin((index / 2) * Math.PI) * 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="relative flex flex-col items-center"
      style={{ transform: `translateX(${xOffset}px)` }}
    >
      {/* Tooltip on hover */}
      {hovered && !lesson.is_locked && (
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

      {/* The button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={lesson.is_locked}
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
          // Completed
          lesson.completed &&
            "bg-primary shadow-glow-soft hover:scale-110 cursor-pointer border-[3px] border-primary/60",
          // Locked
          lesson.is_locked &&
            "bg-muted border-[3px] border-border cursor-not-allowed opacity-40",
          // Current / next
          isNext &&
            "bg-primary/20 border-[3px] border-primary cursor-pointer hover:scale-110 ring-4 ring-primary/20 animate-bounce-subtle",
          // Available but not started
          !lesson.completed && !lesson.is_locked && !isNext &&
            "bg-card border-[3px] border-border hover:border-primary/50 hover:scale-110 cursor-pointer"
        )}
      >
        {lesson.completed ? (
          <CheckCircle2 className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
        ) : lesson.is_locked ? (
          <Lock className="w-5 h-5 text-muted-foreground" />
        ) : (
          <span className="text-lg font-black text-foreground">{lesson.order_index}</span>
        )}
      </button>

      {/* Stars under completed */}
      <div className="flex gap-0.5 mt-1.5 h-4">
        {lesson.completed ? (
          [...Array(3)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < stars ? "text-warning fill-warning" : "text-muted-foreground/20"
              )}
            />
          ))
        ) : isNext ? (
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Start</span>
        ) : null}
      </div>
    </motion.div>
  );
};

/** Dotted SVG connector between two nodes */
const DottedConnector = ({ fromIndex, toIndex }: { fromIndex: number; toIndex: number }) => {
  const gap = 96; // vertical gap between nodes
  const fromX = 50 + Math.sin((fromIndex / 2) * Math.PI) * 50;
  const toX = 50 + Math.sin((toIndex / 2) * Math.PI) * 50;

  return (
    <svg
      className="absolute pointer-events-none"
      width="200"
      height={gap}
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        top: `${fromIndex * gap + 64}px`,
      }}
      viewBox={`0 0 200 ${gap}`}
    >
      <path
        d={`M ${fromX + 50} 0 Q ${(fromX + toX) / 2 + 50} ${gap / 2} ${toX + 50} ${gap}`}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="3"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
    </svg>
  );
};

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

  const handleNodeClick = (lesson: Lesson) => {
    if (!lesson.is_locked) {
      setSelectedLesson(lesson);
    }
  };

  const handleStartChallenge = () => {
    if (selectedLesson) {
      onLessonSelect(selectedLesson.id);
      setSelectedLesson(null);
    }
  };

  const completedLessons = lessons.filter((l) => l.completed).length;
  const progressPercentage =
    lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  // Find the next lesson index for mascot positioning
  const nextLessonIndex = lessons.findIndex((l) => !l.is_locked && !l.completed);

  return (
    <div className="relative min-h-screen">
      {/* Soft background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
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

          {/* Progress bar */}
          <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pathway content */}
      <div className="max-w-2xl mx-auto px-8 py-10 pb-40 relative">
        {/* Mascot character - floats near the current lesson */}
        <motion.div
          className="hidden md:block absolute right-0 z-10"
          style={{ top: nextLessonIndex >= 0 ? `${nextLessonIndex * 96 + 20}px` : "20px" }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative">
            <img
              src={mascot}
              alt="Euphoria mascot"
              className="w-20 h-20 object-contain drop-shadow-lg"
            />
            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-10 -left-16 bg-card border border-border rounded-xl px-3 py-1.5 shadow-md whitespace-nowrap"
            >
              <span className="text-xs font-black text-foreground">
                {completedLessons === 0
                  ? "Let's go! 🚀"
                  : completedLessons < lessons.length
                  ? "Keep it up! 💪"
                  : "Amazing! 🎉"}
              </span>
              <div className="absolute right-2 -bottom-1 w-2 h-2 bg-card border-b border-r border-border rotate-45" />
            </motion.div>
          </div>
        </motion.div>

        {/* Node list with dotted connectors */}
        <div className="relative flex flex-col items-center gap-8">
          {lessons.map((lesson, index) => {
            const isNextLesson =
              !lesson.is_locked &&
              !lesson.completed &&
              index === lessons.findIndex((l) => !l.is_locked && !l.completed);

            return (
              <div key={lesson.id} className="relative">
                {/* Chapter divider */}
                {index > 0 && index % 5 === 0 && (
                  <div className="mb-4 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      <Award className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                        Chapter {Math.floor(index / 5) + 1}
                      </span>
                    </div>
                  </div>
                )}

                {/* Dotted line to next node */}
                {index < lessons.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[72px] w-0 h-8">
                    <svg width="4" height="32" className="absolute left-1/2 -translate-x-1/2">
                      <line
                        x1="2"
                        y1="0"
                        x2="2"
                        y2="32"
                        stroke="hsl(var(--border))"
                        strokeWidth="3"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}

                <DuoButton
                  lesson={lesson}
                  index={index}
                  isNext={isNextLesson}
                  onClick={() => handleNodeClick(lesson)}
                />
              </div>
            );
          })}

          {/* End trophy */}
          {progressPercentage === 100 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-warning-foreground" />
              </div>
              <h3 className="text-xl font-black text-foreground mt-3">Path Complete! 🎉</h3>
              <p className="text-sm text-muted-foreground mt-1">You've mastered every lesson</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Challenge Modal */}
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
          stars={selectedLesson.stars || 0}
        />
      )}
    </div>
  );
};
