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
}

export const PathwayNode = ({
  title,
  orderIndex,
  isLocked,
  isCompleted,
  stars = 0,
  onClick,
  position,
}: PathwayNodeProps) => {
  const positionClasses = {
    left: "mr-auto",
    right: "ml-auto",
    center: "mx-auto",
  };

  return (
    <div className={cn("relative w-32 h-32", positionClasses[position])}>
      {/* Connector Line to Next Node */}
      {!isLocked && (
        <div 
          className={cn(
            "absolute top-full left-1/2 -translate-x-1/2 w-1 h-16 -z-10",
            isCompleted ? "bg-gradient-to-b from-primary to-primary/50 shadow-glow animate-pulse" : "bg-border"
          )}
        />
      )}

      {/* Node Button */}
      <button
        onClick={onClick}
        disabled={isLocked}
        className={cn(
          "relative w-full h-full rounded-full transition-all duration-300 flex items-center justify-center",
          "border-4 shadow-lg",
          isLocked && "opacity-40 cursor-not-allowed border-muted bg-card",
          !isLocked && !isCompleted && "border-primary/50 bg-gradient-to-br from-primary/20 to-primary/5 hover:scale-110 hover:shadow-glow animate-pulse cursor-pointer",
          isCompleted && "border-primary bg-gradient-to-br from-primary/30 to-primary/10 hover:scale-110 hover:shadow-glow-soft cursor-pointer"
        )}
      >
        {/* Floating Particles for Unlocked Nodes */}
        {!isLocked && !isCompleted && (
          <>
            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-primary animate-bounce" />
            <Sparkles className="absolute -bottom-2 -left-2 w-3 h-3 text-primary animate-bounce delay-150" />
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
      </button>

      {/* Node Title */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-40 text-center">
        <p className={cn(
          "text-xs font-semibold leading-tight",
          isLocked ? "text-muted-foreground" : "text-foreground"
        )}>
          {title}
        </p>
      </div>
    </div>
  );
};
