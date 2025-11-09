import { useState } from "react";
import { PathwayNode } from "./PathwayNode";
import { ChallengeModal } from "./ChallengeModal";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  // Determine node position for visual variety
  const getNodePosition = (index: number): "left" | "right" | "center" => {
    const pattern = index % 4;
    if (pattern === 0) return "center";
    if (pattern === 1) return "right";
    if (pattern === 2) return "center";
    return "left";
  };

  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="relative">
      {/* Sticky Header Progress Banner */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border mb-8">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Your Learning Journey
                </h2>
                <p className="text-sm text-muted-foreground">
                  Follow the pathway to financial mastery
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary mb-1 transition-all duration-500">
                {completedCount}/{totalCount}
              </div>
              <p className="text-xs text-muted-foreground">Challenges Completed</p>
            </div>
          </div>
          
          {/* Progress Bar with smooth animation */}
          <div className="relative w-full bg-muted/50 rounded-full h-4 overflow-hidden">
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
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl animate-fade-in flex items-center gap-3">
              <Award className="w-5 h-5 text-yellow-500" />
              <p className="text-xs text-foreground font-semibold">
                🎉 Incredible! You've completed the entire pathway! You're now a Master Investor!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Pathway Container */}
      <ScrollArea className="h-[800px] w-full">
        <div className="relative min-h-full pb-32">
          {/* Pathway Background Line with animated particles */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-border via-border/50 to-transparent" />
          <div className="absolute left-1/2 top-0 w-2 h-2 -translate-x-1/2 bg-primary rounded-full animate-pulse shadow-glow" />

          {/* Pathway Nodes with Milestones */}
          <div className="relative space-y-20 px-8">
            {lessons.map((lesson, index) => (
              <div key={lesson.id}>
                {/* Milestone Separator every 3-4 nodes */}
                {index > 0 && index % 4 === 0 && (
                  <div className="flex items-center justify-center mb-20 animate-fade-in">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <div className="px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
                      <span className="text-xs font-semibold text-primary">
                        Section {Math.floor(index / 4)}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/50 via-transparent to-transparent" />
                  </div>
                )}
                
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PathwayNode
                    title={lesson.title}
                    orderIndex={lesson.order_index}
                    isLocked={lesson.is_locked}
                    isCompleted={lesson.completed}
                    stars={lesson.completed ? (lesson.stars || 3) : 0}
                    onClick={() => handleNodeClick(lesson)}
                    position={getNodePosition(index)}
                    isNext={!lesson.is_locked && !lesson.completed && index === lessons.findIndex(l => !l.is_locked && !l.completed)}
                    duration={lesson.duration}
                    difficulty={lesson.difficulty}
                  />
                </div>
              </div>
            ))}

            {/* End of Pathway Marker */}
            {progressPercentage === 100 && (
              <div className="flex justify-center pt-12 animate-fade-in">
                <div className="text-center p-8 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-3xl border-2 border-yellow-500/30 shadow-glow">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Journey Complete!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You've mastered all challenges. Keep practicing to maintain your skills!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

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
