import { BookOpen, Dumbbell } from "lucide-react";
import { EuphoriaIcon } from "@/components/icons/EuphoriaIcon";

interface CourseInfoCardProps {
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  illustration?: React.ReactNode;
}

const COURSE_ILLUSTRATIONS: Record<string, { icon: string; gradient: string }> = {
  "Investing Fundamentals": { icon: "stocks", gradient: "from-emerald-500/20 to-teal-500/10" },
  "Corporate Finance": { icon: "corp", gradient: "from-blue-500/20 to-indigo-500/10" },
  "Personal Finance": { icon: "finance", gradient: "from-violet-500/20 to-purple-500/10" },
  "Trading & Technical Analysis": { icon: "data", gradient: "from-orange-500/20 to-amber-500/10" },
  "Alternative Assets": { icon: "global", gradient: "from-rose-500/20 to-pink-500/10" },
  "Economics": { icon: "govt", gradient: "from-cyan-500/20 to-sky-500/10" },
  "Business & Entrepreneurship": { icon: "business", gradient: "from-amber-500/20 to-yellow-500/10" },
  "Marketing Fundamentals": { icon: "marketing", gradient: "from-fuchsia-500/20 to-pink-500/10" },
};

export const CourseInfoCard = ({
  title,
  description,
  totalLessons,
  completedLessons,
}: CourseInfoCardProps) => {
  const illus = COURSE_ILLUSTRATIONS[title] || { icon: "fallback", gradient: "from-primary/20 to-primary/5" };
  const exercises = totalLessons * 15; // ~15 exercises per lesson

  return (
    <div className="sticky top-4 w-full">
      <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden">
        {/* Illustration area */}
        <div className={`h-40 bg-gradient-to-br ${illus.gradient} flex items-center justify-center`}>
          <EuphoriaIcon name={illus.icon} size={80} />
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <h2 className="text-lg font-semibold text-foreground leading-tight">{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

          {/* Progress */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>{completedLessons} of {totalLessons} complete</span>
              <span className="font-bold text-primary">
                {totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-3 border-t border-border/40">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium">{totalLessons} Lessons</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Dumbbell className="w-4 h-4" />
              <span className="text-xs font-medium">{exercises} Exercises</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
