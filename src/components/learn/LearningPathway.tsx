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
      {/* Header Progress Banner */}
      <div className="mb-12 p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl border border-primary/20 shadow-glow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1">
                Your Learning Journey
              </h2>
              <p className="text-muted-foreground">
                Follow the pathway to financial mastery
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-primary mb-1">
              {completedCount}/{totalCount}
            </div>
            <p className="text-sm text-muted-foreground">Challenges Completed</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative w-full bg-muted/50 rounded-full h-4 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-primary shadow-glow transition-all duration-700 ease-out flex items-center justify-end pr-2"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && (
              <span className="text-xs font-bold text-white">
                {progressPercentage}%
              </span>
            )}
          </div>
        </div>

        {progressPercentage === 100 && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl animate-fade-in flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-500" />
            <p className="text-sm text-foreground font-semibold">
              🎉 Incredible! You've completed the entire pathway! You're now a Master Investor!
            </p>
          </div>
        )}
      </div>

      {/* Scrollable Pathway Container */}
      <ScrollArea className="h-[800px] w-full">
        <div className="relative min-h-full pb-32">
          {/* Pathway Background Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-border via-border/50 to-transparent" />

          {/* Pathway Nodes */}
          <div className="relative space-y-20 px-8">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PathwayNode
                  title={lesson.title}
                  orderIndex={lesson.order_index}
                  isLocked={lesson.is_locked}
                  isCompleted={lesson.completed}
                  stars={lesson.completed ? (lesson.stars || 3) : 0}
                  onClick={() => handleNodeClick(lesson)}
                  position={getNodePosition(index)}
                />
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
