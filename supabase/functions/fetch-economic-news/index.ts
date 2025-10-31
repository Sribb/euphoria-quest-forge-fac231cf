import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  time_published: string;
  overall_sentiment_score: number;
}

const CACHE_DURATION_HOURS = 6;

const FALLBACK_NEWS = [
  {
    id: 1,
    title: "Federal Reserve Maintains Interest Rates Amid Economic Uncertainty",
    summary: "The Federal Reserve has decided to keep interest rates steady as policymakers assess inflation trends and economic growth indicators...",
    source: "Financial Times",
    url: "#",
    time: "2 hours ago",
    impact: "high" as const,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Global Markets Show Mixed Performance on Trade Data",
    summary: "International markets responded cautiously to new trade figures, with Asian markets closing higher while European indices showed moderate declines...",
    source: "Bloomberg",
    url: "#",
    time: "4 hours ago",
    impact: "medium" as const,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Tech Sector Leads Stock Market Rally",
    summary: "Major technology companies drove market gains today, with strong earnings reports boosting investor confidence in the sector's growth prospects...",
    source: "CNBC",
    url: "#",
    time: "5 hours ago",
    impact: "medium" as const,
    publishedAt: new Date().toISOString(),
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Check cache first
    const { data: cachedData } = await supabaseClient
      .from('news_cache')
      .select('*')
      .maybeSingle();

    const now = new Date();
    const cacheAge = cachedData ? (now.getTime() - new Date(cachedData.updated_at).getTime()) / (1000 * 60 * 60) : CACHE_DURATION_HOURS + 1;

    // Return cached data if still valid
    if (cachedData && cacheAge < CACHE_DURATION_HOURS) {
      console.log('Returning cached news data');
      return new Response(
        JSON.stringify({ success: true, data: cachedData.news_items, cached: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Try to fetch fresh data
    const apiKey = Deno.env.get('Alpha_vantage_api_key');
    
    if (!apiKey) {
      console.log('No API key, using fallback data');
      return new Response(
        JSON.stringify({ success: true, data: FALLBACK_NEWS, fallback: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy_macro,finance&limit=10&apikey=${apiKey}`
    );

    if (!response.ok) {
      console.log('API request failed, using fallback');
      return new Response(
        JSON.stringify({ success: true, data: cachedData?.news_items || FALLBACK_NEWS, fallback: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const data = await response.json();

    // Handle rate limit
    if (data.Information) {
      console.log('Rate limit hit, using cached or fallback data');
      return new Response(
        JSON.stringify({ success: true, data: cachedData?.news_items || FALLBACK_NEWS, cached: !!cachedData, fallback: !cachedData }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (!data.feed || !Array.isArray(data.feed)) {
      console.log('Invalid response format, using fallback');
      return new Response(
        JSON.stringify({ success: true, data: cachedData?.news_items || FALLBACK_NEWS, fallback: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Transform the data
    const newsItems = data.feed.slice(0, 8).map((item: NewsItem, index: number) => {
      const publishedDate = new Date(
        `${item.time_published.slice(0, 4)}-${item.time_published.slice(4, 6)}-${item.time_published.slice(6, 8)}T${item.time_published.slice(9, 11)}:${item.time_published.slice(11, 13)}:${item.time_published.slice(13, 15)}Z`
      );

      let impact: "high" | "medium" | "low" = "medium";
      const sentimentScore = Math.abs(item.overall_sentiment_score);
      if (sentimentScore > 0.25) {
        impact = "high";
      } else if (sentimentScore < 0.1) {
        impact = "low";
      }

      return {
        id: index + 1,
        title: item.title,
        summary: item.summary.substring(0, 200) + (item.summary.length > 200 ? '...' : ''),
        source: item.source,
        url: item.url,
        time: getRelativeTime(publishedDate),
        impact,
        publishedAt: publishedDate.toISOString(),
      };
    });

    // Update cache
    await supabaseClient
      .from('news_cache')
      .upsert({
        id: 1,
        news_items: newsItems,
        updated_at: now.toISOString(),
      });

    return new Response(
      JSON.stringify({ success: true, data: newsItems }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Try to return cached data as last resort
    try {
      const { data: cachedData } = await supabaseClient
        .from('news_cache')
        .select('*')
        .maybeSingle();
      
      if (cachedData?.news_items) {
        return new Response(
          JSON.stringify({ success: true, data: cachedData.news_items, cached: true }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    } catch (cacheError) {
      console.error('Error fetching cache:', cacheError);
    }

    // Final fallback
    return new Response(
      JSON.stringify({ success: true, data: FALLBACK_NEWS, fallback: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
}
