import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getWeekStart, LEAGUE_SIZE } from "../constants";

export interface LeaderboardEntry {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  xp: number;
  level: number;
  rank: number;
  previousRank: number | null;
  isCurrentUser: boolean;
}

export type LeaderboardScope = "class" | "global" | "league";

export function useLeaderboard(scope: LeaderboardScope, classId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const weekStart = getWeekStart();

  // Ensure current user has a league entry for this week
  const ensureLeagueEntry = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      const { data: existing } = await supabase
        .from("weekly_leagues")
        .select("id")
        .eq("user_id", user.id)
        .eq("week_start", weekStart)
        .maybeSingle();

      if (!existing) {
        // Get last week's division for continuity
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastWeekStart = getWeekStart(lastWeek);

        const { data: prev } = await supabase
          .from("weekly_leagues")
          .select("division, league_group, rank_in_league")
          .eq("user_id", user.id)
          .eq("week_start", lastWeekStart)
          .maybeSingle();

        let division = "bronze";
        let leagueGroup = Math.floor(Math.random() * 100) + 1;

        if (prev) {
          // Determine promotion/demotion
          const prevRank = prev.rank_in_league ?? LEAGUE_SIZE;
          if (prevRank <= 10) {
            // Promote
            const divisions = ["bronze", "silver", "gold", "diamond"];
            const idx = divisions.indexOf(prev.division);
            division = divisions[Math.min(idx + 1, 3)];
          } else if (prevRank > LEAGUE_SIZE - 5) {
            // Demote
            const divisions = ["bronze", "silver", "gold", "diamond"];
            const idx = divisions.indexOf(prev.division);
            division = divisions[Math.max(idx - 1, 0)];
          } else {
            division = prev.division;
          }
          leagueGroup = prev.league_group;
        }

        await supabase.from("weekly_leagues").insert({
          user_id: user.id,
          week_start: weekStart,
          division,
          league_group: leagueGroup,
          weekly_xp: 0,
        });
      }
    },
  });

  useEffect(() => {
    if (user?.id) ensureLeagueEntry.mutate();
  }, [user?.id]);

  // Fetch class leaderboard
  const classQuery = useQuery({
    queryKey: ["leaderboard", "class", classId],
    queryFn: async () => {
      if (!classId) return [];
      const { data: members } = await supabase
        .from("class_members")
        .select("student_id")
        .eq("class_id", classId);

      if (!members?.length) return [];
      const studentIds = members.map((m) => m.student_id);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, experience_points, level")
        .in("id", studentIds)
        .order("experience_points", { ascending: false });

      return (profiles || []).map((p, i) => ({
        userId: p.id,
        displayName: p.display_name,
        avatarUrl: p.avatar_url,
        xp: p.experience_points,
        level: p.level,
        rank: i + 1,
        previousRank: null,
        isCurrentUser: p.id === user?.id,
      }));
    },
    enabled: scope === "class" && !!classId,
  });

  // Fetch global leaderboard (top 100)
  const globalQuery = useQuery({
    queryKey: ["leaderboard", "global"],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, experience_points, level")
        .order("experience_points", { ascending: false })
        .limit(100);

      return (profiles || []).map((p, i) => ({
        userId: p.id,
        displayName: p.display_name,
        avatarUrl: p.avatar_url,
        xp: p.experience_points,
        level: p.level,
        rank: i + 1,
        previousRank: null,
        isCurrentUser: p.id === user?.id,
      }));
    },
    enabled: scope === "global",
  });

  // Fetch league leaderboard
  const leagueQuery = useQuery({
    queryKey: ["leaderboard", "league", weekStart],
    queryFn: async () => {
      if (!user?.id) return { entries: [], userDivision: "bronze", leagueGroup: 1 };

      // Get current user's league info
      const { data: myLeague } = await supabase
        .from("weekly_leagues")
        .select("*")
        .eq("user_id", user.id)
        .eq("week_start", weekStart)
        .maybeSingle();

      if (!myLeague) return { entries: [], userDivision: "bronze", leagueGroup: 1 };

      // Get all users in same division + league group this week
      const { data: leagueMembers } = await supabase
        .from("weekly_leagues")
        .select("user_id, weekly_xp, rank_in_league, previous_rank")
        .eq("week_start", weekStart)
        .eq("division", myLeague.division)
        .eq("league_group", myLeague.league_group)
        .order("weekly_xp", { ascending: false })
        .limit(LEAGUE_SIZE);

      if (!leagueMembers?.length) return { entries: [], userDivision: myLeague.division, leagueGroup: myLeague.league_group };

      const userIds = leagueMembers.map((m) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, experience_points, level")
        .in("id", userIds);

      const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

      const entries: LeaderboardEntry[] = leagueMembers.map((m, i) => {
        const profile = profileMap.get(m.user_id);
        return {
          userId: m.user_id,
          displayName: profile?.display_name || null,
          avatarUrl: profile?.avatar_url || null,
          xp: m.weekly_xp,
          level: profile?.level || 1,
          rank: i + 1,
          previousRank: m.previous_rank,
          isCurrentUser: m.user_id === user?.id,
        };
      });

      return { entries, userDivision: myLeague.division, leagueGroup: myLeague.league_group };
    },
    enabled: scope === "league" && !!user?.id,
  });

  // Real-time subscription for profile XP changes
  useEffect(() => {
    const channel = supabase
      .channel("leaderboard-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, () => {
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "weekly_leagues" }, () => {
        queryClient.invalidateQueries({ queryKey: ["leaderboard", "league"] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  // Get user's own classes for the class scope selector
  const { data: userClasses } = useQuery({
    queryKey: ["user-classes", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: memberships } = await supabase
        .from("class_members")
        .select("class_id")
        .eq("student_id", user.id);

      if (!memberships?.length) return [];
      const classIds = memberships.map((m) => m.class_id);

      const { data: classes } = await supabase
        .from("classes")
        .select("id, class_name")
        .in("id", classIds);

      return classes || [];
    },
    enabled: !!user?.id,
  });

  const data = useMemo(() => {
    if (scope === "class") return classQuery.data || [];
    if (scope === "global") return globalQuery.data || [];
    if (scope === "league") return (leagueQuery.data as any)?.entries || [];
    return [];
  }, [scope, classQuery.data, globalQuery.data, leagueQuery.data]);

  const isLoading =
    scope === "class" ? classQuery.isLoading :
    scope === "global" ? globalQuery.isLoading :
    leagueQuery.isLoading;

  return {
    entries: data as LeaderboardEntry[],
    isLoading,
    userClasses: userClasses || [],
    leagueMeta: scope === "league" ? {
      division: (leagueQuery.data as any)?.userDivision || "bronze",
      leagueGroup: (leagueQuery.data as any)?.leagueGroup || 1,
    } : null,
  };
}
