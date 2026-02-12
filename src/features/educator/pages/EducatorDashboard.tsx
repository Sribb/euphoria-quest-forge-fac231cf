import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, GraduationCap, Users, BookOpen, Trophy, 
  TrendingUp, Target, Zap, Clock, AlertTriangle, Award
} from "lucide-react";
import { useEducatorData } from "../hooks/useEducatorData";
import { useClassManagement } from "../hooks/useClassManagement";
import { useEducatorRole } from "../hooks/useEducatorRole";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from "recharts";

interface EducatorDashboardProps {
  onBack: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const COLORS = [
  "hsl(262, 83%, 58%)",
  "hsl(142, 71%, 45%)",
  "hsl(280, 83%, 65%)",
  "hsl(45, 93%, 58%)",
  "hsl(200, 80%, 55%)",
];

export const EducatorDashboard = ({ onBack }: EducatorDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { userRole, isLoading: roleLoading } = useEducatorRole();
  const { users, stats, isLoading } = useEducatorData();
  const { classes } = useClassManagement();

  // Derived analytics data
  const classDistribution = useMemo(() => {
    return classes.map((cls, i) => ({
      name: cls.class_name.length > 15 ? cls.class_name.slice(0, 15) + '…' : cls.class_name,
      students: cls.member_count,
      fill: COLORS[i % COLORS.length],
    }));
  }, [classes]);

  const scoreDistribution = useMemo(() => {
    if (!users?.length) return [];
    const buckets = [
      { range: "0-20%", count: 0 },
      { range: "21-40%", count: 0 },
      { range: "41-60%", count: 0 },
      { range: "61-80%", count: 0 },
      { range: "81-100%", count: 0 },
    ];
    users.forEach(u => {
      const s = u.avg_quiz_score;
      if (s <= 20) buckets[0].count++;
      else if (s <= 40) buckets[1].count++;
      else if (s <= 60) buckets[2].count++;
      else if (s <= 80) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [users]);

  const topPerformers = useMemo(() => {
    return [...(users || [])].sort((a, b) => b.avg_quiz_score - a.avg_quiz_score).slice(0, 5);
  }, [users]);

  const strugglingStudents = useMemo(() => {
    return (users || []).filter(u => u.avg_quiz_score > 0 && u.avg_quiz_score < 50);
  }, [users]);

  const levelDistribution = useMemo(() => {
    if (!users?.length) return [];
    const map: Record<number, number> = {};
    users.forEach(u => { map[u.level] = (map[u.level] || 0) + 1; });
    return Object.entries(map).map(([level, count]) => ({ level: `Lv.${level}`, count })).sort((a, b) => parseInt(a.level.slice(3)) - parseInt(b.level.slice(3)));
  }, [users]);

  if (roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Class Analytics</h1>
            <p className="text-xs text-muted-foreground">
              Performance insights for your {stats?.total_users || 0} students
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto hidden md:flex text-xs">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </Badge>
      </motion.div>

      {/* Stat Strip */}
      <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-3" variants={container} initial="hidden" animate="show">
        {[
          { label: "Students", value: stats?.total_users || 0, icon: Users },
          { label: "Active (7d)", value: stats?.active_users_7d || 0, icon: Clock },
          { label: "Avg Score", value: `${stats?.avg_quiz_score || 0}%`, icon: Target },
          { label: "Completion", value: `${stats?.avg_lesson_completion || 0}%`, icon: TrendingUp },
          { label: "Lessons Done", value: stats?.total_lessons_completed || 0, icon: BookOpen },
        ].map((s, i) => (
          <motion.div key={i} variants={item}>
            <Card className="p-4 border-border/50 bg-card/60 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{s.label}</span>
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="inline-flex h-auto p-1 bg-muted/30 backdrop-blur-sm">
            {[
              { id: "overview", label: "Overview" },
              { id: "students", label: "Students" },
              { id: "performance", label: "Performance" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-4 py-2 text-sm whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
              <h3 className="text-sm font-semibold mb-4">Quiz Score Distribution</h3>
              {scoreDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 20%)" />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(240 5% 65%)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(240 5% 65%)" }} allowDecimals={false} />
                    <RechartsTooltip
                      contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 10% 15%)", borderRadius: "8px", fontSize: 12 }}
                    />
                    <Bar dataKey="count" fill="hsl(262, 83%, 58%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
              )}
            </Card>

            {/* Class Distribution Pie */}
            <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
              <h3 className="text-sm font-semibold mb-4">Students by Class</h3>
              {classDistribution.length > 0 ? (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie
                        data={classDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="students"
                        stroke="none"
                      >
                        {classDistribution.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex-1">
                    {classDistribution.map((cls, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cls.fill }} />
                        <span className="truncate text-xs">{cls.name}</span>
                        <span className="ml-auto font-bold text-xs">{cls.students}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">No classes yet</div>
              )}
            </Card>

            {/* Level Distribution */}
            <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
              <h3 className="text-sm font-semibold mb-4">Student Levels</h3>
              {levelDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={levelDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 20%)" />
                    <XAxis dataKey="level" tick={{ fontSize: 11, fill: "hsl(240 5% 65%)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(240 5% 65%)" }} allowDecimals={false} />
                    <RechartsTooltip
                      contentStyle={{ background: "hsl(240 10% 8%)", border: "1px solid hsl(240 10% 15%)", borderRadius: "8px", fontSize: 12 }}
                    />
                    <defs>
                      <linearGradient id="lvlGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="count" stroke="hsl(142, 71%, 45%)" fill="url(#lvlGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
              )}
            </Card>

            {/* Needs Attention */}
            <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-semibold">Needs Attention</h3>
                <Badge variant="secondary" className="text-[10px] ml-auto">{strugglingStudents.length}</Badge>
              </div>
              {strugglingStudents.length > 0 ? (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {strugglingStudents.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                      <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-warning">{(s.display_name || "S")[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.display_name || "Student"}</p>
                        <p className="text-xs text-muted-foreground">{s.lessons_completed} lessons · {s.avg_quiz_score}% avg</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
                  All students are on track! 🎉
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Students */}
        <TabsContent value="students" className="mt-6">
          <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-sm font-semibold">All Students ({users?.length || 0})</h3>
            </div>
            {!users?.length ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No students have joined your classes yet.
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-4 hover:bg-muted/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">{(u.display_name || "S")[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{u.display_name || "Student"}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Lv.{u.level}</span>
                        <span>{u.experience_points.toLocaleString()} XP</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold">{u.lessons_completed}</p>
                        <p className="text-[10px] text-muted-foreground">lessons</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold">{u.total_game_sessions}</p>
                        <p className="text-[10px] text-muted-foreground">games</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${u.avg_quiz_score >= 80 ? 'text-success' : u.avg_quiz_score < 50 && u.avg_quiz_score > 0 ? 'text-warning' : ''}`}>
                          {u.avg_quiz_score}%
                        </p>
                        <p className="text-[10px] text-muted-foreground">avg score</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Performance / Leaderboard */}
        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leaderboard */}
            <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-warning" />
                <h3 className="text-sm font-semibold">Top Performers</h3>
              </div>
              {topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {topPerformers.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0 ? 'bg-warning/20 text-warning' : 
                        i === 1 ? 'bg-muted text-muted-foreground' : 
                        i === 2 ? 'bg-orange-500/20 text-orange-400' : 
                        'bg-muted/30 text-muted-foreground'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.display_name || "Student"}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Lv.{s.level}</span>
                          <span>·</span>
                          <span>{s.lessons_completed} lessons</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-success">{s.avg_quiz_score}%</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
              )}
            </Card>

            {/* XP Leaderboard */}
            <Card className="p-6 border-border/50 bg-card/60 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">XP Leaders</h3>
              </div>
              {users && users.length > 0 ? (
                <div className="space-y-3">
                  {[...users].sort((a, b) => b.experience_points - a.experience_points).slice(0, 5).map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.display_name || "Student"}</p>
                        <Progress value={Math.min(100, (s.experience_points / (users[0]?.experience_points || 1)) * 100)} className="h-1.5 mt-1" />
                      </div>
                      <p className="text-sm font-bold">{s.experience_points.toLocaleString()} XP</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
