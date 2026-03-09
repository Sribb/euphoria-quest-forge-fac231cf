import { supabase } from "@/integrations/supabase/client";
import { getWeekStart } from "../constants";

/**
 * Increment the user's weekly league XP. Called after any XP award.
 */
export async function addWeeklyLeagueXP(userId: string, xpAmount: number) {
  const weekStart = getWeekStart();

  // Try to update existing entry
  const { data: existing } = await supabase
    .from("weekly_leagues")
    .select("id, weekly_xp, rank_in_league")
    .eq("user_id", userId)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (existing) {
    const previousRank = existing.rank_in_league;
    await supabase
      .from("weekly_leagues")
      .update({
        weekly_xp: existing.weekly_xp + xpAmount,
        previous_rank: previousRank,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    // Create entry if it doesn't exist
    await supabase.from("weekly_leagues").insert({
      user_id: userId,
      week_start: weekStart,
      weekly_xp: xpAmount,
      division: "bronze",
      league_group: Math.floor(Math.random() * 100) + 1,
    });
  }
}
