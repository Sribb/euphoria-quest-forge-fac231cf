import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface ClassWithMembers {
  id: string;
  class_name: string;
  class_code: string;
  description: string | null;
  educator_id: string;
  is_active: boolean | null;
  max_students: number | null;
  grade_level: string | null;
  requires_coppa_consent: boolean;
  period_block: string | null;
  display_color: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  member_count: number;
  members: ClassMember[];
}

export interface ClassMember {
  id: string;
  student_id: string;
  joined_at: string;
  display_name: string | null;
  level: number;
  experience_points: number;
  lessons_completed: number;
  avg_quiz_score: number;
}

export const useClassManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: classes, isLoading } = useQuery({
    queryKey: ["educator-classes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: classesData, error } = await supabase
        .from("classes")
        .select("*")
        .eq("educator_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const classesWithMembers: ClassWithMembers[] = await Promise.all(
        (classesData || []).map(async (cls) => {
          const { data: members } = await supabase
            .from("class_members")
            .select("id, student_id, joined_at")
            .eq("class_id", cls.id);

          const enrichedMembers: ClassMember[] = await Promise.all(
            (members || []).map(async (member) => {
              const { data: profile } = await supabase
                .from("profiles")
                .select("display_name, level, experience_points")
                .eq("id", member.student_id)
                .single();

              const { data: progress } = await supabase
                .from("user_lesson_progress")
                .select("completed, quiz_score")
                .eq("user_id", member.student_id);

              const completed = progress?.filter((p) => p.completed).length || 0;
              const scores = progress?.filter((p) => p.quiz_score).map((p) => p.quiz_score!) || [];
              const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

              return {
                id: member.id,
                student_id: member.student_id,
                joined_at: member.joined_at,
                display_name: profile?.display_name || "Student",
                level: profile?.level || 1,
                experience_points: profile?.experience_points || 0,
                lessons_completed: completed,
                avg_quiz_score: Math.round(avgScore),
              };
            })
          );

          return {
            ...cls,
            member_count: members?.length || 0,
            members: enrichedMembers,
          };
        })
      );

      return classesWithMembers;
    },
    enabled: !!user?.id,
  });

  const createClass = useMutation({
    mutationFn: async ({ className, description, maxStudents, gradeLevel, requiresCoppaConsent, periodBlock, displayColor }: { 
      className: string; description?: string; maxStudents?: number; gradeLevel?: string; requiresCoppaConsent?: boolean;
      periodBlock?: string; displayColor?: string;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data: codeData, error: codeError } = await supabase.rpc("generate_class_code");
      if (codeError) throw codeError;

      // Auto-detect COPPA requirement from grade level
      const COPPA_GRADES = ["k", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
      const autoCoppa = gradeLevel ? COPPA_GRADES.includes(gradeLevel.toLowerCase()) : false;
      const coppaRequired = requiresCoppaConsent || autoCoppa;

      const { error } = await supabase.from("classes").insert({
        class_name: className,
        class_code: codeData as string,
        description: description || null,
        educator_id: user.id,
        max_students: maxStudents || null,
        grade_level: gradeLevel || null,
        requires_coppa_consent: coppaRequired,
      });

      if (error) throw error;
      return codeData as string;
    },
    onSuccess: (classCode) => {
      queryClient.invalidateQueries({ queryKey: ["educator-classes"] });
      toast.success(`Class created! Code: ${classCode}`);
    },
    onError: (error) => {
      toast.error("Failed to create class: " + error.message);
    },
  });

  const deleteClass = useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase.from("classes").delete().eq("id", classId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educator-classes"] });
      toast.success("Class deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete class: " + error.message);
    },
  });

  const removeStudent = useMutation({
    mutationFn: async ({ memberId, studentId, studentName, classId, className }: {
      memberId: string; studentId: string; studentName: string; classId: string; className: string;
    }) => {
      // Remove from class
      const { error } = await supabase.from("class_members").delete().eq("id", memberId);
      if (error) throw error;

      // Auto-create deletion request for roster removal
      if (user?.id) {
        await supabase.from("data_deletion_requests").insert({
          educator_id: user.id,
          student_id: studentId,
          student_name: studentName,
          class_id: classId,
          class_name: className,
          deletion_type: "roster_removal",
          reason: "Student removed from class roster",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educator-classes"] });
      queryClient.invalidateQueries({ queryKey: ["deletion-requests"] });
      toast.success("Student removed. Data deletion scheduled (30-day grace period).");
    },
    onError: (error) => {
      toast.error("Failed to remove student: " + error.message);
    },
  });

  return {
    classes: classes || [],
    isLoading,
    createClass,
    deleteClass,
    removeStudent,
  };
};
