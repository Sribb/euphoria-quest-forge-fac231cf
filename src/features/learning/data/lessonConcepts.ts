// Maps pathway + orderIndex to the key concepts taught in that lesson
// Used by spaced repetition to register concepts after lesson completion.

export interface LessonConcept {
  key: string;
  label: string;
}

const CONCEPT_MAP: Record<string, Record<number, LessonConcept[]>> = {
  investing: {
    1: [
      { key: "inv-what-is-investing", label: "What is investing?" },
      { key: "inv-risk-vs-reward", label: "Risk vs. Reward" },
    ],
    2: [
      { key: "inv-stocks-basics", label: "Stock market basics" },
      { key: "inv-shares-ownership", label: "Shares & ownership" },
    ],
    3: [
      { key: "inv-diversification", label: "Diversification" },
      { key: "inv-asset-allocation", label: "Asset allocation" },
    ],
    4: [
      { key: "inv-compound-interest", label: "Compound interest" },
      { key: "inv-time-value-money", label: "Time value of money" },
    ],
    5: [
      { key: "inv-risk-tolerance", label: "Risk tolerance" },
      { key: "inv-volatility", label: "Volatility" },
    ],
    6: [
      { key: "inv-portfolio-building", label: "Building a portfolio" },
      { key: "inv-rebalancing", label: "Portfolio rebalancing" },
    ],
    7: [
      { key: "inv-etfs", label: "ETFs & Index funds" },
      { key: "inv-mutual-funds", label: "Mutual funds" },
    ],
    8: [
      { key: "inv-bonds", label: "Bonds & fixed income" },
      { key: "inv-yield", label: "Bond yield" },
    ],
    9: [
      { key: "inv-dividends", label: "Dividends" },
      { key: "inv-dividend-reinvest", label: "Dividend reinvestment" },
    ],
    10: [
      { key: "inv-market-cycles", label: "Market cycles" },
      { key: "inv-bull-bear", label: "Bull vs. Bear markets" },
    ],
    11: [
      { key: "inv-valuation", label: "Stock valuation" },
      { key: "inv-pe-ratio", label: "P/E ratio" },
    ],
  },
  "personal-finance": {
    1: [
      { key: "pf-budgeting", label: "Budgeting basics" },
      { key: "pf-income-expenses", label: "Income vs. expenses" },
    ],
    2: [
      { key: "pf-saving-strategies", label: "Saving strategies" },
      { key: "pf-emergency-fund", label: "Emergency fund" },
    ],
    3: [
      { key: "pf-debt-management", label: "Debt management" },
      { key: "pf-interest-rates", label: "Interest rates" },
    ],
    4: [
      { key: "pf-credit-score", label: "Credit score" },
      { key: "pf-credit-report", label: "Credit report" },
    ],
    5: [
      { key: "pf-insurance", label: "Insurance basics" },
      { key: "pf-risk-protection", label: "Risk protection" },
    ],
  },
  "corporate-finance": {
    1: [
      { key: "cf-financial-statements", label: "Financial statements" },
      { key: "cf-balance-sheet", label: "Balance sheet" },
    ],
    2: [
      { key: "cf-income-statement", label: "Income statement" },
      { key: "cf-revenue-profit", label: "Revenue vs. profit" },
    ],
    3: [
      { key: "cf-cash-flow", label: "Cash flow analysis" },
      { key: "cf-working-capital", label: "Working capital" },
    ],
  },
  trading: {
    1: [
      { key: "tr-market-orders", label: "Market orders" },
      { key: "tr-limit-orders", label: "Limit orders" },
    ],
    2: [
      { key: "tr-candlestick", label: "Candlestick charts" },
      { key: "tr-support-resistance", label: "Support & resistance" },
    ],
    3: [
      { key: "tr-technical-indicators", label: "Technical indicators" },
      { key: "tr-moving-averages", label: "Moving averages" },
    ],
  },
  "trading-technical-analysis": {
    1: [
      { key: "tr-market-orders", label: "Market orders" },
      { key: "tr-limit-orders", label: "Limit orders" },
    ],
  },
  "alternative-assets": {
    1: [
      { key: "alt-real-estate", label: "Real estate investing" },
      { key: "alt-reits", label: "REITs" },
    ],
    2: [
      { key: "alt-crypto-basics", label: "Cryptocurrency basics" },
      { key: "alt-blockchain", label: "Blockchain technology" },
    ],
    3: [
      { key: "alt-commodities", label: "Commodities" },
      { key: "alt-precious-metals", label: "Precious metals" },
    ],
  },
};

export function getConceptsForLesson(pathway: string, orderIndex: number): LessonConcept[] {
  const pathwayConcepts = CONCEPT_MAP[pathway];
  if (!pathwayConcepts) return [];
  return pathwayConcepts[orderIndex] ?? [];
}
