import type { FeedCardData, CardType } from "../components/FeedCard";

interface LessonData {
  id: string;
  title: string;
  description: string;
  pathway: string | null;
  difficulty: string;
  order_index: number;
}

// Granular, specific tags instead of broad pathway labels
const TOPIC_TAGS: Record<string, string[]> = {
  investing: ["Index Funds", "Dividends", "ETFs", "Portfolio Strategy", "Risk Management"],
  "corporate-finance": ["Valuation", "Cash Flow", "M&A", "Financial Modeling", "Capital Structure"],
  "personal-finance": ["Budgeting", "Emergency Fund", "Credit Score", "Taxes", "Debt Payoff"],
  trading: ["Technical Analysis", "Options Basics", "Market Orders", "Day Trading", "Volatility"],
  "alternative-assets": ["Real Estate", "Crypto Basics", "REITs", "Commodities", "Collectibles"],
};

function getTag(pathway: string | null): string {
  const tags = TOPIC_TAGS[pathway || "investing"] || TOPIC_TAGS.investing;
  return tags[Math.floor(Math.random() * tags.length)];
}

// ────────────────────────────────────────────────
// REAL QUIZ CONTENT — specific, plausible answers
// ────────────────────────────────────────────────

const QUIZ_BANK: Record<string, Array<{
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
  tag: string;
}>> = {
  investing: [
    {
      question: "You have $5,000 to invest for 20 years. Which approach historically produces the best risk-adjusted return?",
      options: [
        { text: "Put it all in a total market index fund and forget it", correct: true, explanation: "Index funds have returned ~10% annually since 1926, beating 85% of active managers over 15-year periods." },
        { text: "Split between 5 individual stocks you researched on Reddit", correct: false, explanation: "Concentrated positions amplify risk. One bad pick can erase gains from the others." },
        { text: "Wait for a market dip before investing — timing matters", correct: false, explanation: "Time in market beats timing the market. Waiting for a dip means missing gains 67% of the time." },
        { text: "Invest in a target-date fund matching your retirement year", correct: false, explanation: "Target-date funds are solid, but their higher fees (0.3-0.7%) drag on returns vs. a simple index fund (0.03%)." },
      ],
      tag: "Index Funds",
    },
    {
      question: "A stock's P/E ratio is 45. What does this actually tell you?",
      options: [
        { text: "Investors pay $45 for every $1 of current earnings — high expectations are priced in", correct: true, explanation: "A P/E of 45 means the market expects strong future growth. If growth disappoints, the stock falls hard." },
        { text: "The stock is overpriced and you should sell immediately", correct: false, explanation: "High P/E doesn't always mean overpriced. Amazon's P/E was 300+ in 2012 — it 10x'd after." },
        { text: "The company made 45% profit this quarter", correct: false, explanation: "P/E is price divided by earnings per share, not a percentage. It's a valuation multiple, not a profitability metric." },
        { text: "The stock price is $45", correct: false, explanation: "P/E is a ratio, not the price. A $300 stock with $6.67 EPS also has a P/E of 45." },
      ],
      tag: "Valuation",
    },
    {
      question: "Your friend says they 'beat the market' this year with a 15% return. What's the most important follow-up question?",
      options: [
        { text: "What was your risk-adjusted return compared to the S&P 500?", correct: true, explanation: "Raw returns mean nothing without context. A 15% return with 3x the volatility of the S&P is actually underperforming." },
        { text: "Which stocks did you pick? I want to copy them.", correct: false, explanation: "Past picks don't predict future returns. Survivorship bias — you only hear about winners." },
        { text: "How much did you invest total?", correct: false, explanation: "Total invested doesn't matter for evaluating performance. Percentage return already normalizes for size." },
        { text: "Are you using a financial advisor?", correct: false, explanation: "Whether they use an advisor doesn't evaluate the actual performance claim." },
      ],
      tag: "Risk Management",
    },
  ],
  "personal-finance": [
    {
      question: "You just got your first credit card. What's the single most important thing to do?",
      options: [
        { text: "Set up autopay for the full statement balance every month", correct: true, explanation: "Paying the full balance avoids interest (15-25% APR). Autopay prevents missed payments that tank your credit score." },
        { text: "Keep your balance below 50% of your credit limit", correct: false, explanation: "Under 50% is okay, but under 10% is optimal for your credit score. But avoiding interest entirely by paying in full is more important." },
        { text: "Only use it for emergencies to avoid overspending", correct: false, explanation: "Using it regularly (and paying it off) builds credit history faster. Zero activity doesn't help your score." },
        { text: "Request a credit limit increase right away", correct: false, explanation: "A hard inquiry this early can temporarily hurt your new credit file. Build 6+ months of history first." },
      ],
      tag: "Credit Score",
    },
    {
      question: "You earn $55K/year. Your employer matches 401(k) contributions up to 4%. You have $8K in credit card debt at 22% APR. What should you prioritize?",
      options: [
        { text: "Contribute 4% to get the full match, then attack the credit card debt aggressively", correct: true, explanation: "The 401(k) match is a 100% instant return — unbeatable. After capturing that, the 22% APR debt is an emergency." },
        { text: "Pay off all the credit card debt first, then start contributing", correct: false, explanation: "You'd miss the employer match — that's literally free money with a 100% return. You can't beat that, even with 22% APR savings." },
        { text: "Split it 50/50 between retirement and debt payoff", correct: false, explanation: "Splitting dilutes both goals. Max the match first (it's guaranteed), then focus fire on the debt." },
        { text: "Put everything into the 401(k) since retirement compounds longer", correct: false, explanation: "22% APR compounding against you wipes out any long-term gains. Match first, then eliminate the debt." },
      ],
      tag: "Debt Payoff",
    },
    {
      question: "You're filing taxes and realize you can claim either the standard deduction ($14,600) or itemize. When does itemizing make sense?",
      options: [
        { text: "When your mortgage interest, state taxes, and charitable donations together exceed $14,600", correct: true, explanation: "Itemizing only wins when total deductions beat the standard amount. For most renters under 30, the standard deduction wins." },
        { text: "Always itemize — you'll find more deductions that way", correct: false, explanation: "Itemizing without enough deductions actually increases your tax bill. Most people under 35 save more with the standard deduction." },
        { text: "Itemize if you donated more than $500 to charity this year", correct: false, explanation: "$500 alone isn't enough. You'd need $14,100+ more in other deductions to beat the standard." },
        { text: "It doesn't matter — the IRS calculates whichever saves you more", correct: false, explanation: "The IRS doesn't choose for you. You must select one, and picking wrong means overpaying." },
      ],
      tag: "Taxes",
    },
  ],
  "corporate-finance": [
    {
      question: "A startup has $2M revenue growing 80% YoY but burns $500K/month. Their runway is 8 months. What's the most critical metric for survival?",
      options: [
        { text: "Months of runway remaining and the path to cash flow positive", correct: true, explanation: "At $500K/month burn, they have 8 months. Revenue growth is meaningless if they run out of cash before profitability." },
        { text: "Revenue growth rate — 80% YoY means they'll outgrow the burn", correct: false, explanation: "Revenue growth doesn't guarantee survival. Many high-growth startups died because burn exceeded runway. Cash is oxygen." },
        { text: "Customer acquisition cost vs. lifetime value ratio", correct: false, explanation: "CAC/LTV is important for unit economics, but irrelevant if the company runs out of cash in 8 months." },
        { text: "Gross margin — if it's above 60%, they're in good shape", correct: false, explanation: "Healthy margins mean nothing when you're hemorrhaging $500K/month and the bank account hits zero." },
      ],
      tag: "Cash Flow",
    },
  ],
  trading: [
    {
      question: "You notice a stock dropping 12% after hours on an earnings miss. The market opens in 14 hours. What should you consider first?",
      options: [
        { text: "Read the earnings call transcript — the guidance matters more than the miss", correct: true, explanation: "A small earnings miss with raised guidance often recovers. A beat with lowered guidance often drops further. Context is everything." },
        { text: "Set a limit buy order 5% below current after-hours price to catch the bounce", correct: false, explanation: "After-hours prices are unreliable due to thin volume. The actual open could be anywhere — you're guessing in the dark." },
        { text: "Sell your position at market open to cut losses", correct: false, explanation: "Selling into the opening volatility often means selling at the worst price. Panic selling locks in losses that might recover by lunch." },
        { text: "Check what the Reddit community thinks about the earnings", correct: false, explanation: "Retail sentiment is noise, not signal. Institutional positioning and actual business fundamentals drive lasting price moves." },
      ],
      tag: "Technical Analysis",
    },
  ],
  "alternative-assets": [
    {
      question: "You're 24 and considering putting 15% of your portfolio in Bitcoin. What's the strongest argument against this allocation?",
      options: [
        { text: "Bitcoin's 70-80% drawdowns mean 15% becomes a 10-12% portfolio drag in bear markets", correct: true, explanation: "Crypto's extreme volatility means a 15% allocation can dominate your portfolio's risk profile. Most advisors suggest 1-5% max." },
        { text: "Crypto is a scam and will go to zero eventually", correct: false, explanation: "Dismissing crypto entirely ignores institutional adoption by BlackRock, Fidelity, etc. The risk is sizing, not existence." },
        { text: "You should wait until you're older and have more money", correct: false, explanation: "Age isn't the issue — a 24-year-old has the longest time horizon and most recovery time. It's about position sizing." },
        { text: "You should put it in gold instead as a safer hedge", correct: false, explanation: "Gold and Bitcoin serve different portfolio functions. Gold is low-volatility preservation; Bitcoin is a high-vol asymmetric bet." },
      ],
      tag: "Crypto Basics",
    },
  ],
};

