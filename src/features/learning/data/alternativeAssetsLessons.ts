import { LessonDefinition } from './lessonTypes';

const q = (question: string, options: string[], correctIndex: number, explanation: string) => ({ question, options, correctIndex, explanation });
const s = (id: string, label: string, min: number, max: number, step: number, defaultValue: number, unit: string) => ({ id, label, min, max, step, defaultValue, unit });

const TITLES = ["Beyond Stocks & Bonds", "Real Estate Investing 101", "REITs Explained", "Gold & Precious Metals", "Commodities Basics", "Cryptocurrency Fundamentals", "NFTs & Digital Assets", "Collectibles & Tangible Assets", "ESG & Impact Investing", "Alternative Assets Challenge",
  "Rental Property Analysis", "Real Estate Syndications", "Forex Markets Introduction", "DeFi & Yield Farming", "Private Equity Overview", "Venture Capital Basics", "Hedge Fund Strategies", "Fixed Income Alternatives", "Tax Considerations for Alts", "Portfolio Allocation with Alts",
  "Advanced Crypto Strategies", "Private Credit & Direct Lending", "Infrastructure Investing", "Risk Management for Alternatives", "Alternative Assets Capstone"];

const QUOTES = [
  { text: "Diversification is the only free lunch in investing.", author: "Harry Markowitz" },
  { text: "Real estate cannot be lost or stolen, nor can it be carried away.", author: "Franklin D. Roosevelt" },
  { text: "The best investment on Earth is earth.", author: "Louis Glickman" },
  { text: "Gold is a way of going long on fear.", author: "Warren Buffett" },
  { text: "In commodities, the weights of the world are in the balance.", author: "Commodity Trading Wisdom" },
  { text: "Bitcoin is a technological tour de force.", author: "Bill Gates" },
  { text: "The value of art is in the eye of the beholder.", author: "Art Market Wisdom" },
  { text: "One man's junk is another man's treasure.", author: "Proverb" },
  { text: "Sustainability is no longer about doing less harm. It's about doing more good.", author: "Jochen Zeitz" },
  { text: "Risk and return are two sides of the same coin.", author: "Investment Principle" },
  ...Array(15).fill({ text: "Alternative investments expand opportunities but require deeper due diligence.", author: "Investment Wisdom" }),
];

export const ALTERNATIVE_ASSETS_LESSONS: LessonDefinition[] = TITLES.map((title, i) => ({
  orderIndex: i + 1, title,
  intro: { description: `Explore ${title.toLowerCase()} — alternative investments that can diversify your portfolio beyond traditional stocks and bonds.`, points: [`What ${title.toLowerCase()} are and how they work`, "Risk and return characteristics", "How to evaluate and access these investments"] },
  teach: { title: `Understanding ${title}`, content: `${title} represents a category of alternative investments that behaves differently from traditional stocks and bonds. Their primary appeal is low correlation to public markets, which can enhance portfolio diversification and reduce overall risk.`, cards: [
    { title: "How It Works", description: `The mechanics of ${title.toLowerCase()} and how investors can participate.`, icon: "🔑" },
    { title: "Risk Considerations", description: "Unique risks including illiquidity, valuation challenges, and complexity.", icon: "⚠️" },
  ]},
  interactive: i % 3 === 0 ? { type: 'slider' as const, title: `📊 ${title} Impact Analyzer`, description: "See how this allocation affects your portfolio:", sliders: [s("portfolio", "Total Portfolio", 50000, 500000, 25000, 100000, "$"), s("altPct", "Alt Allocation", 0, 30, 5, 10, "%")], calculateResult: (v: Record<string, number>) => {
      const altAmount = Math.round(v.portfolio * v.altPct / 100);
      const traditionalReturn = v.portfolio * 0.08;
      const blendedReturn = (v.portfolio - altAmount) * 0.08 + altAmount * 0.10;
      return { primary: `$${altAmount.toLocaleString()} in alternatives`, secondary: `Blended expected return: ${(blendedReturn/v.portfolio*100).toFixed(1)}% vs pure traditional: 8.0%`, insight: v.altPct > 20 ? "Heavy alt allocation — ensure you can handle illiquidity." : "Moderate allocation adds diversification without excessive complexity." };
    }}
    : i % 3 === 1 ? { type: 'drag-sort' as const, title: `📋 ${title} Due Diligence`, description: "Order these evaluation steps correctly:", items: [{ id: "understand", label: "Understand the asset class" }, { id: "risk", label: "Assess risks and liquidity" }, { id: "fees", label: "Evaluate fees and costs" }, { id: "fit", label: "Determine portfolio fit" }], correctOrder: ["understand", "risk", "fees", "fit"] }
    : { type: 'quiz' as const, title: `🎯 ${title} Knowledge Check`, description: "Test your understanding:", questions: [
      q(`What is the primary benefit of adding ${title.toLowerCase()} to a portfolio?`, ["Guaranteed higher returns", "Low correlation to stocks and bonds", "No risk at all", "Tax-free income"], 1, "The main benefit is diversification through low correlation to traditional assets."),
    ]},
  check: i % 2 === 0 ? { type: 'frq' as const, question: `Explain the key risks and benefits of investing in ${title.toLowerCase()}. Would you include this in your own portfolio? Why or why not?`, context: `Alternative investments, ${title.toLowerCase()}, diversification, risk assessment` } : { type: 'quiz' as const, questions: [q(`What should investors understand before investing in ${title.toLowerCase()}?`, ["Nothing — just invest", "Liquidity constraints and fee structures", "Only the potential returns", "How to time the market"], 1, "Understanding liquidity, fees, and risks is essential before investing in alternatives.")] },
  summary: { points: [`${title} can enhance portfolio diversification through low market correlation`, "Alternative investments often have unique risks: illiquidity, complexity, higher fees", "Due diligence is more important for alts than traditional investments", "Position sizing should reflect the higher risk and lower liquidity"], quote: QUOTES[i] || QUOTES[0] },
}));
