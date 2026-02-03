import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Trophy, TrendingUp, Activity, Target } from "lucide-react";
import type { EducatorStats } from "../hooks/useEducatorData";

interface EducatorKPICardsProps {
  stats: EducatorStats | undefined;
  isLoading: boolean;
}

export const EducatorKPICards = ({ stats, isLoading }: EducatorKPICardsProps) => {
  const kpis = [
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      icon: Users,
      description: "Registered students",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active (7 Days)",
      value: stats?.active_users_7d || 0,
      icon: Activity,
      description: "Recently active",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Avg. Completion",
      value: `${stats?.avg_lesson_completion || 0}%`,
      icon: Target,
      description: "Lesson progress",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Lessons Completed",
      value: stats?.total_lessons_completed || 0,
      icon: BookOpen,
      description: "Total completions",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Avg. Quiz Score",
      value: `${stats?.avg_quiz_score || 0}%`,
      icon: Trophy,
      description: "Assessment average",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Engagement Rate",
      value: stats?.total_users
        ? `${Math.round((stats.active_users_7d / stats.total_users) * 100)}%`
        : "0%",
      icon: TrendingUp,
      description: "Weekly engagement",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className={`absolute top-3 right-3 p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <p className="text-xl md:text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                  {kpi.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
