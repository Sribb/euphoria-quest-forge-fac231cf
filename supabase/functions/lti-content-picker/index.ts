import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const url = new URL(req.url);
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  // POST = teacher selected content, return deep linking response
  if (req.method === "POST") {
    return handleContentSelection(req, admin, supabaseUrl);
  }

  // GET = render content picker UI
  const platformId = url.searchParams.get("platform_id") || "";
  const returnUrl = url.searchParams.get("return_url") || "";
  const educatorId = url.searchParams.get("educator_id") || "";
  const deploymentId = url.searchParams.get("deployment_id") || "";

  // Fetch available lessons
  const { data: lessons } = await admin
    .from("lessons")
    .select("id, title, description, pathway, order_index, difficulty")
    .order("pathway")
    .order("order_index");

  const pathways = [
    { id: "investing", name: "Investing", color: "#10b981" },
    { id: "personal-finance", name: "Personal Finance", color: "#3b82f6" },
    { id: "corporate-finance", name: "Corporate Finance", color: "#8b5cf6" },
    { id: "trading", name: "Trading", color: "#f59e0b" },
    { id: "alternative-assets", name: "Alternative Assets", color: "#ef4444" },
  ];

  const lessonsByPathway: Record<string, any[]> = {};
  (lessons || []).forEach((l: any) => {
    const p = l.pathway || "investing";
    if (!lessonsByPathway[p]) lessonsByPathway[p] = [];
    lessonsByPathway[p].push(l);
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Select Euphoria Content</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .header { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 24px 32px; border-bottom: 1px solid #334155; }
    .header h1 { font-size: 24px; font-weight: 700; color: #f1f5f9; }
    .header p { color: #94a3b8; margin-top: 4px; font-size: 14px; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .tab { padding: 8px 16px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #94a3b8; cursor: pointer; font-size: 13px; transition: all 0.2s; }
    .tab.active { border-color: var(--color); color: #f1f5f9; background: rgba(255,255,255,0.05); }
    .tab:hover { border-color: #475569; }
    .content-grid { display: grid; gap: 12px; }
    .content-card { padding: 16px; border-radius: 12px; border: 2px solid #334155; background: #1e293b; cursor: pointer; transition: all 0.2s; }
    .content-card:hover { border-color: #60a5fa; background: #1e3a5f; }
    .content-card.selected { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
    .content-card h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
    .content-card p { font-size: 13px; color: #94a3b8; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-left: 8px; }
    .scoring-toggle { display: flex; gap: 12px; margin-top: 12px; }
    .scoring-option { padding: 6px 12px; border-radius: 6px; border: 1px solid #475569; font-size: 12px; cursor: pointer; color: #94a3b8; }
    .scoring-option.active { border-color: #3b82f6; color: #60a5fa; background: rgba(59,130,246,0.1); }
    .footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 16px 32px; background: #1e293b; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .btn { padding: 10px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-primary:hover { background: #2563eb; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-cancel { background: transparent; color: #94a3b8; border: 1px solid #475569; }
    .selected-count { color: #94a3b8; font-size: 14px; }
    .pathway-section { display: none; }
    .pathway-section.visible { display: block; }
    .sim-card { padding: 20px; border-radius: 12px; border: 2px solid #334155; background: linear-gradient(135deg, #1e293b, #0f172a); cursor: pointer; transition: all 0.2s; }
    .sim-card:hover { border-color: #f59e0b; }
    .sim-card.selected { border-color: #f59e0b; background: rgba(245,158,11,0.05); }
  </style>
</head>
<body>
  <div class="header">
    <h1>📚 Select Euphoria Content</h1>
    <p>Choose lessons or activities to embed in your Canvas course</p>
  </div>
  <div class="container">
    <div class="tabs">
      ${pathways.map(p => `<div class="tab" data-pathway="${p.id}" style="--color:${p.color}" onclick="showPathway('${p.id}')">${p.name}</div>`).join("")}
      <div class="tab" data-pathway="simulator" style="--color:#f59e0b" onclick="showPathway('simulator')">🎮 Trading Simulator</div>
    </div>

    ${pathways.map(p => `
      <div class="pathway-section" id="section-${p.id}">
        <div class="content-grid">
          ${(lessonsByPathway[p.id] || []).map((l: any) => `
            <div class="content-card" data-type="lesson" data-id="${l.order_index}" data-pathway="${p.id}" data-title="${l.title}" onclick="toggleSelect(this)">
              <h3>${l.title} <span class="badge" style="background:${p.color}20;color:${p.color}">${l.difficulty}</span></h3>
              <p>${l.description}</p>
              <div class="scoring-toggle">
                <div class="scoring-option active" data-mode="score" onclick="event.stopPropagation();setScoringMode(this,'score')">📊 Score-based</div>
                <div class="scoring-option" data-mode="completion" onclick="event.stopPropagation();setScoringMode(this,'completion')">✅ Completion</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("")}

    <div class="pathway-section" id="section-simulator">
      <div class="content-grid">
        <div class="sim-card" data-type="simulator" data-id="market-sim" data-pathway="" data-title="AI Trading Simulator" onclick="toggleSelect(this)">
          <h3>🤖 AI Trading Simulator</h3>
          <p>Practice trading with AI-driven market scenarios, compete against AI traders, and learn risk management in a simulated environment.</p>
          <div class="scoring-toggle">
            <div class="scoring-option active" data-mode="score" onclick="event.stopPropagation();setScoringMode(this,'score')">📊 Portfolio performance</div>
            <div class="scoring-option" data-mode="completion" onclick="event.stopPropagation();setScoringMode(this,'completion')">✅ Participation</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span class="selected-count" id="selectedCount">0 items selected</span>
    <div style="display:flex;gap:12px">
      <button class="btn btn-cancel" onclick="window.close()">Cancel</button>
      <button class="btn btn-primary" id="submitBtn" disabled onclick="submitSelection()">Add to Canvas</button>
    </div>
  </div>

  <form id="submitForm" method="POST" action="${supabaseUrl}/functions/v1/lti-content-picker">
    <input type="hidden" name="platform_id" value="${platformId}">
    <input type="hidden" name="return_url" value="${returnUrl}">
    <input type="hidden" name="educator_id" value="${educatorId}">
    <input type="hidden" name="deployment_id" value="${deploymentId}">
    <input type="hidden" name="selections" id="selectionsInput" value="[]">
  </form>

  <script>
    let activePathway = null;
    function showPathway(id) {
      document.querySelectorAll('.pathway-section').forEach(s => s.classList.remove('visible'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById('section-' + id)?.classList.add('visible');
      document.querySelector('[data-pathway="' + id + '"]')?.classList.add('active');
      activePathway = id;
    }
    showPathway('${pathways[0].id}');

    function toggleSelect(el) {
      el.classList.toggle('selected');
      updateCount();
    }

    function setScoringMode(el, mode) {
      const toggle = el.closest('.scoring-toggle');
      toggle.querySelectorAll('.scoring-option').forEach(o => o.classList.remove('active'));
      el.classList.add('active');
    }

    function updateCount() {
      const selected = document.querySelectorAll('.content-card.selected, .sim-card.selected');
      document.getElementById('selectedCount').textContent = selected.length + ' item' + (selected.length !== 1 ? 's' : '') + ' selected';
      document.getElementById('submitBtn').disabled = selected.length === 0;
    }

    function submitSelection() {
      const selected = document.querySelectorAll('.content-card.selected, .sim-card.selected');
      const items = Array.from(selected).map(el => ({
        type: el.dataset.type,
        id: el.dataset.id,
        pathway: el.dataset.pathway,
        title: el.dataset.title,
        scoringMode: el.querySelector('.scoring-option.active')?.dataset.mode || 'score'
      }));
      document.getElementById('selectionsInput').value = JSON.stringify(items);
      document.getElementById('submitForm').submit();
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});

async function handleContentSelection(req: Request, admin: any, supabaseUrl: string): Promise<Response> {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const platformId = params.get("platform_id") || "";
  const returnUrl = params.get("return_url") || "";
  const educatorId = params.get("educator_id") || "";
  const deploymentId = params.get("deployment_id") || "";
  const selections = JSON.parse(params.get("selections") || "[]");

  if (!returnUrl || selections.length === 0) {
    return new Response("Missing return URL or selections", { status: 400 });
  }

  // Get platform info
  const { data: platform } = await admin
    .from("lti_platforms")
    .select("*")
    .eq("id", platformId)
    .single();

  if (!platform) {
    return new Response("Platform not found", { status: 404 });
  }

  // Get our signing key
  const { data: keys } = await admin
    .from("lti_keys")
    .select("kid, private_key_pem")
    .eq("is_active", true)
    .limit(1);

  if (!keys || keys.length === 0) {
    return new Response("No signing key available", { status: 500 });
  }

  const signingKey = keys[0];
  const launchUrl = `${supabaseUrl}/functions/v1/lti-launch`;

  // Build content items
  const contentItems = selections.map((s: any) => ({
    type: "ltiResourceLink",
    title: s.title,
    url: launchUrl,
    custom: {
      content_type: s.type,
      content_id: s.id,
      pathway: s.pathway || "",
      scoring_mode: s.scoringMode || "score",
    },
    lineItem: {
      scoreMaximum: 100,
      label: s.title,
      resourceId: `euphoria-${s.type}-${s.id}`,
    },
  }));

  // Build deep linking response JWT
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    iss: platform.client_id,
    aud: platform.issuer,
    iat: now,
    exp: now + 300,
    nonce: crypto.randomUUID(),
    "https://purl.imsglobal.org/spec/lti/claim/message_type": "LtiDeepLinkingResponse",
    "https://purl.imsglobal.org/spec/lti/claim/version": "1.3.0",
    "https://purl.imsglobal.org/spec/lti/claim/deployment_id": deploymentId,
    "https://purl.imsglobal.org/spec/lti-dl/claim/content_items": contentItems,
  };

  const jwt = await signJwt(jwtPayload, signingKey.private_key_pem, signingKey.kid);

  // Return auto-submitting form to Canvas
  const html = `<!DOCTYPE html>
<html>
<body>
  <p>Returning to Canvas...</p>
  <form id="returnForm" method="POST" action="${returnUrl}">
    <input type="hidden" name="JWT" value="${jwt}">
  </form>
  <script>document.getElementById('returnForm').submit();</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
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
  const sigB64 = base64UrlEncode(signature);

  return `${headerB64}.${payloadB64}.${sigB64}`;
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
