import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface ParentalConsent {
  id: string;
  student_id: string;
  class_id: string;
  parent_email: string;
  consent_status: string;
  consent_token: string;
  requested_at: string;
  responded_at: string | null;
  revoked_at: string | null;
  deletion_requested_at: string | null;
  requested_by: string;
}

export const useParentalConsent = (classId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: consents, isLoading } = useQuery({
    queryKey: ["parental-consents", classId],
    queryFn: async () => {
      if (!classId) return [];
      const { data, error } = await supabase
        .from("parental_consents")
        .select("*")
        .eq("class_id", classId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ParentalConsent[];
    },
    enabled: !!classId && !!user?.id,
  });

  const requestConsent = useMutation({
    mutationFn: async ({ studentId, parentEmail, classId }: { studentId: string; parentEmail: string; classId: string }) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("parental_consents")
        .insert({
          student_id: studentId,
          class_id: classId,
          parent_email: parentEmail,
          requested_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Invoke edge function to send email
      const { error: emailError } = await supabase.functions.invoke("send-consent-email", {
        body: {
          consentId: data.id,
          parentEmail,
          consentToken: data.consent_token,
        },
      });

      if (emailError) {
        console.error("Email send failed:", emailError);
        // Don't fail the whole operation — consent record is created
        toast.warning("Consent recorded but email delivery may be delayed");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parental-consents"] });
      toast.success("Parental consent request sent!");
    },
    onError: (error) => {
      toast.error("Failed to request consent: " + error.message);
    },
  });

  const resendConsent = useMutation({
    mutationFn: async (consentId: string) => {
      const consent = consents?.find(c => c.id === consentId);
      if (!consent) throw new Error("Consent not found");

      const { error } = await supabase.functions.invoke("send-consent-email", {
        body: {
          consentId: consent.id,
          parentEmail: consent.parent_email,
          consentToken: consent.consent_token,
        },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Consent request resent!");
    },
    onError: (error) => {
      toast.error("Failed to resend: " + error.message);
    },
  });

  const getConsentStatus = (studentId: string): string => {
    const consent = consents?.find(c => c.student_id === studentId);
    if (!consent) return "none";
    if (consent.revoked_at) return "revoked";
    return consent.consent_status;
  };

  const isConsentBlocked = (studentId: string): boolean => {
    const status = getConsentStatus(studentId);
    return status === "pending" || status === "none" || status === "revoked";
  };

  return {
    consents: consents || [],
    isLoading,
    requestConsent,
    resendConsent,
    getConsentStatus,
    isConsentBlocked,
  };
};
