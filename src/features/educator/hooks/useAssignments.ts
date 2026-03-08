import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Assignment {
  id: string;
  educator_id: string;
  lesson_id: string;
  title: string;
  instructions: string | null;
  target_type: string;
  class_ids: string[];
  student_ids: string[];
  due_date: string | null;
  scheduled_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // joined
  lesson_title?: string;
  submission_count?: number;
  completed_count?: number;
}

export interface CreateAssignmentInput {
  lessonId: string;
  title: string;
  instructions?: string;
  targetType: "class" | "students";
  classIds: string[];
  studentIds: string[];
  dueDate?: string | null;
  scheduledAt?: string | null;
}

export const useAssignments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["educator-assignments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("educator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Enrich with lesson titles and submission counts
      const enriched: Assignment[] = await Promise.all(
        (data || []).map(async (a: any) => {
          const { data: lesson } = await supabase
            .from("lessons")
            .select("title")
            .eq("id", a.lesson_id)
            .single();

          const { data: subs } = await supabase
            .from("assignment_submissions")
            .select("id, status")
            .eq("assignment_id", a.id);

          return {
            ...a,
            lesson_title: lesson?.title || "Unknown Quest",
            submission_count: subs?.length || 0,
            completed_count: subs?.filter((s: any) => s.status === "completed").length || 0,
          };
        })
      );

      return enriched;
    },
    enabled: !!user?.id,
  });

  const createAssignment = useMutation({
    mutationFn: async (input: CreateAssignmentInput) => {
      if (!user?.id) throw new Error("Not authenticated");

      const isScheduled = input.scheduledAt && new Date(input.scheduledAt) > new Date();

      const { error } = await supabase.from("assignments").insert({
        educator_id: user.id,
        lesson_id: input.lessonId,
        title: input.title,
        instructions: input.instructions || null,
        target_type: input.targetType,
        class_ids: input.classIds,
        student_ids: input.studentIds,
        due_date: input.dueDate || null,
        scheduled_at: input.scheduledAt || null,
        is_published: !isScheduled,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educator-assignments"] });
      toast.success("Assignment created!");
    },
    onError: (error) => {
      toast.error("Failed to create assignment: " + error.message);
    },
  });

  const deleteAssignment = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase.from("assignments").delete().eq("id", assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educator-assignments"] });
      toast.success("Assignment deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete assignment: " + error.message);
    },
  });

  return {
    assignments: assignments || [],
    isLoading,
    createAssignment,
    deleteAssignment,
  };
};
