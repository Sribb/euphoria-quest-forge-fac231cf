import { Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PathwayNodeProps {
  title: string;
  orderIndex: number;
  isLocked: boolean;
  isCompleted: boolean;
  stars?: number;
  onClick: () => void;
  isNext?: boolean;
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
  isNext = false,
  duration,
  difficulty,
}: PathwayNodeProps) => {
  const sizeClasses = isNext ? "w-28 h-28" : "w-24 h-24";

  return (
    <div className="relative flex flex-col items-center group">
      {/* Node Button - centered on pathway */}
      <button
        onClick={onClick}
        disabled={isLocked}
        className={cn(
          "relative rounded-full transition-all duration-300 flex items-center justify-center",
          "border-4 shadow-lg",
          sizeClasses,
          isLocked && "opacity-50 cursor-not-allowed border-muted bg-card",
          !isLocked && !isCompleted && !isNext && "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5 hover:scale-110 hover:shadow-glow cursor-pointer",
          isCompleted && "border-primary bg-gradient-to-br from-primary/30 to-primary/10 hover:scale-105 cursor-pointer",
          isNext && "border-primary bg-gradient-to-br from-primary/40 to-primary/20 ring-4 ring-primary/40 shadow-glow cursor-pointer hover:scale-105"
        )}
      >
        {/* Subtle glow for current lesson - no animation */}
        {isNext && (
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
        )}

        {/* Node Content */}
        <div className="relative text-center z-10">
          {isLocked ? (
            <Lock className="w-6 h-6 text-muted-foreground mx-auto" />
          ) : isCompleted ? (
            <div className="space-y-0.5">
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i <= stars ? "text-yellow-500 fill-yellow-500" : "text-muted"
                    )}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-primary">{orderIndex}</div>
            </div>
          ) : (
            <div className="text-xl font-bold text-primary">{orderIndex}</div>
          )}
        </div>
      </button>

      {/* Node Title - below the circle */}
      <div className="mt-3 w-32 text-center">
        <p className={cn(
          "text-xs font-semibold leading-tight transition-colors",
          isLocked ? "text-muted-foreground" : "text-foreground",
          isNext && "text-primary font-bold"
        )}>
          {title}
        </p>
      </div>

      {/* Hover Preview */}
      {!isLocked && (duration || difficulty) && (
        <div className="absolute top-full mt-12 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg">
            <p className="text-xs font-semibold text-foreground mb-1">{title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {duration && <span>⏱️ {duration}</span>}
              {difficulty && <span>📊 {difficulty}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