// ────────────────────────────────────────────────
// REAL CASE STUDY CONTENT
// ────────────────────────────────────────────────

const CASE_STUDIES: Array<{
  title: string;
  scenario: string;
  options: { text: string; correct: boolean; explanation: string }[];
  tag: string;
}> = [
  {
    title: "The Subscription Creep",
    scenario: "Maya checks her bank statement and discovers she's spending $287/month on subscriptions she barely uses — streaming, meal kits, gym, apps. She earns $3,800/month after taxes.",
    options: [
      { text: "Audit every subscription, cancel unused ones, negotiate rates on keepers — target under $80/month", correct: true, explanation: "Cutting $200/month = $2,400/year. Invested at 8%, that's $35K+ over 10 years. Small leaks sink ships." },
      { text: "Cancel everything and go cold turkey for 3 months", correct: false, explanation: "All-or-nothing rarely sticks. She'll re-subscribe within weeks. Selective cuts she can sustain beat dramatic resets." },
      { text: "It's only 7.5% of income — focus on earning more instead", correct: false, explanation: "7.5% on autopilot waste is significant. And earning more doesn't fix spending habits — lifestyle inflation fills the gap." },
      { text: "Switch to annual plans to save 15-20% on the ones she keeps", correct: false, explanation: "Locking into annual plans for services she barely uses is throwing money at the problem, not solving it." },
    ],
    tag: "Budgeting",
  },
  {
    title: "The Side Hustle Tax Surprise",
    scenario: "Jake earned $12,000 freelancing on top of his $50K salary. He didn't set aside any money for taxes. It's January and he owes the IRS.",
    options: [
      { text: "He likely owes ~$3,600 in self-employment + income tax on the $12K and should set up a payment plan", correct: true, explanation: "Self-employment tax (15.3%) + marginal income tax (~22%) on $12K ≈ $3,600. IRS payment plans exist for this exact situation." },
      { text: "His employer already withheld enough — the freelance income is below the reporting threshold", correct: false, explanation: "Any self-employment income over $400 is taxable. His W-2 withholding only covers his salary, not the $12K." },
      { text: "He should file for an extension to delay the payment until October", correct: false, explanation: "An extension extends filing time, not payment time. He still owes interest and penalties from April 15th." },
      { text: "He can deduct the full $12K as business expenses if he has receipts", correct: false, explanation: "Revenue isn't deductible — only legitimate business expenses are. He can deduct supplies, software, etc., but not the income itself." },
    ],
    tag: "Taxes",
  },
  {
    title: "The Emergency Fund Dilemma",
    scenario: "Priya has $15K saved in a high-yield savings account earning 4.5% APY. Her car needs a $3,200 repair. She also has $3,200 available on a credit card at 19% APR.",
    options: [
      { text: "Pay cash from savings — preserving the emergency fund principle isn't worth 19% interest", correct: true, explanation: "Using $3,200 from a $15K fund keeps you at $11,800 — still 3+ months of expenses. Credit card interest would cost $608/year." },
      { text: "Split it: $1,600 cash and $1,600 on the card to keep savings intact", correct: false, explanation: "Splitting still incurs $304/year in interest on the credit portion. The emergency fund exists for exactly this scenario." },
      { text: "Put it on the credit card and pay it off over 6 months to preserve cash", correct: false, explanation: "6 months at 19% APR adds ~$190 in interest. She has the cash — paying interest to keep money earning 4.5% is negative arbitrage." },
      { text: "Get a quote from another mechanic first — $3,200 seems high", correct: false, explanation: "Getting quotes is smart but doesn't answer the financing question. Once she decides to repair, cash beats credit card debt." },
    ],
    tag: "Emergency Fund",
  },
  {
    title: "The First Job 401(k) Freeze",
    scenario: "Derek, 22, just started his first job at $48K. HR hands him a 401(k) enrollment form with 30 fund options. He's overwhelmed and considers skipping it.",
    options: [
      { text: "Pick the target-date 2065 fund and contribute at least enough to get the full employer match", correct: true, explanation: "Target-date funds auto-diversify and rebalance. The employer match is 50-100% instant return. Waiting even 2 years costs $50K+ by retirement." },
      { text: "Skip it for now and open a Roth IRA instead — more control, better tax treatment", correct: false, explanation: "A Roth IRA is great, but skipping the 401(k) means leaving the employer match on the table. Do both if possible, but never skip free money." },
      { text: "Wait until he understands investing better — he doesn't want to lose money", correct: false, explanation: "Waiting to learn costs time in the market. Starting at 22 vs. 24 in a target-date fund can mean $100K+ difference by 65." },
      { text: "Put 100% in the S&P 500 index fund — he's young enough to handle the volatility", correct: false, explanation: "100% S&P 500 isn't wrong, but for someone overwhelmed by 30 options, a target-date fund removes all decision paralysis and still captures market returns." },
    ],
    tag: "Portfolio Strategy",
  },
  {
    title: "The Credit Score Mystery",
    scenario: "Aisha has never missed a payment, has no debt, and has one credit card she's had for 3 years. Her credit score is 680 — lower than she expected.",
    options: [
      { text: "Her thin credit file is the issue — she needs more account types and credit history length", correct: true, explanation: "One account for 3 years is a 'thin file.' Score models reward diversity (installment + revolving) and average age of accounts. She needs more data points." },
      { text: "680 is actually solid for someone her age — she shouldn't worry", correct: false, explanation: "680 is 'fair,' not 'good.' It means higher interest rates on future loans. With perfect payment history, she should be 740+ with a thicker file." },
      { text: "She should request a credit limit increase to improve her utilization ratio", correct: false, explanation: "Utilization matters, but with no debt, her utilization is already near 0%. The issue is account diversity and history length, not limits." },
      { text: "She probably has an error on her credit report that's dragging her score down", correct: false, explanation: "Errors are worth checking, but the most likely cause for a 680 with perfect payments is a thin file, not errors." },
    ],
    tag: "Credit Score",
  },
];

