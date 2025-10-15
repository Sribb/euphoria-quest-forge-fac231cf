import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useOnboarding = () => {
  const { user } = useAuth();

  const { data: onboardingData, isLoading } = useQuery({
    queryKey: ["onboarding", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_onboarding")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    hasCompletedOnboarding: !!onboardingData,
    investmentLevel: onboardingData?.investment_level || "beginner",
    quizScore: onboardingData?.quiz_score || 0,
    isLoading,
  };
};
