import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, token } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Look up consent by token
    const { data: consent, error: lookupError } = await supabase
      .from("parental_consents")
      .select("*, classes(class_name)")
      .eq("consent_token", token)
      .single();

    if (lookupError || !consent) {
      return new Response(JSON.stringify({ error: "Consent not found or expired" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get student name
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", consent.student_id)
      .single();

    const studentName = profile?.display_name || "Student";
    const className = (consent as any).classes?.class_name || "Class";

    if (action === "info") {
      return new Response(
        JSON.stringify({
          studentName,
          className,
          status: consent.consent_status,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "grant") {
      await supabase
        .from("parental_consents")
        .update({
          consent_status: "granted",
          responded_at: new Date().toISOString(),
          revoked_at: null,
        })
        .eq("id", consent.id);

      return new Response(
        JSON.stringify({
          message: `Consent granted for ${studentName}. They can now fully participate in ${className} on Euphoria.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "deny") {
      await supabase
        .from("parental_consents")
        .update({
          consent_status: "denied",
          responded_at: new Date().toISOString(),
        })
        .eq("id", consent.id);

      return new Response(
        JSON.stringify({
          message: `Consent denied for ${studentName}. No data will be collected. You can change this decision at any time using this link.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "revoke") {
      await supabase
        .from("parental_consents")
        .update({
          consent_status: "revoked",
          revoked_at: new Date().toISOString(),
        })
        .eq("id", consent.id);

      return new Response(
        JSON.stringify({
          message: `Consent revoked for ${studentName}. Data collection has been stopped. Existing data will be retained unless you request deletion.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "delete") {
      // Mark deletion requested
      await supabase
        .from("parental_consents")
        .update({
          consent_status: "revoked",
          revoked_at: new Date().toISOString(),
          deletion_requested_at: new Date().toISOString(),
        })
        .eq("id", consent.id);

      // Delete student's progress data
      await supabase
        .from("user_lesson_progress")
        .delete()
        .eq("user_id", consent.student_id);

      await supabase
        .from("lesson_question_performance")
        .delete()
        .eq("user_id", consent.student_id);

      await supabase
        .from("ai_lesson_interactions")
        .delete()
        .eq("user_id", consent.student_id);

      await supabase
        .from("game_sessions")
        .delete()
        .eq("user_id", consent.student_id);

      return new Response(
        JSON.stringify({
          message: `Consent revoked and all collected data for ${studentName} has been deleted. This action cannot be undone.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
