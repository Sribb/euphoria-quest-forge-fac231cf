import { useState } from "react";
import { TrendingUp, Building2, Wallet, BarChart3, Globe, Landmark, Briefcase, Megaphone, Search, BookOpen, Dumbbell, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CourseInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

const COURSES: CourseInfo[] = [
  { id: "investing", title: "Investing Fundamentals", description: "Master stocks, bonds, and portfolio construction from the ground up.", icon: TrendingUp, gradient: "from-emerald-500/15 to-teal-500/5", iconBg: "bg-emerald-500" },
  { id: "corporate-finance", title: "Corporate Finance", description: "Read financial statements, evaluate companies, and understand corporate strategy.", icon: Building2, gradient: "from-blue-500/15 to-indigo-500/5", iconBg: "bg-blue-500" },
  { id: "personal-finance", title: "Personal Finance", description: "Build wealth with budgeting, retirement planning, and passive income.", icon: Wallet, gradient: "from-violet-500/15 to-purple-500/5", iconBg: "bg-violet-500" },
  { id: "trading", title: "Trading & Technical Analysis", description: "Decode charts, master indicators, and build trading strategies.", icon: BarChart3, gradient: "from-orange-500/15 to-amber-500/5", iconBg: "bg-orange-500" },
  { id: "alternative-assets", title: "Alternative Assets", description: "Explore crypto, REITs, international markets, and ESG investing.", icon: Globe, gradient: "from-rose-500/15 to-pink-500/5", iconBg: "bg-rose-500" },
  { id: "economics", title: "Economics", description: "Supply, demand, GDP, fiscal & monetary policy, and global trade.", icon: Landmark, gradient: "from-cyan-500/15 to-sky-500/5", iconBg: "bg-cyan-600" },
  { id: "business", title: "Business & Entrepreneurship", description: "From idea to pitch — planning, execution, and virtual business capstone.", icon: Briefcase, gradient: "from-amber-500/15 to-yellow-500/5", iconBg: "bg-amber-600" },
  { id: "marketing", title: "Marketing Fundamentals", description: "Consumer behavior, branding, digital marketing, and campaign creation.", icon: Megaphone, gradient: "from-fuchsia-500/15 to-pink-500/5", iconBg: "bg-fuchsia-600" },
];

interface LessonWithPathway {
  id: string;
  completed: boolean;
  pathway?: string | null;
}

interface CoursesGridProps {
  lessons: LessonWithPathway[];
  activePathway: string | null;
  onSelectCourse: (pathwayId: string) => void;
}

export const CoursesGrid = ({ lessons, activePathway, onSelectCourse }: CoursesGridProps) => {
  const [search, setSearch] = useState("");

  const getStats = (id: string) => {
    const pathLessons = lessons.filter((l) => (l as any).pathway === id);
    const completed = pathLessons.filter((l) => l.completed).length;
    return { total: pathLessons.length, completed };
  };

  const filtered = COURSES.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Courses</h1>
        <p className="text-sm text-muted-foreground">Choose a course to start or continue learning</p>

        <div className="relative mt-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card/60 border-border/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((course, i) => {
          const stats = getStats(course.id);
          const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          const isActive = activePathway === course.id;
          const Icon = course.icon;

          return (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelectCourse(course.id)}
              className={cn(
                "relative text-left p-5 rounded-2xl border transition-all duration-200 group",
                "bg-gradient-to-br",
                course.gradient,
                isActive
                  ? "border-primary/60 shadow-lg shadow-primary/10"
                  : "border-border/50 hover:border-primary/30 hover:shadow-md"
              )}
            >
              {isActive && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold text-primary">Currently Learning</span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", course.iconBg)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>

                  {/* Progress */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-700", course.iconBg)} style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{stats.completed}/{stats.total}</span>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="w-3 h-3" />
                      <span className="text-[10px]">{stats.total} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Dumbbell className="w-3 h-3" />
                      <span className="text-[10px]">{stats.total * 15} Exercises</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
