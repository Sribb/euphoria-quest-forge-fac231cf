import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ActivityOptions {
  classId?: string;
  lessonId?: string;
  lessonTitle?: string;
  completionPercentage?: number;
}

/**
 * Hook that tracks student activity for real-time educator dashboards.
 * Automatically pings the activity table to show the student as active.
 * Should be used in lesson/quest pages.
 */
export const useStudentActivityTracker = (options: ActivityOptions = {}) => {
  const { user } = useAuth();
  const { classId, lessonId, lessonTitle, completionPercentage = 0 } = options;
  const activityIdRef = useRef<string | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update activity record
  const updateActivity = useCallback(async (interactionType: string = "viewing") => {
    if (!user?.id) return;

    try {
      const activityData = {
        user_id: user.id,
        class_id: classId || null,
        current_lesson_id: lessonId || null,
        lesson_title: lessonTitle || null,
        completion_percentage: completionPercentage,
        last_active_at: new Date().toISOString(),
        last_interaction_type: interactionType,
        is_online: true,
      };

      if (activityIdRef.current) {
        // Update existing record
        await supabase
          .from("student_activity")
          .update(activityData)
          .eq("id", activityIdRef.current);
      } else {
        // Upsert to handle unique constraint
        const { data, error } = await supabase
          .from("student_activity")
          .upsert(
            {
              ...activityData,
              session_started_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id,class_id",
            }
          )
          .select("id")
          .single();

        if (!error && data) {
          activityIdRef.current = data.id;
        }
      }
    } catch (err) {
      console.error("Failed to update activity:", err);
    }
  }, [user?.id, classId, lessonId, lessonTitle, completionPercentage]);

  // Mark as offline
  const markOffline = useCallback(async () => {
    if (!activityIdRef.current) return;

    try {
      await supabase
        .from("student_activity")
        .update({ is_online: false })
        .eq("id", activityIdRef.current);
    } catch (err) {
      console.error("Failed to mark offline:", err);
    }
  }, []);

  // Report specific interactions
  const reportInteraction = useCallback((type: "quiz_answer" | "reading" | "video" | "scrolling" | "idle") => {
    updateActivity(type);
  }, [updateActivity]);

  // Report progress update
  const reportProgress = useCallback((progress: number) => {
    if (!user?.id || !activityIdRef.current) return;

    supabase
      .from("student_activity")
      .update({
        completion_percentage: progress,
        last_active_at: new Date().toISOString(),
        last_interaction_type: "progress",
      })
      .eq("id", activityIdRef.current)
      .then(() => {});
  }, [user?.id]);

  // Start tracking on mount
  useEffect(() => {
    if (!user?.id) return;

    // Initial ping
    updateActivity("viewing");

    // Ping every 60 seconds to maintain "active" status
    pingIntervalRef.current = setInterval(() => {
      updateActivity("heartbeat");
    }, 60000);

    // Track visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateActivity("tabbed_away");
      } else {
        updateActivity("returned");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Track user interactions for more accurate "last active"
    let interactionTimeout: NodeJS.Timeout;
    const handleInteraction = () => {
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        updateActivity("interaction");
      }, 5000); // Debounce to avoid spamming
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keypress", handleInteraction);
    document.addEventListener("scroll", handleInteraction, { passive: true });

    // Cleanup
    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      clearTimeout(interactionTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keypress", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);

      // Mark offline on unmount
      markOffline();
    };
  }, [user?.id, updateActivity, markOffline]);

  // Update when lesson/progress changes
  useEffect(() => {
    if (activityIdRef.current) {
      updateActivity("lesson_change");
    }
  }, [lessonId, completionPercentage, updateActivity]);

  return {
    reportInteraction,
    reportProgress,
    markOffline,
  };
};
