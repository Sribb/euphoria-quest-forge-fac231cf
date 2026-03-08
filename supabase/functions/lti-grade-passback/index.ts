import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { launch_id, score, max_score, completion_status } = await req.json();

    if (!launch_id) {
      return new Response(JSON.stringify({ error: "launch_id required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Get launch record with platform info
    const { data: launch, error: launchError } = await admin
      .from("lti_launches")
      .select("*, lti_platforms(*)")
      .eq("id", launch_id)
      .single();

    if (launchError || !launch) {
      return new Response(JSON.stringify({ error: "Launch not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (!launch.lineitem_url) {
      // No lineitem - update local record only
      await admin.from("lti_launches").update({
        score_value: score,
        score_max: max_score || 100,
        completion_status: completion_status || "completed",
      }).eq("id", launch_id);

      return new Response(JSON.stringify({ success: true, grade_synced: false, reason: "No lineitem URL" }), {
        headers: corsHeaders,
      });
    }

    const platform = launch.lti_platforms;

    // Get OAuth2 access token for AGS
    const accessToken = await getAgsToken(platform);

    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Failed to get AGS token" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Build score payload per AGS spec
    const scorePayload: any = {
      userId: launch.lti_user_id,
      timestamp: new Date().toISOString(),
      activityProgress: completion_status === "completed" ? "Completed" : "InProgress",
      gradingProgress: score !== undefined ? "FullyGraded" : "NotReady",
    };

    if (score !== undefined) {
      scorePayload.scoreGiven = score;
      scorePayload.scoreMaximum = max_score || launch.score_max || 100;
    }

    if (launch.scoring_mode === "completion") {
      scorePayload.scoreGiven = completion_status === "completed" ? 100 : 0;
      scorePayload.scoreMaximum = 100;
      scorePayload.activityProgress = completion_status === "completed" ? "Completed" : "InProgress";
      scorePayload.gradingProgress = "FullyGraded";
    }

    // POST score to Canvas AGS
    const scoreUrl = `${launch.lineitem_url}/scores`;
    const agsResponse = await fetch(scoreUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/vnd.ims.lis.v1.score+json",
        "Accept": "application/json",
      },
      body: JSON.stringify(scorePayload),
    });

    const agsBody = await agsResponse.text();

    if (!agsResponse.ok) {
      console.error("AGS score post failed:", agsResponse.status, agsBody);
      return new Response(JSON.stringify({
        error: "Grade passback failed",
        status: agsResponse.status,
        details: agsBody,
      }), { status: 502, headers: corsHeaders });
    }

    // Update launch record
    await admin.from("lti_launches").update({
      score_value: scorePayload.scoreGiven,
      score_max: scorePayload.scoreMaximum,
      completion_status: completion_status || "completed",
      last_score_synced_at: new Date().toISOString(),
    }).eq("id", launch_id);

    return new Response(JSON.stringify({ success: true, grade_synced: true }), {
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Grade passback error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

async function getAgsToken(platform: any): Promise<string | null> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Get our private key for client assertion
    const { data: keys } = await admin
      .from("lti_keys")
      .select("kid, private_key_pem")
      .eq("is_active", true)
      .limit(1);

    if (!keys || keys.length === 0) return null;

    const signingKey = keys[0];
    const now = Math.floor(Date.now() / 1000);

    // Create client_credentials JWT assertion
    const assertionPayload = {
      iss: platform.client_id,
      sub: platform.client_id,
      aud: platform.auth_token_url,
      iat: now,
      exp: now + 300,
      jti: crypto.randomUUID(),
    };

    const jwt = await signJwt(assertionPayload, signingKey.private_key_pem, signingKey.kid);

    // Exchange for access token
    const tokenParams = new URLSearchParams({
      grant_type: "client_credentials",
      client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
      client_assertion: jwt,
      scope: "https://purl.imsglobal.org/spec/lti-ags/scope/lineitem https://purl.imsglobal.org/spec/lti-ags/scope/score https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly",
    });

    const tokenResponse = await fetch(platform.auth_token_url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    const tokenBody = await tokenResponse.text();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenResponse.status, tokenBody);
      return null;
    }

    const tokenData = JSON.parse(tokenBody);
    return tokenData.access_token;
  } catch (err) {
    console.error("AGS token error:", err);
    return null;
  }
}

async function signJwt(payload: any, privatePem: string, kid: string): Promise<string> {
  const header = { alg: "RS256", typ: "JWT", kid };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));

  const pemBody = privatePem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const keyData = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, data);
  return `${headerB64}.${payloadB64}.${base64UrlEncode(signature)}`;
}

function base64UrlEncode(input: string | ArrayBuffer): string {
  let base64: string;
  if (typeof input === "string") {
    base64 = btoa(input);
  } else {
    base64 = btoa(String.fromCharCode(...new Uint8Array(input)));
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