// ────────────────────────────────────────────────
// REAL SIMULATION CONTENT
// ────────────────────────────────────────────────

const SIMULATIONS: Array<{
  title: string;
  scenario: string;
  options: { text: string; correct: boolean; explanation?: string }[];
  outcome: string;
  tag: string;
}> = [
  {
    title: "Flash Crash: Your Portfolio Drops 8% in a Day",
    scenario: "It's 2:30 PM. Breaking news: a major bank is under investigation. The S&P 500 drops 4%. Your tech-heavy portfolio is down 8%. Your phone is blowing up with panicked friends.",
    options: [
      { text: "Do nothing — check your portfolio again in a week, not today", correct: true, explanation: "Historically, knee-jerk selling during flash crashes locks in losses. The market recovered from 85% of single-day 4%+ drops within 3 months." },
      { text: "Sell 30% of your tech holdings and move to bonds temporarily", correct: false, explanation: "Panic rebalancing into bonds means you sell low and miss the recovery. Emotional trades are the #1 destroyer of retail returns." },
      { text: "Buy more — this is a discount if your thesis hasn't changed", correct: false, explanation: "Buying the dip sounds smart but adding risk during uncertainty without understanding the catalyst is gambling, not investing." },
    ],
    outcome: "Three weeks later, the investigation finds no wrongdoing. The S&P recovers fully. Investors who panic-sold locked in a -8% loss. Those who held broke even.",
    tag: "Risk Management",
  },
  {
    title: "The Rent vs. Buy Calculator",
    scenario: "You're 26, earning $75K in Austin. A 2BR condo costs $320K. Rent for similar is $1,800/month. You have $40K saved. Mortgage rates are 6.8%. Do you buy?",
    options: [
      { text: "Keep renting — at 6.8%, the true cost of owning exceeds renting by $400+/month after taxes, insurance, and maintenance", correct: true, explanation: "Monthly mortgage: $2,080 + $400 taxes/insurance + $270 maintenance = $2,750. Renting at $1,800 and investing the $950 difference often wins." },
      { text: "Buy now — building equity is always better than paying someone else's mortgage", correct: false, explanation: "This ignores opportunity cost. The $40K down payment invested at 8% becomes $86K in 10 years. Equity building is slow in early mortgage years." },
      { text: "Wait for rates to drop below 5% then buy", correct: false, explanation: "Nobody can predict rates. Waiting means paying rent anyway, and lower rates usually mean higher home prices as demand increases." },
    ],
    outcome: "After 5 years: the renter who invested the difference has $78K in investments. The buyer has $31K in equity after closing costs. Renting won this round.",
    tag: "Real Estate",
  },
];

