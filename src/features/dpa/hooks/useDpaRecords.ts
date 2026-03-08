import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface DpaRecord {
  id: string;
  user_id: string;
  district_name: string;
  district_address: string;
  signatory_name: string;
  signatory_title: string;
  signatory_email: string;
  state: string;
  student_count: number;
  term_years: number;
  contract_start_date: string;
  generated_at: string;
  pdf_url: string | null;
  status: string;
}

export interface DpaFormData {
  district_name: string;
  district_address: string;
  signatory_name: string;
  signatory_title: string;
  signatory_email: string;
  state: string;
  student_count: number;
  term_years: number;
  contract_start_date: string;
}

export const useDpaRecords = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dpa-records", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dpa_records")
        .select("*")
        .order("generated_at", { ascending: false });
      if (error) throw error;
      return data as DpaRecord[];
    },
    enabled: !!user,
  });
};

export const useCreateDpaRecord = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: DpaFormData & { pdf_url?: string }) => {
      const { data, error } = await supabase
        .from("dpa_records")
        .insert({
          ...formData,
          user_id: user!.id,
          status: "generated",
        })
        .select()
        .single();
      if (error) throw error;
      return data as DpaRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dpa-records"] });
    },
  });
};
