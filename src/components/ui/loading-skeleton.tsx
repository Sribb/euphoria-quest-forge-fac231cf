import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text";
}

export const LoadingSkeleton = ({ className, variant = "default" }: LoadingSkeletonProps) => {
  const variants = {
    default: "h-12 w-full rounded-lg",
    card: "h-32 w-full rounded-xl",
    text: "h-4 w-3/4 rounded",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variants[variant],
        className
      )}
    />
  );
};

export const LoadingCard = () => (
  <div className="p-6 bg-card rounded-xl border border-border space-y-4 animate-fade-in">
    <LoadingSkeleton variant="text" className="w-1/2" />
    <LoadingSkeleton variant="default" />
    <LoadingSkeleton variant="text" className="w-2/3" />
  </div>
);

export const LoadingGrid = ({ count = 3 }: { count?: number }) => (
  <div className="grid gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);
