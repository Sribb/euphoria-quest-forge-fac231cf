import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWELVE_DATA_API_KEY = Deno.env.get('TWELVE_DATA_API_KEY');
const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, params } = await req.json();
    
    if (!endpoint) {
      throw new Error('Endpoint is required');
    }

    // Build query string from params
    const queryParams = new URLSearchParams({
      ...params,
      apikey: TWELVE_DATA_API_KEY!,
    });

    const url = `${TWELVE_DATA_BASE_URL}${endpoint}?${queryParams.toString()}`;
    
    console.log(`Fetching from Twelve Data: ${endpoint}`, params);

    const response = await fetch(url);
    const data = await response.json();

    // Check for API errors
    if (data.status === 'error' || data.code === 429) {
      console.error('Twelve Data API error:', data);
      throw new Error(data.message || 'API request failed');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-market-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        status: 'error'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
