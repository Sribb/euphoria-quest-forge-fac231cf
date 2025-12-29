import { Lock, Star, Sparkles, Crown, Zap, Target, BookOpen, Sword, Shield, Gem, FastForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface PathwayNodeProps {
  title: string;
  orderIndex: number;
  isLocked: boolean;
  isCompleted: boolean;
  isSkippedByPlacement?: boolean;
  stars?: number;
  onClick: () => void;
  isNext?: boolean;
  duration?: string;
  difficulty?: string;
  isMilestone?: boolean;
}

const getDifficultyIcon = (difficulty?: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return BookOpen;
    case 'intermediate': return Sword;
    case 'advanced': return Shield;
    default: return Target;
  }
};

export const PathwayNode = ({
  title,
  orderIndex,
  isLocked,
  isCompleted,
  isSkippedByPlacement = false,
  stars = 0,
  onClick,
  isNext = false,
  duration,
  difficulty,
  isMilestone = false,
}: PathwayNodeProps) => {
  const DifficultyIcon = getDifficultyIcon(difficulty);
  
  // Milestone nodes are larger
  const sizeClasses = isMilestone 
    ? "w-28 h-28" 
    : isNext 
      ? "w-24 h-24" 
      : "w-20 h-20";

  return (
    <div className="relative flex flex-col items-center group">
      {/* Outer glow ring for next lesson */}
      {isNext && (
        <div className="absolute inset-0 -m-4 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/30 via-yellow-500/30 to-primary/30 animate-pulse blur-xl" />
        </div>
      )}

      {/* Floating particles for next lesson */}
      {isNext && (
        <>
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-80" style={{ animationDelay: '0ms' }} />
          <div className="absolute -top-1 right-0 w-1.5 h-1.5 bg-primary rounded-full animate-bounce opacity-80" style={{ animationDelay: '200ms' }} />
          <div className="absolute top-1/2 -right-3 w-2 h-2 bg-yellow-400 rounded-full animate-bounce opacity-80" style={{ animationDelay: '400ms' }} />
        </>
      )}

      {/* Milestone crown decoration */}
      {isMilestone && isCompleted && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <Crown className="w-6 h-6 text-yellow-500 drop-shadow-lg animate-pulse" />
        </div>
      )}

      {/* Node Button */}
      <button
        onClick={onClick}
        disabled={isLocked}
        className={cn(
          "relative rounded-2xl transition-all duration-500 flex items-center justify-center transform-gpu",
          "shadow-xl",
          sizeClasses,
          // Locked state - stone/greyed out
          isLocked && "bg-gradient-to-br from-muted/80 to-muted/40 border-2 border-muted-foreground/20 cursor-not-allowed opacity-60",
          // Available but not started
          !isLocked && !isCompleted && !isNext && [
            "bg-gradient-to-br from-card via-card to-muted/30",
            "border-2 border-primary/40",
            "hover:scale-110 hover:border-primary hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]",
            "cursor-pointer"
          ],
          // Completed state - golden/victorious
          isCompleted && [
            "bg-gradient-to-br from-yellow-500/20 via-primary/20 to-yellow-500/10",
            "border-2 border-yellow-500/60",
            "hover:scale-105",
            "cursor-pointer",
            "shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
          ],
          // Next/Current lesson - glowing beacon
          isNext && [
            "bg-gradient-to-br from-primary/30 via-yellow-500/20 to-primary/20",
            "border-3 border-primary",
            "ring-4 ring-primary/30 ring-offset-2 ring-offset-background",
            "shadow-[0_0_40px_hsl(var(--primary)/0.5)]",
            "cursor-pointer hover:scale-105"
          ],
          // Milestone styling
          isMilestone && "rounded-xl"
        )}
      >
        {/* Inner glow effect */}
        {(isNext || isCompleted) && (
          <div className={cn(
            "absolute inset-1 rounded-xl",
            isNext && "bg-gradient-to-br from-primary/20 to-transparent",
            isCompleted && "bg-gradient-to-br from-yellow-500/10 to-transparent"
          )} />
        )}

        {/* Node Content */}
        <div className="relative text-center z-10">
          {isLocked ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-lg bg-muted-foreground/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">Locked</span>
            </div>
          ) : isCompleted ? (
            <div className="space-y-1">
              {isSkippedByPlacement ? (
                <>
                  {/* Skipped indicator */}
                  <div className="flex justify-center mb-1">
                    <FastForward className="w-5 h-5 text-blue-400" />
                  </div>
                  {/* Level number */}
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-bold text-blue-400">{orderIndex}</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Stars display */}
                  <div className="flex justify-center gap-0.5 mb-1">
                    {[1, 2, 3].map((i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4 drop-shadow-md transition-all",
                          i <= stars 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  {/* Level number with gem */}
                  <div className="flex items-center justify-center gap-1">
                    <Gem className="w-3 h-3 text-primary" />
                    <span className="text-sm font-bold text-primary">{orderIndex}</span>
                  </div>
                </>
              )}
            </div>
          ) : isNext ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-lg font-bold text-primary">{orderIndex}</span>
              </div>
              <span className="text-[10px] text-primary font-semibold uppercase tracking-wide">Start</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold text-foreground/80">{orderIndex}</span>
              <DifficultyIcon className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </button>

      {/* Title Banner - styled like a scroll/banner */}
      <div className={cn(
        "mt-3 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-all duration-300",
        "max-w-[140px]",
        isLocked && "bg-muted/30",
        !isLocked && !isCompleted && "bg-card/60 border border-border/50 group-hover:bg-card group-hover:border-primary/30",
        isCompleted && !isSkippedByPlacement && "bg-yellow-500/10 border border-yellow-500/20",
        isCompleted && isSkippedByPlacement && "bg-blue-500/10 border border-blue-500/20",
        isNext && "bg-primary/10 border border-primary/30"
      )}>
        <p className={cn(
          "text-xs font-semibold leading-tight text-center",
          isLocked && "text-muted-foreground",
          !isLocked && !isCompleted && !isNext && "text-foreground/80",
          isCompleted && !isSkippedByPlacement && "text-yellow-600 dark:text-yellow-400",
          isCompleted && isSkippedByPlacement && "text-blue-500 dark:text-blue-400",
          isNext && "text-primary font-bold"
        )}>
          {isSkippedByPlacement ? "Skipped by Quiz" : title}
        </p>
      </div>

      {/* Hover Preview Card */}
      {!isLocked && (
        <div className="absolute top-full mt-16 left-1/2 -translate-x-1/2 w-56 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30 scale-95 group-hover:scale-100">
          <div className="bg-card/98 backdrop-blur-lg border border-primary/20 rounded-xl p-4 shadow-2xl shadow-primary/10">
            {/* Header */}
            <div className="flex items-start gap-2 mb-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                isCompleted ? "bg-yellow-500/20" : "bg-primary/20"
              )}>
                {isCompleted ? (
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                ) : (
                  <Target className="w-4 h-4 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Chapter {orderIndex}</p>
              </div>
            </div>
            
            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs">
              {duration && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="w-4 h-4 rounded bg-muted flex items-center justify-center">⏱️</div>
                  <span>{duration}</span>
                </div>
              )}
              {difficulty && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <div className="w-4 h-4 rounded bg-muted flex items-center justify-center">
                    <DifficultyIcon className="w-2.5 h-2.5" />
                  </div>
                  <span>{difficulty}</span>
                </div>
              )}
            </div>

            {/* Action hint */}
            <div className={cn(
              "mt-3 pt-3 border-t border-border/50 text-center",
            )}>
              <span className={cn(
                "text-xs font-semibold",
                isCompleted && !isSkippedByPlacement && "text-yellow-500",
                isCompleted && isSkippedByPlacement && "text-blue-500",
                !isCompleted && "text-primary"
              )}>
                {isSkippedByPlacement ? "⏭️ Skipped — Take Lesson" : isCompleted ? "✓ Completed — Replay" : "Click to begin →"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