// ────────────────────────────────────────────────
// PATTERN INTERRUPTS — kept but with better content
// ────────────────────────────────────────────────

const MONEY_MYTHS = [
  { headline: "\"You need money to make money\"", reality: "The S&P 500 has returned ~10% annually. $50/month invested at 22 becomes $350K+ by 65. Starting small beats waiting to be rich.", stat: "$50/mo → $350K+" },
  { headline: "\"Renting is throwing money away\"", reality: "The average homeowner spends 30% of their home's value on maintenance over 30 years. Renting + investing the difference often wins.", stat: "30% hidden costs" },
  { headline: "\"Cash is safe\"", reality: "Inflation averages 3.2% annually. $10,000 in cash loses $320/year in purchasing power. 'Safe' is the most dangerous strategy.", stat: "-$320/yr lost" },
  { headline: "\"More risk = more reward\"", reality: "Diversified portfolios with moderate risk beat aggressive single-stock bets 73% of the time over 20-year periods.", stat: "73% win rate" },
  { headline: "\"Credit cards are bad\"", reality: "Responsible credit card use builds your credit score, earns 1-5% cashback, and provides purchase protection. The card isn't the problem — spending without a budget is.", stat: "1-5% cashback" },
];

const REALITY_SHOCKS = [
  { headline: "The Latte Math is Wrong", reality: "Cutting $5 lattes saves $1,825/yr. But negotiating ONE salary raise of 5% on $60K = $3,000/yr. Focus on income, not pennies.", stat: "$3K > $1.8K" },
  { headline: "Student Loans: The Real ROI", reality: "Average student debt is $37,338. Entry-level salaries haven't kept pace with tuition since 2008. Calculate ROI before choosing a school.", stat: "$37K avg debt" },
  { headline: "Most Millionaires Are Boring", reality: "79% of millionaires never inherited a dime. The average millionaire drives a used car and lives below their means.", stat: "79% self-made" },
  { headline: "The Savings Gap is Real", reality: "By 30, the median American has saved $20,000. Financial planners recommend 1x your annual salary. The gap is growing every year.", stat: "1x salary by 30" },
  { headline: "Day Trading is a Full-Time Loss", reality: "95% of day traders lose money over any 3-year period. The median crypto day trader has negative returns since 2021.", stat: "95% lose money" },
];

