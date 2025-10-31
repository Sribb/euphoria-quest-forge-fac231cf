import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback curated headlines for when API limits are hit
const fallbackNews = [
  {
    id: 1,
    title: "Federal Reserve Signals Data-Dependent Approach to Interest Rates",
    summary: "Fed officials emphasize careful monitoring of economic indicators before making policy decisions amid ongoing inflation concerns.",
    source: "Reuters",
    url: "https://www.reuters.com/markets/us/",
    time: "2 hours ago",
    impact: "high" as const,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: "Tech Giants Report Strong Earnings on AI Innovation",
    summary: "Major technology companies exceed Wall Street expectations as artificial intelligence investments drive revenue growth.",
    source: "CNBC",
    url: "https://www.cnbc.com/technology/",
    time: "3 hours ago",
    impact: "high" as const,
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: "U.S. Job Market Shows Resilience with Steady Growth",
    summary: "Latest employment data reveals continued strength in labor markets, with unemployment remaining near historic lows.",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/economics",
    time: "5 hours ago",
    impact: "medium" as const,
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: "Global Energy Markets Stabilize After Supply Concerns",
    summary: "Oil and natural gas prices find equilibrium as production increases offset geopolitical tensions.",
    source: "MarketWatch",
    url: "https://www.marketwatch.com/investing/commodities",
    time: "6 hours ago",
    impact: "medium" as const,
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: "Retail Sales Beat Forecasts, Consumer Spending Remains Strong",
    summary: "Monthly retail figures show robust consumer demand continuing, supporting economic growth outlook.",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/economics",
    time: "8 hours ago",
    impact: "high" as const,
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  time_published: string;
  overall_sentiment_score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for cached news (cache for 6 hours)
    const { data: cachedData } = await supabase
      .from('news_cache')
      .select('*')
      .single();

    const now = new Date();
    const cacheExpiry = cachedData?.updated_at 
      ? new Date(new Date(cachedData.updated_at).getTime() + 6 * 60 * 60 * 1000)
      : null;

    // Return cached data if still valid
    if (cachedData && cacheExpiry && now < cacheExpiry) {
      console.log('Returning cached news data');
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: cachedData.news_items,
          cached: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Try to fetch fresh data from API
    const apiKey = Deno.env.get('Alpha_vantage_api_key');
    
    if (!apiKey) {
      console.log('API key not configured, using fallback news');
      return new Response(
        JSON.stringify({ success: true, data: fallbackNews, fallback: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log('Fetching fresh news from Alpha Vantage');
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy_macro,finance&limit=10&apikey=${apiKey}`
    );

    if (!response.ok) {
      console.error('API request failed:', response.statusText);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Check for rate limit or API errors
    if (data.Information || data.Note) {
      const errorMsg = data.Information || data.Note;
      console.log('API limit reached, using fallback:', errorMsg);
      
      // Return fallback data instead of erroring
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: fallbackNews, 
          fallback: true,
          message: 'Using curated headlines due to API rate limits'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!data.feed || !Array.isArray(data.feed)) {
      throw new Error('Invalid response format from API');
    }

    // Transform the data to match our frontend format
    const newsItems = data.feed.slice(0, 8).map((item: NewsItem, index: number) => {
      const publishedDate = new Date(
        `${item.time_published.slice(0, 4)}-${item.time_published.slice(4, 6)}-${item.time_published.slice(6, 8)}T${item.time_published.slice(9, 11)}:${item.time_published.slice(11, 13)}:${item.time_published.slice(13, 15)}Z`
      );

      // Determine impact based on sentiment score
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

    // Cache the fresh data
    try {
      await supabase
        .from('news_cache')
        .upsert({ 
          id: 1, 
          news_items: newsItems,
          updated_at: new Date().toISOString()
        });
      console.log('News cached successfully');
    } catch (cacheError) {
      console.error('Failed to cache news:', cacheError);
      // Continue even if caching fails
    }

    return new Response(
      JSON.stringify({ success: true, data: newsItems, cached: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Return fallback data instead of error
    console.log('Error occurred, using fallback headlines');
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: fallbackNews,
        fallback: true,
        message: 'Using curated headlines due to technical issues'
      }),
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
