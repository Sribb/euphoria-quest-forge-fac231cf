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
    const { consentId, parentEmail, consentToken } = await req.json();

    if (!consentId || !parentEmail || !consentToken) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get consent details
    const { data: consent, error: consentError } = await supabase
      .from("parental_consents")
      .select("*, classes(class_name, educator_id)")
      .eq("id", consentId)
      .single();

    if (consentError || !consent) {
      return new Response(JSON.stringify({ error: "Consent record not found" }), {
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

    const studentName = profile?.display_name || "Your child";
    const className = (consent as any).classes?.class_name || "a class";

    // Build the consent URL
    // Use the project URL from env or construct from supabase URL
    const projectId = Deno.env.get("SUPABASE_URL")?.match(/\/\/([^.]+)/)?.[1] || "";
    const appUrl = Deno.env.get("APP_URL") || `https://euphoria-quest-forge.lovable.app`;
    const consentUrl = `${appUrl}/parent-consent?token=${consentToken}`;

    // For now, log the consent URL (email sending would use a transactional email service)
    console.log(`Consent request email for ${parentEmail}:`);
    console.log(`Consent URL: ${consentUrl}`);
    console.log(`Student: ${studentName}, Class: ${className}`);

    // In production, integrate with an email service here
    // For now, we return the URL so the educator can share it manually
    return new Response(
      JSON.stringify({
        success: true,
        message: "Consent request created",
        consentUrl,
        parentEmail,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