const RARE_INSIGHTS = [
  { headline: "The Rule of 72", reality: "Divide 72 by your return rate to find doubling time. At 8% returns, your money doubles every 9 years. $10K → $80K in 27 years.", stat: "72 ÷ rate = years" },
  { headline: "Tax-Loss Harvesting", reality: "Selling losing investments to offset gains can save $3,000+ in taxes annually. Most beginners leave this on the table.", stat: "$3K+ saved/yr" },
  { headline: "The First $100K is the Hardest", reality: "Charlie Munger's insight: the first $100K takes the longest. After that, compounding does the heavy lifting. $100K at 8% adds $8K/year passively.", stat: "Exponential growth" },
  { headline: "Dollar-Cost Averaging Psychology", reality: "Lump-sum investing beats DCA 68% of the time historically, but DCA reduces regret risk by 90%. Psychology matters more than math.", stat: "90% less regret" },
  { headline: "Your Biggest Asset Before 40", reality: "Your earning potential (human capital) dwarfs financial capital until ~age 45. Invest in skills, negotiation, and career moves — not just stocks.", stat: "Skills > Stocks" },
];

const SLIDER_CARDS = [
  { title: "The Savings Rate Question", question: "What percentage of after-tax income should you save to retire comfortably by 65?", answer: 20, unit: "%", min: 0, max: 50, explanation: "The 50/30/20 rule targets 20% minimum. Saving 15% means retiring at 67. Saving 25% can mean retiring at 57." },
  { title: "Emergency Fund Reality", question: "How many months of living expenses should your emergency fund cover?", answer: 6, unit: " months", min: 1, max: 12, explanation: "3-6 months is standard for W-2 employees. Freelancers and self-employed should target 9-12 months." },
  { title: "The Credit Utilization Sweet Spot", question: "What credit utilization percentage maximizes your credit score?", answer: 7, unit: "%", min: 0, max: 50, explanation: "Under 10% is optimal. People with 800+ scores average 7% utilization. 0% can actually lower your score slightly." },
  { title: "Inflation's Bite", question: "How much purchasing power does $100 lose over 10 years at average inflation?", answer: 26, unit: "%", min: 0, max: 50, explanation: "At 3% average inflation, $100 buys only $74 worth of goods after a decade. Your money literally shrinks while sitting in a checking account." },
];

