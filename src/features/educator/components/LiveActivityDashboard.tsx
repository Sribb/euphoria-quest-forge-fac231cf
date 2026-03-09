import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Circle,
  Users,
  BookOpen,
  Wifi,
  WifiOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow, differenceInMinutes } from "date-fns";

interface StudentActivity {
  id: string;
  user_id: string;
  class_id: string | null;
  current_lesson_id: string | null;
  lesson_title: string | null;
  completion_percentage: number;
  session_started_at: string;
  last_active_at: string;
  last_interaction_type: string | null;
  is_online: boolean;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface Props {
  classId?: string;
}

const INACTIVE_THRESHOLD_MINUTES = 5;

export const LiveActivityDashboard = ({ classId }: Props) => {
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [now, setNow] = useState(new Date());

  // Refresh "now" every 30 seconds for time calculations
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Initial fetch
  const { data: initialActivities, isLoading } = useQuery({
    queryKey: ["live-activity", classId],
    queryFn: async () => {
      let query = supabase
        .from("student_activity")
        .select("*")
        .eq("is_online", true)
        .order("last_active_at", { ascending: false });

      if (classId) {
        query = query.eq("class_id", classId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles separately
      const userIds = (data || []).map((a) => a.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      return (data || []).map((activity) => ({
        ...activity,
        profile: profileMap.get(activity.user_id) || null,
      })) as StudentActivity[];
    },
  });

  // Set initial data
  useEffect(() => {
    if (initialActivities) {
      setActivities(initialActivities);
    }
  }, [initialActivities]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("live-activity-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "student_activity",
          ...(classId && { filter: `class_id=eq.${classId}` }),
        },
        async (payload) => {
          if (payload.eventType === "DELETE") {
            setActivities((prev) => 
              prev.filter((a) => a.id !== payload.old.id)
            );
          } else {
            // Fetch the profile for the updated record
            const { data: profile } = await supabase
              .from("profiles")
              .select("display_name, avatar_url")
              .eq("id", payload.new.user_id)
              .single();

            const newActivity = {
              ...payload.new,
              profile,
            } as StudentActivity;

            setActivities((prev) => {
              const exists = prev.find((a) => a.id === newActivity.id);
              if (exists) {
                return prev.map((a) => 
                  a.id === newActivity.id ? newActivity : a
                );
              }
              return [newActivity, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [classId]);

  // Categorize students
  const { activeStudents, stuckStudents, idleStudents } = useMemo(() => {
    const active: StudentActivity[] = [];
    const stuck: StudentActivity[] = [];
    const idle: StudentActivity[] = [];

    activities.forEach((activity) => {
      if (!activity.is_online) {
        idle.push(activity);
        return;
      }

      const lastActiveDate = new Date(activity.last_active_at);
      const minutesSinceActive = differenceInMinutes(now, lastActiveDate);

      if (minutesSinceActive >= INACTIVE_THRESHOLD_MINUTES) {
        stuck.push(activity);
      } else {
        active.push(activity);
      }
    });

    return { activeStudents: active, stuckStudents: stuck, idleStudents: idle };
  }, [activities, now]);

  const totalOnline = activeStudents.length + stuckStudents.length;

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-muted-foreground">Loading live activity...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Live Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Real-time student monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">{totalOnline} online</span>
            </div>
            {stuckStudents.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                {stuckStudents.length} stuck
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all" className="gap-2">
              <Users className="w-4 h-4" />
              All ({activities.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2">
              <Wifi className="w-4 h-4" />
              Active ({activeStudents.length})
            </TabsTrigger>
            <TabsTrigger value="stuck" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              Needs Help ({stuckStudents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <StudentList 
              students={[...stuckStudents, ...activeStudents]} 
              now={now} 
              emptyMessage="No students currently online"
            />
          </TabsContent>

          <TabsContent value="active">
            <StudentList 
              students={activeStudents} 
              now={now}
              emptyMessage="No actively working students"
            />
          </TabsContent>

          <TabsContent value="stuck">
            <StudentList 
              students={stuckStudents} 
              now={now}
              emptyMessage="No students appear stuck"
              isStuckView
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface StudentListProps {
  students: StudentActivity[];
  now: Date;
  emptyMessage: string;
  isStuckView?: boolean;
}

const StudentList = ({ students, now, emptyMessage, isStuckView }: StudentListProps) => {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {students.map((student) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              now={now}
              isStuckView={isStuckView}
            />
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};

interface StudentCardProps {
  student: StudentActivity;
  now: Date;
  isStuckView?: boolean;
}

const StudentCard = ({ student, now, isStuckView }: StudentCardProps) => {
  const lastActiveDate = new Date(student.last_active_at);
  const sessionStartDate = new Date(student.session_started_at);
  const minutesSinceActive = differenceInMinutes(now, lastActiveDate);
  const isStuck = minutesSinceActive >= INACTIVE_THRESHOLD_MINUTES;

  const sessionDuration = differenceInMinutes(now, sessionStartDate);
  const sessionDurationFormatted = sessionDuration >= 60 
    ? `${Math.floor(sessionDuration / 60)}h ${sessionDuration % 60}m`
    : `${sessionDuration}m`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-4 rounded-lg border transition-colors ${
        isStuck 
          ? "bg-destructive/5 border-destructive/30" 
          : "bg-muted/30 border-border/50 hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar / Status */}
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              isStuck ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
            }`}>
              {student.profile?.display_name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
              isStuck ? "bg-amber-500" : "bg-green-500"
            }`} />
          </div>

          {/* Name & Quest */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">
                {student.profile?.display_name || "Unknown Student"}
              </p>
              {isStuck && (
                <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Inactive {minutesSinceActive}m
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="truncate">
                {student.lesson_title || "No active quest"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {sessionDurationFormatted}
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={student.completion_percentage} 
              className="w-16 h-2"
            />
            <span className="text-xs font-medium w-8 text-right">
              {student.completion_percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Last interaction hint */}
      <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
        <span className="capitalize">
          {student.last_interaction_type || "viewing"} • {formatDistanceToNow(lastActiveDate, { addSuffix: true })}
        </span>
        {isStuckView && (
          <span className="text-destructive">
            May need assistance
          </span>
        )}
      </div>
    </motion.div>
  );
};
