import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  // LTI OIDC login initiation - Canvas redirects here first
  // We redirect back to Canvas auth endpoint with proper params
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const url = new URL(req.url);
    let params: URLSearchParams;

    if (req.method === "POST") {
      const body = await req.text();
      params = new URLSearchParams(body);
    } else {
      params = url.searchParams;
    }

    const iss = params.get("iss");
    const loginHint = params.get("login_hint");
    const targetLinkUri = params.get("target_link_uri");
    const ltiMessageHint = params.get("lti_message_hint");
    const clientId = params.get("client_id");

    if (!iss || !loginHint || !targetLinkUri) {
      return new Response("Missing required OIDC parameters", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Look up platform config
    let query = admin.from("lti_platforms").select("*").eq("issuer", iss);
    if (clientId) query = query.eq("client_id", clientId);
    const { data: platforms, error } = await query;

    if (error || !platforms || platforms.length === 0) {
      console.error("Platform not found for issuer:", iss);
      return new Response("Platform not registered", { status: 404 });
    }

    const platform = platforms[0];

    // Generate state and nonce
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();

    // Store nonce for validation
    await admin.from("lti_nonces").insert({
      nonce,
      platform_id: platform.id,
    });

    // Build auth redirect URL
    const launchUrl = `${supabaseUrl}/functions/v1/lti-launch`;
    const authParams = new URLSearchParams({
      scope: "openid",
      response_type: "id_token",
      client_id: platform.client_id,
      redirect_uri: launchUrl,
      login_hint: loginHint,
      state,
      response_mode: "form_post",
      nonce,
      prompt: "none",
    });

    if (ltiMessageHint) {
      authParams.set("lti_message_hint", ltiMessageHint);
    }

    const redirectUrl = `${platform.auth_login_url}?${authParams.toString()}`;
    return Response.redirect(redirectUrl, 302);
  } catch (err) {
    console.error("OIDC login error:", err);
    return new Response("Internal error during OIDC login", { status: 500 });
  }
});