const POLL_CARDS = [
  { question: "Which would you choose?", options: ["$1M right now", "$50K/year forever"], insight: "At a 5% return, $1M generates $50K/year AND you keep the principal. The lump sum is mathematically superior unless you'd outlive 20 years of spending." },
  { question: "What's your biggest financial anxiety?", options: ["Not saving enough", "Student loans", "Housing costs", "Not understanding investing"], insight: "You're not alone. 73% of Gen Z reports money as their #1 stress source. The antidote isn't more money — it's more knowledge and a plan." },
  { question: "Best first investment for a beginner?", options: ["Total market index fund", "Individual stocks", "High-yield savings", "Crypto"], insight: "A total market index fund gives instant diversification across 4,000+ stocks for near-zero fees. Start here, specialize later." },
  { question: "How do you feel about debt?", options: ["All debt is bad", "Mortgages are okay", "Leverage is a tool", "I avoid thinking about it"], insight: "Strategic debt (mortgages at low rates, business loans with ROI) builds wealth. Consumer debt at 20%+ APR destroys it. The type matters enormously." },
];

const COUNTER_FACTS = [
  { headline: "While you read this...", countFrom: 0, countTo: 847, suffix: " trades", prefix: "", duration: 3, subtext: "were executed on the NYSE", context: "The NYSE processes ~6 billion shares daily. Every second, prices adjust based on new information." },
  { headline: "Every single second...", countFrom: 0, countTo: 31688, suffix: "", prefix: "$", duration: 4, subtext: "in interest accrues on US national debt", context: "That's $2.7 billion per day in interest payments alone. The US debt crossed $34 trillion in 2024." },
  { headline: "Since you opened this app...", countFrom: 0, countTo: 190, suffix: " people", prefix: "", duration: 3, subtext: "became new millionaires worldwide", context: "~1,700 new millionaires are created daily. Most through business ownership, real estate, or consistent investing — not lottery tickets." },
  { headline: "In the time it takes to scroll...", countFrom: 0, countTo: 42000, suffix: "", prefix: "$", duration: 3, subtext: "changes hands in crypto markets globally", context: "Crypto trades $100B+ daily across exchanges. But 95% of that volume is institutional — not retail investors." },
];

