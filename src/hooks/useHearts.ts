import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const MAX_HEARTS = 5;
const MAX_EARN_PER_DAY = 3; // Max hearts earnable through practice per day

interface HeartsState {
  hearts: number;
  maxHearts: number;
  heartsEarnedToday: number;
  loading: boolean;
}

export const useHearts = () => {
  const { user } = useAuth();
  const [state, setState] = useState<HeartsState>({
    hearts: MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    heartsEarnedToday: 0,
    loading: true,
  });

  const today = new Date().toISOString().split("T")[0];

  const loadHearts = useCallback(async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("user_hearts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      // No row yet — create one
      const { data: newRow } = await supabase
        .from("user_hearts")
        .insert({ user_id: user.id, hearts_remaining: MAX_HEARTS, max_hearts: MAX_HEARTS, last_reset_date: today })
        .select()
        .single();

      if (newRow) {
        setState({ hearts: newRow.hearts_remaining, maxHearts: newRow.max_hearts, heartsEarnedToday: 0, loading: false });
      }
      return;
    }

    if (data) {
      // Daily reset check
      if (data.last_reset_date !== today) {
        const { data: updated } = await supabase
          .from("user_hearts")
          .update({ hearts_remaining: MAX_HEARTS, last_reset_date: today, hearts_earned_today: 0, updated_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .select()
          .single();

        if (updated) {
          setState({ hearts: updated.hearts_remaining, maxHearts: updated.max_hearts, heartsEarnedToday: 0, loading: false });
        }
      } else {
        setState({ hearts: data.hearts_remaining, maxHearts: data.max_hearts, heartsEarnedToday: data.hearts_earned_today, loading: false });
      }
    }
  }, [user?.id, today]);

  useEffect(() => { loadHearts(); }, [loadHearts]);

  const loseHeart = useCallback(async () => {
    if (!user?.id || state.hearts <= 0) return state.hearts;

    const newHearts = state.hearts - 1;
    setState(prev => ({ ...prev, hearts: newHearts }));

    await supabase
      .from("user_hearts")
      .update({ hearts_remaining: newHearts, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    return newHearts;
  }, [user?.id, state.hearts]);

  const earnHeart = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;
    if (state.hearts >= MAX_HEARTS) return false;
    if (state.heartsEarnedToday >= MAX_EARN_PER_DAY) return false;

    const newHearts = state.hearts + 1;
    const newEarned = state.heartsEarnedToday + 1;
    setState(prev => ({ ...prev, hearts: newHearts, heartsEarnedToday: newEarned }));

    await supabase
      .from("user_hearts")
      .update({ hearts_remaining: newHearts, hearts_earned_today: newEarned, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    return true;
  }, [user?.id, state.hearts, state.heartsEarnedToday]);

  const canEarnMore = state.heartsEarnedToday < MAX_EARN_PER_DAY && state.hearts < MAX_HEARTS;
  const isDepleted = state.hearts <= 0;

  return {
    hearts: state.hearts,
    maxHearts: state.maxHearts,
    loading: state.loading,
    isDepleted,
    canEarnMore,
    heartsEarnedToday: state.heartsEarnedToday,
    maxEarnPerDay: MAX_EARN_PER_DAY,
    loseHeart,
    earnHeart,
    refresh: loadHearts,
  };
};
