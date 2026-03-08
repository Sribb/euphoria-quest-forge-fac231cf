import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const idToken = params.get("id_token");
    const state = params.get("state");

    if (!idToken) {
      return new Response("Missing id_token", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Decode JWT header to get kid
    const [headerB64, payloadB64] = idToken.split(".");
    const header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));

    const iss = payload.iss;
    const aud = payload.aud;
    const clientId = Array.isArray(aud) ? aud[0] : aud;

    // Look up platform
    const { data: platforms } = await admin
      .from("lti_platforms")
      .select("*")
      .eq("issuer", iss)
      .eq("client_id", clientId);

    if (!platforms || platforms.length === 0) {
      return new Response("Unknown platform", { status: 403 });
    }

    const platform = platforms[0];

    // Verify nonce
    const nonce = payload.nonce;
    if (nonce) {
      const { data: nonceRecord } = await admin
        .from("lti_nonces")
        .select("id")
        .eq("nonce", nonce)
        .eq("platform_id", platform.id)
        .single();

      if (!nonceRecord) {
        return new Response("Invalid nonce - possible replay attack", { status: 403 });
      }

      // Delete used nonce
      await admin.from("lti_nonces").delete().eq("id", nonceRecord.id);
    }

    // Verify JWT signature using platform's JWKS
    const verified = await verifyJwtWithJwks(idToken, platform.jwks_url, header.kid);
    if (!verified) {
      return new Response("JWT verification failed", { status: 403 });
    }

    // Determine message type
    const messageType = payload["https://purl.imsglobal.org/spec/lti/claim/message_type"];

    if (messageType === "LtiDeepLinkingRequest") {
      return handleDeepLinking(payload, platform, supabaseUrl);
    }

    // Regular resource link launch
    return handleResourceLaunch(payload, platform, admin, supabaseUrl);
  } catch (err) {
    console.error("LTI launch error:", err);
    return new Response(`Launch error: ${err.message}`, { status: 500 });
  }
});

async function verifyJwtWithJwks(token: string, jwksUrl: string, kid: string): Promise<boolean> {
  try {
    const response = await fetch(jwksUrl);
    const jwks = await response.json();
    const key = jwks.keys.find((k: any) => k.kid === kid);

    if (!key) {
      console.error("Key not found in JWKS for kid:", kid);
      return false;
    }

    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      key,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const [headerB64, payloadB64, signatureB64] = token.split(".");
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlDecode(signatureB64);

    return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, signature, data);
  } catch (err) {
    console.error("JWT verification error:", err);
    return false;
  }
}

function base64UrlDecode(str: string): ArrayBuffer {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function handleDeepLinking(payload: any, platform: any, supabaseUrl: string): Response {
  const deepLinkSettings = payload["https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings"];
  const returnUrl = deepLinkSettings?.deep_link_return_url;

  // Redirect to our content picker UI with context
  const pickerUrl = new URL(`${supabaseUrl}/functions/v1/lti-content-picker`);
  pickerUrl.searchParams.set("platform_id", platform.id);
  pickerUrl.searchParams.set("return_url", returnUrl || "");
  pickerUrl.searchParams.set("educator_id", platform.educator_id);
  pickerUrl.searchParams.set("accept_types", JSON.stringify(deepLinkSettings?.accept_types || []));
  pickerUrl.searchParams.set("deployment_id", payload["https://purl.imsglobal.org/spec/lti/claim/deployment_id"] || "");

  return Response.redirect(pickerUrl.toString(), 302);
}

async function handleResourceLaunch(payload: any, platform: any, admin: any, supabaseUrl: string): Promise<Response> {
  const customParams = payload["https://purl.imsglobal.org/spec/lti/claim/custom"] || {};
  const contentType = customParams.content_type || "lesson";
  const contentId = customParams.content_id || "1";
  const pathway = customParams.pathway || "investing";
  const scoringMode = customParams.scoring_mode || "score";

  // AGS endpoint for grade passback
  const agsEndpoint = payload["https://purl.imsglobal.org/spec/lti-ags/claim/endpoint"];
  const lineitemUrl = agsEndpoint?.lineitem;
  const lineitemsUrl = agsEndpoint?.lineitems;

  const ltiUserId = payload.sub;

  // Create launch record
  const { data: launch } = await admin.from("lti_launches").insert({
    platform_id: platform.id,
    user_id: platform.educator_id, // Will be updated when student authenticates
    content_type: contentType,
    content_id: contentId,
    scoring_mode: scoringMode,
    lineitem_url: lineitemUrl || null,
    ags_endpoint: lineitemsUrl || null,
    ags_token_url: platform.auth_token_url,
    lti_user_id: ltiUserId,
  }).select("id").single();

  // Redirect to the app with LTI context
  const appUrl = new URL(supabaseUrl.replace(".supabase.co", ".lovable.app"));
  // Build the actual app URL based on content type
  let targetPath: string;
  if (contentType === "simulator") {
    targetPath = "/app/trading";
  } else {
    targetPath = `/app/learn/${pathway}/${contentId}`;
  }

  const redirectUrl = new URL(targetPath, appUrl.origin.replace("xhruetneyvdpryihwolq.supabase.co", "euphoria-quest-forge.lovable.app"));
  if (launch?.id) {
    redirectUrl.searchParams.set("lti_launch_id", launch.id);
  }

  return Response.redirect(redirectUrl.toString(), 302);
}
