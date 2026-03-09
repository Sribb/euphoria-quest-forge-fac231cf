import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getTodaysChallenge, getTodaysChallengeDay, getTimeUntilMidnight } from "../data/dailyChallengeQuestions";
import type { DailyChallengeQuestion } from "../data/dailyChallengeQuestions";

export interface DailyChallengeState {
  challenge: DailyChallengeQuestion;
  challengeDay: number;
  alreadyCompleted: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  revealed: boolean;
  streak: {
    current: number;
    longest: number;
    totalCompleted: number;
    totalCorrect: number;
  };
  timeRemaining: string;
  loading: boolean;
  submitting: boolean;
}

export function useDailyChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const challengeDay = getTodaysChallengeDay();
  const challenge = getTodaysChallenge();

  const [timeRemaining, setTimeRemaining] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Countdown timer
  useEffect(() => {
    const update = () => {
      const ms = getTimeUntilMidnight();
      const hours = Math.floor(ms / 3600000);
      const mins = Math.floor((ms % 3600000) / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      setTimeRemaining(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if already completed today
  const { data: todayProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["daily-challenge-progress", user?.id, challengeDay],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("daily_challenge_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("challenge_day", challengeDay)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch streak
  const { data: streakData, isLoading: streakLoading } = useQuery({
    queryKey: ["daily-challenge-streak", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("daily_challenge_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  // Set revealed state if already completed
  useEffect(() => {
    if (todayProgress) {
      setSelectedAnswer(todayProgress.selected_answer);
      setRevealed(true);
    }
  }, [todayProgress]);

  // Submit answer
  const submitMutation = useMutation({
    mutationFn: async (answerIndex: number) => {
      if (!user?.id) throw new Error("Not authenticated");
      const isCorrect = answerIndex === challenge.correctIndex;
      const xpEarned = isCorrect ? challenge.xpReward : Math.floor(challenge.xpReward * 0.3);

      // Insert progress
      const { error: progressError } = await supabase
        .from("daily_challenge_progress")
        .insert({
          user_id: user.id,
          challenge_day: challengeDay,
          selected_answer: answerIndex,
          is_correct: isCorrect,
          xp_earned: xpEarned,
        });
      if (progressError) throw progressError;

      // Update streak
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      if (streakData) {
        const wasYesterday = streakData.last_completed_date === yesterday;
        const isConsecutiveDay = streakData.last_completed_day === challengeDay - 1 || wasYesterday;
        const newStreak = isConsecutiveDay ? streakData.current_streak + 1 : 1;
        const newLongest = Math.max(newStreak, streakData.longest_streak);

        await supabase
          .from("daily_challenge_streaks")
          .update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_completed_day: challengeDay,
            last_completed_date: today,
            total_completed: streakData.total_completed + 1,
            total_correct: streakData.total_correct + (isCorrect ? 1 : 0),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      } else {
        await supabase.from("daily_challenge_streaks").insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_completed_day: challengeDay,
          last_completed_date: today,
          total_completed: 1,
          total_correct: isCorrect ? 1 : 0,
        });
      }

      // Award XP
      await supabase.rpc("add_experience_points", {
        user_id_param: user.id,
        xp_amount: xpEarned,
      });

      return { isCorrect, xpEarned };
    },
    onSuccess: ({ isCorrect, xpEarned }) => {
      queryClient.invalidateQueries({ queryKey: ["daily-challenge-progress"] });
      queryClient.invalidateQueries({ queryKey: ["daily-challenge-streak"] });
      queryClient.invalidateQueries({ queryKey: ["user-xp-stats"] });
      setRevealed(true);

      if (isCorrect) {
        toast.success(`🎯 Correct! +${xpEarned} XP earned!`);
      } else {
        toast(`💡 Not quite — but you still earned ${xpEarned} XP for trying!`);
      }
    },
    onError: (err: any) => {
      if (err?.code === "23505") {
        toast.error("You've already completed today's challenge!");
        setRevealed(true);
      } else {
        toast.error("Failed to submit answer");
      }
    },
  });

  const submitAnswer = useCallback(
    (answerIndex: number) => {
      setSelectedAnswer(answerIndex);
      submitMutation.mutate(answerIndex);
    },
    [submitMutation]
  );

  return {
    challenge,
    challengeDay,
    alreadyCompleted: !!todayProgress,
    selectedAnswer,
    isCorrect: selectedAnswer !== null ? selectedAnswer === challenge.correctIndex : null,
    revealed,
    streak: {
      current: streakData?.current_streak ?? 0,
      longest: streakData?.longest_streak ?? 0,
      totalCompleted: streakData?.total_completed ?? 0,
      totalCorrect: streakData?.total_correct ?? 0,
    },
    timeRemaining,
    loading: progressLoading || streakLoading,
    submitting: submitMutation.isPending,
    submitAnswer,
  };
}
