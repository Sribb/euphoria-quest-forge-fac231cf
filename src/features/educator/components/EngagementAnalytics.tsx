import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, Star, TrendingUp, Users, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";

interface EngagementAnalyticsProps {
  onViewUser: (userId: string) => void;
}

export const EngagementAnalytics = ({ onViewUser }: EngagementAnalyticsProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["educator-engagement"],
    queryFn: async () => {
      // Get all profiles with their activity
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url, level, experience_points, updated_at")
        .order("updated_at", { ascending: false });

      // Get lesson progress
      const { data: progress } = await supabase
        .from("user_lesson_progress")
        .select("user_id, progress, completed, quiz_score, updated_at");

      // Get game sessions
      const { data: gameSessions } = await supabase
        .from("game_sessions")
        .select("user_id, score, completed, created_at");

      // Get live sessions attendance
      const { data: sessionAttendance } = await supabase
        .from("session_attendance")
        .select("user_id, duration_minutes, participation_score");

      // Calculate user engagement scores
      const userEngagement = profiles?.map((profile) => {
        const userProgress = progress?.filter((p) => p.user_id === profile.id) || [];
        const userGames = gameSessions?.filter((g) => g.user_id === profile.id) || [];
        const userAttendance = sessionAttendance?.filter((a) => a.user_id === profile.id) || [];

        const avgProgress = userProgress.length
          ? userProgress.reduce((acc, p) => acc + p.progress, 0) / userProgress.length
          : 0;
        const completedLessons = userProgress.filter((p) => p.completed).length;
        const avgQuizScore = userProgress.filter((p) => p.quiz_score).length
          ? userProgress.filter((p) => p.quiz_score).reduce((acc, p) => acc + (p.quiz_score || 0), 0) /
            userProgress.filter((p) => p.quiz_score).length
          : 0;
        const gamesPlayed = userGames.length;
        const sessionsAttended = userAttendance.length;
        const totalParticipation = userAttendance.reduce((acc, a) => acc + (a.participation_score || 0), 0);

        // Calculate engagement score (0-100)
        const engagementScore = Math.min(
          100,
          Math.round(
            avgProgress * 0.3 +
            completedLessons * 3 +
            avgQuizScore * 0.2 +
            gamesPlayed * 2 +
            sessionsAttended * 5 +
            totalParticipation * 0.5
          )
        );

        const daysSinceActive = Math.floor(
          (Date.now() - new Date(profile.updated_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          ...profile,
          avgProgress: Math.round(avgProgress),
          completedLessons,
          avgQuizScore: Math.round(avgQuizScore),
          gamesPlayed,
          sessionsAttended,
          engagementScore,
          daysSinceActive,
          isStruggling: avgProgress < 30 && daysSinceActive > 7,
          isExcelling: engagementScore > 70 && avgQuizScore > 80,
        };
      });

      // Sort for different categories
      const strugglingUsers = userEngagement?.filter((u) => u.isStruggling).slice(0, 5) || [];
      const excellingUsers = userEngagement?.filter((u) => u.isExcelling).slice(0, 5) || [];
      const recentlyActive = userEngagement?.slice(0, 5) || [];

      // Create engagement trend data (last 7 days mock)
      const engagementTrend = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          activeUsers: Math.floor(Math.random() * 50) + 20,
          lessonsCompleted: Math.floor(Math.random() * 30) + 10,
          gamesPlayed: Math.floor(Math.random() * 40) + 15,
        };
      });

      return {
        strugglingUsers,
        excellingUsers,
        recentlyActive,
        engagementTrend,
        totalActive: userEngagement?.filter((u) => u.daysSinceActive <= 7).length || 0,
        totalStruggling: strugglingUsers.length,
        totalExcelling: excellingUsers.length,
      };
    },
  });

  const UserCard = ({
    user,
    type,
  }: {
    user: (typeof data)["strugglingUsers"][0];
    type: "struggling" | "excelling" | "active";
  }) => (
    <div
      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => onViewUser(user.id)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar_url || undefined} />
          <AvatarFallback>{(user.display_name || user.username || "U")[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{user.display_name || user.username || "Unknown"}</p>
          <p className="text-xs text-muted-foreground">
            {type === "struggling"
              ? `${user.avgProgress}% progress • ${user.daysSinceActive}d inactive`
              : type === "excelling"
              ? `${user.engagementScore} score • ${user.avgQuizScore}% quiz avg`
              : `Active ${formatDistanceToNow(new Date(user.updated_at), { addSuffix: true })}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {type === "struggling" && (
          <Badge variant="destructive" className="text-xs">
            Needs Help
          </Badge>
        )}
        {type === "excelling" && (
          <Badge variant="default" className="text-xs bg-green-500">
            <Star className="h-3 w-3 mr-1" />
            Top Performer
          </Badge>
        )}
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users (7d)</p>
                <p className="text-3xl font-bold text-green-500">{data?.totalActive || 0}</p>
              </div>
              <Activity className="h-10 w-10 text-green-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needing Guidance</p>
                <p className="text-3xl font-bold text-yellow-500">{data?.totalStruggling || 0}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Performers</p>
                <p className="text-3xl font-bold text-primary">{data?.totalExcelling || 0}</p>
              </div>
              <Star className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5" />
            Engagement Trends
          </CardTitle>
          <CardDescription>User activity over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.engagementTrend}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Active Users"
                />
                <Area
                  type="monotone"
                  dataKey="lessonsCompleted"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#colorLessons)"
                  name="Lessons Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Struggling Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Users Needing Guidance
            </CardTitle>
            <CardDescription>Low progress or inactive students</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.strugglingUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No struggling users identified 🎉
              </p>
            ) : (
              <div className="space-y-2">
                {data?.strugglingUsers.map((user) => (
                  <UserCard key={user.id} user={user} type="struggling" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Excelling Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-5 w-5 text-primary" />
              Top Performers
            </CardTitle>
            <CardDescription>High engagement and quiz scores</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.excellingUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No top performers yet
              </p>
            ) : (
              <div className="space-y-2">
                {data?.excellingUsers.map((user) => (
                  <UserCard key={user.id} user={user} type="excelling" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
