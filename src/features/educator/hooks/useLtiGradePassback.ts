import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to detect LTI launch context and handle grade passback
 * when a student completes a lesson or simulator activity.
 */
export const useLtiGradePassback = () => {
  const [searchParams] = useSearchParams();
  const launchId = searchParams.get("lti_launch_id");

  const syncScore = async (score: number, maxScore = 100, completionStatus = "completed") => {
    if (!launchId) return;

    try {
      const { data, error } = await supabase.functions.invoke("lti-grade-passback", {
        body: {
          launch_id: launchId,
          score,
          max_score: maxScore,
          completion_status: completionStatus,
        },
      });

      if (error) {
        console.error("LTI grade passback error:", error);
        return { success: false, error };
      }

      console.log("LTI grade synced:", data);
      return { success: true, data };
    } catch (err) {
      console.error("LTI grade passback failed:", err);
      return { success: false, error: err };
    }
  };

  return {
    isLtiLaunch: !!launchId,
    launchId,
    syncScore,
  };
};
