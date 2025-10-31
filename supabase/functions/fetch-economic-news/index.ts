import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('Alpha_vantage_api_key');
    
    if (!apiKey) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Fetch news from Alpha Vantage NEWS_SENTIMENT endpoint
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=economy_macro,finance&limit=10&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.Information) {
      throw new Error(data.Information);
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

    return new Response(
      JSON.stringify({ success: true, data: newsItems }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch news' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
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
