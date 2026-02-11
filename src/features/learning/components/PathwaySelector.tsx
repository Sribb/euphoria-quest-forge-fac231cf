import { TrendingUp, Building2, Wallet, BarChart3, Globe, BookOpen, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PathwayInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

const PATHWAYS: PathwayInfo[] = [
  {
    id: "investing",
    title: "Investing Fundamentals",
    description: "Master the core principles of investing, from stocks and bonds to portfolio construction.",
    icon: TrendingUp,
    gradient: "from-emerald-500/10 to-teal-500/5",
    iconBg: "bg-emerald-500",
  },
  {
    id: "corporate_finance",
    title: "Corporate Finance",
    description: "Learn to read financial statements, evaluate companies, and understand corporate strategy.",
    icon: Building2,
    gradient: "from-blue-500/10 to-indigo-500/5",
    iconBg: "bg-blue-500",
  },
  {
    id: "personal_finance",
    title: "Personal Finance",
    description: "Build wealth with retirement planning, tax strategies, and passive income streams.",
    icon: Wallet,
    gradient: "from-violet-500/10 to-purple-500/5",
    iconBg: "bg-violet-500",
  },
  {
    id: "trading",
    title: "Trading & Technical Analysis",
    description: "Decode charts, master indicators, and develop systematic trading strategies.",
    icon: BarChart3,
    gradient: "from-orange-500/10 to-amber-500/5",
    iconBg: "bg-orange-500",
  },
  {
    id: "alternatives",
    title: "Alternative Assets",
    description: "Explore crypto, REITs, international markets, ESG investing, and beyond.",
    icon: Globe,
    gradient: "from-rose-500/10 to-pink-500/5",
    iconBg: "bg-rose-500",
  },
];

interface LessonWithPathway {
  id: string;
  completed: boolean;
  pathway?: string | null;
}

interface PathwaySelectorProps {
  lessons: LessonWithPathway[];
  onSelectPathway: (pathwayId: string) => void;
}

export const PathwaySelector = ({ lessons, onSelectPathway }: PathwaySelectorProps) => {
  const getPathwayStats = (pathwayId: string) => {
    const pathwayLessons = lessons.filter(l => (l as any).pathway === pathwayId);
    const completed = pathwayLessons.filter(l => l.completed).length;
    return { total: pathwayLessons.length, completed };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Learning Pathways</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-[52px]">
          Choose a track to begin your journey
        </p>
      </div>

      {/* Pathway Cards */}
      <div className="px-6 pb-12 max-w-4xl mx-auto grid gap-4">
        {PATHWAYS.map((pathway, index) => {
          const stats = getPathwayStats(pathway.id);
          const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

          return (
            <motion.button
              key={pathway.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              onClick={() => onSelectPathway(pathway.id)}
              className={cn(
                "w-full text-left p-5 rounded-2xl border border-border/60",
                "bg-gradient-to-br",
                pathway.gradient,
                "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
                "transition-all duration-300 group"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  pathway.iconBg
                )}>
                  <pathway.icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                      {pathway.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {pathway.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", pathway.iconBg)}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {stats.completed}/{stats.total}
                    </span>
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
