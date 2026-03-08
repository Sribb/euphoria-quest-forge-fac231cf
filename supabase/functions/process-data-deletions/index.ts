import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Find all pending deletion requests that have passed their 30-day grace period
    const { data: pendingDeletions, error: fetchError } = await supabase
      .from("data_deletion_requests")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_purge_at", new Date().toISOString());

    if (fetchError) throw fetchError;

    if (!pendingDeletions || pendingDeletions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No deletions to process", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processed = 0;
    const errors: string[] = [];

    for (const request of pendingDeletions) {
      try {
        const studentId = request.student_id;

        // Delete all student data across tables
        const deletions = [
          supabase.from("user_lesson_progress").delete().eq("user_id", studentId),
          supabase.from("lesson_question_performance").delete().eq("user_id", studentId),
          supabase.from("ai_lesson_interactions").delete().eq("user_id", studentId),
          supabase.from("game_sessions").delete().eq("user_id", studentId),
          supabase.from("user_achievements").delete().eq("user_id", studentId),
          supabase.from("user_seen_insights").delete().eq("user_id", studentId),
          supabase.from("direct_messages").delete().or(`sender_id.eq.${studentId},receiver_id.eq.${studentId}`),
          supabase.from("comments").delete().eq("user_id", studentId),
          supabase.from("likes").delete().eq("user_id", studentId),
          supabase.from("posts").delete().eq("user_id", studentId),
          supabase.from("group_members").delete().eq("user_id", studentId),
          supabase.from("portfolio_assets").delete().in("portfolio_id",
            (await supabase.from("portfolios").select("id").eq("user_id", studentId)).data?.map(p => p.id) || []
          ),
          supabase.from("orders").delete().eq("user_id", studentId),
          supabase.from("transaction_logs").delete().eq("user_id", studentId),
          supabase.from("transactions").delete().eq("user_id", studentId),
          supabase.from("settlements").delete().eq("user_id", studentId),
          supabase.from("portfolios").delete().eq("user_id", studentId),
          supabase.from("streaks").delete().eq("user_id", studentId),
          supabase.from("user_onboarding").delete().eq("user_id", studentId),
          supabase.from("onboarding_ab_analytics").delete().eq("user_id", studentId),
          supabase.from("onboarding_ab_assignments").delete().eq("user_id", studentId),
          supabase.from("class_members").delete().eq("student_id", studentId),
        ];

        await Promise.allSettled(deletions);

        // Mark the request as purged
        await supabase
          .from("data_deletion_requests")
          .update({
            status: "purged",
            purged_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", request.id);

        processed++;
      } catch (err) {
        errors.push(`Failed to process deletion ${request.id}: ${err.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${processed} deletions`,
        processed,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
