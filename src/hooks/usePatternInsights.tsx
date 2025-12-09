import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PatternInsight {
  id: string;
  pattern_id: string;
  pattern_name: string;
  insight_text: string;
  difficulty: string;
  category: string;
}

export const usePatternInsights = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all pattern insights
  const { data: allInsights, isLoading } = useQuery({
    queryKey: ["pattern-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pattern_insights")
        .select("*")
        .order("pattern_name");
      
      if (error) throw error;
      return data as PatternInsight[];
    },
  });

  // Fetch user's seen insights
  const { data: seenInsights } = useQuery({
    queryKey: ["user-seen-insights", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_seen_insights")
        .select("insight_id")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data.map(s => s.insight_id);
    },
    enabled: !!user?.id,
  });

  // Mark insight as seen
  const markSeenMutation = useMutation({
    mutationFn: async (insightId: string) => {
      if (!user?.id) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("user_seen_insights")
        .upsert({ user_id: user.id, insight_id: insightId }, { onConflict: "user_id,insight_id" });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-seen-insights"] });
    },
  });

  // Get a random unseen insight for a pattern
  const getUnseenInsight = (patternId: string): PatternInsight | null => {
    if (!allInsights) return null;
    
    const patternInsights = allInsights.filter(i => i.pattern_id === patternId);
    const unseenInsights = patternInsights.filter(i => !seenInsights?.includes(i.id));
    
    // If all are seen, reset and return any
    const pool = unseenInsights.length > 0 ? unseenInsights : patternInsights;
    if (pool.length === 0) return null;
    
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Get insight by pattern ID (for Trend Master)
  const getInsightByPattern = (patternId: string): string | null => {
    if (!allInsights) return null;
    const insight = allInsights.find(i => i.pattern_id === patternId);
    return insight?.insight_text || null;
  };

  return {
    allInsights,
    seenInsights,
    isLoading,
    getUnseenInsight,
    getInsightByPattern,
    markAsSeen: markSeenMutation.mutate,
  };
};
