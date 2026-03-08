import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface DeletionRequest {
  id: string;
  educator_id: string;
  student_id: string;
  student_name: string;
  class_id: string | null;
  class_name: string | null;
  deletion_type: string;
  reason: string | null;
  status: string;
  requested_at: string;
  scheduled_purge_at: string;
  cancelled_at: string | null;
  purged_at: string | null;
  certificate_url: string | null;
  data_categories: string[];
}

export const useDataDeletion = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["deletion-requests", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("data_deletion_requests")
        .select("*")
        .eq("educator_id", user.id)
        .order("requested_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as DeletionRequest[];
    },
    enabled: !!user?.id,
  });

  const createRequest = useMutation({
    mutationFn: async (params: {
      studentId: string;
      studentName: string;
      classId?: string;
      className?: string;
      deletionType: string;
      reason?: string;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase.from("data_deletion_requests").insert({
        educator_id: user.id,
        student_id: params.studentId,
        student_name: params.studentName,
        class_id: params.classId || null,
        class_name: params.className || null,
        deletion_type: params.deletionType,
        reason: params.reason || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletion-requests"] });
      toast.success("Deletion request created. Data will be purged after 30 days.");
    },
    onError: (err) => toast.error("Failed to create deletion request: " + err.message),
  });

  const createBulkRequests = useMutation({
    mutationFn: async (params: {
      students: { studentId: string; studentName: string; classId: string; className: string }[];
      reason?: string;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const rows = params.students.map((s) => ({
        educator_id: user.id,
        student_id: s.studentId,
        student_name: s.studentName,
        class_id: s.classId,
        class_name: s.className,
        deletion_type: "bulk",
        reason: params.reason || "End-of-year data purge",
      }));
      const { error } = await supabase.from("data_deletion_requests").insert(rows);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["deletion-requests"] });
      toast.success(`${vars.students.length} deletion requests created.`);
    },
    onError: (err) => toast.error("Failed to create bulk requests: " + err.message),
  });

  const cancelRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("data_deletion_requests")
        .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("id", requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deletion-requests"] });
      toast.success("Deletion request cancelled.");
    },
    onError: (err) => toast.error("Failed to cancel: " + err.message),
  });

  return {
    requests,
    isLoading,
    createRequest,
    createBulkRequests,
    cancelRequest,
    pendingCount: requests.filter((r) => r.status === "pending").length,
    purgedCount: requests.filter((r) => r.status === "purged").length,
  };
};
