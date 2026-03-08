import { LessonDefinition } from './lessonTypes';

export const INVESTING_LESSONS: LessonDefinition[] = [
  {
    orderIndex: 1, title: "Introduction to Investing",
    intro: { description: "Discover the difference between saving and investing, and why putting your money to work is essential for building long-term wealth.", points: ["Saving vs. investing: key differences", "How money grows through different asset types", "Why starting early matters more than starting big"] },
    teach: { title: "Saving vs. Investing", content: "Saving preserves your capital in safe, liquid accounts like bank savings. Investing commits capital to assets like stocks or bonds with the expectation of generating returns that outpace inflation. While a savings account might yield 0.5%, a diversified investment portfolio has historically returned around 7% annually.", cards: [
      { title: "Saving", description: "Safe, liquid, FDIC-insured. Returns ~0.5%. Great for short-term needs and emergencies.", icon: "🏦" },
      { title: "Investing", description: "Growth-focused, higher risk. Returns ~7%+. Essential for beating inflation and building wealth.", icon: "📈" },
      { title: "Inflation", description: "At 3% inflation, $100 today buys only $74 worth of goods in 10 years. Investing fights this erosion.", icon: "💸" },
    ]},
    interactive: { type: 'slider', title: "💰 Saving vs. Investing Calculator", description: "See how your money grows differently over time:", sliders: [
      { id: "monthly", label: "Monthly Contribution", min: 50, max: 1000, step: 50, defaultValue: 200, unit: "$" },
      { id: "years", label: "Time Period", min: 5, max: 40, step: 5, defaultValue: 20, unit: " years" },
    ], calculateResult: (v) => {
      const saved = v.monthly * 12 * v.years;
      const invested = v.monthly * ((Math.pow(1 + 0.07/12, v.years*12) - 1) / (0.07/12));
      return { primary: `Saved: $${saved.toLocaleString()} | Invested: $${Math.round(invested).toLocaleString()}`, secondary: `Difference: $${Math.round(invested - saved).toLocaleString()} more by investing`, insight: `That's ${Math.round(invested/saved)}x your money through compound growth!` };
    }},
    check: { type: 'frq', question: "Explain why someone who invests $200/month starting at age 20 could end up with more money than someone who invests $400/month starting at age 35, even though the second person contributes more total dollars.", context: "Introduction to investing, compound interest, time value of money" },
    summary: { points: ["Saving keeps money safe but loses purchasing power to inflation", "Investing puts money to work in assets that can grow over time", "Starting early is the single most powerful advantage in investing", "Even small, consistent investments can grow into significant wealth"], quote: { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" } },
  },
  {
    orderIndex: 2, title: "Risk vs. Reward",
    intro: { description: "Every investment involves a tradeoff between risk and potential return. Understanding this relationship is the foundation of smart investing.", points: ["Why higher returns require accepting more risk", "Types of risk: market, specific, and inflation", "How to assess your personal risk tolerance"] },
    teach: { title: "The Risk-Reward Tradeoff", content: "Risk in investing is measured by volatility — how much an investment's value fluctuates. Higher volatility means wider swings (both up and down). The key insight: you're compensated for taking risk. Savings accounts are safe but return almost nothing; stocks are volatile but have returned ~10% annually over the long run.", cards: [
      { title: "Low Risk", description: "Savings accounts, government bonds. Stable but low returns (1-3%). Your purchasing power barely keeps up with inflation.", icon: "🛡️" },
      { title: "High Risk", description: "Individual stocks, crypto. Could double or halve. Big potential rewards come with stomach-churning swings.", icon: "⚡" },
      { title: "Managed Risk", description: "Diversified portfolios balance growth and stability. The sweet spot for most investors.", icon: "⚖️" },
    ]},
    interactive: { type: 'slider', title: "🌡️ Risk Thermometer", description: "Adjust your risk level and see how your portfolio behaves:", sliders: [
      { id: "risk", label: "Risk Level", min: 1, max: 10, step: 1, defaultValue: 5, unit: "" },
      { id: "years", label: "Time Horizon", min: 1, max: 30, step: 1, defaultValue: 10, unit: " years" },
    ], calculateResult: (v) => {
      const ret = 2 + v.risk * 1.2;
      const vol = v.risk * 4;
      const best = Math.round(10000 * Math.pow(1 + (ret + vol)/100, v.years));
      const worst = Math.round(10000 * Math.pow(1 + (ret - vol)/100, v.years));
      return { primary: `Expected return: ${ret.toFixed(1)}% | Volatility: ±${vol}%`, secondary: `$10K range after ${v.years}yr: $${worst.toLocaleString()} – $${best.toLocaleString()}`, insight: v.risk > 7 ? "High risk — only for long time horizons!" : v.risk < 3 ? "Very conservative — may not beat inflation." : "Balanced approach for most investors." };
    }},
    check: { type: 'quiz', questions: [
      { question: "What does 'volatility' measure in investing?", options: ["How popular a stock is", "How much an investment's price fluctuates", "The total return of an investment", "How quickly you can sell"], correctIndex: 1, explanation: "Volatility measures the degree of price variation over time — higher volatility means bigger swings." },
      { question: "Why do riskier investments tend to offer higher returns?", options: ["The government guarantees them", "Investors demand compensation for uncertainty", "They are always better investments", "They have lower fees"], correctIndex: 1, explanation: "Investors require a 'risk premium' — extra return to compensate for the possibility of loss." },
    ]},
    summary: { points: ["Risk and reward are fundamentally linked — you can't have one without the other", "Volatility measures how much prices swing, not whether you'll lose money", "Your personal risk tolerance should guide your investment choices", "Time horizon is your greatest tool for managing risk"], quote: { text: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" } },
  },
  {
    orderIndex: 3, title: "The Magic of Compound Interest",
    intro: { description: "Compound interest is the most powerful force in investing. Learn how earning returns on your returns creates exponential growth over time.", points: ["How compound interest differs from simple interest", "Why time is the most powerful variable", "The devastating cost of delay"] },
    teach: { title: "Earning Returns on Returns", content: "With simple interest, you earn returns only on your original investment. With compound interest, you earn returns on your returns too. This creates exponential growth: $10,000 at 7% becomes $19,672 in 10 years, $38,697 in 20 years, and $76,123 in 30 years. The formula is A = P(1 + r/n)^(nt).", cards: [
      { title: "Simple Interest", description: "$10,000 at 7% = $700/year forever. After 30 years: $31,000. Linear growth.", icon: "📏" },
      { title: "Compound Interest", description: "$10,000 at 7% compounded = $76,123 after 30 years. Exponential growth!", icon: "🚀" },
      { title: "The Rule of 72", description: "Divide 72 by your return rate to find how many years to double your money. At 7%, money doubles every ~10 years.", icon: "🔄" },
    ]},
    interactive: { type: 'slider', title: "🏁 Compounding Race", description: "Compare starting at different ages:", sliders: [
      { id: "monthly", label: "Monthly Investment", min: 100, max: 1000, step: 50, defaultValue: 300, unit: "$" },
      { id: "startAge", label: "Start Age", min: 18, max: 45, step: 1, defaultValue: 25, unit: "" },
    ], calculateResult: (v) => {
      const years = 65 - v.startAge;
      const total = v.monthly * ((Math.pow(1 + 0.07/12, years*12) - 1) / (0.07/12));
      const contributed = v.monthly * 12 * years;
      return { primary: `By age 65: $${Math.round(total).toLocaleString()}`, secondary: `You contributed $${contributed.toLocaleString()} — compound growth added $${Math.round(total - contributed).toLocaleString()}`, insight: `${Math.round((total-contributed)/total*100)}% of your wealth came from compound growth, not your contributions!` };
    }},
    check: { type: 'frq', question: "A friend says 'I'll start investing when I'm 35 and have more money.' Using what you learned about compound interest, explain why waiting could cost them significantly, even if they invest more per month later.", context: "Compound interest, cost of delay, exponential growth, Rule of 72" },
    summary: { points: ["Compound interest earns returns on returns, creating exponential growth", "Time is the most powerful variable — starting early beats investing more later", "The Rule of 72 helps estimate doubling time (72 ÷ rate = years)", "Fees act as reverse compounding, eroding wealth over decades"], quote: { text: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.", author: "Albert Einstein" } },
  },
  {
    orderIndex: 4, title: "Stocks vs. Bonds",
    intro: { description: "Stocks and bonds are the two fundamental building blocks of any portfolio. Learn how they work and why combining them creates balance.", points: ["Stocks = ownership; Bonds = lending", "How risk and return differ between them", "Why asset allocation matters"] },
    teach: { title: "Equity vs. Debt", content: "When you buy a stock, you own a piece of a company and share in its profits (and losses). When you buy a bond, you're lending money and receiving fixed interest payments. Stocks offer higher growth potential but more volatility; bonds provide stability and income but lower long-term returns.", cards: [
      { title: "Stocks (Equity)", description: "Ownership in companies. Higher growth potential (~10%/yr historically). More volatile. Value tied to company performance.", icon: "📊" },
      { title: "Bonds (Debt)", description: "Loans to governments/companies. Lower returns (~3-5%/yr). More stable. Regular interest payments (coupons).", icon: "📜" },
    ]},
    interactive: { type: 'slider', title: "⚖️ Asset Mix Balance", description: "Adjust your stock/bond mix and see the impact:", sliders: [
      { id: "stocks", label: "Stock Allocation", min: 0, max: 100, step: 10, defaultValue: 60, unit: "%" },
    ], calculateResult: (v) => {
      const bonds = 100 - v.stocks;
      const ret = (v.stocks * 10 + bonds * 4) / 100;
      const vol = (v.stocks * 16 + bonds * 4) / 100;
      const growth = Math.round(10000 * Math.pow(1 + ret/100, 20));
      return { primary: `${v.stocks}% Stocks / ${bonds}% Bonds`, secondary: `Expected return: ${ret.toFixed(1)}% | Volatility: ${vol.toFixed(1)}% | $10K → $${growth.toLocaleString()} in 20yr`, insight: v.stocks > 80 ? "Aggressive — great for young investors with long horizons." : v.stocks < 30 ? "Very conservative — good for capital preservation." : "Balanced mix — suitable for most investors." };
    }},
    check: { type: 'quiz', questions: [
      { question: "What happens to bond prices when interest rates rise?", options: ["They go up", "They go down", "They stay the same", "It depends on the company"], correctIndex: 1, explanation: "Bond prices and interest rates have an inverse relationship. When rates rise, existing bonds with lower coupons become less attractive." },
      { question: "A 60/40 portfolio means:", options: ["60% bonds, 40% stocks", "60% stocks, 40% bonds", "60% cash, 40% stocks", "60% domestic, 40% international"], correctIndex: 1, explanation: "The classic 60/40 portfolio allocates 60% to stocks for growth and 40% to bonds for stability." },
    ]},
    summary: { points: ["Stocks represent ownership and offer higher growth with more volatility", "Bonds represent loans and provide stability with lower returns", "Bond prices move inversely to interest rates", "Mixing stocks and bonds creates a balanced, resilient portfolio"], quote: { text: "The individual investor should act consistently as an investor and not as a speculator.", author: "Benjamin Graham" } },
  },
  {
    orderIndex: 5, title: "Diversification",
    intro: { description: "Don't put all your eggs in one basket. Learn how spreading investments across different assets reduces risk without sacrificing returns.", points: ["Why concentration increases risk", "Diversification across assets, sectors, and regions", "The role of index funds and ETFs"] },
    teach: { title: "Spreading Risk Wisely", content: "Diversification combines assets whose values don't move in perfect sync. If one investment drops, others may hold steady or rise. This reduces unsystematic risk (risk specific to one company). Modern Portfolio Theory shows there's an 'efficient frontier' of optimal portfolios that maximize return for each level of risk.", cards: [
      { title: "Concentrated Portfolio", description: "5 tech stocks. If tech crashes, your entire portfolio crashes. High risk, high potential reward.", icon: "🎯" },
      { title: "Diversified Portfolio", description: "Stocks, bonds, real estate, international. One sector's loss is offset by others. Lower risk, similar returns.", icon: "🌐" },
    ]},
    interactive: { type: 'drag-sort', title: "🥚 Diversification Ranking", description: "Rank these portfolios from MOST diversified to LEAST diversified:", items: [
      { id: "global", label: "Global index fund (thousands of stocks across 40+ countries)" },
      { id: "sp500", label: "S&P 500 index fund (500 large US companies)" },
      { id: "sector", label: "Tech sector ETF (50 technology companies)" },
      { id: "single", label: "Single company stock (e.g., just Apple)" },
    ], correctOrder: ["global", "sp500", "sector", "single"] },
    check: { type: 'frq', question: "Your friend invested their entire savings in a single tech company stock because it's been going up. Using the concept of diversification, explain the risks they face and what you'd recommend instead.", context: "Diversification, unsystematic risk, correlation, index funds" },
    summary: { points: ["Diversification reduces unsystematic (company-specific) risk", "Combining uncorrelated assets smooths out portfolio volatility", "Index funds and ETFs provide instant broad diversification", "Diversification doesn't eliminate all risk — market-wide events affect everything"], quote: { text: "Wide diversification is only required when investors do not understand what they are doing.", author: "Warren Buffett" } },
  },
  {
    orderIndex: 6, title: "Market Psychology: Fear & Greed",
    intro: { description: "Markets are driven by human emotions. Understanding fear and greed helps you avoid the costly mistakes most investors make.", points: ["How fear and greed drive market cycles", "Behavioral biases that hurt returns", "Building emotional discipline"] },
    teach: { title: "Emotions Move Markets", content: "Behavioral finance studies how psychology influences financial decisions. Fear causes panic selling at market bottoms; greed drives buying at market tops. Herd mentality and FOMO amplify these emotions, creating bubbles and crashes where prices detach from fundamental value.", cards: [
      { title: "Fear (Panic Selling)", description: "Market drops 20%. Headlines scream 'CRASH!' Everyone sells. Prices fall further. Smart investors buy.", icon: "😨" },
      { title: "Greed (FOMO Buying)", description: "Market surges 50%. Friends brag about gains. You pile in at the top. Then the bubble pops.", icon: "🤑" },
    ]},
    interactive: { type: 'quiz', title: "🎭 Emotion Meter Challenge", description: "What would you do in each scenario?", questions: [
      { question: "Your portfolio drops 25% in one month. Breaking news says 'recession imminent.' What do you do?", options: ["Sell everything immediately", "Do nothing — stick to your plan", "Buy more at discounted prices", "Move everything to crypto"], correctIndex: 1, explanation: "Sticking to your investment plan during downturns is almost always the best strategy. Panic selling locks in losses." },
      { question: "A stock you don't own has tripled in 3 months. Everyone on social media is buying it.", options: ["Buy immediately before it goes higher", "Research it thoroughly before deciding", "It's clearly overvalued, short it", "FOMO is too strong, buy a small amount"], correctIndex: 1, explanation: "Always research before buying. Chasing momentum driven by hype often leads to buying at the peak." },
    ]},
    check: { type: 'frq', question: "Describe a real or hypothetical scenario where herd mentality led to poor investment outcomes. What behavioral biases were at play, and how could an investor have avoided the trap?", context: "Behavioral finance, herd mentality, FOMO, fear, greed, market bubbles and crashes" },
    summary: { points: ["Fear and greed are the two dominant emotions that drive markets", "Herd mentality amplifies emotional extremes, creating bubbles and crashes", "Circuit breakers exist to pause trading during extreme volatility", "Having a written investment plan helps override emotional impulses"], quote: { text: "Be fearful when others are greedy, and greedy when others are fearful.", author: "Warren Buffett" } },
  },
  {
    orderIndex: 7, title: "Value Investing",
    intro: { description: "Learn Benjamin Graham's approach to finding investments priced below their true worth — buying a dollar for fifty cents.", points: ["What is intrinsic value?", "The margin of safety concept", "Identifying value traps"] },
    teach: { title: "Price vs. Intrinsic Value", content: "Value investing means buying assets trading below their intrinsic value — the true underlying economic worth based on future cash flows. The margin of safety is the gap between intrinsic value and market price. A wide margin protects against errors and downturns.", cards: [
      { title: "Undervalued Stock", description: "Intrinsic value: $100. Market price: $65. Margin of safety: 35%. This is what value investors look for.", icon: "💎" },
      { title: "Value Trap Warning", description: "Some stocks look cheap (low P/E, low P/B) but are cheap because the business is failing. Cheap ≠ undervalued.", icon: "⚠️" },
    ]},
    interactive: { type: 'slider', title: "🔍 Valuation Judge", description: "Estimate if a stock is undervalued:", sliders: [
      { id: "price", label: "Current Stock Price", min: 20, max: 200, step: 5, defaultValue: 80, unit: "$" },
      { id: "earnings", label: "Earnings Per Share", min: 2, max: 20, step: 1, defaultValue: 8, unit: "$" },
      { id: "growth", label: "Expected Growth Rate", min: 0, max: 25, step: 1, defaultValue: 10, unit: "%" },
    ], calculateResult: (v) => {
      const pe = v.price / v.earnings;
      const fairPE = v.growth * 2 + 5;
      const fairValue = v.earnings * fairPE;
      const margin = ((fairValue - v.price) / fairValue * 100);
      return { primary: `P/E Ratio: ${pe.toFixed(1)} | Fair Value: ~$${Math.round(fairValue)}`, secondary: `Margin of Safety: ${margin > 0 ? '+' : ''}${margin.toFixed(0)}%`, insight: margin > 20 ? "Looks undervalued! Good margin of safety." : margin > 0 ? "Slightly undervalued — proceed with caution." : "Appears overvalued — no margin of safety." };
    }},
    check: { type: 'quiz', questions: [
      { question: "What is the 'margin of safety' in value investing?", options: ["The minimum amount to invest", "The difference between intrinsic value and market price", "The stop-loss percentage", "The broker's commission"], correctIndex: 1, explanation: "Margin of safety is the cushion between what a stock is worth and what you pay — protection against being wrong." },
    ]},
    summary: { points: ["Intrinsic value is a company's true worth based on future cash flows", "Margin of safety protects against analytical errors and market downturns", "Value traps look cheap but are cheap for fundamental reasons", "Patience is essential — the market may take years to recognize true value"], quote: { text: "Price is what you pay. Value is what you get.", author: "Warren Buffett" } },
  },
  {
    orderIndex: 8, title: "Fundamental Analysis",
    intro: { description: "Learn to read the financial statements that reveal a company's true health — balance sheets, income statements, and cash flow.", points: ["The 'Big Three' financial statements", "Key metrics: P/E, ROE, current ratio", "Why cash flow matters more than earnings"] },
    teach: { title: "Reading the Numbers", content: "Every public company files financial statements with the SEC. The balance sheet shows assets vs. liabilities at a point in time. The income statement shows revenue and expenses over a period. The cash flow statement tracks actual money coming in and going out — often the most reliable measure of health.", cards: [
      { title: "Balance Sheet", description: "Assets = Liabilities + Equity. Shows what a company owns and owes at a specific moment.", icon: "⚖️" },
      { title: "Income Statement", description: "Revenue - Expenses = Net Income. Shows profitability over a quarter or year.", icon: "📊" },
      { title: "Cash Flow Statement", description: "Tracks actual cash from operations, investing, and financing. Harder to manipulate than earnings.", icon: "💰" },
    ]},
    interactive: { type: 'drag-sort', title: "📋 Financial Health Check", description: "Rank these financial indicators from MOST important to LEAST important when evaluating a company:", items: [
      { id: "cashflow", label: "Strong positive operating cash flow" },
      { id: "revenue", label: "Growing revenue year over year" },
      { id: "pe", label: "Low price-to-earnings ratio" },
      { id: "brand", label: "Well-known brand name" },
    ], correctOrder: ["cashflow", "revenue", "pe", "brand"] },
    check: { type: 'frq', question: "A company reports record profits but its cash flow from operations is negative. Should you be concerned? Explain why cash flow and reported earnings can diverge and which metric you'd trust more.", context: "Fundamental analysis, income statement vs cash flow, earnings quality, accounting" },
    summary: { points: ["Financial statements reveal a company's true economic health", "The balance sheet, income statement, and cash flow statement each tell a different story", "Cash flow is harder to manipulate and often more reliable than earnings", "Key ratios like P/E and ROE help compare companies quickly"], quote: { text: "Accounting is the language of business.", author: "Warren Buffett" } },
  },
  {
    orderIndex: 9, title: "Economic Moats",
    intro: { description: "Some companies consistently outperform because they have durable competitive advantages — economic moats — that protect profits from competitors.", points: ["What makes a moat 'durable'", "Four types of competitive advantages", "Why moats erode over time"] },
    teach: { title: "Competitive Advantages", content: "An economic moat is a structural feature that allows a business to sustain high returns over time. Companies with moats can charge premium prices, retain customers, and fend off competitors. But moats aren't permanent — technology disruption can erode them rapidly.", cards: [
      { title: "Brand Power", description: "Coca-Cola, Apple, Nike. Customers pay more just for the name. Decades of trust and recognition.", icon: "⭐" },
      { title: "Network Effects", description: "Facebook, Visa, Uber. More users = more value. Extremely hard for competitors to replicate.", icon: "🕸️" },
      { title: "Cost Advantages", description: "Walmart, Amazon. Scale allows lower prices that competitors can't match.", icon: "📦" },
      { title: "Switching Costs", description: "Microsoft Office, Salesforce. Moving to a competitor is painful and expensive.", icon: "🔒" },
    ]},
    interactive: { type: 'drag-sort', title: "🏰 Moat Builder", description: "Rank these moat types from STRONGEST to WEAKEST long-term protection:", items: [
      { id: "network", label: "Network effects (more users = more value)" },
      { id: "switch", label: "High switching costs (painful to leave)" },
      { id: "brand", label: "Strong brand recognition" },
      { id: "cost", label: "Lowest cost producer" },
    ], correctOrder: ["network", "switch", "brand", "cost"] },
    check: { type: 'quiz', questions: [
      { question: "Which company has the strongest network effect moat?", options: ["Coca-Cola (brand)", "Visa (payment network)", "Walmart (cost advantage)", "Pfizer (patents)"], correctIndex: 1, explanation: "Visa's value increases with every merchant and cardholder that joins the network — a classic network effect." },
      { question: "Why are moats not permanent?", options: ["The SEC removes them", "Technological disruption or regulation can erode them", "They automatically expire after 20 years", "Competitors always have identical moats"], correctIndex: 1, explanation: "Digital photography destroyed Kodak's moat. Netflix disrupted Blockbuster. No moat is guaranteed to last forever." },
    ]},
    summary: { points: ["Economic moats protect companies from competition and sustain high profits", "The four main moat types: brand power, network effects, cost advantages, switching costs", "Moats with network effects tend to be the most durable", "Technology disruption can rapidly erode even the strongest moats"], quote: { text: "In business, I look for economic castles protected by unbreachable moats.", author: "Warren Buffett" } },
  },
  {
    orderIndex: 10, title: "Portfolio Management",
    intro: { description: "Learn to combine individual investments into a coherent, goal-oriented portfolio strategy that balances risk and return.", points: ["Strategic vs. tactical asset allocation", "Why rebalancing is essential", "Creating an Investment Policy Statement"] },
    teach: { title: "Building Your Strategy", content: "Portfolio management is the art and science of selecting and monitoring investments to meet your goals. Strategic allocation sets your long-term target mix (e.g., 70/30 stocks/bonds). Rebalancing means selling winners and buying laggards to restore your target — counter-intuitive but essential for risk control.", cards: [
      { title: "Strategic Allocation", description: "Your long-term target mix based on age, goals, and risk tolerance. The foundation of your portfolio.", icon: "🎯" },
      { title: "Rebalancing", description: "Markets drift your allocation. A 70/30 can become 80/20 after a bull run. Rebalance annually to stay on track.", icon: "⚖️" },
    ]},
    interactive: { type: 'slider', title: "📊 Portfolio Stress Test", description: "Test how your allocation handles market crashes:", sliders: [
      { id: "stocks", label: "Stock %", min: 0, max: 100, step: 10, defaultValue: 70, unit: "%" },
      { id: "crash", label: "Market Crash Severity", min: 10, max: 50, step: 5, defaultValue: 30, unit: "%" },
    ], calculateResult: (v) => {
      const bonds = 100 - v.stocks;
      const stockLoss = v.stocks * v.crash / 100;
      const bondGain = bonds * 5 / 100;
      const totalLoss = stockLoss - bondGain;
      const portfolio100k = 100000 - totalLoss * 1000;
      return { primary: `Portfolio drop: -${totalLoss.toFixed(1)}%`, secondary: `$100K → $${Math.round(portfolio100k).toLocaleString()} after a ${v.crash}% crash`, insight: totalLoss > 25 ? "Significant loss — consider more bonds if this feels too painful." : "Your bond cushion is helping absorb the shock." };
    }},
    check: { type: 'frq', question: "Explain why rebalancing a portfolio — selling assets that have gone up and buying assets that have gone down — is considered good practice, even though it feels counterintuitive.", context: "Portfolio management, rebalancing, asset allocation, risk management" },
    summary: { points: ["A good portfolio is more than a collection of stocks — it's a coherent strategy", "Strategic allocation sets your risk level; rebalancing maintains it", "Rebalancing forces you to buy low and sell high systematically", "An Investment Policy Statement prevents emotional decision-making"], quote: { text: "The essence of investment management is the management of risks, not the management of returns.", author: "Benjamin Graham" } },
  },
  {
    orderIndex: 11, title: "Long-Term Wealth Building",
    intro: { description: "Create a realistic 30-year strategy using compounding, consistent contributions, and growth-focused assets.", points: ["Time in market vs. timing the market", "Dollar-cost averaging as a risk strategy", "Sequence of returns risk"] },
    teach: { title: "The 30-Year Plan", content: "The greatest factor in long-term wealth is time invested. Dollar-cost averaging — investing fixed amounts at regular intervals — removes the temptation to time the market and ensures you buy more shares when prices are low. Missing just the 10 best trading days over 20 years can cut your returns in half.", cards: [
      { title: "Stay Invested", description: "Missing the 10 best days over 20 years can halve your returns. Nobody can predict which days those will be.", icon: "⏰" },
      { title: "Dollar-Cost Averaging", description: "Invest $500/month regardless of price. You automatically buy more shares when prices drop.", icon: "📅" },
    ]},
    interactive: { type: 'slider', title: "🎯 Life Path Simulator", description: "Plan your path to financial independence:", sliders: [
      { id: "monthly", label: "Monthly Investment", min: 100, max: 2000, step: 100, defaultValue: 500, unit: "$" },
      { id: "rate", label: "Expected Return", min: 4, max: 12, step: 1, defaultValue: 7, unit: "%" },
      { id: "years", label: "Investment Period", min: 10, max: 40, step: 5, defaultValue: 30, unit: " years" },
    ], calculateResult: (v) => {
      const total = v.monthly * ((Math.pow(1 + v.rate/100/12, v.years*12) - 1) / (v.rate/100/12));
      const contributed = v.monthly * 12 * v.years;
      return { primary: `Final portfolio: $${Math.round(total).toLocaleString()}`, secondary: `You contributed $${contributed.toLocaleString()} — growth added $${Math.round(total - contributed).toLocaleString()}`, insight: `${Math.round((total-contributed)/total*100)}% of your wealth came from compound growth!` };
    }},
    check: { type: 'quiz', questions: [
      { question: "What is dollar-cost averaging?", options: ["Buying only when prices drop", "Investing fixed amounts at regular intervals", "Selling when you double your money", "Only investing in dollar-denominated assets"], correctIndex: 1, explanation: "DCA means investing a fixed amount on a regular schedule, regardless of market conditions." },
    ]},
    summary: { points: ["Time in the market beats timing the market almost every time", "Dollar-cost averaging removes emotion and ensures consistent investing", "Missing just a few of the market's best days devastates long-term returns", "Consistent contributions matter more than finding the 'perfect' investment"], quote: { text: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" } },
  },
  {
    orderIndex: 12, title: "Your Investment Checklist",
    intro: { description: "Bring together everything you've learned into a structured decision-making process that prevents emotional mistakes.", points: ["Creating a systematic investment process", "Pre-mortem analysis: assuming failure first", "Checklist as a defense against bias"] },
    teach: { title: "Process Over Prediction", content: "Successful investing is a process, not a series of lucky picks. A formal checklist forces you to evaluate fundamentals, valuation, risk, and portfolio fit before every trade. Pre-mortem analysis — imagining the investment has failed and listing why — counteracts overconfidence bias.", cards: [
      { title: "Before You Buy", description: "Check: fundamentals, valuation, competitive moat, management quality, your portfolio fit.", icon: "✅" },
      { title: "Pre-Mortem Analysis", description: "Ask: 'If this investment fails in 2 years, what went wrong?' List 5 possible reasons before buying.", icon: "🔮" },
    ]},
    interactive: { type: 'drag-sort', title: "📋 Investment Checklist Order", description: "Put these investment steps in the correct order:", items: [
      { id: "research", label: "Research the company's fundamentals" },
      { id: "valuation", label: "Assess the stock's valuation" },
      { id: "risk", label: "Evaluate risks and do a pre-mortem" },
      { id: "fit", label: "Check if it fits your portfolio" },
      { id: "execute", label: "Execute the trade with a plan" },
    ], correctOrder: ["research", "valuation", "risk", "fit", "execute"] },
    check: { type: 'frq', question: "Create a brief pre-mortem analysis for investing in a hypothetical AI company. List 3-4 specific reasons the investment could fail in 2 years.", context: "Investment checklist, pre-mortem analysis, risk assessment, overconfidence bias" },
    summary: { points: ["A written investment process prevents impulsive decisions", "Pre-mortem analysis forces you to consider downside risks before committing", "Every investment should pass checks on fundamentals, valuation, risk, and fit", "The checklist is your best defense against cognitive biases"], quote: { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" } },
  },
  {
    orderIndex: 13, title: "Technical Analysis Fundamentals",
    intro: { description: "Learn to read price charts, identify patterns, and use support/resistance levels to time entry and exit points.", points: ["Reading candlestick charts", "Support and resistance levels", "Why technical analysis is speculative"] },
    teach: { title: "Reading Price Charts", content: "Technical analysis forecasts price movements by examining historical price and volume data. Candlestick charts show open, high, low, and close prices. Support is a price floor where buyers step in; resistance is a ceiling where sellers appear. These are psychological barriers traders watch.", cards: [
      { title: "Support Level", description: "A price floor where buying pressure overwhelms selling. The stock 'bounces' off this level repeatedly.", icon: "📉" },
      { title: "Resistance Level", description: "A price ceiling where selling pressure overwhelms buying. The stock struggles to break through.", icon: "📈" },
    ]},
    interactive: { type: 'quiz', title: "📊 Pattern Recognition", description: "Test your chart-reading skills:", questions: [
      { question: "A stock has bounced off $50 three times without going lower. What is $50?", options: ["A resistance level", "A support level", "A fair value", "A moving average"], correctIndex: 1, explanation: "$50 is a support level — a price floor where buyers consistently step in to prevent further decline." },
      { question: "What does a long lower wick (shadow) on a candlestick indicate?", options: ["Strong selling pressure", "Buyers pushed the price back up after a dip", "The stock is overvalued", "Trading volume was low"], correctIndex: 1, explanation: "A long lower wick means the price dipped significantly but buyers pushed it back up — a bullish signal." },
    ]},
    check: { type: 'quiz', questions: [
      { question: "Technical analysis is based on the premise that:", options: ["Company fundamentals don't matter", "All known information is already reflected in the price", "Stock prices move randomly", "Charts predict the future with certainty"], correctIndex: 1, explanation: "Technical analysis assumes 'everything is priced in' and that patterns in price/volume can indicate future movement." },
    ]},
    summary: { points: ["Technical analysis uses price and volume data to forecast movements", "Support and resistance are psychological price barriers watched by traders", "Candlestick patterns reveal the battle between buyers and sellers", "Technical analysis is speculative and works best alongside fundamental analysis"], quote: { text: "The trend is your friend until the end when it bends.", author: "Ed Seykota" } },
  },
  {
    orderIndex: 14, title: "Investment Psychology",
    intro: { description: "Dive deeper into cognitive biases that plague investors — and learn systems to overcome them.", points: ["Loss aversion and anchoring bias", "The VIX 'Fear Gauge'", "Building systems over emotions"] },
    teach: { title: "Cognitive Traps", content: "Loss aversion means the pain of losing $100 feels twice as intense as the pleasure of gaining $100. Anchoring bias makes you fixate on irrelevant numbers like your purchase price. Self-attribution bias makes you credit wins to skill and blame losses on bad luck.", cards: [
      { title: "Loss Aversion", description: "Losing $1,000 feels twice as painful as gaining $1,000 feels good. This causes holding losers too long.", icon: "😖" },
      { title: "Anchoring Bias", description: "'I bought at $100, I can't sell at $80.' Your purchase price is irrelevant to a stock's future value.", icon: "⚓" },
    ]},
    interactive: { type: 'quiz', title: "🧠 Bias Detector", description: "Identify the bias in each scenario:", questions: [
      { question: "You refuse to sell a losing stock because 'I've already lost too much to sell now.'", options: ["FOMO", "Sunk cost fallacy", "Anchoring bias", "Herd mentality"], correctIndex: 1, explanation: "The sunk cost fallacy makes you factor in past losses that are irrelevant to the future value of the investment." },
      { question: "You attribute your winning stock picks to skill but blame your losses on 'market manipulation.'", options: ["Loss aversion", "Confirmation bias", "Self-attribution bias", "Anchoring"], correctIndex: 2, explanation: "Self-attribution bias credits wins to personal skill while blaming losses on external factors." },
    ]},
    check: { type: 'frq', question: "Describe a specific system or rule you could implement in your investing to protect yourself from loss aversion and anchoring bias. Be concrete.", context: "Investment psychology, loss aversion, anchoring bias, systematic investing, stop-loss orders" },
    summary: { points: ["Loss aversion causes holding losers too long and selling winners too early", "Anchoring makes you fixate on irrelevant price points like your purchase price", "The VIX measures market-wide fear and is a useful sentiment indicator", "Pre-set rules (stop-losses, rebalancing triggers) remove emotion from decisions"], quote: { text: "The investor's chief problem — and even his worst enemy — is likely to be himself.", author: "Benjamin Graham" } },
  },
  {
    orderIndex: 15, title: "Options Trading Fundamentals",
    intro: { description: "Understand calls, puts, and how options can hedge risk or amplify returns — but with significant danger.", points: ["Calls (right to buy) vs. Puts (right to sell)", "The Greeks: Delta, Theta, Vega", "Why options require extreme caution"] },
    teach: { title: "Derivative Contracts", content: "An option gives you the right (not obligation) to buy (call) or sell (put) an asset at a set price (strike) by a set date (expiration). Options are leveraged — small moves create big gains or total losses. Time decay (Theta) erodes option value daily.", cards: [
      { title: "Call Option", description: "Right to BUY at the strike price. Profits when the stock goes UP. Max loss = premium paid.", icon: "📞" },
      { title: "Put Option", description: "Right to SELL at the strike price. Profits when the stock goes DOWN. Used for hedging.", icon: "📉" },
    ]},
    interactive: { type: 'slider', title: "📈 Options Payoff Calculator", description: "See how a call option's value changes:", sliders: [
      { id: "strike", label: "Strike Price", min: 80, max: 120, step: 5, defaultValue: 100, unit: "$" },
      { id: "premium", label: "Premium Paid", min: 1, max: 15, step: 1, defaultValue: 5, unit: "$" },
      { id: "stockPrice", label: "Stock Price at Expiry", min: 70, max: 150, step: 5, defaultValue: 110, unit: "$" },
    ], calculateResult: (v) => {
      const intrinsic = Math.max(0, v.stockPrice - v.strike);
      const profit = intrinsic - v.premium;
      const returnPct = (profit / v.premium * 100);
      return { primary: `${profit >= 0 ? 'Profit' : 'Loss'}: $${profit.toFixed(0)} per share`, secondary: `Intrinsic value: $${intrinsic} | Return: ${returnPct > 0 ? '+' : ''}${returnPct.toFixed(0)}%`, insight: profit > 0 ? `Profitable! The stock moved enough above your strike to cover the premium.` : intrinsic > 0 ? "In the money but premium cost makes it a loss." : "Out of the money — option expires worthless." };
    }},
    check: { type: 'quiz', questions: [
      { question: "What is 'Theta' in options trading?", options: ["Sensitivity to stock price changes", "The rate of time decay", "Sensitivity to volatility changes", "The option's leverage ratio"], correctIndex: 1, explanation: "Theta measures how much value an option loses each day as it gets closer to expiration — time decay." },
    ]},
    summary: { points: ["Options give the right (not obligation) to buy or sell at a set price", "Time decay (Theta) erodes option value daily — options are wasting assets", "Options provide leverage: small investments can produce large gains or total losses", "Naked options carry the risk of unlimited loss and require extreme caution"], quote: { text: "Options are like fire. Used wisely, they warm your house. Used carelessly, they burn it down.", author: "Options Trading Proverb" } },
  },
  {
    orderIndex: 16, title: "ETFs & Index Funds",
    intro: { description: "Discover why passive investing through ETFs and index funds beats most professional money managers over the long run.", points: ["How index funds work", "The cost drag of expense ratios", "Active vs. passive investing debate"] },
    teach: { title: "The Power of Passive Investing", content: "An index fund holds all the stocks in a market index (like the S&P 500), providing instant diversification. Studies show that over 15+ years, 90% of actively managed funds fail to beat their index benchmark — mainly due to higher fees.", cards: [
      { title: "Index Fund", description: "Holds hundreds of stocks automatically. Expense ratio: ~0.03%. Beats 90% of professionals over time.", icon: "📊" },
      { title: "Active Fund", description: "Manager picks stocks trying to beat the market. Expense ratio: ~1.0%. Most fail to justify their fees.", icon: "👔" },
    ]},
    interactive: { type: 'slider', title: "💸 Cost Drag Visualizer", description: "See how fees compound against you over decades:", sliders: [
      { id: "investment", label: "Investment Amount", min: 10000, max: 500000, step: 10000, defaultValue: 100000, unit: "$" },
      { id: "fee", label: "Annual Fee", min: 0, max: 2, step: 0.1, defaultValue: 1, unit: "%" },
    ], calculateResult: (v) => {
      const low = Math.round(v.investment * Math.pow(1 + (7 - 0.03)/100, 30));
      const high = Math.round(v.investment * Math.pow(1 + (7 - v.fee)/100, 30));
      const lost = low - high;
      return { primary: `Low-fee fund: $${low.toLocaleString()} | ${v.fee}% fee fund: $${high.toLocaleString()}`, secondary: `Fee drag cost you: $${lost.toLocaleString()} over 30 years`, insight: v.fee > 1 ? "That fee is eating a huge chunk of your wealth!" : v.fee > 0.5 ? "Moderate fee impact — consider lower-cost alternatives." : "Low fees — your money works harder for you." };
    }},
    check: { type: 'frq', question: "Your financial advisor recommends an actively managed fund with a 1.2% expense ratio. Using what you've learned, explain to them why you might prefer a low-cost index fund instead.", context: "Index funds, ETFs, expense ratios, passive vs active investing, cost drag" },
    summary: { points: ["Index funds provide instant, broad diversification at minimal cost", "Over 90% of active managers fail to beat their benchmark over 15+ years", "Expense ratios compound against you — a 1% fee can cost hundreds of thousands", "Passive investing is the most reliable path to long-term wealth for most people"], quote: { text: "Don't look for the needle in the haystack. Just buy the haystack!", author: "John Bogle" } },
  },
  {
    orderIndex: 17, title: "Bonds & Fixed Income",
    intro: { description: "Understand how bonds work, the yield curve, and why bonds are essential for portfolio stability and income.", points: ["Government vs. corporate bonds", "How yields and prices move inversely", "Duration and interest rate risk"] },
    teach: { title: "Lending Your Money", content: "When you buy a bond, you're lending money in exchange for regular interest payments (coupons) and return of principal at maturity. Bond prices fall when interest rates rise because new bonds offer better yields, making old bonds less attractive.", cards: [
      { title: "Government Bonds", description: "Backed by the government. Very safe. Lower yields. Treasury bonds are considered 'risk-free.'", icon: "🏛️" },
      { title: "Corporate Bonds", description: "Issued by companies. Higher yields but credit risk. Investment grade vs. junk bonds.", icon: "🏢" },
    ]},
    interactive: { type: 'slider', title: "📐 Yield Curve Explorer", description: "See how rate changes affect bond prices:", sliders: [
      { id: "duration", label: "Bond Duration", min: 1, max: 30, step: 1, defaultValue: 10, unit: " years" },
      { id: "rateChange", label: "Interest Rate Change", min: -3, max: 3, step: 0.25, defaultValue: 1, unit: "%" },
    ], calculateResult: (v) => {
      const priceChange = -v.duration * v.rateChange;
      return { primary: `Bond price change: ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(1)}%`, secondary: `A ${v.duration}-year bond ${v.rateChange > 0 ? 'loses' : 'gains'} ~${Math.abs(priceChange).toFixed(1)}% when rates ${v.rateChange > 0 ? 'rise' : 'fall'} ${Math.abs(v.rateChange)}%`, insight: Math.abs(priceChange) > 15 ? "Long-duration bonds are very sensitive to rate changes!" : "Moderate sensitivity — shorter duration reduces risk." };
    }},
    check: { type: 'quiz', questions: [
      { question: "What happens to existing bond prices when the Fed raises interest rates?", options: ["They go up", "They go down", "Nothing changes", "Only corporate bonds are affected"], correctIndex: 1, explanation: "When rates rise, new bonds offer higher yields, making existing bonds with lower coupons less valuable." },
      { question: "What does 'duration' measure in bonds?", options: ["When the bond matures", "Price sensitivity to interest rate changes", "The coupon payment frequency", "The credit quality"], correctIndex: 1, explanation: "Duration measures how much a bond's price changes for each 1% change in interest rates. Higher duration = more sensitivity." },
    ]},
    summary: { points: ["Bonds provide stability and income — essential for balanced portfolios", "Bond prices and interest rates move in opposite directions", "Longer duration bonds are more sensitive to rate changes", "Government bonds are safest; corporate bonds offer higher yields with credit risk"], quote: { text: "The four most dangerous words in investing are: 'this time it's different.'", author: "Sir John Templeton" } },
  },
  {
    orderIndex: 18, title: "Market Cycles & Timing",
    intro: { description: "Markets move in repeating phases. Learn to recognize cycles and position wisely — without trying to time the market.", points: ["The four phases: expansion, peak, recession, recovery", "Cyclical vs. defensive sectors", "Why timing the market is nearly impossible"] },
    teach: { title: "Economic Cycles", content: "Markets move through expansion (growth), peak (overheating), recession (contraction), and recovery (rebound). Different sectors perform differently in each phase: technology thrives in expansion while utilities hold steady in recession.", cards: [
      { title: "Cyclical Sectors", description: "Tech, industrials, consumer discretionary. Boom during expansion, suffer in recession.", icon: "🎢" },
      { title: "Defensive Sectors", description: "Utilities, healthcare, consumer staples. Steady demand regardless of economic conditions.", icon: "🛡️" },
    ]},
    interactive: { type: 'drag-sort', title: "🔄 Cycle Positioning", description: "Match these investment strategies to the RIGHT order in the economic cycle:", items: [
      { id: "growth", label: "Buy growth stocks and tech (Expansion)" },
      { id: "reduce", label: "Reduce risk, raise cash (Peak)" },
      { id: "defensive", label: "Shift to defensive sectors (Recession)" },
      { id: "buy", label: "Buy beaten-down assets (Recovery)" },
    ], correctOrder: ["growth", "reduce", "defensive", "buy"] },
    check: { type: 'frq', question: "Explain why 'time in the market' almost always beats 'timing the market.' Include a specific example of what could go wrong if you try to predict market cycles.", context: "Market cycles, expansion, recession, sector rotation, market timing" },
    summary: { points: ["Markets cycle through expansion, peak, recession, and recovery", "Cyclical sectors boom in growth; defensive sectors hold steady in downturns", "Smart positioning matters more than perfect timing", "Nobody can consistently predict market cycles — stay invested"], quote: { text: "Far more money has been lost by investors preparing for corrections, or trying to anticipate corrections, than has been lost in corrections themselves.", author: "Peter Lynch" } },
  },
  {
    orderIndex: 19, title: "Cryptocurrency Basics",
    intro: { description: "Explore digital assets, blockchain technology, and why crypto demands extreme caution and strict position sizing.", points: ["How blockchain technology works", "Bitcoin and Ethereum: use cases and risks", "Position sizing for high-volatility assets"] },
    teach: { title: "Digital Assets & Blockchain", content: "Cryptocurrency is a digital asset built on blockchain — a decentralized ledger recording transactions across thousands of computers. Bitcoin was created as peer-to-peer digital money with a fixed supply of 21 million coins. Ethereum enables smart contracts and decentralized applications.", cards: [
      { title: "Bitcoin (BTC)", description: "First cryptocurrency. Fixed supply. Digital gold narrative. Drops 50-80% regularly in bear markets.", icon: "₿" },
      { title: "Ethereum (ETH)", description: "Programmable blockchain. Powers DeFi and NFTs. More versatile but also extremely volatile.", icon: "⟠" },
    ]},
    interactive: { type: 'slider', title: "📊 Crypto Allocation Impact", description: "See how crypto allocation affects portfolio risk:", sliders: [
      { id: "portfolio", label: "Total Portfolio", min: 10000, max: 500000, step: 10000, defaultValue: 100000, unit: "$" },
      { id: "cryptoPct", label: "Crypto Allocation", min: 0, max: 30, step: 1, defaultValue: 5, unit: "%" },
    ], calculateResult: (v) => {
      const crypto = Math.round(v.portfolio * v.cryptoPct / 100);
      const worstCase = Math.round(crypto * 0.2);
      const portfolioLoss = Math.round((crypto - worstCase) / v.portfolio * 100);
      return { primary: `$${crypto.toLocaleString()} in crypto`, secondary: `Worst case (80% crash): lose $${(crypto - worstCase).toLocaleString()} = ${portfolioLoss}% of total portfolio`, insight: v.cryptoPct <= 5 ? "Conservative — manageable even in a crash." : v.cryptoPct <= 15 ? "Moderate risk — significant loss potential." : "Aggressive — a crypto crash could seriously damage your portfolio!" };
    }},
    check: { type: 'quiz', questions: [
      { question: "What is the best approach to crypto in a portfolio?", options: ["Invest everything for maximum returns", "Use strict position sizing — only invest what you can afford to lose", "Avoid it completely", "Buy whenever it's in the news"], correctIndex: 1, explanation: "Most advisors suggest limiting crypto to 1-5% of your portfolio due to extreme volatility." },
    ]},
    summary: { points: ["Blockchain is a decentralized ledger — no single entity controls it", "Bitcoin and Ethereum have real use cases but extreme price volatility", "Crypto can drop 50-80% in bear markets — position sizing is critical", "Never invest more in crypto than you can afford to lose entirely"], quote: { text: "The biggest risk is not taking any risk. In a world that's changing quickly, the only strategy guaranteed to fail is not taking risks.", author: "Mark Zuckerberg" } },
  },
  {
    orderIndex: 20, title: "Dividend Investing",
    intro: { description: "Learn how stocks that pay regular dividends generate income and compound returns over time.", points: ["How dividends work: yield, payout ratio, growth", "Reinvesting dividends for compound returns", "Building a passive income stream"] },
    teach: { title: "Income from Ownership", content: "Some companies share profits with shareholders through dividends. Dividend yield = annual dividend / stock price. Reinvesting dividends buys more shares, which pay more dividends — creating a compounding income snowball over decades.", cards: [
      { title: "Dividend Yield", description: "A stock priced at $100 paying $3/year in dividends has a 3% yield. Higher isn't always better.", icon: "💰" },
      { title: "Dividend Growth", description: "Companies that grow dividends annually (aristocrats) compound your income automatically.", icon: "📈" },
    ]},
    interactive: { type: 'slider', title: "💵 Dividend Income Dashboard", description: "See how reinvested dividends compound:", sliders: [
      { id: "invested", label: "Amount Invested", min: 10000, max: 500000, step: 10000, defaultValue: 50000, unit: "$" },
      { id: "yield", label: "Dividend Yield", min: 1, max: 6, step: 0.5, defaultValue: 3, unit: "%" },
      { id: "years", label: "Hold Period", min: 5, max: 30, step: 5, defaultValue: 20, unit: " years" },
    ], calculateResult: (v) => {
      const growth = 0.05; // 5% price appreciation
      const totalReturn = (v.yield/100 + growth);
      const finalValue = Math.round(v.invested * Math.pow(1 + totalReturn, v.years));
      const annualIncome = Math.round(finalValue * v.yield / 100);
      return { primary: `Portfolio: $${finalValue.toLocaleString()} | Annual income: $${annualIncome.toLocaleString()}`, secondary: `That's $${Math.round(annualIncome/12).toLocaleString()}/month in passive dividend income`, insight: annualIncome > 30000 ? "Significant passive income stream!" : "Keep reinvesting to grow your income snowball." };
    }},
    check: { type: 'frq', question: "Explain the concept of a 'dividend snowball' and why reinvesting dividends is more powerful than spending them, especially early in your investing career.", context: "Dividend investing, compound returns, reinvestment, passive income" },
    summary: { points: ["Dividends provide income from stock ownership — cash flow without selling shares", "Reinvesting dividends creates a compounding income snowball", "Dividend aristocrats have raised dividends for 25+ consecutive years", "A high yield can be a warning sign — always check the payout ratio"], quote: { text: "Do you know the only thing that gives me pleasure? It's to see my dividends coming in.", author: "John D. Rockefeller" } },
  },
  {
    orderIndex: 21, title: "Technical Indicators Deep Dive",
    intro: { description: "Apply advanced charting tools like RSI, MACD, and moving averages to refine entry and exit decisions.", points: ["Moving averages as trend indicators", "RSI for overbought/oversold signals", "MACD for momentum shifts"] },
    teach: { title: "Beyond Price Charts", content: "Technical indicators transform raw price data into actionable signals. Moving averages smooth price noise to reveal trends. RSI (Relative Strength Index) identifies overbought (>70) or oversold (<30) conditions. MACD shows momentum shifts through signal line crossovers.", cards: [
      { title: "Moving Averages", description: "50-day and 200-day MAs show trend direction. A 'golden cross' (50 > 200) is bullish.", icon: "📉" },
      { title: "RSI", description: "Above 70 = overbought (may drop). Below 30 = oversold (may bounce). Ranges 0-100.", icon: "📊" },
    ]},
    interactive: { type: 'slider', title: "📈 Indicator Signal Analyzer", description: "Interpret these market conditions:", sliders: [
      { id: "rsi", label: "RSI Value", min: 10, max: 90, step: 5, defaultValue: 50, unit: "" },
      { id: "maPrice", label: "Price vs 200-day MA", min: -20, max: 20, step: 1, defaultValue: 5, unit: "%" },
    ], calculateResult: (v) => {
      const rsiSignal = v.rsi > 70 ? "OVERBOUGHT ⚠️" : v.rsi < 30 ? "OVERSOLD 🟢" : "NEUTRAL";
      const trendSignal = v.maPrice > 0 ? "UPTREND ↗️" : "DOWNTREND ↘️";
      const combined = v.rsi < 30 && v.maPrice > 0 ? "Strong buy signal — oversold in an uptrend!" : v.rsi > 70 && v.maPrice < 0 ? "Strong sell signal — overbought in a downtrend!" : "Mixed signals — wait for confirmation.";
      return { primary: `RSI: ${rsiSignal} | Trend: ${trendSignal}`, secondary: `Combined signal: ${combined}`, insight: "Remember: indicators suggest probabilities, not certainties. Always confirm with other analysis." };
    }},
    check: { type: 'quiz', questions: [
      { question: "An RSI of 25 typically indicates:", options: ["The stock is overvalued", "The stock may be oversold and due for a bounce", "You should sell immediately", "The stock is fairly valued"], correctIndex: 1, explanation: "RSI below 30 suggests the stock is oversold — selling pressure may be exhausted and a bounce could follow." },
    ]},
    summary: { points: ["Moving averages reveal underlying trends by smoothing price noise", "RSI identifies overbought (>70) and oversold (<30) conditions", "MACD signal line crossovers indicate momentum shifts", "No indicator predicts the future — use them for timing refinement, not prediction"], quote: { text: "The market can stay irrational longer than you can stay solvent.", author: "John Maynard Keynes" } },
  },
  {
    orderIndex: 22, title: "REITs & Real Estate",
    intro: { description: "Invest in real estate through the stock market — REITs offer income and diversification without buying property.", points: ["How REITs work and their income structure", "REITs vs. physical real estate", "Interest rate sensitivity"] },
    teach: { title: "Real Estate Without the Hassle", content: "REITs (Real Estate Investment Trusts) own income-producing properties and must distribute 90% of income as dividends. They trade like stocks, providing liquidity that physical real estate can't. However, REIT prices are sensitive to interest rate changes.", cards: [
      { title: "REIT Advantages", description: "Liquidity (buy/sell instantly), diversification across properties, professional management, high dividends.", icon: "🏢" },
      { title: "Physical Real Estate", description: "Direct control, leverage (mortgages), tax benefits, but illiquid and management-intensive.", icon: "🏠" },
    ]},
    interactive: { type: 'slider', title: "🏢 REIT vs. Rental Property", description: "Compare returns on REITs vs. rental income:", sliders: [
      { id: "investment", label: "Investment Amount", min: 50000, max: 500000, step: 25000, defaultValue: 100000, unit: "$" },
      { id: "reitYield", label: "REIT Dividend Yield", min: 3, max: 8, step: 0.5, defaultValue: 5, unit: "%" },
    ], calculateResult: (v) => {
      const reitIncome = Math.round(v.investment * v.reitYield / 100);
      const rentalIncome = Math.round(v.investment * 0.06); // 6% cap rate
      const rentalNet = Math.round(rentalIncome * 0.65); // After expenses
      return { primary: `REIT income: $${reitIncome.toLocaleString()}/yr | Rental net: $${rentalNet.toLocaleString()}/yr`, secondary: `REIT: fully passive | Rental: requires management, repairs, vacancies`, insight: "REITs offer competitive returns with zero management headaches." };
    }},
    check: { type: 'quiz', questions: [
      { question: "Why must REITs distribute at least 90% of income?", options: ["It's a company choice", "It's required by law to qualify for tax benefits", "Investors demand it", "The SEC mandates it for all companies"], correctIndex: 1, explanation: "REITs get special tax treatment (no corporate tax) in exchange for distributing 90%+ of taxable income as dividends." },
    ]},
    summary: { points: ["REITs own income-producing properties and must distribute 90% of income", "They offer real estate exposure with stock-market liquidity", "REIT prices are sensitive to interest rate changes", "Diversifying across REIT types (office, residential, industrial) reduces risk"], quote: { text: "Real estate cannot be lost or stolen, nor can it be carried away.", author: "Franklin D. Roosevelt" } },
  },
  {
    orderIndex: 23, title: "Margin Trading & Leverage",
    intro: { description: "Borrowing to invest amplifies both gains and losses. Understand margin requirements, margin calls, and why leverage is dangerous.", points: ["How margin accounts work", "Margin calls and forced liquidation", "Why leverage must be used cautiously"] },
    teach: { title: "Amplified Risk", content: "Margin trading lets you borrow money from your broker to buy more securities. If you invest $10,000 with 2:1 leverage, you control $20,000. A 10% gain becomes 20%, but a 10% loss becomes 20% — and you can lose more than your original investment.", cards: [
      { title: "The Upside", description: "$10K invested with 2x leverage → $20K exposure. A 15% gain = $3,000 profit (30% on your money).", icon: "📈" },
      { title: "The Downside", description: "Same leverage, 15% loss = $3,000 loss (30% of your capital). A margin call forces you to sell at the worst time.", icon: "💥" },
    ]},
    interactive: { type: 'slider', title: "⚡ Leverage Impact Calculator", description: "See how leverage amplifies both gains AND losses:", sliders: [
      { id: "capital", label: "Your Capital", min: 5000, max: 100000, step: 5000, defaultValue: 10000, unit: "$" },
      { id: "leverage", label: "Leverage Ratio", min: 1, max: 5, step: 0.5, defaultValue: 2, unit: "x" },
      { id: "move", label: "Market Move", min: -30, max: 30, step: 5, defaultValue: -15, unit: "%" },
    ], calculateResult: (v) => {
      const exposure = v.capital * v.leverage;
      const pnl = exposure * v.move / 100;
      const returnPct = pnl / v.capital * 100;
      const remaining = v.capital + pnl;
      return { primary: `${v.move > 0 ? 'Profit' : 'Loss'}: $${Math.abs(Math.round(pnl)).toLocaleString()} (${returnPct > 0 ? '+' : ''}${returnPct.toFixed(0)}% on your capital)`, secondary: `Remaining capital: $${Math.max(0, Math.round(remaining)).toLocaleString()}`, insight: remaining <= 0 ? "MARGIN CALL — your entire capital is wiped out!" : returnPct < -50 ? "Approaching margin call territory!" : v.leverage > 3 ? "Extreme leverage — very dangerous." : "Moderate impact." };
    }},
    check: { type: 'frq', question: "A friend wants to use 5x leverage to 'maximize gains.' Explain the specific dangers, including what a margin call is and how leverage can lead to losing more than your original investment.", context: "Margin trading, leverage, margin calls, forced liquidation, risk amplification" },
    summary: { points: ["Leverage amplifies both gains and losses by the same multiple", "Margin calls force you to sell at the worst possible time", "With enough leverage, you can lose more than your original investment", "Professional traders use leverage very sparingly — most beginners should avoid it"], quote: { text: "Leverage is a double-edged sword. It can make you rich quickly — and poor even faster.", author: "Trading Wisdom" } },
  },
  {
    orderIndex: 24, title: "Building Your First Portfolio",
    intro: { description: "Apply everything you've learned to construct a real, diversified investment portfolio from scratch.", points: ["Core-satellite portfolio strategy", "Setting constraints: risk limits and goals", "Asset location for tax efficiency"] },
    teach: { title: "Putting It All Together", content: "The core-satellite approach puts most of your money (80%+) in low-cost index funds (the core) and a smaller portion in targeted bets (satellites). Asset location matters too: put tax-inefficient assets in tax-advantaged accounts (401k, IRA) and tax-efficient ones in taxable accounts.", cards: [
      { title: "Core Holdings (80%+)", description: "Low-cost index funds: total market, international, bonds. The foundation that provides diversification.", icon: "🏛️" },
      { title: "Satellite Holdings (<20%)", description: "Individual stocks, sector ETFs, REITs. Higher risk/reward bets around your stable core.", icon: "🛸" },
    ]},
    interactive: { type: 'slider', title: "🏗️ Portfolio Builder", description: "Build your ideal portfolio allocation:", sliders: [
      { id: "usStocks", label: "US Stocks", min: 0, max: 60, step: 5, defaultValue: 40, unit: "%" },
      { id: "intl", label: "International", min: 0, max: 30, step: 5, defaultValue: 20, unit: "%" },
      { id: "bonds", label: "Bonds", min: 0, max: 40, step: 5, defaultValue: 25, unit: "%" },
    ], calculateResult: (v) => {
      const other = 100 - v.usStocks - v.intl - v.bonds;
      const ret = (v.usStocks * 10 + v.intl * 8 + v.bonds * 4 + Math.max(0, other) * 6) / 100;
      return { primary: `US: ${v.usStocks}% | Intl: ${v.intl}% | Bonds: ${v.bonds}% | Other: ${Math.max(0,other)}%`, secondary: `Expected return: ~${ret.toFixed(1)}% | ${v.bonds > 30 ? 'Conservative' : v.bonds > 15 ? 'Balanced' : 'Aggressive'}`, insight: v.usStocks + v.intl + v.bonds > 100 ? "Over-allocated! Reduce some categories." : other < 0 ? "Over 100% — adjust your allocations." : "Well-structured portfolio!" };
    }},
    check: { type: 'quiz', questions: [
      { question: "In a core-satellite strategy, what should the 'core' consist of?", options: ["Individual stock picks", "Low-cost index funds", "Options and leveraged ETFs", "Cryptocurrency"], correctIndex: 1, explanation: "The core should be stable, diversified index funds that form the foundation of your portfolio." },
    ]},
    summary: { points: ["Core-satellite strategy: index funds as your foundation, small active bets around it", "Asset location: tax-inefficient assets in 401k/IRA, tax-efficient in taxable accounts", "Your portfolio should match your specific time horizon and risk tolerance", "Overall structure matters far more than any individual stock pick"], quote: { text: "The biggest risk of all is not taking one.", author: "Mellody Hobson" } },
  },
  {
    orderIndex: 25, title: "Short Selling Basics",
    intro: { description: "Learn how traders profit from declining prices — and why short selling carries the risk of unlimited loss.", points: ["The mechanics of borrowing shares to sell", "Short squeezes and their danger", "Why unlimited loss is possible"] },
    teach: { title: "Profiting from Decline", content: "Short selling means borrowing shares, selling them now, and buying them back later (hopefully cheaper). If the stock drops from $100 to $70, you profit $30/share. But if it rises, your losses are unlimited — a stock can go from $100 to $1,000 or higher.", cards: [
      { title: "How It Works", description: "Borrow shares → sell at $100 → stock drops to $70 → buy back → return shares → keep $30 profit.", icon: "📉" },
      { title: "The Danger", description: "Stock goes from $100 to $300: you owe $200/share. There's no ceiling on losses. GameStop short squeeze destroyed billions.", icon: "💀" },
    ]},
    interactive: { type: 'slider', title: "📉 Short Selling Risk Calculator", description: "See the asymmetric risk of short selling:", sliders: [
      { id: "shares", label: "Shares Shorted", min: 10, max: 500, step: 10, defaultValue: 100, unit: "" },
      { id: "entryPrice", label: "Short Entry Price", min: 20, max: 200, step: 10, defaultValue: 100, unit: "$" },
      { id: "currentPrice", label: "Current Price", min: 10, max: 300, step: 10, defaultValue: 130, unit: "$" },
    ], calculateResult: (v) => {
      const pnl = (v.entryPrice - v.currentPrice) * v.shares;
      const returnPct = ((v.entryPrice - v.currentPrice) / v.entryPrice * 100);
      return { primary: `${pnl >= 0 ? 'Profit' : 'Loss'}: $${Math.abs(pnl).toLocaleString()} (${returnPct > 0 ? '+' : ''}${returnPct.toFixed(0)}%)`, secondary: `You shorted at $${v.entryPrice}, stock is now $${v.currentPrice}`, insight: v.currentPrice > v.entryPrice ? "The stock went UP — you're losing money! This is why shorts are dangerous." : "The stock dropped — your short is profitable. But remember: your max gain is limited while losses are unlimited." };
    }},
    check: { type: 'frq', question: "Explain why short selling has 'unlimited loss potential' while buying a stock has limited downside. Use specific numbers to illustrate your point.", context: "Short selling, unlimited loss, borrowing shares, short squeezes, risk asymmetry" },
    summary: { points: ["Short selling profits from declining prices by borrowing and selling shares", "Maximum profit is limited (stock can only go to $0) but losses are unlimited", "Short squeezes force short sellers to buy back at higher prices, fueling further rises", "Short selling is extremely risky and requires strict discipline and stop-losses"], quote: { text: "He that sells what isn't his'n, must buy it back or go to prison.", author: "Daniel Drew" } },
  },
];
