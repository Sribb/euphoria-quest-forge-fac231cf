import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface SpacedRepetitionItem {
  id: string;
  user_id: string;
  lesson_id: string;
  concept_key: string;
  concept_label: string;
  pathway: string;
  ease_factor: number;
  interval_days: number;
  repetition_count: number;
  last_reviewed_at: string | null;
  next_review_at: string;
  mastery_level: string;
  is_cracked: boolean;
  consecutive_correct: number;
  total_reviews: number;
  correct_reviews: number;
  created_at: string;
  updated_at: string;
}

// SM-2 inspired intervals
const INTERVALS = [1, 3, 7, 30, 90];

function getNextInterval(repetitionCount: number, easeFactor: number): number {
  if (repetitionCount < INTERVALS.length) return INTERVALS[repetitionCount];
  return Math.round(INTERVALS[INTERVALS.length - 1] * easeFactor);
}

function getMasteryLabel(consecutiveCorrect: number, totalReviews: number): string {
  if (totalReviews === 0) return "new";
  if (consecutiveCorrect >= 5) return "mastered";
  if (consecutiveCorrect >= 3) return "strong";
  if (consecutiveCorrect >= 1) return "learning";
  return "weak";
}

export const XP_REVIEW_CORRECT = 5;
export const XP_MASTERY_MAINTAIN = 15;

export const useSpacedRepetition = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all SR items for user
  const { data: items, isLoading } = useQuery({
    queryKey: ["spaced-repetition", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("spaced_repetition_items")
        .select("*")
        .eq("user_id", user.id)
        .order("next_review_at");
      if (error) throw error;
      return data as SpacedRepetitionItem[];
    },
    enabled: !!user?.id,
  });

  // Items due for review
  const dueItems = items?.filter(
    (item) => new Date(item.next_review_at) <= new Date()
  ) ?? [];

  // Cracked skills (overdue by more than double their interval)
  const crackedItems = items?.filter((item) => {
    if (!item.last_reviewed_at) return false;
    const overdueDays =
      (Date.now() - new Date(item.next_review_at).getTime()) / (1000 * 60 * 60 * 24);
    return overdueDays > item.interval_days;
  }) ?? [];

  // Mastered items
  const masteredItems = items?.filter((i) => i.mastery_level === "mastered") ?? [];

  // Register concepts from a completed lesson
  const registerConceptsMutation = useMutation({
    mutationFn: async ({
      lessonId,
      pathway,
      concepts,
    }: {
      lessonId: string;
      pathway: string;
      concepts: { key: string; label: string }[];
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const rows = concepts.map((c) => ({
        user_id: user.id,
        lesson_id: lessonId,
        concept_key: c.key,
        concept_label: c.label,
        pathway,
        next_review_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        interval_days: 1,
      }));

      const { error } = await supabase
        .from("spaced_repetition_items")
        .upsert(rows, { onConflict: "user_id,concept_key", ignoreDuplicates: true });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaced-repetition"] });
    },
  });

  // Record a review result
  const recordReviewMutation = useMutation({
    mutationFn: async ({
      itemId,
      correct,
    }: {
      itemId: string;
      correct: boolean;
    }) => {
      if (!user?.id) throw new Error("Not authenticated");
      const item = items?.find((i) => i.id === itemId);
      if (!item) throw new Error("Item not found");

      let newConsecutive = correct ? item.consecutive_correct + 1 : 0;
      let newRep = correct ? item.repetition_count + 1 : 0;
      let newEase = item.ease_factor + (correct ? 0.1 : -0.3);
      newEase = Math.max(1.3, Math.min(3.0, newEase));

      const newInterval = correct ? getNextInterval(newRep, newEase) : 1;
      const nextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString();
      const newMastery = getMasteryLabel(newConsecutive, item.total_reviews + 1);

      const { error } = await supabase
        .from("spaced_repetition_items")
        .update({
          ease_factor: newEase,
          interval_days: newInterval,
          repetition_count: newRep,
          last_reviewed_at: new Date().toISOString(),
          next_review_at: nextReview,
          mastery_level: newMastery,
          is_cracked: false,
          consecutive_correct: newConsecutive,
          total_reviews: item.total_reviews + 1,
          correct_reviews: item.correct_reviews + (correct ? 1 : 0),
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId);

      if (error) throw error;
      return { correct, newMastery, prevMastery: item.mastery_level };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["spaced-repetition"] });
      if (result.newMastery === "mastered" && result.prevMastery !== "mastered") {
        toast.success("🧠 Concept mastered! +15 XP");
      }
    },
  });

  // Mark overdue items as cracked
  const refreshCrackedStatus = useMutation({
    mutationFn: async () => {
      if (!user?.id || !items) return;
      const now = Date.now();
      const toUpdate = items.filter((item) => {
        if (item.is_cracked) return false;
        if (!item.last_reviewed_at) return false;
        const overdueDays = (now - new Date(item.next_review_at).getTime()) / (1000 * 60 * 60 * 24);
        return overdueDays > item.interval_days;
      });

      for (const item of toUpdate) {
        await supabase
          .from("spaced_repetition_items")
          .update({ is_cracked: true, updated_at: new Date().toISOString() })
          .eq("id", item.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaced-repetition"] });
    },
  });

  return {
    items: items ?? [],
    dueItems,
    crackedItems,
    masteredItems,
    isLoading,
    dueCount: dueItems.length,
    crackedCount: crackedItems.length,
    masteredCount: masteredItems.length,
    totalCount: items?.length ?? 0,
    registerConcepts: registerConceptsMutation.mutate,
    recordReview: recordReviewMutation.mutate,
    refreshCrackedStatus: refreshCrackedStatus.mutate,
    isRegistering: registerConceptsMutation.isPending,
    isReviewing: recordReviewMutation.isPending,
  };
};
