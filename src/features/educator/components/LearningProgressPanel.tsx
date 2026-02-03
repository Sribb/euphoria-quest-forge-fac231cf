import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Clock, Award, Target, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export const LearningProgressPanel = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");

  const { data: lessonData, isLoading } = useQuery({
    queryKey: ["educator-lesson-progress", timeRange],
    queryFn: async () => {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, difficulty, duration_minutes")
        .order("order_index");

      const { data: progress } = await supabase
        .from("user_lesson_progress")
        .select("lesson_id, progress, completed, quiz_score, created_at, updated_at");

      // Calculate completion rates per lesson
      const lessonStats = lessons?.map((lesson) => {
        const lessonProgress = progress?.filter((p) => p.lesson_id === lesson.id) || [];
        const totalAttempts = lessonProgress.length;
        const completions = lessonProgress.filter((p) => p.completed).length;
        const avgProgress = totalAttempts
          ? lessonProgress.reduce((acc, p) => acc + p.progress, 0) / totalAttempts
          : 0;
        const quizScores = lessonProgress.filter((p) => p.quiz_score).map((p) => p.quiz_score!);
        const avgQuizScore = quizScores.length
          ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
          : 0;

        return {
          id: lesson.id,
          title: lesson.title.length > 20 ? lesson.title.substring(0, 20) + "..." : lesson.title,
          fullTitle: lesson.title,
          difficulty: lesson.difficulty,
          duration: lesson.duration_minutes,
          attempts: totalAttempts,
          completions,
          completionRate: totalAttempts ? Math.round((completions / totalAttempts) * 100) : 0,
          avgProgress: Math.round(avgProgress),
          avgQuizScore: Math.round(avgQuizScore),
        };
      });

      // Calculate difficulty distribution
      const difficultyDist = [
        { name: "Beginner", value: lessons?.filter((l) => l.difficulty === "beginner").length || 0, color: "#22c55e" },
        { name: "Intermediate", value: lessons?.filter((l) => l.difficulty === "intermediate").length || 0, color: "#eab308" },
        { name: "Advanced", value: lessons?.filter((l) => l.difficulty === "advanced").length || 0, color: "#ef4444" },
      ];

      // Time spent trends (mock data - would need actual session tracking)
      const timeSpentTrend = Array.from({ length: 7 }, (_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        minutes: Math.floor(Math.random() * 60) + 30,
      }));

      return {
        lessonStats: lessonStats || [],
        difficultyDist,
        timeSpentTrend,
        totalLessons: lessons?.length || 0,
        totalAttempts: progress?.length || 0,
        totalCompletions: progress?.filter((p) => p.completed).length || 0,
      };
    },
  });

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Progress Analytics
            </CardTitle>
            <CardDescription>
              Track module completion, scores, and learning trends
            </CardDescription>
          </div>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span className="text-xs">Total Lessons</span>
            </div>
            <p className="text-2xl font-bold">{lessonData?.totalLessons || 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Total Attempts</span>
            </div>
            <p className="text-2xl font-bold">{lessonData?.totalAttempts || 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="h-4 w-4" />
              <span className="text-xs">Completions</span>
            </div>
            <p className="text-2xl font-bold">{lessonData?.totalCompletions || 0}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Completion Rate</span>
            </div>
            <p className="text-2xl font-bold">
              {lessonData?.totalAttempts
                ? Math.round((lessonData.totalCompletions / lessonData.totalAttempts) * 100)
                : 0}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lesson Completion Chart */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Completion Rate by Lesson</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lessonData?.lessonStats.slice(0, 10)} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="title" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Completion"]}
                    labelFormatter={(label) => lessonData?.lessonStats.find((l) => l.title === label)?.fullTitle}
                  />
                  <Bar dataKey="completionRate" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quiz Scores Chart */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Average Quiz Scores</h4>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lessonData?.lessonStats.slice(0, 10)} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="title" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => [`${value}%`, "Avg Score"]} />
                  <Bar
                    dataKey="avgQuizScore"
                    fill="hsl(var(--chart-2))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Content Difficulty Distribution</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lessonData?.difficultyDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {lessonData?.difficultyDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Spent Trend */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Weekly Learning Time (Minutes)</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lessonData?.timeSpentTrend}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} min`, "Time Spent"]} />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Lesson Details Table */}
        <div className="mt-6">
          <h4 className="font-medium mb-3 text-sm">Module Performance Details</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {lessonData?.lessonStats.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{lesson.fullTitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        lesson.difficulty === "beginner"
                          ? "secondary"
                          : lesson.difficulty === "intermediate"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {lesson.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">Attempts</p>
                    <p className="font-medium">{lesson.attempts}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completion</p>
                    <p className="font-medium text-primary">{lesson.completionRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                    <p className={`font-medium ${lesson.avgQuizScore >= 70 ? "text-green-500" : "text-yellow-500"}`}>
                      {lesson.avgQuizScore}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
