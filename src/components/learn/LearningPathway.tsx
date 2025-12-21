import { useState } from "react";
import { PathwayNode } from "./PathwayNode";
import { ChallengeModal } from "./ChallengeModal";
import { Trophy, Award, SkipForward, ChevronDown, ChevronUp, Map, Sparkles, Flag, Mountain, Castle, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const actualCompletedLessons = lessons.filter(l => l.completed && !l.skipped).length;
  const actualTotalLessons = lessons.filter(l => !l.skipped).length;
  const progressPercentage = actualTotalLessons > 0 ? Math.round((actualCompletedLessons / actualTotalLessons) * 100) : 0;

  // Get chapter info based on lesson index
  const getChapterInfo = (index: number) => {
    const chapters = [
      { name: "The Beginning", icon: Flag, color: "from-emerald-500 to-teal-600" },
      { name: "Rising Challenges", icon: Mountain, color: "from-blue-500 to-indigo-600" },
      { name: "The Fortress", icon: Castle, color: "from-purple-500 to-pink-600" },
      { name: "Final Quest", icon: Trophy, color: "from-yellow-500 to-orange-600" },
    ];
    return chapters[Math.floor(index / 5) % chapters.length];
  };

  return (
    <div className="relative min-h-screen">
      {/* Epic Background with gradient and pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
        
        {/* Decorative grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Epic Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Title Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-yellow-500 to-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Map className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-background">
                  <Sparkles className="w-3 h-3 text-yellow-900" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                  The Investor's Saga
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Scroll className="w-4 h-4" />
                  Your journey to financial mastery
                </p>
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-500">
                  {actualCompletedLessons}/{actualTotalLessons}
                </div>
                <p className="text-xs text-muted-foreground font-medium">Chapters Complete</p>
              </div>
            </div>
          </div>
          
          {/* Epic Progress Bar */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-yellow-500/20 to-primary/20 rounded-full blur-md" />
            <div className="relative h-4 bg-muted/50 rounded-full overflow-hidden border border-border/50">
              {/* Progress segments */}
              <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-background/20 last:border-0" />
                ))}
              </div>
              {/* Fill */}
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-yellow-500 to-primary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
              {/* Percentage badge */}
              {progressPercentage > 5 && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                  style={{ left: `calc(${progressPercentage}% - 20px)` }}
                >
                  <span className="text-xs font-black text-white drop-shadow-lg">
                    {progressPercentage}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Completion celebration */}
          {progressPercentage === 100 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-yellow-500/20 border border-yellow-500/30 rounded-xl animate-fade-in flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-900" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Saga Complete!</p>
                <p className="text-xs text-muted-foreground">You are now a Master Investor</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skipped Lessons Banner */}
      {skippedLessons.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 mt-6">
          <div className="p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <SkipForward className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {skippedLessons.length} Prologue Chapters Skipped
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your wisdom earned you a head start at Chapter {startingLesson}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSkippedLessons(!showSkippedLessons)}
                className="gap-2 rounded-xl border-primary/30 hover:bg-primary/10"
              >
                {showSkippedLessons ? (
                  <>Hide <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Explore <ChevronDown className="w-4 h-4" /></>
                )}
              </Button>
            </div>

            {showSkippedLessons && (
              <div className="mt-4 pt-4 border-t border-primary/20 animate-fade-in">
                <p className="text-xs text-muted-foreground mb-3">
                  Revisit these foundational chapters anytime:
                </p>
                <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
                  {skippedLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleNodeClick(lesson)}
                      className="flex items-center justify-between p-3 bg-background/50 hover:bg-background rounded-xl border border-border/50 transition-all hover:border-primary/30 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          {lesson.order_index}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration} · {lesson.difficulty}</p>
                        </div>
                      </div>
                      <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Begin →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* The Saga Path */}
      <div className="relative max-w-3xl mx-auto px-8 py-12 pb-40">
        {/* Central pathway decoration */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />
        </div>

        {activeLessons.map((lesson, index) => {
          const isNextLesson = !lesson.is_locked && !lesson.completed && 
            index === activeLessons.findIndex(l => !l.is_locked && !l.completed);
          const side = index % 2 === 0 ? "left" : "right";
          const isLastNode = index === activeLessons.length - 1;
          const isMilestone = (index + 1) % 5 === 0;
          const chapterInfo = getChapterInfo(index);

          return (
            <div key={lesson.id} className="relative">
              {/* Chapter Divider */}
              {index > 0 && index % 5 === 0 && (
                <div className="relative py-8 mb-6">
                  {/* Decorative line */}
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  
                  {/* Chapter badge */}
                  <div className="relative flex justify-center">
                    <div className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-2xl",
                      "bg-gradient-to-r shadow-lg",
                      chapterInfo.color,
                      "border border-white/20"
                    )}>
                      <chapterInfo.icon className="w-5 h-5 text-white" />
                      <div className="text-center">
                        <p className="text-xs font-medium text-white/80 uppercase tracking-wider">Chapter {Math.floor(index / 5) + 1}</p>
                        <p className="text-sm font-bold text-white">{chapterInfo.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Node Row */}
              <div 
                className={cn(
                  "relative flex items-center",
                  side === "left" ? "justify-start" : "justify-end"
                )}
                style={{ 
                  marginBottom: isLastNode ? 0 : "60px",
                  paddingLeft: side === "left" ? "0" : "0",
                  paddingRight: side === "right" ? "0" : "0"
                }}
              >
                {/* Connection line to center */}
                <div 
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-0.5",
                    "bg-gradient-to-r",
                    side === "left" 
                      ? "left-[120px] right-1/2 from-primary/40 to-transparent" 
                      : "right-[120px] left-1/2 from-transparent to-primary/40",
                    lesson.completed && "from-yellow-500/60 to-primary/40"
                  )}
                />

                {/* The Node */}
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
                  isMilestone={isMilestone}
                />
              </div>

              {/* Curved connector to next node */}
              {!isLastNode && (
                <svg
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{ 
                    top: "calc(100% - 30px)",
                    height: "90px"
                  }}
                  viewBox="0 0 600 90"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id={`pathGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={lesson.completed ? "hsl(var(--primary))" : "hsl(var(--border))"} stopOpacity={lesson.completed ? 0.8 : 0.4} />
                      <stop offset="50%" stopColor={lesson.completed ? "hsl(45, 100%, 50%)" : "hsl(var(--border))"} stopOpacity={lesson.completed ? 0.6 : 0.3} />
                      <stop offset="100%" stopColor={lesson.completed ? "hsl(var(--primary))" : "hsl(var(--border))"} stopOpacity={lesson.completed ? 0.8 : 0.4} />
                    </linearGradient>
                  </defs>
                  {side === "left" ? (
                    <path
                      d="M 120 0 Q 120 45, 300 45 Q 480 45, 480 90"
                      fill="none"
                      stroke={`url(#pathGradient-${index})`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={lesson.completed ? "0" : "8 8"}
                    />
                  ) : (
                    <path
                      d="M 480 0 Q 480 45, 300 45 Q 120 45, 120 90"
                      fill="none"
                      stroke={`url(#pathGradient-${index})`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={lesson.completed ? "0" : "8 8"}
                    />
                  )}
                </svg>
              )}
            </div>
          );
        })}

        {/* Epic End Trophy */}
        {progressPercentage === 100 && (
          <div className="pt-16 flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 -m-8 bg-gradient-to-r from-yellow-500/30 via-yellow-400/40 to-yellow-500/30 rounded-full blur-2xl animate-pulse" />
              
              <div className="relative text-center p-8 bg-gradient-to-br from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 rounded-3xl border-2 border-yellow-500/40 shadow-2xl shadow-yellow-500/20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/50">
                  <Trophy className="w-10 h-10 text-yellow-900" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">
                  Saga Complete!
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  You've conquered every challenge and emerged as a true Master Investor.
                </p>
                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
