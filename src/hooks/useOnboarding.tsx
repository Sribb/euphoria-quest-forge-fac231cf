import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useOnboarding = () => {
  const { user } = useAuth();

  const { data: onboardingData, isLoading, refetch } = useQuery({
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
    staleTime: 0, // Always check fresh data for onboarding status
    gcTime: 0, // Don't cache this query (was cacheTime in older versions)
  });

  const startingLesson = (onboardingData?.preferences as any)?.starting_lesson || 1;

  return {
    hasCompletedOnboarding: !!onboardingData,
    investmentLevel: onboardingData?.investment_level || "beginner",
    quizScore: onboardingData?.quiz_score || 0,
    startingLesson,
    isLoading,
    refetch,
  };
};
