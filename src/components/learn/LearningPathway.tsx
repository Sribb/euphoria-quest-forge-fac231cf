import { useState } from "react";
import { PathwayNode } from "./PathwayNode";
import { ChallengeModal } from "./ChallengeModal";
import { Trophy, Award, SkipForward, ChevronDown, ChevronUp } from "lucide-react";
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
  stars?: number;
  skipped?: boolean;
}

interface LearningPathwayProps {
  lessons: Lesson[];
  onLessonSelect: (lessonId: string) => void;
  completedCount: number;
  totalCount: number;
  startingLesson?: number;
}

export const LearningPathway = ({
  lessons,
  onLessonSelect,
  completedCount,
  totalCount,
  startingLesson = 1,
}: LearningPathwayProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showSkippedLessons, setShowSkippedLessons] = useState(false);

  // Separate skipped and active lessons
  const skippedLessons = lessons.filter(l => l.skipped);
  const activeLessons = lessons.filter(l => !l.skipped);

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

  // Calculate progress based on non-skipped lessons only
  const actualCompletedLessons = lessons.filter(l => l.completed && !l.skipped).length;
  const actualTotalLessons = lessons.filter(l => !l.skipped).length;
  const progressPercentage = actualTotalLessons > 0 ? Math.round((actualCompletedLessons / actualTotalLessons) * 100) : 0;

  // Snake pattern: left, right, left, right...
  const getNodeSide = (index: number): "left" | "right" => {
    return index % 2 === 0 ? "left" : "right";
  };

  return (
    <div className="relative">
      {/* Sticky Header Progress Banner */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border mb-4">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Your Learning Journey
                </h2>
                <p className="text-xs text-muted-foreground">
                  Follow the pathway to financial mastery
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary transition-all duration-500">
                {actualCompletedLessons}/{actualTotalLessons}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-primary shadow-glow transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage > 10 && (
                <span className="text-xs font-bold text-white animate-fade-in">
                  {progressPercentage}%
                </span>
              )}
            </div>
          </div>

          {progressPercentage === 100 && (
            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg animate-fade-in flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <p className="text-xs text-foreground font-semibold">
                🎉 Pathway complete! You're now a Master Investor!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Skipped Lessons Banner */}
      {skippedLessons.length > 0 && (
        <div className="max-w-2xl mx-auto px-8 mb-6">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SkipForward className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {skippedLessons.length} lessons skipped
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on your placement test, you can start from Lesson {startingLesson}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSkippedLessons(!showSkippedLessons)}
                className="gap-2"
              >
                {showSkippedLessons ? (
                  <>
                    Hide <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View & Complete <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Expandable Skipped Lessons List */}
            {showSkippedLessons && (
              <div className="mt-4 pt-4 border-t border-primary/20 space-y-2 animate-fade-in">
                <p className="text-xs text-muted-foreground mb-3">
                  You can go back and complete these lessons anytime to reinforce fundamentals:
                </p>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {skippedLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleNodeClick(lesson)}
                      className="flex items-center justify-between p-3 bg-background/50 hover:bg-background rounded-lg border border-border transition-all hover:border-primary/30 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {lesson.order_index}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration} · {lesson.difficulty}</p>
                        </div>
                      </div>
                      <span className="text-xs text-primary font-medium">Start →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Snake Pattern Pathway - Only show non-skipped lessons */}
      <div className="w-full max-w-2xl mx-auto px-12 pb-32">
        <div className="relative">
          {activeLessons.map((lesson, index) => {
            const isNextLesson = !lesson.is_locked && !lesson.completed && 
              index === activeLessons.findIndex(l => !l.is_locked && !l.completed);
            const side = getNodeSide(index);
            const isLastNode = index === activeLessons.length - 1;

            return (
              <div key={lesson.id} className="relative">
                {/* Section Milestone */}
                {index > 0 && index % 4 === 0 && (
                  <div className="flex items-center justify-center py-4 mb-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
                    <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                      <span className="text-xs font-semibold text-primary">
                        Section {Math.floor(index / 4)}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  </div>
                )}

                {/* Node positioned left or right */}
                <div 
                  className={`flex ${side === "left" ? "justify-start pl-4" : "justify-end pr-4"}`}
                  style={{ marginBottom: isLastNode ? 0 : "20px" }}
                >
                  <PathwayNode
                    title={lesson.title}
                    orderIndex={lesson.order_index}
                    isLocked={lesson.is_locked}
                    isCompleted={lesson.completed}
                    stars={lesson.completed ? (lesson.stars || 3) : 0}
                    onClick={() => handleNodeClick(lesson)}
                    isNext={isNextLesson}
                    duration={lesson.duration}
                    difficulty={lesson.difficulty}
                  />
                </div>

                {/* Snake connector line to next node */}
                {!isLastNode && (
                  <svg
                    className="absolute w-full pointer-events-none"
                    style={{ 
                      top: side === "left" ? "85px" : "85px",
                      left: 0,
                      height: "100px"
                    }}
                    viewBox="0 0 500 100"
                    preserveAspectRatio="none"
                  >
                    {side === "left" ? (
                      // Curve from left to right
                      <path
                        d="M 70 0 C 70 50, 430 50, 430 100"
                        fill="none"
                        stroke={lesson.completed ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity={lesson.completed ? 0.8 : 0.5}
                      />
                    ) : (
                      // Curve from right to left
                      <path
                        d="M 430 0 C 430 50, 70 50, 70 100"
                        fill="none"
                        stroke={lesson.completed ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity={lesson.completed ? 0.8 : 0.5}
                      />
                    )}
                  </svg>
                )}
              </div>
            );
          })}

          {/* End of Pathway Marker */}
          {progressPercentage === 100 && (
            <div className="pt-12 flex justify-center">
              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-2xl border-2 border-yellow-500/30 shadow-glow">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-1">
                  Journey Complete!
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  You've mastered all challenges. Keep practicing!
                </p>
              </div>
            </div>
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
