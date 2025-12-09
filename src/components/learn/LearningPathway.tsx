import { useState } from "react";
import { PathwayNode } from "./PathwayNode";
import { ChallengeModal } from "./ChallengeModal";
import { Trophy, Award } from "lucide-react";

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
}

interface LearningPathwayProps {
  lessons: Lesson[];
  onLessonSelect: (lessonId: string) => void;
  completedCount: number;
  totalCount: number;
}

export const LearningPathway = ({
  lessons,
  onLessonSelect,
  completedCount,
  totalCount,
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

  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
                {completedCount}/{totalCount}
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

      {/* Vertical Scrolling Pathway */}
      <div className="w-full max-w-md mx-auto px-8 pb-32">
        <div className="relative">
          {/* Central Pathway Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-primary/30 via-border to-transparent" />

          {/* Pathway Nodes - all centered on the line */}
          <div className="relative flex flex-col items-center">
            {lessons.map((lesson, index) => {
              const isNextLesson = !lesson.is_locked && !lesson.completed && 
                index === lessons.findIndex(l => !l.is_locked && !l.completed);

              return (
                <div key={lesson.id} className="relative">
                  {/* Connector segment - above each node except the first */}
                  {index > 0 && (
                    <div className="w-1 h-12 mx-auto bg-gradient-to-b from-transparent via-border to-transparent" />
                  )}

                  {/* Section Milestone */}
                  {index > 0 && index % 4 === 0 && (
                    <div className="flex items-center justify-center py-4 w-64">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
                      <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                        <span className="text-xs font-semibold text-primary">
                          Section {Math.floor(index / 4)}
                        </span>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                    </div>
                  )}

                  {/* The Node */}
                  <div className="py-4">
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
                </div>
              );
            })}

            {/* End of Pathway Marker */}
            {progressPercentage === 100 && (
              <div className="pt-8">
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
