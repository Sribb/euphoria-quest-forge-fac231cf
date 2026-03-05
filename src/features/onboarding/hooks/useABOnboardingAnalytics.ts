import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

export type ABVariant = "A" | "B";

export const useABOnboardingAnalytics = () => {
  const { user } = useAuth();
  const stepStartTime = useRef<number>(Date.now());

  const assignVariant = useCallback(async (): Promise<ABVariant> => {
    if (!user?.id) return Math.random() < 0.5 ? "A" : "B";

    // Check if already assigned
    const { data: existing } = await supabase
      .from("onboarding_ab_assignments")
      .select("variant")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) return existing.variant as ABVariant;

    // 50/50 assignment
    const variant: ABVariant = Math.random() < 0.5 ? "A" : "B";

    await supabase.from("onboarding_ab_assignments").insert({
      user_id: user.id,
      variant,
    });

    return variant;
  }, [user?.id]);

  const trackStepStart = useCallback(() => {
    stepStartTime.current = Date.now();
  }, []);

  const trackStepComplete = useCallback(
    async (variant: ABVariant, stepNumber: number, stepName: string, response: unknown) => {
      if (!user?.id) return;
      const timeSpent = Date.now() - stepStartTime.current;

      await supabase.from("onboarding_ab_analytics").insert([{
        user_id: user.id,
        variant,
        step_number: stepNumber,
        step_name: stepName,
        action: "completed" as const,
        response: response as Json,
        time_spent_ms: timeSpent,
      }]);
    },
    [user?.id]
  );

  const trackDropOff = useCallback(
    async (variant: ABVariant, stepNumber: number, stepName: string) => {
      if (!user?.id) return;
      const timeSpent = Date.now() - stepStartTime.current;

      await supabase.from("onboarding_ab_analytics").insert([{
        user_id: user.id,
        variant,
        step_number: stepNumber,
        step_name: stepName,
        action: "dropped" as const,
        time_spent_ms: timeSpent,
      }]);
    },
    [user?.id]
  );

  const markComplete = useCallback(
    async (variant: ABVariant, totalTimeMs: number) => {
      if (!user?.id) return;

      await supabase
        .from("onboarding_ab_assignments")
        .update({
          completed: true,
          total_time_ms: totalTimeMs,
          completed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    },
    [user?.id]
  );

  return { assignVariant, trackStepStart, trackStepComplete, trackDropOff, markComplete };
};
