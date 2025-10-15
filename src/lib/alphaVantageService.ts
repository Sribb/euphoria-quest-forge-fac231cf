const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

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

export const alphaVantageService = {
  async getGlobalQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await fetch(
        `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (data["Global Quote"]) {
        const quote = data["Global Quote"];
        return {
          symbol: quote["01. symbol"],
          price: parseFloat(quote["05. price"]),
          change: parseFloat(quote["09. change"]),
          changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
          high: parseFloat(quote["03. high"]),
          low: parseFloat(quote["04. low"]),
          open: parseFloat(quote["02. open"]),
          previousClose: parseFloat(quote["08. previous close"]),
          volume: parseInt(quote["06. volume"]),
        };
      }
      throw new Error("Invalid response from Alpha Vantage");
    } catch (error) {
      console.error("Error fetching quote:", error);
      throw error;
    }
  },

  async getIntradayData(symbol: string, interval: "1min" | "5min" | "15min" | "30min" | "60min" = "5min"): Promise<IntradayData[]> {
    try {
      const response = await fetch(
        `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      const timeSeriesKey = `Time Series (${interval})`;
      if (data[timeSeriesKey]) {
        const timeSeries = data[timeSeriesKey];
        return Object.entries(timeSeries).map(([timestamp, values]: [string, any]) => ({
          timestamp,
          open: parseFloat(values["1. open"]),
          high: parseFloat(values["2. high"]),
          low: parseFloat(values["3. low"]),
          close: parseFloat(values["4. close"]),
          volume: parseInt(values["5. volume"]),
        }));
      }
      throw new Error("Invalid response from Alpha Vantage");
    } catch (error) {
      console.error("Error fetching intraday data:", error);
      throw error;
    }
  },

  async searchSymbol(keywords: string): Promise<Array<{ symbol: string; name: string }>> {
    try {
      const response = await fetch(
        `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (data.bestMatches) {
        return data.bestMatches.map((match: any) => ({
          symbol: match["1. symbol"],
          name: match["2. name"],
        }));
      }
      return [];
    } catch (error) {
      console.error("Error searching symbol:", error);
      return [];
    }
  },
};
