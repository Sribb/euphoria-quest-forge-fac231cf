import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface UserWithProgress {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  level: number;
  experience_points: number;
  coins: number;
  created_at: string;
  updated_at: string;
  lessons_completed: number;
  avg_quiz_score: number;
  total_game_sessions: number;
  role?: string;
}

export interface EducatorStats {
  total_users: number;
  active_users_7d: number;
  avg_lesson_completion: number;
  total_lessons_completed: number;
  avg_quiz_score: number;
}

export const useEducatorData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all users with their progress
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["educator-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get lesson progress for each user
      const usersWithProgress: UserWithProgress[] = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: lessonProgress } = await supabase
            .from("user_lesson_progress")
            .select("completed, quiz_score")
            .eq("user_id", profile.id);

          const { data: gameSessions } = await supabase
            .from("game_sessions")
            .select("id")
            .eq("user_id", profile.id);

          const { data: userRole } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id)
            .single();

          const completedLessons = lessonProgress?.filter((l) => l.completed).length || 0;
          const quizScores = lessonProgress?.filter((l) => l.quiz_score).map((l) => l.quiz_score!) || [];
          const avgScore = quizScores.length > 0 ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length : 0;

          return {
            ...profile,
            lessons_completed: completedLessons,
            avg_quiz_score: Math.round(avgScore),
            total_game_sessions: gameSessions?.length || 0,
            role: userRole?.role || "user",
          };
        })
      );

      return usersWithProgress;
    },
  });

  // Fetch educator stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["educator-stats"],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, updated_at");

      const { data: lessonProgress } = await supabase
        .from("user_lesson_progress")
        .select("progress, completed, quiz_score");

      const totalUsers = profiles?.length || 0;
      const activeUsers7d = profiles?.filter(
        (p) => new Date(p.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;
      const avgCompletion = lessonProgress?.length
        ? lessonProgress.reduce((acc, curr) => acc + (curr.progress || 0), 0) / lessonProgress.length
        : 0;
      const totalCompleted = lessonProgress?.filter((l) => l.completed).length || 0;
      const quizScores = lessonProgress?.filter((l) => l.quiz_score).map((l) => l.quiz_score!) || [];
      const avgQuiz = quizScores.length ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length : 0;

      return {
        total_users: totalUsers,
        active_users_7d: activeUsers7d,
        avg_lesson_completion: Math.round(avgCompletion),
        total_lessons_completed: totalCompleted,
        avg_quiz_score: Math.round(avgQuiz),
      } as EducatorStats;
    },
  });

  // Fetch announcements
  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: ["educator-announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch live sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["educator-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("live_sessions")
        .select("*")
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcement: {
      title: string;
      content: string;
      priority: string;
      is_published: boolean;
    }) => {
      const { error } = await supabase.from("announcements").insert({
        ...announcement,
        author_id: user!.id,
        published_at: announcement.is_published ? new Date().toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educator-announcements"] });
      toast.success("Announcement created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create announcement: " + error.message);
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // First, delete existing role
      await supabase.from("user_roles").delete().eq("user_id", userId);

      // Then insert new role
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: role as "admin" | "user" | "educator" | "mentor",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educator-users"] });
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update role: " + error.message);
    },
  });

  // Create live session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (session: {
      title: string;
      description?: string;
      session_type: string;
      scheduled_at: string;
      duration_minutes: number;
    }) => {
      const { error } = await supabase.from("live_sessions").insert({
        ...session,
        host_id: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educator-sessions"] });
      toast.success("Session scheduled successfully");
    },
    onError: (error) => {
      toast.error("Failed to schedule session: " + error.message);
    },
  });

  return {
    users,
    stats,
    announcements,
    sessions,
    isLoading: usersLoading || statsLoading || announcementsLoading || sessionsLoading,
    createAnnouncement: createAnnouncementMutation.mutate,
    updateUserRole: updateUserRoleMutation.mutate,
    createSession: createSessionMutation.mutate,
    isCreating: createAnnouncementMutation.isPending || createSessionMutation.isPending,
  };
};
