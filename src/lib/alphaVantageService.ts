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
  // Use mock data by default for free tier - set to false to enable real API calls
  USE_MOCK_DATA: true,
  
  async getGlobalQuote(symbol: string): Promise<StockQuote> {
    // Always use mock data for now to avoid rate limits
    if (this.USE_MOCK_DATA) {
      return this.getMockQuote(symbol);
    }

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
      "NFLX": 485.20,
      "JNJ": 152.30,
      "WMT": 168.40,
      "PG": 152.80,
      "BAC": 32.45,
      "DIS": 98.75,
    };
    
    const basePrice = mockPrices[symbol] || 100;
    // Add small random variation to simulate market movement
    const variation = (Math.random() - 0.5) * 2; // +/- $1
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

  async getIntradayData(symbol: string, interval: "1min" | "5min" | "15min" | "30min" | "60min" = "5min"): Promise<IntradayData[]> {
    // Use mock intraday data to avoid rate limits
    if (this.USE_MOCK_DATA) {
      return this.getMockIntradayData(symbol);
    }

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
      return this.getMockIntradayData(symbol);
    }
  },

  getMockIntradayData(symbol: string): IntradayData[] {
    const mockQuote = this.getMockQuote(symbol);
    const data: IntradayData[] = [];
    const now = new Date();
    
    // Generate 30 data points going back in time
    for (let i = 29; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 5 * 60000); // 5 minute intervals
      const basePrice = mockQuote.price;
      const variation = (Math.random() - 0.5) * 3;
      const close = basePrice + variation;
      
      data.push({
        timestamp: timestamp.toISOString(),
        open: close + (Math.random() - 0.5),
        high: close + Math.random() * 2,
        low: close - Math.random() * 2,
        close: close,
        volume: Math.floor(Math.random() * 1000000) + 100000,
      });
    }
    
    return data;
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
    
    if (symbols.length === 0) return results;

    // Use mock data to avoid rate limits
    if (this.USE_MOCK_DATA) {
      symbols.forEach(symbol => {
        results.set(symbol, this.getMockQuote(symbol));
      });
      return results;
    }

    try {
      // Use batch endpoint to fetch all symbols at once (single API call)
      const { data, error } = await supabase.functions.invoke('fetch-market-data', {
        body: {
          endpoint: '/quote',
          symbols: symbols,
          params: {
            interval: '1min',
          }
        }
      });

      if (error || data?.status === 'error') {
        console.warn('Batch quote failed, using mock data for all symbols');
        // Return mock data for all symbols
        symbols.forEach(symbol => {
          results.set(symbol, this.getMockQuote(symbol));
        });
        return results;
      }

      // Handle both single and multiple symbol responses
      const quotes = Array.isArray(data) ? data : [data];
      
      quotes.forEach((quoteData: TwelveDataQuote) => {
        if (!quoteData || !quoteData.symbol) return;
        
        const price = parseFloat(quoteData.close);
        const previousClose = parseFloat(quoteData.previous_close);
        const change = parseFloat(quoteData.change);
        const changePercent = parseFloat(quoteData.percent_change);

        results.set(quoteData.symbol, {
          symbol: quoteData.symbol,
          price: price || 0,
          change: change || 0,
          changePercent: changePercent || 0,
          high: parseFloat(quoteData.high) || 0,
          low: parseFloat(quoteData.low) || 0,
          open: parseFloat(quoteData.open) || 0,
          previousClose: previousClose || 0,
          volume: parseInt(quoteData.volume) || 0,
        });
      });

      // Fill in mock data for any missing symbols
      symbols.forEach(symbol => {
        if (!results.has(symbol)) {
          results.set(symbol, this.getMockQuote(symbol));
        }
      });

    } catch (error) {
      console.error('Error fetching batch quotes:', error);
      // Return mock data for all symbols on error
      symbols.forEach(symbol => {
        results.set(symbol, this.getMockQuote(symbol));
      });
    }
    
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
