import { supabase } from "@/integrations/supabase/client";

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

interface TwelveDataQuote {
  symbol: string;
  name: string;
  exchange: string;
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
}

export const alphaVantageService = {
  async getGlobalQuote(symbol: string): Promise<StockQuote> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: {
          endpoint: '/quote',
          params: {
            symbol: symbol,
            interval: '1min',
          }
        }
      });

      if (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return this.getMockQuote(symbol);
      }

      // Check for API errors in response
      if (data?.status === 'error' || !data) {
        console.warn(`No data available for ${symbol}, using mock data`);
        return this.getMockQuote(symbol);
      }

      const quote = data as TwelveDataQuote;
      const price = parseFloat(quote.close);
      const previousClose = parseFloat(quote.previous_close);
      const change = parseFloat(quote.change);
      const changePercent = parseFloat(quote.percent_change);

      return {
        symbol: quote.symbol,
        price: price || 0,
        change: change || 0,
        changePercent: changePercent || 0,
        high: parseFloat(quote.high) || 0,
        low: parseFloat(quote.low) || 0,
        open: parseFloat(quote.open) || 0,
        previousClose: previousClose || 0,
        volume: parseInt(quote.volume) || 0,
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return this.getMockQuote(symbol);
    }
  },

  getMockQuote(symbol: string): StockQuote {
    const mockPrices: Record<string, number> = {
      "SPY": 450.25,
      "QQQ": 375.80,
      "DIA": 340.50,
      "AAPL": 178.50,
      "MSFT": 380.20,
      "GOOGL": 140.30,
      "AMZN": 145.75,
      "TSLA": 242.80,
      "META": 352.78,
      "NVDA": 495.50,
      "JPM": 145.20,
      "V": 245.80,
    };
    
    const basePrice = mockPrices[symbol] || 100;
    const change = (Math.random() - 0.5) * 5;
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      price: basePrice,
      change,
      changePercent,
      high: basePrice + Math.random() * 3,
      low: basePrice - Math.random() * 3,
      open: basePrice + (Math.random() - 0.5) * 2,
      previousClose: basePrice - change,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    };
  },

  async getIntradayData(symbol: string, interval: "1min" | "5min" | "15min" | "30min" | "60min" = "5min"): Promise<IntradayData[]> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: {
          endpoint: '/time_series',
          params: {
            symbol: symbol,
            interval: interval,
            outputsize: 'compact',
          }
        }
      });

      if (error || data?.status === 'error') {
        console.error(`Error fetching intraday data for ${symbol}:`, error || data);
        throw new Error('Failed to fetch intraday data');
      }

      // Twelve Data returns time series in 'values' array
      if (data?.values && Array.isArray(data.values)) {
        return data.values.map((value: any) => ({
          timestamp: value.datetime,
          open: parseFloat(value.open),
          high: parseFloat(value.high),
          low: parseFloat(value.low),
          close: parseFloat(value.close),
          volume: parseInt(value.volume) || 0,
        }));
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error fetching intraday data:", error);
      throw error;
    }
  },

  async searchSymbol(keywords: string): Promise<Array<{ symbol: string; name: string }>> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: {
          endpoint: '/symbol_search',
          params: {
            symbol: keywords,
          }
        }
      });

      if (error || data?.status === 'error') {
        console.error('Error searching symbol:', error || data);
        return [];
      }

      // Twelve Data returns search results in 'data' array
      if (data?.data && Array.isArray(data.data)) {
        return data.data.map((match: any) => ({
          symbol: match.symbol,
          name: match.instrument_name || match.symbol,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error searching symbol:", error);
      return [];
    }
  },

  async getMarketIndex(symbol: string): Promise<StockQuote | null> {
    try {
      return await this.getGlobalQuote(symbol);
    } catch (error) {
      console.error(`Error fetching market index ${symbol}:`, error);
      return null;
    }
  },

  async getMultipleQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
    const results = new Map<string, StockQuote>();
    
    // Fetch all quotes in parallel for better performance
    const quotePromises = symbols.map(symbol => 
      this.getGlobalQuote(symbol)
        .then(quote => ({ symbol, quote }))
        .catch(error => {
          console.error(`Failed to fetch ${symbol}:`, error);
          return { symbol, quote: this.getMockQuote(symbol) };
        })
    );
    
    const quotes = await Promise.all(quotePromises);
    
    quotes.forEach(({ symbol, quote }) => {
      results.set(symbol, quote);
    });
    
    return results;
  },

  // New method to get current price only (faster for quick updates)
  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: {
          endpoint: '/price',
          params: {
            symbol: symbol,
          }
        }
      });

      if (error || data?.status === 'error' || !data?.price) {
        console.error(`Error fetching price for ${symbol}:`, error || data);
        const mockQuote = this.getMockQuote(symbol);
        return mockQuote.price;
      }

      return parseFloat(data.price);
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      const mockQuote = this.getMockQuote(symbol);
      return mockQuote.price;
    }
  },
};
