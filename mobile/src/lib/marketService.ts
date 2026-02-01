import { supabase } from '@/integrations/supabase/client';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
}

export interface IntradayData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const mockPrices: Record<string, number> = {
  SPY: 450.25,
  QQQ: 375.8,
  DIA: 340.5,
  AAPL: 178.5,
  MSFT: 380.2,
  GOOGL: 140.3,
  AMZN: 145.75,
  TSLA: 242.8,
  META: 352.78,
  NVDA: 495.5,
  JPM: 145.2,
  V: 245.8,
  NFLX: 485.2,
  JNJ: 152.3,
  WMT: 168.4,
  PG: 152.8,
  BAC: 32.45,
  DIS: 98.75,
};

export const marketService = {
  USE_MOCK_DATA: true,

  getMockQuote(symbol: string): StockQuote {
    const basePrice = mockPrices[symbol] || 100;
    const variation = (Math.random() - 0.5) * 2;
    const price = basePrice + variation;
    const change = variation;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      high: Number((price + Math.random() * 2).toFixed(2)),
      low: Number((price - Math.random() * 2).toFixed(2)),
      open: Number((price + (Math.random() - 0.5)).toFixed(2)),
      previousClose: Number((price - change).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    };
  },

  async getGlobalQuote(symbol: string): Promise<StockQuote> {
    if (this.USE_MOCK_DATA) {
      return this.getMockQuote(symbol);
    }

    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: {
          endpoint: '/quote',
          params: { symbol, interval: '1min' },
        },
      });

      if (error || !data) {
        return this.getMockQuote(symbol);
      }

      return {
        symbol: data.symbol,
        price: parseFloat(data.close) || 0,
        change: parseFloat(data.change) || 0,
        changePercent: parseFloat(data.percent_change) || 0,
        high: parseFloat(data.high) || 0,
        low: parseFloat(data.low) || 0,
        open: parseFloat(data.open) || 0,
        previousClose: parseFloat(data.previous_close) || 0,
        volume: parseInt(data.volume) || 0,
      };
    } catch {
      return this.getMockQuote(symbol);
    }
  },

  getMockIntradayData(symbol: string): IntradayData[] {
    const mockQuote = this.getMockQuote(symbol);
    const data: IntradayData[] = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 5 * 60000);
      const basePrice = mockQuote.price;
      const variation = (Math.random() - 0.5) * 3;
      const close = basePrice + variation;

      data.push({
        timestamp: timestamp.toISOString(),
        open: close + (Math.random() - 0.5),
        high: close + Math.random() * 2,
        low: close - Math.random() * 2,
        close,
        volume: Math.floor(Math.random() * 1000000) + 100000,
      });
    }

    return data;
  },

  async getIntradayData(symbol: string): Promise<IntradayData[]> {
    if (this.USE_MOCK_DATA) {
      return this.getMockIntradayData(symbol);
    }

    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: {
          endpoint: '/time_series',
          params: { symbol, interval: '5min', outputsize: 'compact' },
        },
      });

      if (error || !data?.values) {
        return this.getMockIntradayData(symbol);
      }

      return data.values.map((value: Record<string, string>) => ({
        timestamp: value.datetime,
        open: parseFloat(value.open),
        high: parseFloat(value.high),
        low: parseFloat(value.low),
        close: parseFloat(value.close),
        volume: parseInt(value.volume) || 0,
      }));
    } catch {
      return this.getMockIntradayData(symbol);
    }
  },

  async getMultipleQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
    const results = new Map<string, StockQuote>();

    symbols.forEach((symbol) => {
      results.set(symbol, this.getMockQuote(symbol));
    });

    return results;
  },

  getPopularSymbols(): string[] {
    return Object.keys(mockPrices);
  },
};
