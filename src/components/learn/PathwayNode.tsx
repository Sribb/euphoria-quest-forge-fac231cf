import { Lock, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PathwayNodeProps {
  title: string;
  orderIndex: number;
  isLocked: boolean;
  isCompleted: boolean;
  stars?: number; // 1-3 star rating
  onClick: () => void;
  position: "left" | "right" | "center";
  isNext?: boolean; // Is this the next available challenge?
  duration?: string;
  difficulty?: string;
}

export const PathwayNode = ({
  title,
  orderIndex,
  isLocked,
  isCompleted,
  stars = 0,
  onClick,
  position,
  isNext = false,
  duration,
  difficulty,
}: PathwayNodeProps) => {
  const positionClasses = {
    left: "mr-auto",
    right: "ml-auto",
    center: "mx-auto",
  };

  // Next node is larger than others
  const sizeClasses = isNext ? "w-40 h-40 scale-110" : isLocked ? "w-28 h-28" : "w-32 h-32";

  return (
    <div className={cn("relative group transition-all duration-300", sizeClasses, positionClasses[position])}>
      {/* Connector Line to Next Node with animated flow */}
      {!isLocked && (
        <div 
          className={cn(
            "absolute top-full left-1/2 -translate-x-1/2 w-1 h-16 -z-10 transition-all duration-500",
            isCompleted 
              ? "bg-gradient-to-b from-primary to-primary/50 shadow-glow" 
              : "bg-border"
          )}
        >
          {isCompleted && (
            <>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-ping" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            </>
          )}
        </div>
      )}

      {/* Node Button with hover preview */}
      <button
        onClick={onClick}
        disabled={isLocked}
        className={cn(
          "relative w-full h-full rounded-full transition-all duration-300 flex items-center justify-center",
          "border-4 shadow-lg hover-lift",
          isLocked && "opacity-40 cursor-not-allowed border-muted bg-card",
          !isLocked && !isCompleted && "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5 hover:scale-110 hover:shadow-glow cursor-pointer",
          isCompleted && "border-primary bg-gradient-to-br from-primary/30 to-primary/10 hover:scale-105 hover:shadow-glow-soft cursor-pointer",
          isNext && "ring-4 ring-primary/30 animate-pulse shadow-glow"
        )}
      >
        {/* Soft glow around current node */}
        {isNext && (
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
        )}

        {/* Floating Particles for Unlocked Nodes */}
        {!isLocked && !isCompleted && (
          <>
            <Sparkles className="absolute -top-3 -right-3 w-5 h-5 text-primary animate-bounce" />
            <Sparkles className="absolute -bottom-3 -left-3 w-4 h-4 text-primary animate-bounce delay-150" />
            {isNext && (
              <>
                <Sparkles className="absolute -top-3 -left-3 w-4 h-4 text-primary animate-bounce delay-300" />
                <Sparkles className="absolute -bottom-3 -right-3 w-4 h-4 text-primary animate-bounce delay-500" />
              </>
            )}
          </>
        )}

        {/* Node Content */}
        <div className="text-center">
          {isLocked ? (
            <Lock className="w-8 h-8 text-muted-foreground mx-auto" />
          ) : isCompleted ? (
            <div className="space-y-1">
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i <= stars ? "text-yellow-500 fill-yellow-500" : "text-muted"
                    )}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-primary">{orderIndex}</div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-primary">{orderIndex}</div>
          )}
        </div>

        {/* Glow Effect for Unlocked Nodes */}
        {!isLocked && !isCompleted && (
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        )}

        {/* Completion Particles */}
        {isCompleted && (
          <>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-500 rounded-full animate-ping" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-500 rounded-full animate-ping delay-300" />
          </>
        )}
      </button>

      {/* Interactive Hover Preview */}
      {!isLocked && (duration || difficulty) && (
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-glow-soft">
            <p className="text-xs font-semibold text-foreground mb-1">{title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {duration && <span>⏱️ {duration}</span>}
              {difficulty && <span>📊 {difficulty}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Node Title */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-44 text-center">
        <p className={cn(
          "text-xs font-semibold leading-tight transition-colors",
          isLocked ? "text-muted-foreground" : "text-foreground",
          isNext && "text-primary"
        )}>
          {title}
        </p>
      </div>
    </div>
  );
};
