import { MicroLessonDefinition } from './microLessonTypes';

const CF_TITLES = ["What Is Corporate Finance?", "Reading an Income Statement", "Understanding Balance Sheets", "Cash Flow Statement Essentials", "Financial Ratios Toolkit", "Revenue Recognition", "COGS & Profit Margins", "Working Capital Management", "SEC Filings & Reports", "Corporate Finance Challenge",
  "Valuation Methods", "Capital Budgeting", "Capital Structure", "Dividend Policy", "Mergers & Acquisitions", "Corporate Governance", "Risk Management", "Financial Modeling", "Industry Analysis", "Corporate Restructuring",
  "Executive Compensation", "Forensic Accounting", "International Corp Finance", "ESG in Corporate Strategy", "Corporate Finance Capstone"];

export const CF_MICRO_LESSONS: MicroLessonDefinition[] = [
  { orderIndex: 1, title: CF_TITLES[0], screens: [
    { id: "cf1a", type: "concept", emoji: "🏢", title: "How Companies Make Money Decisions", body: "Corporate finance is about three decisions: what to invest in, how to fund it, and how to return profits to owners.", visual: { type: "highlight", items: [{ emoji: "💰", text: "Investment: Which projects to fund?" }, { emoji: "🏦", text: "Financing: Debt or equity?" }, { emoji: "💸", text: "Dividends: Return cash or reinvest?" }] } },
    { id: "cf1b", type: "match", title: "Decision → Example", pairs: [{ left: "Build a new factory", right: "Investment decision" }, { left: "Issue bonds vs. stock", right: "Financing decision" }, { left: "Pay dividends vs. buyback", right: "Distribution decision" }] },
    { id: "cf1c", type: "fill-blank", sentence: "The primary goal of corporate finance is to maximize ___.", options: ["shareholder value", "employee count", "revenue", "market share"], correctIndex: 0, explanation: "Everything in corporate finance aims to create long-term value for shareholders." },
    { id: "cf1d", type: "true-false", statement: "Companies should always choose the project with the highest revenue.", isTrue: false, explanation: "Revenue means nothing without considering costs, risk, and return on investment." },
    { id: "cf1e", type: "quiz", question: "A CFO's main job is to:", options: ["Run marketing campaigns", "Allocate capital to maximize company value", "Hire employees", "Set product prices"], correctIndex: 1, explanation: "The CFO's core job is capital allocation — deciding where to invest for maximum value." },
    { id: "cf1f", type: "summary", takeaways: ["Corporate finance = investment + financing + distribution decisions", "Goal: maximize long-term shareholder value", "Revenue alone doesn't measure success", "Capital allocation is the most important skill"], quote: { text: "Revenue is vanity, profit is sanity, cash is king.", author: "Business Proverb" } },
  ]},
  { orderIndex: 2, title: CF_TITLES[1], screens: [
    { id: "cf2a", type: "concept", emoji: "📋", title: "Revenue → Expenses → Profit", body: "The income statement shows if a company is profitable. Revenue minus all expenses equals net income.", visual: { type: "stat", value: "Bottom Line", label: "Net income = the money that's actually left" } },
    { id: "cf2b", type: "sort", title: "Income Statement Order", description: "Top to bottom", items: [{ id: "rev", label: "Revenue (sales)" }, { id: "gp", label: "Gross profit (after COGS)" }, { id: "op", label: "Operating income (after OpEx)" }, { id: "ni", label: "Net income (after taxes)" }], correctOrder: ["rev", "gp", "op", "ni"] },
    { id: "cf2c", type: "fill-blank", sentence: "Revenue minus cost of goods sold equals ___ profit.", options: ["gross", "net", "operating", "total"], correctIndex: 0, explanation: "Gross profit = revenue - COGS. It shows how much you make before operating expenses." },
    { id: "cf2d", type: "true-false", statement: "A company with growing revenue is always healthy.", isTrue: false, explanation: "Revenue can grow while profits shrink. If costs grow faster than revenue, the company is in trouble." },
    { id: "cf2e", type: "quiz", question: "Which line item matters most for evaluating profitability?", options: ["Revenue", "Gross profit", "Net income", "Total expenses"], correctIndex: 2, explanation: "Net income is the 'bottom line' — what's actually left after ALL expenses and taxes." },
    { id: "cf2f", type: "summary", takeaways: ["Income statement: Revenue → Gross → Operating → Net", "Revenue growth without profit growth is a red flag", "Net income is the true 'bottom line'", "Compare margins across years and competitors"] },
  ]},
  { orderIndex: 3, title: CF_TITLES[2], screens: [
    { id: "cf3a", type: "concept", emoji: "⚖️", title: "What a Company Owns and Owes", body: "Assets = Liabilities + Equity. The balance sheet is a snapshot of financial position at one moment in time.", visual: { type: "comparison", left: { label: "Assets (owns)", value: "Cash, property, IP" }, right: { label: "Liabilities (owes)", value: "Loans, accounts payable" } } },
    { id: "cf3b", type: "fill-blank", sentence: "The fundamental accounting equation: Assets = Liabilities + ___.", options: ["Equity", "Revenue", "Profit", "Cash"], correctIndex: 0, explanation: "This equation ALWAYS balances. Equity is what shareholders actually own." },
    { id: "cf3c", type: "match", title: "Item → Category", pairs: [{ left: "Cash in bank", right: "Current asset" }, { left: "Bank loan", right: "Liability" }, { left: "Factory building", right: "Long-term asset" }, { left: "Retained earnings", right: "Equity" }] },
    { id: "cf3d", type: "true-false", statement: "A company with more assets than liabilities has positive equity.", isTrue: true, explanation: "Assets - Liabilities = Equity. If assets > liabilities, equity is positive (company is solvent)." },
    { id: "cf3e", type: "quiz", question: "What does it mean if a company's liabilities exceed its assets?", options: ["It's highly profitable", "It has negative equity — potentially insolvent", "It's a great investment", "Nothing important"], correctIndex: 1, explanation: "Negative equity (liabilities > assets) means the company owes more than it owns. Major red flag." },
    { id: "cf3f", type: "summary", takeaways: ["Assets = Liabilities + Equity (always balances)", "Balance sheet = snapshot at a point in time", "Positive equity = solvent, negative = trouble", "Current ratio (current assets ÷ current liabilities) measures short-term health"] },
  ]},
  { orderIndex: 4, title: CF_TITLES[3], screens: [
    { id: "cf4a", type: "concept", emoji: "💸", title: "Cash Is King", body: "The cash flow statement shows actual money moving in and out. A profitable company can still go bankrupt if it runs out of cash.", visual: { type: "highlight", items: [{ emoji: "🏭", text: "Operating: Cash from core business" }, { emoji: "🏗️", text: "Investing: Buying/selling assets" }, { emoji: "🏦", text: "Financing: Debt and equity moves" }] } },
    { id: "cf4b", type: "true-false", statement: "A company reporting profits can still run out of cash.", isTrue: true, explanation: "Profit is accounting. Cash is reality. Companies die from no cash, not no profit." },
    { id: "cf4c", type: "fill-blank", sentence: "Free cash flow = Operating cash flow minus ___ expenditures.", options: ["capital", "operating", "marketing", "tax"], correctIndex: 0, explanation: "FCF = cash from operations minus money spent on equipment/property. It's the cash truly available." },
    { id: "cf4d", type: "match", title: "Activity → Category", pairs: [{ left: "Selling products", right: "Operating" }, { left: "Buying equipment", right: "Investing" }, { left: "Issuing bonds", right: "Financing" }, { left: "Paying dividends", right: "Financing" }] },
    { id: "cf4e", type: "quiz", question: "Which cash flow section is most important for evaluating a business?", options: ["Investing", "Financing", "Operating", "All equally"], correctIndex: 2, explanation: "Operating cash flow shows if the core business generates cash. That's the engine." },
    { id: "cf4f", type: "summary", takeaways: ["Three sections: operating, investing, financing", "Profit ≠ cash. Cash is what matters.", "Free cash flow = operating - capital expenditures", "Strong operating cash flow = healthy business engine"], quote: { text: "Cash flow is the lifeblood of any business.", author: "Richard Branson" } },
  ]},
  { orderIndex: 5, title: CF_TITLES[4], screens: [
    { id: "cf5a", type: "concept", emoji: "📊", title: "Ratios Tell the Story", body: "Financial ratios compare numbers to reveal insights. A ratio alone means little — compare to industry peers and trends." },
    { id: "cf5b", type: "tap-reveal", title: "Key Ratios", cards: [{ front: "Profit Margin", back: "Net Income ÷ Revenue. Shows how much of each dollar becomes profit.", emoji: "💰" }, { front: "Current Ratio", back: "Current Assets ÷ Current Liabilities. Above 1 = can pay short-term bills.", emoji: "⚡" }, { front: "Debt-to-Equity", back: "Total Debt ÷ Equity. How leveraged the company is.", emoji: "⚖️" }, { front: "ROE", back: "Net Income ÷ Equity. How well management uses shareholder money.", emoji: "🎯" }] },
    { id: "cf5c", type: "fill-blank", sentence: "Return on Equity (ROE) measures how efficiently a company uses ___ money.", options: ["shareholders'", "borrowed", "government", "foreign"], correctIndex: 0, explanation: "ROE = Net Income ÷ Equity. Higher ROE = management is generating more profit per dollar of equity." },
    { id: "cf5d", type: "true-false", statement: "A high debt-to-equity ratio always means the company is in trouble.", isTrue: false, explanation: "Some industries (utilities, banks) normally have high D/E. Context and industry comparison matter." },
    { id: "cf5e", type: "quiz", question: "A company has a current ratio of 0.5. This means:", options: ["It's highly profitable", "It can't cover short-term debts — liquidity risk!", "It's well-managed", "Nothing — ratios don't matter"], correctIndex: 1, explanation: "Current ratio < 1 means liabilities exceed current assets. Short-term bankruptcy risk." },
    { id: "cf5f", type: "summary", takeaways: ["Ratios are meaningless without context — compare to peers", "Profit margin shows per-dollar profitability", "Current ratio < 1 = liquidity warning", "ROE measures management effectiveness"] },
  ]},
  // Lessons 6-25: generate remaining
  ...Array.from({ length: 20 }, (_, i) => {
    const idx = i + 6;
    const title = CF_TITLES[idx - 1];
    return {
      orderIndex: idx, title,
      screens: [
        { id: `cf${idx}a`, type: "concept" as const, emoji: "🏢", title, body: `Understanding ${title.toLowerCase()} is essential for evaluating how companies make strategic financial decisions.` },
        { id: `cf${idx}b`, type: "true-false" as const, statement: `${title} only matters for finance professionals, not investors.`, isTrue: false, explanation: `Understanding ${title.toLowerCase()} helps you evaluate whether a company is well-managed and worth investing in.` },
        { id: `cf${idx}c`, type: "fill-blank" as const, sentence: `The key metric for evaluating ${title.toLowerCase()} is comparing it to industry ___.`, options: ["peers", "prices", "rumors", "logos"], correctIndex: 0, explanation: "Context matters. A ratio or metric only has meaning when compared to similar companies." },
        { id: `cf${idx}d`, type: "quiz" as const, question: `What should analysts examine first when studying ${title.toLowerCase()}?`, options: ["Stock price movement", "Underlying fundamentals and data", "Social media sentiment", "CEO's personal life"], correctIndex: 1, explanation: "Fundamental analysis of actual financial data always comes first." },
        { id: `cf${idx}e`, type: "match" as const, title: `${title} Analysis`, pairs: [{ left: "Step 1", right: "Gather financial data" }, { left: "Step 2", right: "Calculate key metrics" }, { left: "Step 3", right: "Compare to industry peers" }] },
        { id: `cf${idx}f`, type: "summary" as const, takeaways: [`${title} reveals how companies create value`, "Always compare to industry peers for context", "Strong fundamentals = better investment outcomes", "Review multiple periods to spot trends"] },
      ],
    } as MicroLessonDefinition;
  }),
];
