import { supabase } from "@/integrations/supabase/client";

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 60s

export async function callFinnhub(endpoint: string, params: Record<string, string> = {}) {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { data: cached.data, fresh: false };
  }

  const { data, error } = await supabase.functions.invoke('get-market-data', {
    body: { endpoint, params },
  });

  if (error) throw new Error(error.message || 'Failed to fetch market data');
  if (data?.error) {
    if (data.retryAfter) throw new Error(`RATE_LIMIT:${data.retryAfter}`);
    throw new Error(data.message || 'Finnhub API error');
  }

  cache.set(cacheKey, { data, timestamp: Date.now() });
  return { data, fresh: true };
}

export interface FinnhubQuote {
  c: number; d: number; dp: number; h: number; l: number; o: number; pc: number;
}

export interface CompanyProfile {
  name: string; ticker: string; logo: string; finnhubIndustry: string;
  marketCapitalization: number; exchange: string; weburl: string;
}

export interface SearchResult {
  symbol: string; description: string; type: string;
}

export interface NewsArticle {
  headline: string; source: string; datetime: number; url: string; image: string; summary: string;
}

export interface Recommendation {
  buy: number; hold: number; sell: number; strongBuy: number; strongSell: number; period: string;
}

export interface BasicMetrics {
  '52WeekHigh': number; '52WeekLow': number; beta: number;
  '10DayAverageTradingVolume': number; peNormalizedAnnual: number;
}

export async function searchSymbol(query: string) {
  const { data } = await callFinnhub('search', { q: query, exchange: 'US' });
  return ((data?.result || []) as SearchResult[]).filter((r: any) => r.type === 'Common Stock').slice(0, 6);
}

export async function getQuote(symbol: string) {
  const result = await callFinnhub('quote', { symbol });
  return { ...(result.data as FinnhubQuote), _fresh: result.fresh };
}

export async function getCompanyProfile(symbol: string) {
  const { data } = await callFinnhub('stock/profile2', { symbol });
  return data as CompanyProfile;
}

export async function getBasicMetrics(symbol: string) {
  const { data } = await callFinnhub('stock/metric', { symbol, metric: 'all' });
  return (data?.metric || {}) as BasicMetrics;
}

export async function getCompanyNews(symbol: string) {
  const today = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const { data } = await callFinnhub('company-news', { symbol, from, to: today });
  return ((data || []) as NewsArticle[]).slice(0, 5);
}

export async function getRecommendations(symbol: string) {
  const { data } = await callFinnhub('stock/recommendation', { symbol });
  return (data as Recommendation[])?.[0] || null;
}

// Ticker color hash for logo fallback
export function tickerColor(ticker: string): string {
  const colors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#FDCB6E', '#E84393', '#00CEC9', '#2D3436'];
  let hash = 0;
  for (let i = 0; i < ticker.length; i++) hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