// ────────────────────────────────────────────────
// CARD GENERATION
// ────────────────────────────────────────────────

type PatternInterruptType = "myth" | "shock" | "insight" | "slider" | "poll" | "counter";
const allCardTypes: CardType[] = ["quiz", "case-study", "simulation", "concept"];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStandardCard(lesson: LessonData, idx: number): FeedCardData {
  const type = allCardTypes[idx % allCardTypes.length];
  const pathway = lesson.pathway || "investing";

  // Try to pick real content from our banks
  if (type === "quiz") {
    const pool = QUIZ_BANK[pathway] || QUIZ_BANK.investing;
    const quiz = pool[idx % pool.length];
    return {
      id: `card-${idx}-${lesson.id}`,
      type: "quiz",
      lessonTitle: lesson.title,
      pathway: quiz.tag,
      difficulty: lesson.difficulty as FeedCardData["difficulty"],
      xpReward: 15,
      title: "Quick Check",
      content: quiz.question,
      options: quiz.options,
    };
  }

  if (type === "case-study") {
    const cs = CASE_STUDIES[idx % CASE_STUDIES.length];
    return {
      id: `card-${idx}-${lesson.id}`,
      type: "case-study",
      lessonTitle: cs.title,
      pathway: cs.tag,
      difficulty: lesson.difficulty as FeedCardData["difficulty"],
      xpReward: 20,
      title: cs.title,
      content: cs.scenario,
      options: cs.options,
    };
  }

  if (type === "simulation") {
    const sim = SIMULATIONS[idx % SIMULATIONS.length];
    return {
      id: `card-${idx}-${lesson.id}`,
      type: "simulation",
      lessonTitle: sim.title,
      pathway: sim.tag,
      difficulty: lesson.difficulty as FeedCardData["difficulty"],
      xpReward: 20,
      title: sim.title,
      content: sim.scenario,
      options: sim.options,
      scenarioOutcome: sim.outcome,
    };
  }

  // concept — use lesson data but with a relevant tag
  const tag = getTag(pathway);
  return {
    id: `card-${idx}-${lesson.id}`,
    type: "concept",
    lessonTitle: lesson.title,
    pathway: tag,
    difficulty: lesson.difficulty as FeedCardData["difficulty"],
    xpReward: 10,
    title: lesson.title,
    content: lesson.description,
    insight: `Understanding ${lesson.title.toLowerCase()} is a building block for ${tag.toLowerCase()} mastery.`,
  };
}

