import { useState } from "react";
import { ChallengeModal } from "./ChallengeModal";
import { Trophy, Award, Map, Sparkles, Lock, Star, ArrowLeft } from "lucide-react";
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

const DuoCircle = ({ 
  lesson, 
  index, 
  isNext, 
  onClick 
}: { 
  lesson: Lesson; 
  index: number; 
  isNext: boolean; 
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const stars = lesson.stars || (lesson.completed ? 3 : 0);

  // Zigzag horizontal offset for the "snake" feel
  const xOffset = Math.sin((index / 2) * Math.PI) * 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="flex flex-col items-center"
      style={{ transform: `translateX(${xOffset}px)` }}
    >
      {/* Hover tooltip */}
      {hovered && !lesson.is_locked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-20 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg z-20 min-w-[180px] text-center pointer-events-none"
        >
          <p className="text-sm font-bold text-foreground line-clamp-2">{lesson.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{lesson.duration} · {lesson.difficulty}</p>
        </motion.div>
      )}

      {/* The circle */}
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={lesson.is_locked}
        className={cn(
          "relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 border-4",
          lesson.completed 
            ? "bg-primary border-primary/80 shadow-glow-soft hover:scale-110 cursor-pointer" 
            : lesson.is_locked 
              ? "bg-muted border-border cursor-not-allowed opacity-50" 
              : isNext 
                ? "bg-primary/20 border-primary animate-bounce-subtle hover:bg-primary/30 hover:scale-110 cursor-pointer ring-4 ring-primary/20"
                : "bg-card border-border hover:border-primary/50 hover:scale-110 cursor-pointer",
        )}
      >
        {lesson.completed ? (
          <Star className="w-7 h-7 text-primary-foreground fill-primary-foreground" />
        ) : lesson.is_locked ? (
          <Lock className="w-6 h-6 text-muted-foreground" />
        ) : (
          <span className="text-lg font-black text-foreground">{lesson.order_index}</span>
        )}

        {/* Crown for completed */}
        {lesson.completed && (
          <div className="absolute -top-2 -right-1">
            <Sparkles className="w-4 h-4 text-warning" />
          </div>
        )}
      </button>

      {/* Stars below */}
      <div className="flex gap-0.5 mt-2 h-4">
        {lesson.completed ? (
          [...Array(3)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < stars ? "text-warning fill-warning" : "text-muted-foreground/30"
              )}
            />
          ))
        ) : (
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            {lesson.is_locked ? "" : isNext ? "Start" : ""}
          </span>
        )}
      </div>
    </motion.div>
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

  const completedLessons = lessons.filter(l => l.completed).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  return (
    <div className="relative min-h-screen">
      {/* Soft background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
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
                <p className="text-sm text-muted-foreground">
                  {completedLessons} of {lessons.length} complete
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-lg font-black text-primary">{progressPercentage}%</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Duolingo-style circle path */}
      <div className="max-w-2xl mx-auto px-8 py-12 pb-40">
        <div className="flex flex-col items-center gap-6">
          {lessons.map((lesson, index) => {
            const isNextLesson = !lesson.is_locked && !lesson.completed && 
              index === lessons.findIndex(l => !l.is_locked && !l.completed);

            return (
              <div key={lesson.id} className="relative">
                {/* Chapter divider every 5 lessons */}
                {index > 0 && index % 5 === 0 && (
                  <div className="mb-6 -mt-1 flex justify-center">
                    <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Chapter {Math.floor(index / 5) + 1}
                      </span>
                    </div>
                  </div>
                )}

                <DuoCircle
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-8 text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-warning-foreground" />
              </div>
              <h3 className="text-xl font-black text-foreground mt-4">Path Complete! 🎉</h3>
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
