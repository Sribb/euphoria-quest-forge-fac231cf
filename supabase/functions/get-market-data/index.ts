import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FINNHUB_KEY = Deno.env.get('FINNHUB_KEY');
    if (!FINNHUB_KEY) {
      return new Response(JSON.stringify({ error: true, message: 'FINNHUB_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { endpoint, params } = await req.json();
    if (!endpoint) {
      return new Response(JSON.stringify({ error: true, message: 'Missing endpoint' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const searchParams = new URLSearchParams(params || {});
    searchParams.set('token', FINNHUB_KEY);
    const url = `https://finnhub.io/api/v1/${endpoint}?${searchParams.toString()}`;

    const response = await fetch(url);
    
    if (response.status === 429) {
      return new Response(JSON.stringify({ error: true, message: 'Rate limit reached', retryAfter: 30 }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: true, message: `Finnhub API error: ${response.status}` }), {
        status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: true, message: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
