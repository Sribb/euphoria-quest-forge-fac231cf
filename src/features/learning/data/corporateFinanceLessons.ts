import { LessonDefinition } from './lessonTypes';

const q = (question: string, options: string[], correctIndex: number, explanation: string) => ({ question, options, correctIndex, explanation });
const s = (id: string, label: string, min: number, max: number, step: number, defaultValue: number, unit: string) => ({ id, label, min, max, step, defaultValue, unit });

const TITLES = ["What Is Corporate Finance?", "Reading an Income Statement", "Understanding Balance Sheets", "Cash Flow Statement Essentials", "Financial Ratios Toolkit", "Revenue Recognition", "COGS & Profit Margins", "Working Capital Management", "SEC Filings & Reports", "Corporate Finance Challenge",
  "Valuation Methods", "Capital Budgeting", "Capital Structure", "Dividend Policy", "Mergers & Acquisitions", "Corporate Governance", "Risk Management", "Financial Modeling", "Industry Analysis", "Corporate Restructuring",
  "Executive Compensation", "Forensic Accounting", "International Corporate Finance", "ESG in Corporate Strategy", "Corporate Finance Capstone"];

const QUOTES = [
  { text: "In the business world, the rearview mirror is always clearer than the windshield.", author: "Warren Buffett" },
  { text: "Revenue is vanity, profit is sanity, cash is king.", author: "Business Proverb" },
  { text: "Assets on the left, liabilities and equity on the right.", author: "Accounting Principle" },
  { text: "Cash flow is the lifeblood of any business.", author: "Richard Branson" },
  { text: "What gets measured gets managed.", author: "Peter Drucker" },
  { text: "Revenue recognition is the single most important and pervasive issue in auditing.", author: "SEC" },
  { text: "High margins attract competition; sustainable margins require moats.", author: "Business Wisdom" },
  { text: "A business that makes nothing but money is a poor business.", author: "Henry Ford" },
  { text: "Transparency is the currency of trust.", author: "Business Ethics" },
  { text: "The test of a first-rate intelligence is the ability to hold two opposed ideas at the same time.", author: "F. Scott Fitzgerald" },
  ...Array(15).fill({ text: "The goal of financial management is to maximize shareholder value.", author: "Corporate Finance Principle" }),
];

export const CORPORATE_FINANCE_LESSONS: LessonDefinition[] = TITLES.map((title, i) => ({
  orderIndex: i + 1, title,
  intro: { description: `Master the core concepts of ${title.toLowerCase()} — essential knowledge for understanding how companies make financial decisions.`, points: [`Core principles of ${title.toLowerCase()}`, "Real-world applications and examples", "How this connects to investment analysis"] },
  teach: { title: `Understanding ${title}`, content: `${title} is a fundamental concept in corporate finance that affects how companies operate, grow, and create value. Understanding this topic helps investors evaluate businesses more effectively and make better investment decisions.`, cards: [
    { title: "Key Concept", description: `The essential principles of ${title.toLowerCase()} that drive corporate decision-making.`, icon: "📊" },
    { title: "Why It Matters", description: "How this concept impacts company valuation and investment analysis.", icon: "🎯" },
    ...(i < 5 ? [{ title: "Common Pitfalls", description: "Mistakes analysts make when evaluating this aspect of a company.", icon: "⚠️" }] : []),
  ]},
  interactive: i % 3 === 0 ? { type: 'slider' as const, title: `📊 ${title} Calculator`, description: "Explore the financial impact:", sliders: [s("revenue", "Revenue ($M)", 10, 1000, 10, 100, "$M"), s("margin", "Margin %", 5, 50, 5, 20, "%")], calculateResult: (v: Record<string, number>) => ({ primary: `Profit: $${(v.revenue * v.margin / 100).toFixed(0)}M`, secondary: `On revenue of $${v.revenue}M with ${v.margin}% margin`, insight: v.margin > 25 ? "Strong margins — likely has competitive advantages." : "Thin margins — efficiency and scale are critical." }) }
    : i % 3 === 1 ? { type: 'drag-sort' as const, title: `📋 ${title} Analysis Order`, description: "Put these analysis steps in the correct order:", items: [{ id: "gather", label: "Gather financial data" }, { id: "analyze", label: "Analyze key metrics" }, { id: "compare", label: "Compare to industry peers" }, { id: "conclude", label: "Draw investment conclusions" }], correctOrder: ["gather", "analyze", "compare", "conclude"] }
    : { type: 'quiz' as const, title: `🏢 ${title} Challenge`, description: "Test your corporate finance knowledge:", questions: [q(`In ${title.toLowerCase()}, what should analysts prioritize?`, ["Following market trends", "Understanding underlying fundamentals", "Copying competitor strategies", "Short-term performance only"], 1, "Fundamental analysis of the underlying business is always the priority.")] },
  check: i % 2 === 0 ? { type: 'frq' as const, question: `Explain how ${title.toLowerCase()} affects a company's valuation and why investors should pay attention to it when evaluating stocks.`, context: `Corporate finance, ${title.toLowerCase()}, company valuation` } : { type: 'quiz' as const, questions: [q(`What is the primary goal of ${title.toLowerCase()}?`, ["Maximize short-term profits", "Create long-term shareholder value", "Minimize all risks", "Reduce employee costs"], 1, "Corporate finance aims to maximize long-term value for all stakeholders.")] },
  summary: { points: [`${title} is essential for understanding how companies operate`, "Financial analysis requires examining multiple metrics together", "Industry context matters — compare against relevant peers", "Strong fundamentals translate to better long-term investment outcomes"], quote: QUOTES[i] || QUOTES[0] },
}));
