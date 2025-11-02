import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWELVE_DATA_API_KEY = Deno.env.get('TWELVE_DATA_API_KEY');
const TWELVE_DATA_BASE_URL = 'https://api.twelvedata.com';

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minute cache to minimize API calls

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Request queue to prevent rate limit issues
let requestQueue: Array<() => Promise<void>> = [];
let isProcessing = false;
const REQUEST_DELAY = 8000; // 8 seconds between batches (to stay under 8/min limit)

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const request = requestQueue.shift();
  if (request) {
    await request();
    setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, REQUEST_DELAY);
  } else {
    isProcessing = false;
  }
}

function getCacheKey(endpoint: string, params: Record<string, string>): string {
  return `${endpoint}-${JSON.stringify(params)}`;
}

function getCachedData(cacheKey: string): any | null {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`Cache hit for ${cacheKey}`);
    return cached.data;
  }
  return null;
}

function setCachedData(cacheKey: string, data: any) {
  cache.set(cacheKey, { data, timestamp: Date.now() });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, params, symbols } = await req.json();
    
    if (!endpoint) {
      throw new Error('Endpoint is required');
    }

    // Special handling for batch quotes
    if (endpoint === '/quote' && symbols && Array.isArray(symbols)) {
      const batchCacheKey = `batch-quote-${symbols.sort().join(',')}`;
      
      // Check cache first
      const cachedData = getCachedData(batchCacheKey);
      if (cachedData) {
        console.log('Returning cached batch quotes');
        return new Response(JSON.stringify(cachedData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Fetch all symbols in one request using batch endpoint
      const symbolsParam = symbols.join(',');
      const queryParams = new URLSearchParams({
        symbol: symbolsParam,
        interval: params?.interval || '1min',
        apikey: TWELVE_DATA_API_KEY!,
      });

      const url = `${TWELVE_DATA_BASE_URL}/quote?${queryParams.toString()}`;
      console.log(`Fetching batch quotes for: ${symbolsParam}`);

      const response = await fetch(url);
      const data = await response.json();

      // Check for API errors
      if (data.status === 'error' || data.code === 429) {
        console.error('Twelve Data API error (batch):', data);
        
        // Return expired cache if available
        const expiredCache = cache.get(batchCacheKey);
        if (expiredCache) {
          console.log('Using expired cache for batch quotes due to rate limit');
          return new Response(JSON.stringify(expiredCache.data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        throw new Error(data.message || 'API request failed');
      }

      // Cache successful response
      setCachedData(batchCacheKey, data);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Regular single symbol request
    const cacheKey = getCacheKey(endpoint, params);
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
      
      // Return cached data if available (even if expired)
      const expiredCache = cache.get(cacheKey);
      if (expiredCache) {
        console.log('Using expired cache due to rate limit');
        return new Response(JSON.stringify(expiredCache.data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(data.message || 'API request failed');
    }

    // Cache successful response
    setCachedData(cacheKey, data);

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