function generatePatternInterrupt(idx: number): FeedCardData {
  const interruptTypes: PatternInterruptType[] = ["myth", "shock", "insight", "slider", "poll", "counter"];
  const type = interruptTypes[idx % interruptTypes.length];

  if (type === "myth") {
    const myth = pickRandom(MONEY_MYTHS);
    return {
      id: `interrupt-myth-${idx}`, type: "myth", lessonTitle: "Money Myth", pathway: "Financial Literacy",
      difficulty: "intermediate", xpReward: 25, title: myth.headline, content: myth.reality, insight: myth.stat,
    };
  }
  if (type === "shock") {
    const shock = pickRandom(REALITY_SHOCKS);
    return {
      id: `interrupt-shock-${idx}`, type: "shock", lessonTitle: "Reality Check", pathway: "Financial Literacy",
      difficulty: "intermediate", xpReward: 25, title: shock.headline, content: shock.reality, insight: shock.stat,
    };
  }
  if (type === "insight") {
    const ins = pickRandom(RARE_INSIGHTS);
    return {
      id: `interrupt-insight-${idx}`, type: "rare-insight", lessonTitle: "Deep Insight", pathway: "Wealth Building",
      difficulty: "advanced", xpReward: 30, title: ins.headline, content: ins.reality, insight: ins.stat,
    };
  }
  if (type === "slider") {
    const slider = pickRandom(SLIDER_CARDS);
    return {
      id: `interrupt-slider-${idx}`, type: "slider", lessonTitle: "Interactive", pathway: "Test Yourself",
      difficulty: "beginner", xpReward: 20, title: slider.title, content: slider.question,
      sliderConfig: { answer: slider.answer, unit: slider.unit, min: slider.min, max: slider.max, explanation: slider.explanation },
    };
  }
  if (type === "poll") {
    const poll = pickRandom(POLL_CARDS);
    return {
      id: `interrupt-poll-${idx}`, type: "poll", lessonTitle: "Quick Poll", pathway: "Community",
      difficulty: "beginner", xpReward: 10, title: poll.question, content: poll.insight,
      options: poll.options.map((o, i) => ({ text: o, correct: i === 0 })),
    };
  }

  const counter = pickRandom(COUNTER_FACTS);
  return {
    id: `interrupt-counter-${idx}`, type: "counter", lessonTitle: "Live Stat", pathway: "Market Pulse",
    difficulty: "beginner", xpReward: 15, title: counter.headline, content: counter.subtext,
    counterConfig: { from: counter.countFrom, to: counter.countTo, suffix: counter.suffix, prefix: counter.prefix, duration: counter.duration, context: counter.context },
  };
}

export function generateFeedCards(lessons: LessonData[], count: number = 30): FeedCardData[] {
  const cards: FeedCardData[] = [];
  let sinceLastInterrupt = 0;
  const interruptInterval = () => 4 + Math.floor(Math.random() * 3);
  let nextInterrupt = interruptInterval();

  for (let i = 0; i < count; i++) {
    sinceLastInterrupt++;
    if (sinceLastInterrupt >= nextInterrupt) {
      cards.push(generatePatternInterrupt(i));
      sinceLastInterrupt = 0;
      nextInterrupt = interruptInterval();
      continue;
    }
    const lesson = lessons[i % lessons.length];
    cards.push(generateStandardCard(lesson, i));
  }
  return cards;
}
