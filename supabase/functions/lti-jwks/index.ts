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

    // Get active keys
    const { data: keys, error } = await admin
      .from("lti_keys")
      .select("kid, public_key_jwk")
      .eq("is_active", true);

    if (error) throw error;

    // If no keys exist, generate one
    if (!keys || keys.length === 0) {
      const keyPair = await crypto.subtle.generateKey(
        { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true,
        ["sign", "verify"]
      );

      const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
      const privatePkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      const privatePem = arrayBufferToPem(privatePkcs8, "PRIVATE KEY");

      const kid = crypto.randomUUID();
      const jwk = { ...publicJwk, kid, use: "sig", alg: "RS256" };

      await admin.from("lti_keys").insert({
        kid,
        public_key_jwk: jwk,
        private_key_pem: privatePem,
        is_active: true,
      });

      return new Response(JSON.stringify({ keys: [jwk] }), { headers: corsHeaders });
    }

    const jwks = keys.map((k: any) => k.public_key_jwk);
    return new Response(JSON.stringify({ keys: jwks }), { headers: corsHeaders });
  } catch (err) {
    console.error("JWKS error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

function arrayBufferToPem(buffer: ArrayBuffer, type: string): string {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const lines = base64.match(/.{1,64}/g)?.join("\n") || base64;
  return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`;
}
