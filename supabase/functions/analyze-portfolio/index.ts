import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { holdings } = await req.json();

    if (!holdings || !Array.isArray(holdings) || holdings.length === 0) {
      return new Response(JSON.stringify({ error: "Please provide at least one holding." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate & sanitize holdings
    const sanitized = holdings.slice(0, 50).map((h: any) => ({
      ticker: String(h.ticker || "").toUpperCase().slice(0, 10).replace(/[^A-Z0-9.]/g, ""),
      allocation: Math.max(0, Math.min(100, Number(h.allocation) || 0)),
    })).filter((h: any) => h.ticker.length > 0 && h.allocation > 0);

    if (sanitized.length === 0) {
      return new Response(JSON.stringify({ error: "No valid holdings provided." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const holdingsList = sanitized.map((h: any) => `${h.ticker}: ${h.allocation}%`).join(", ");

    const systemPrompt = `You are a financial education assistant for a learning platform aimed at students. Your role is to analyze a user's portfolio allocation and provide GENERAL educational feedback about diversification.

CRITICAL LEGAL RULES — you MUST follow these:
- NEVER recommend buying, selling, or holding any specific stock, ETF, or security.
- NEVER say things like "you should buy AAPL" or "sell your TSLA".
- ONLY give general diversification guidance like "you may want to diversify more across sectors" or "your portfolio is concentrated in one sector".
- Always include a disclaimer that this is for educational purposes only and is NOT financial advice.
- Focus on sector allocation, geographic diversification concepts, concentration risk, and general portfolio theory.

When analyzing, identify:
1. Which sectors the holdings likely belong to (Technology, Healthcare, Finance, Consumer, Energy, etc.)
2. Whether the portfolio is concentrated or diversified across sectors
3. General educational commentary on diversification principles
4. A simple risk assessment (concentrated, moderate, well-diversified)

Format your response in clear sections with headers. Use markdown formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Please analyze this portfolio allocation and provide educational feedback on diversification:\n\nHoldings: ${holdingsList}\n\nTotal allocation: ${sanitized.reduce((s: number, h: any) => s + h.allocation, 0)}%`,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service credits depleted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis failed. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("analyze-portfolio error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
