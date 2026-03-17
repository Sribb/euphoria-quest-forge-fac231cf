
import { L, c, tr, fb, ds, q, tf, m, sl, sc, bi, pc, vi, cq,
  hookOpener, stakesCard, teachingSlide, microCheck, interactiveGraph,
  caseStudy, misconceptions, keyTermsCards, simulationFinale, summaryCards, whatsNext
} from '../helpers';

const lessons = [
  L(1,'Introduction to Investing',30,[
    // ═══════════════════════════════════════════
    // PHASE 1 — HOOK (Steps 1–2)
    // ═══════════════════════════════════════════

    // Step 1 — Real-World Opener
    hookOpener(
      'Introduction to Investing',
      '$1,000 invested in the S&P 500 in 1990 would be worth $23,000 today — without ever picking a single stock.',
      'By the end of this lesson, you\'ll understand exactly what investing is, the four main asset classes, and why millions of people build wealth this way.',
      'S&P 500 growth from $1,000 to $23,000 (1990–2024)'
    ),

    // Step 2 — Stakes Card
    stakesCard(
      { label: 'Savings account at 1% interest', detail: '$10,000 becomes $11,050 in 10 years. Inflation eats most of it. Your money actually loses purchasing power.' },
      { label: 'Index fund at 10% average return', detail: '$10,000 becomes $25,937 in 10 years. Your money works for you while you sleep, outpacing inflation by 7% annually.' }
    ),

    // ═══════════════════════════════════════════
    // PHASE 2 — TEACH (Steps 3–8)
    // ═══════════════════════════════════════════

    // Step 3 — First Teaching Slide (Core Concept)
    teachingSlide(
      'THE BASICS',
      'What Is Investing?',
      [
        'Investing means buying assets — things that can grow in value or generate income over time. When you invest, you put your money to work instead of letting it sit idle in a bank account.',
        'There are four main asset classes: stocks, bonds, real estate, and cash equivalents. Each has a different level of risk and potential return. Understanding these categories is the foundation of every investment decision.',
        'The key difference between saving and investing is growth. A savings account might pay 1% interest, but inflation averages 3% per year. That means savers actually lose purchasing power over time. Investors aim to beat inflation and grow real wealth.'
      ],
      [
        { term: 'Asset', definition: 'Anything you own that has financial value and can potentially generate returns.', example: 'A share of Apple stock, a rental property, or a U.S. Treasury bond are all assets.' },
        { term: 'Return', definition: 'The profit or loss on an investment, usually expressed as a percentage of the amount invested.', example: 'If you invest $1,000 and it grows to $1,100, your return is 10%.' },
        { term: 'Inflation', definition: 'The rate at which the general level of prices rises, eroding the purchasing power of money over time.', example: 'At 3% inflation, something that costs $100 today will cost $103 next year.' },
        { term: 'Portfolio', definition: 'The collection of all investments you own, across all asset classes.', example: 'A portfolio might contain 60% stocks, 30% bonds, and 10% cash.' }
      ],
      'Flow diagram showing money moving from a bank account (1% return) vs. an investment account (8% return), with inflation (3%) shown as a barrier in the middle.',
      { company: 'Vanguard', metric: 'Total Stock Market Index Fund (VTSAX)', outcome: 'averaged 10.4% annual return since 1992', explanation: 'A single index fund holding the entire U.S. stock market has turned $10,000 into over $200,000 in 30 years — with zero stock-picking required.' }
    ),

    // Step 4 — Embedded Micro-Check (Application-based)
    microCheck(
      'Maria has $5,000 in a savings account earning 1% interest. Inflation this year is 3.2%. At the end of the year, what has actually happened to her money?',
      ['It grew by $50 so she\'s better off', 'It lost purchasing power despite the balance increasing slightly', 'It stayed exactly the same in real terms', 'It doubled in real value due to compound interest'],
      1,
      'Correct! Her balance went up by $50, but inflation eroded $160 of purchasing power. She actually lost $110 in real terms. This is why keeping money in savings long-term guarantees losing wealth.',
      'Not quite. Her balance technically went up by $50 (1% of $5,000), but inflation at 3.2% eroded $160 of purchasing power. She actually lost $110 in real terms — her money buys less than before.'
    ),

    // Step 5 — Second Teaching Slide (Interactive Graph)
    interactiveGraph(
      'HOW IT WORKS',
      'The Power of Compound Growth',
      'exponential',
      'Watch how your money grows when you invest. Adjust the return rate and time period to see the exponential effect of compounding.',
      [
        'Compound growth means your returns generate their own returns. In year one, you earn interest on your original investment. In year two, you earn interest on your original investment plus last year\'s returns. This snowball effect accelerates over time.',
        'The difference between 1% (savings) and 8% (investing) seems small, but over decades it\'s massive. At 1%, $1,000 becomes $1,349 in 30 years. At 8%, it becomes $10,063. That\'s not 8x more — it\'s the exponential power of compounding.',
        'This is why starting early matters so much. An investor who starts at 25 with $5,000 per year at 10% will have $2.4 million by 65. Starting at 35 — just 10 years later — yields only $900,000. That decade costs over $1.5 million.'
      ],
      [
        { term: 'Compound', definition: 'Earning returns on your returns, not just on your original investment.', example: '$1,000 at 10%: Year 1 = $1,100, Year 2 = $1,210, Year 3 = $1,331.' },
        { term: 'Principal', definition: 'The original amount of money you invest before any returns are added.', example: 'If you invest $5,000, your principal is $5,000.' }
      ],
      [
        'At 8% annual return, your money doubles approximately every 9 years (the Rule of 72).',
        'After 30 years, over 90% of your wealth comes from compound returns — not from your original contributions.',
        'Starting 10 years earlier can more than double your final amount, even investing the same amount per year.'
      ],
      [
        { label: 'Annual Return', min: 1, max: 15, default: 8, unit: '%' },
        { label: 'Time Period', min: 5, max: 40, default: 20, unit: ' years' }
      ],
      { company: 'Warren Buffett', metric: 'Net worth timeline', outcome: '$95B of his $100B+ net worth came after age 60', explanation: 'Buffett started investing at age 11. His wealth exploded in later decades because compound growth is exponential — the longer it runs, the more dramatic the results.' }
    ),

    // Step 6 — Third Teaching Slide (Case Study)
    caseStudy(
      'Amazon: From $18 to $3,000+',
      [
        { date: 'May 1997', event: 'Amazon IPOs at $18 per share', context: 'Jeff Bezos takes Amazon public. The company sells books online and has never turned a profit. Most Wall Street analysts are skeptical.' },
        { date: '2001', event: 'Stock crashes to $6 during Dotcom bust', context: 'Amazon loses 90% of its value. Headlines declare e-commerce dead. Investors who panic-sell lock in massive losses.' },
        { date: '2009', event: 'Stock recovers to $85 — launches AWS', context: 'Amazon Web Services becomes a cash machine. Patient investors who held through the crash are now up 370% from the IPO.' },
        { date: '2024', event: 'Stock exceeds $3,000 (split-adjusted equivalent)', context: 'A $1,000 investment at the IPO is worth over $166,000. The key wasn\'t picking the right stock — it was having the patience to hold through two major crashes.' }
      ],
      'Amazon\'s story illustrates the most important principle in investing: time in the market beats timing the market. Investors who sold during the crashes missed the recoveries. Those who held — even through 90% drops — saw life-changing returns. Patience and a long time horizon are an investor\'s greatest advantages.'
    ),

    // Step 7 — Fourth Teaching Slide (Misconceptions)
    misconceptions(
      'COMMON MISTAKES',
      'What most people get wrong about investing',
      [
        {
          myth: 'You need thousands of dollars to start investing.',
          truth: 'You can start with as little as $1. Most brokerages now offer fractional shares and zero-commission trading.',
          explanation: 'This misconception persists from an era when brokerages charged $50 per trade and required minimum balances. Apps like Fidelity, Schwab, and Robinhood eliminated those barriers entirely.'
        },
        {
          myth: 'Investing is basically gambling — you\'ll probably lose everything.',
          truth: 'A diversified portfolio held for 20+ years has never lost money in U.S. market history. The S&P 500 has returned ~10% annually on average since 1926.',
          explanation: 'Individual stocks can go to zero, but a diversified index fund spreads your money across hundreds of companies. Even including crashes (1929, 2008, 2020), long-term investors always came out ahead.'
        },
        {
          myth: 'You need to watch the market every day and pick the right stocks.',
          truth: '80% of professional fund managers fail to beat a simple index fund over 15 years. Passive investing outperforms active stock-picking for most people.',
          explanation: 'The data is overwhelming: buying and holding an index fund beats most professional strategies. Time and consistency matter far more than stock-picking skill.'
        }
      ]
    ),

    // Step 8 — Key Terms Reference Cards
    keyTermsCards([
      { term: 'Asset', definition: 'Anything you own that has financial value. In investing, assets include stocks, bonds, real estate, and cash equivalents.', example: 'Owning 10 shares of Apple stock means you hold $1,700+ in stock assets.', sentence: 'She diversified her assets across stocks, bonds, and real estate to reduce her overall portfolio risk.' },
      { term: 'Return', definition: 'The profit or loss on an investment over a specific period, expressed as a percentage of the original investment.', example: 'If you invest $5,000 and it grows to $5,500 in a year, your annual return is 10%.', sentence: 'The fund delivered a 12% return last year, outperforming its benchmark by 2 percentage points.' },
      { term: 'Inflation', definition: 'The rate at which prices rise across the economy, reducing the purchasing power of each dollar you hold.', example: 'At 3% inflation, a $30 meal this year will cost $30.90 next year.', sentence: 'With inflation running at 4%, her savings account\'s 1% interest rate meant she was actually losing 3% in real purchasing power.' },
      { term: 'Portfolio', definition: 'The total collection of all your investments. A portfolio can contain any mix of stocks, bonds, real estate, and cash.', example: 'A common starter portfolio: 80% stocks (via an S&P 500 ETF) and 20% bonds.', sentence: 'He rebalanced his portfolio quarterly to maintain his target allocation of 70% stocks and 30% bonds.' },
      { term: 'Liquidity', definition: 'How quickly and easily you can convert an investment into cash without significantly affecting its price.', example: 'Stocks are highly liquid — you can sell in seconds. Real estate is illiquid — selling a house takes months.', sentence: 'She kept 3 months of expenses in a high-yield savings account for liquidity, while investing the rest for long-term growth.' },
      { term: 'Diversification', definition: 'Spreading your investments across different asset classes, industries, and regions to reduce the impact of any single loss.', example: 'Instead of buying one stock, an S&P 500 ETF gives you exposure to 500 companies at once.', sentence: 'Diversification is the only free lunch in investing — it reduces risk without necessarily reducing expected returns.' }
    ]),

    // ═══════════════════════════════════════════
    // PHASE 3 — PRACTICE (Steps 9–16)
    // ═══════════════════════════════════════════

    // Step 9 — Fill in the Blank
    fb('Investing is putting money to work so it grows faster than ___.',['inflation','deflation','savings','interest'],0),

    // Step 10 — Multiple Choice (Scenario-based)
    q('Sarah has $10,000 sitting in a checking account earning 0.01% interest. Inflation is currently 3.2%. After 5 years, what has actually happened to her money?',
      ['It grew slightly because it earned interest','It stayed the same because it\'s in a safe account','It lost about 15% of its purchasing power despite the balance barely changing','It doubled because banks protect against inflation'],
      2,
      'Correct. At 0.01% interest vs 3.2% inflation, Sarah loses ~3.19% of purchasing power per year. After 5 years, her $10,000 can only buy about $8,500 worth of goods in today\'s dollars — even though her bank balance reads $10,005. This is the "invisible tax" of inflation on savers.'
    ),

    // Step 11 — Tap to Reveal
    tr('Investment Facts You Should Know',[
      ['What was the S&P 500\'s average annual return since 1926?','Approximately 10% per year — despite depressions, wars, pandemics, and financial crises.'],
      ['How much would $1,000 invested in 1990 be worth today?','About $23,000 in a simple S&P 500 index fund — a 2,200% total return.'],
      ['What percentage of active fund managers beat the S&P 500 over 15 years?','Only about 8%. The other 92% would have done better with a simple index fund.'],
      ['How long has the U.S. market taken to recover from its worst crashes?','The longest recovery was ~5.5 years (2007-2013). Patient investors were rewarded every time.']
    ]),

    // Step 12 — Drag and Drop: Order the steps of how compound growth works
    ds('Put these steps in order: How does $1,000 grow through compound interest?',[
      'You invest $1,000 at an 8% annual return',
      'After Year 1, you earn $80 in returns → balance is $1,080',
      'In Year 2, you earn 8% on $1,080 (not just $1,000)',
      'Your returns start generating their own returns',
      'After 10 years, over half your balance is from compounded returns',
      'After 30 years, 90%+ of your wealth comes from compound growth'
    ]),

    // Step 13 — Scenario Simulation (Interactive Diagram replacement)
    sc('You have $5,000 to invest for retirement in 30 years. You\'re choosing between three approaches. Which strategy will likely produce the best long-term result?',[
      {label:'Keep it all in a savings account at 1.5% — safe and guaranteed',outcome:'After 30 years: $7,832. Inflation at 3% means this is actually worth about $3,700 in today\'s dollars. Playing it "safe" actually guaranteed you\'d lose purchasing power.',correct:false},
      {label:'Invest in a diversified stock index fund averaging 10% — accept short-term volatility',outcome:'After 30 years: $87,247. Even accounting for inflation, this is worth about $41,000 in today\'s dollars. Time in the market smoothed out the volatility.',correct:true},
      {label:'Wait for a market crash to invest — buy low',outcome:'Historically, investors who wait for crashes miss more gains than they save. Studies show that investing immediately beats waiting for a dip 75% of the time over any 10-year period.',correct:false}
    ]),

    // Step 14 — Slider Prediction
    sl('What percentage of your final retirement wealth comes from compound returns (not your original contributions) after 30 years of investing?',10,100,90,'%'),

    // Step 15 — True/False Rapid Set
    tf([
      {s:'Saving alone is enough to build long-term wealth if you save enough',a:false},
      {s:'The stock market has always recovered from crashes — eventually',a:true},
      {s:'You need to be an expert to start investing successfully',a:false},
      {s:'Starting to invest at 25 vs 35 can mean 2-3x more money at retirement',a:true},
      {s:'A diversified portfolio of stocks has lost money over every 20-year period in history',a:false}
    ]),

    // Step 16 — Match Pairs
    m('Match the Asset to Its Profile',[
      ['Stocks','Highest potential return, highest volatility — ownership in companies'],
      ['Bonds','Steady income, lower risk — loans to governments or corporations'],
      ['Real Estate','Rental income and appreciation — requires more capital to enter'],
      ['Cash','Safest, lowest return — savings accounts and money market funds']
    ]),

    // ═══════════════════════════════════════════
    // PHASE 4 — APPLY (Steps 17–18)
    // ═══════════════════════════════════════════

    // Step 17 — Applied Scenario Question
    q('Your friend Marcos just graduated college and has $3,000 saved. He says: "I\'ll wait until I have $50,000 to start investing — $3,000 isn\'t enough to matter." He plans to save in a regular bank account until then. Using what you\'ve learned about compound growth, inflation, and the accessibility of modern investing, what is the best response?',
      [
        'He\'s right — $3,000 is too little to make a difference in investing',
        'He should start investing now because compound growth rewards early starters exponentially, even with small amounts',
        'He should put it all in bonds since he doesn\'t have much money',
        'He should wait for a market crash to get better prices'
      ],
      1,
      'Starting early is far more important than starting big. $3,000 invested at 22 at 10% average return becomes $132,000 by age 65. If he waits until he saves $50,000 and starts at 32, even that larger amount only grows to $109,000 in the same timeframe. Modern brokerages have no minimums and offer fractional shares. Every year of delay costs more than any amount of additional savings can compensate for.'
    ),

    // Step 18 — Simulation Finale
    simulationFinale(
      'You Inherit $10,000',
      'A relative has left you $10,000. The stock market just dropped 25% in the past month. Headlines are panicking. You need to make a series of decisions about what to do with this money.',
      [
        {
          prompt: 'Decision 1: The market just crashed 25%. What do you do with the $10,000?',
          options: [
            { label: 'Invest all $10,000 immediately in a diversified index fund', consequence: 'Bold move. Historically, investing during crashes has produced the best long-term returns. Markets have always recovered. You\'re buying stocks "on sale."', score: 3 },
            { label: 'Invest $5,000 now and $5,000 over the next 6 months', consequence: 'Smart compromise. Dollar-cost averaging reduces the risk of investing everything at the worst possible moment while still getting money working.', score: 2 },
            { label: 'Keep it all in savings and wait for the market to recover', consequence: 'You feel safe, but history shows investors who wait for recovery miss the biggest gains. The best days in the market often come right after the worst.', score: 0 }
          ]
        },
        {
          prompt: 'Decision 2: Two months later, your investment has dropped another 10%. A coworker says "get out before you lose everything." What do you do?',
          options: [
            { label: 'Sell everything — cut your losses', consequence: 'You locked in your losses. Historically, the worst thing an investor can do is sell during a downturn. You turned a temporary paper loss into a permanent real loss.', score: 0 },
            { label: 'Hold steady — do nothing', consequence: 'Patience pays. Markets are volatile in the short term but have always trended up over 10+ year periods. Doing nothing during panic is often the smartest strategy.', score: 2 },
            { label: 'Buy more — stocks are even cheaper now', consequence: 'This is contrarian but historically optimal. Buying during maximum pessimism has produced the highest long-term returns. You\'re lowering your average cost.', score: 3 }
          ]
        },
        {
          prompt: 'Decision 3: One year later, markets have recovered and your portfolio is up 15% from where you started. A friend says a hot stock could double your money. What do you do?',
          options: [
            { label: 'Move everything into the hot stock tip', consequence: 'Concentrated bets are gambling, not investing. If the stock drops, you lose everything. Diversification exists specifically to prevent this kind of risk.', score: 0 },
            { label: 'Stay diversified and keep investing regularly', consequence: 'Consistency and diversification are the proven path. You\'re not chasing excitement — you\'re building wealth systematically.', score: 3 },
            { label: 'Take profits and move to cash — you\'re up, lock it in', consequence: 'Selling winners and sitting in cash means inflation erodes your gains. Long-term investors stay invested through ups and downs.', score: 1 }
          ]
        },
        {
          prompt: 'Decision 4: Five years have passed. Your portfolio has doubled. You\'re considering your strategy going forward. What do you do?',
          options: [
            { label: 'Increase contributions and maintain your diversified strategy', consequence: 'The compounding engine is running. Adding more fuel (contributions) while staying diversified maximizes long-term growth.', score: 3 },
            { label: 'Stop contributing — you\'ve made enough', consequence: 'Stopping contributions halts the compounding effect. Even a doubled portfolio benefits enormously from continued regular investment.', score: 1 },
            { label: 'Move everything to bonds — protect your gains', consequence: 'At this stage of wealth-building, being too conservative sacrifices decades of compound growth. Asset allocation should match your timeline, not your emotions.', score: 1 }
          ]
        }
      ],
      'Investing immediately, holding through the crash, staying diversified, and continuing to invest regularly — scoring 12/12.',
      'The best investment decisions often feel uncomfortable in the moment. Investing during crashes, ignoring panic, and staying consistent are the three behaviors that separate successful investors from everyone else. Emotions are the biggest threat to your portfolio — not market crashes.'
    ),

    // ═══════════════════════════════════════════
    // PHASE 5 — CONSOLIDATE (Steps 20–22)
    // ═══════════════════════════════════════════

    // Step 20 — Summary Cards
    summaryCards('Introduction to Investing', [
      { takeaway: 'Investing beats saving', detail: 'Saving at 1% loses to inflation. Investing at 8-10% average return is the only reliable way to build real wealth over time.' },
      { takeaway: 'Four asset classes', detail: 'Stocks (highest return, highest risk), Bonds (steady income, lower risk), Real Estate (appreciation + income), and Cash (safest, lowest return). Every portfolio combines these.' },
      { takeaway: 'Time is your superpower', detail: 'Compound growth is exponential. Starting 10 years earlier can mean 2-3x more wealth at retirement. The best time to start investing was yesterday.' }
    ]),

    // Step 22 — What's Next
    whatsNext(
      'Introduction to Investing',
      'Stocks Explained',
      'You\'ll learn exactly what a stock is, how stock prices are determined, and why companies issue shares. This builds directly on the asset classes you just learned.',
      25
    )
  ],[
    // ═══════════════════════════════════════════
    // CHALLENGE ROUND (Step 19) — 5 Questions
    // ═══════════════════════════════════════════
    cq('A friend has $10,000 in a savings account earning 0.5% interest while inflation runs at 3.5%. After 10 years, approximately how much purchasing power have they lost?',
      ['None — savings accounts are safe','About $3,000 in real purchasing power','About $500','Their money doubled'],
      1,'At 0.5% interest vs 3.5% inflation, they lose ~3% of purchasing power per year. Over 10 years, that\'s roughly $3,000 in real value — their $10,000 can only buy what $7,000 could when they started.'),
    cq('Why has the S&P 500 historically returned ~10% per year despite multiple crashes, wars, and recessions?',
      ['The government guarantees stock returns','Companies innovate and grow revenue, and stock prices reflect long-term earnings growth','Stocks always go up every year','Professional traders prop up the market'],
      1,'Stock prices ultimately reflect corporate earnings. Over decades, companies grow revenues through innovation, expansion, and productivity gains. Short-term crashes are noise; long-term earnings growth is the signal.'),
    cq('Which combination correctly matches ALL asset classes to their risk profiles?',
      ['Stocks=Low risk, Bonds=High risk, Real Estate=No risk, Cash=Medium risk','Stocks=Highest risk/return, Bonds=Moderate risk/return, Real Estate=Illiquid/moderate return, Cash=Lowest risk/return','All asset classes have equal risk','Bonds are riskier than stocks because companies can default'],
      1,'Stocks offer the highest potential return with the highest volatility. Bonds provide steady income with lower risk. Real estate offers appreciation but is illiquid. Cash is safest but barely keeps pace with inflation.'),
    cq('An investor puts $5,000 per year into an index fund starting at age 25, earning 10% average annual return. Another starts the same strategy at age 35. By age 65, approximately how much more does the early starter have?',
      ['About $100,000 more','About $500,000 more','About $1,500,000 more','About the same amount'],
      2,'Starting at 25: ~$2.4 million. Starting at 35: ~$900,000. That 10-year head start generates over $1.5 million in additional wealth thanks to compound growth. Time is the most powerful variable in investing.'),
    cq('During the 2008 financial crisis, the S&P 500 dropped 57%. An investor who sold at the bottom in March 2009 and waited to "feel safe" before reinvesting in 2013 missed approximately what percentage of the recovery gains?',
      ['About 25%','About 80%','About 140%','About 10%'],
      2,'From the March 2009 bottom to early 2013, the S&P 500 gained approximately 140%. Investors who sold at the bottom and waited for confidence to return missed the entire recovery — turning a temporary paper loss into a permanent real loss.')
  ]),

  // ═══════════════════════════════════════════════════════════════
  // LESSON 2 — RISK VS. REWARD
  // ═══════════════════════════════════════════════════════════════
  L(2,'Risk vs. Reward',30,[
    // PHASE 1 — HOOK
    hookOpener(
      'Risk vs. Reward',
      'The S&P 500 has survived 27 bear markets since 1928 — and recovered from every single one. Higher risk has always meant higher long-term reward.',
      'By the end of this lesson, you\'ll understand the risk-return tradeoff, how to measure risk, and why accepting the right amount of risk is essential to building wealth.',
      'Risk-return spectrum showing asset classes from savings to stocks over 30 years'
    ),
    stakesCard(
      { label: 'A single stock losing 80% in a crash', detail: 'Investors who put everything into one company — like Enron, Lehman Brothers, or Peloton — lost 80-100% of their money. Concentration risk is the fastest way to destroy wealth.' },
      { label: 'A diversified portfolio losing only 20% in the same crash', detail: 'During the 2008 crisis, a diversified 60/40 portfolio lost roughly 20%, recovered within 2 years, and went on to triple in value by 2024. Diversification turns catastrophic losses into temporary setbacks.' }
    ),

    // PHASE 2 — TEACH
    teachingSlide(
      'THE FUNDAMENTALS',
      'Understanding the Risk-Return Tradeoff',
      [
        'Every investment sits somewhere on a risk-return spectrum. At one end, savings accounts offer near-zero risk but returns so low they lose to inflation. At the other end, individual stocks can deliver 20%+ annual returns but can also lose 50% or more in a single year.',
        'Risk in investing is measured by volatility — how much an investment\'s value swings up and down. The S&P 500 has averaged 10% annual returns since 1926, but in any given year it might return +30% or -30%. The key insight: higher volatility is the price you pay for higher long-term returns.',
        'The most important concept in risk management is your time horizon. Over any single year, stocks lose money about 26% of the time. Over any 10-year period, that drops to 6%. Over any 20-year period in U.S. history, stocks have never lost money. Time transforms risk into reward.'
      ],
      [
        { term: 'Volatility', definition: 'A statistical measure of how much an investment\'s price fluctuates over time. Higher volatility = wider price swings.', example: 'Bitcoin has ~80% annual volatility vs ~15% for the S&P 500 — meaning its price swings 5x more wildly.' },
        { term: 'Risk Premium', definition: 'The extra return investors earn for taking on additional risk compared to a risk-free asset like Treasury bills.', example: 'Stocks have historically earned a ~7% risk premium over Treasury bills — the reward for accepting volatility.' },
        { term: 'Time Horizon', definition: 'The length of time you plan to hold an investment before needing the money.', example: 'A 25-year-old saving for retirement has a 40-year time horizon, allowing them to take more risk.' },
        { term: 'Drawdown', definition: 'The peak-to-trough decline in the value of an investment during a specific period.', example: 'The S&P 500\'s maximum drawdown during 2008 was -57% — it took until 2013 to fully recover.' }
      ],
      'Horizontal risk-return spectrum with five asset classes plotted as labeled dots from left (safe, low return) to right (risky, high return): Savings, Bonds, Real Estate, Index Funds, Individual Stocks.',
      { company: 'Vanguard Research', metric: 'Risk vs. return by asset class (1926-2023)', outcome: 'Stocks returned 10.3% annually vs 5.1% for bonds and 3.3% for cash', explanation: 'The equity risk premium — the extra return stocks earn over bonds — has averaged about 5% per year over nearly a century. This premium is the compensation investors receive for accepting short-term volatility.' }
    ),

    microCheck(
      'An investor holds $50,000 in a single tech stock. The stock drops 75% during a sector crash. Meanwhile, a diversified index fund dropped only 30% in the same period. What was the primary difference?',
      ['The index fund investor was luckier', 'The single stock had concentrated risk while the index fund spread risk across hundreds of companies', 'Tech stocks are always bad investments', 'Index funds never lose money'],
      1,
      'Correct! Concentration in a single stock exposes you to company-specific risk — one bad earnings report, one scandal, one industry shift can destroy 75%+ of your value. A diversified index fund spreads that risk across hundreds of companies, so no single failure can be catastrophic.',
      'Not quite. The key difference is diversification. A single stock carries company-specific risk — one bad event can cause a 75%+ loss. A diversified index fund spreads risk across hundreds of companies, limiting any single stock\'s impact to a fraction of a percent.'
    ),

    interactiveGraph(
      'RISK IN ACTION',
      'Conservative vs. Aggressive: 30-Year Comparison',
      'comparison',
      'Watch how two portfolios — one conservative (40% stocks / 60% bonds) and one aggressive (90% stocks / 10% bonds) — perform over 30 years including crashes and recoveries.',
      [
        'A conservative portfolio experiences smaller drawdowns during crashes but lower overall growth. During the 2008 crisis, a 40/60 portfolio lost about 20% while a 90/10 portfolio lost 45%. But over 30 years, the aggressive portfolio ended up with roughly 3x more wealth.',
        'The key insight is that short-term pain leads to long-term gain — but only if you can actually hold through the pain. The best portfolio is the one you won\'t sell during a crash. If a 45% drawdown would make you panic-sell, a conservative allocation will actually perform better for you.',
        'Risk tolerance isn\'t just about math — it\'s about psychology. An investor who sleeps well during a 20% drop and one who panic-sells during the same drop will have dramatically different outcomes, even if they started with identical portfolios.'
      ],
      [
        { term: 'Asset Allocation', definition: 'The percentage of your portfolio dedicated to each asset class (stocks, bonds, cash, etc.).', example: 'A 60/40 portfolio means 60% stocks and 40% bonds.' },
        { term: 'Drawdown', definition: 'The decline from a portfolio\'s peak value to its lowest point during a downturn.', example: 'A portfolio worth $100,000 that drops to $55,000 has a 45% drawdown.' }
      ],
      [
        'Over any 20-year period since 1926, a 100% stock portfolio has never lost money.',
        'The average bear market lasts 9.6 months. The average bull market lasts 2.7 years.',
        'Missing just the 10 best trading days in a 20-year period cuts your total return by more than half.'
      ],
      [
        { label: 'Stock Allocation', min: 10, max: 100, default: 60, unit: '%' },
        { label: 'Time Period', min: 5, max: 40, default: 30, unit: ' years' }
      ],
      { company: 'Dalbar Research', metric: 'Average investor return vs S&P 500 (1994-2023)', outcome: 'Average investor earned 3.7% vs S&P 500\'s 9.9%', explanation: 'The gap is entirely behavioral — investors buy high during euphoria and sell low during panic. The market itself returned 9.9%, but the average investor earned only 3.7% because they couldn\'t handle the volatility.' }
    ),

    caseStudy(
      'Amazon: 94% Crash to 100x Recovery',
      [
        { date: 'December 1999', event: 'Amazon stock peaks at $113 per share', context: 'The dotcom bubble has inflated Amazon\'s stock price to absurd levels. The company has never turned a profit. Revenue is $1.6 billion but losses are mounting.' },
        { date: 'September 2001', event: 'Stock crashes to $5.51 — a 94% decline', context: 'The dotcom bust wipes out trillions. Amazon\'s stock loses 94% of its value. Analysts predict bankruptcy. CEO Jeff Bezos writes to shareholders: "Ouch."' },
        { date: '2003-2006', event: 'Slow recovery as Amazon launches AWS and Prime', context: 'While most dotcom companies died, Amazon pivots to cloud computing and subscription services. The stock slowly climbs back to $40-50.' },
        { date: '2020-2021', event: 'Stock surpasses $3,000 — a 545x return from the bottom', context: 'An investor who held through the 94% crash saw their $5.51 shares become worth $3,000+. A $1,000 investment at the bottom became $545,000.' }
      ],
      'Amazon\'s story teaches the most painful lesson in investing: the highest returns come from holding through the deepest drawdowns. Investors who sold during the 94% crash avoided further losses — but they also missed a 54,500% recovery. Risk and reward are inseparable. The investors who earned 100x returns were the ones who endured a 94% loss first.'
    ),

    misconceptions(
      'RISK MYTHS',
      'What most people get wrong about investment risk',
      [
        {
          myth: 'Risk means you\'ll lose your money.',
          truth: 'Risk means the value of your investment fluctuates in the short term. For diversified portfolios held long-term, this volatility has always resulted in positive returns.',
          explanation: 'The S&P 500 has been negative in roughly 26% of calendar years, but over every 20-year rolling period since 1926, it has been positive. Short-term fluctuation is not the same as permanent loss.'
        },
        {
          myth: 'The safest strategy is keeping money in cash.',
          truth: 'Cash is "safe" from volatility but guaranteed to lose purchasing power. At 3% inflation, cash loses half its value every 24 years.',
          explanation: '$100,000 in cash in 2000 has the purchasing power of about $57,000 today. "Safe" cash investors have silently lost 43% of their wealth. The real risk isn\'t volatility — it\'s inflation.'
        },
        {
          myth: 'Higher risk always means higher returns.',
          truth: 'Higher risk means higher potential returns, but only with proper diversification and time. Concentrated bets in a single stock can — and do — go to zero.',
          explanation: 'The risk premium only applies to systematic (market) risk. Company-specific risk — like putting everything in one stock — is unrewarded risk. Diversification eliminates this unrewarded risk while preserving the risk premium.'
        }
      ]
    ),

    keyTermsCards([
      { term: 'Volatility', definition: 'A statistical measure of how much an investment\'s value fluctuates over time, usually expressed as standard deviation of returns.', example: 'The S&P 500 has about 15% annual volatility, meaning returns typically range from -5% to +25% in any given year.', sentence: 'Despite the short-term volatility, her diversified portfolio delivered a steady 9% average annual return over 20 years.' },
      { term: 'Risk Premium', definition: 'The additional return an investor receives for bearing risk above the risk-free rate (typically Treasury bills).', example: 'If Treasury bills yield 3% and stocks return 10%, the equity risk premium is 7%.', sentence: 'The risk premium for stocks has averaged about 7% over Treasury bills, compensating investors for enduring market volatility.' },
      { term: 'Drawdown', definition: 'The peak-to-trough decline in the value of an investment or portfolio during a specific period, expressed as a percentage.', example: 'During the 2008 financial crisis, the S&P 500 experienced a maximum drawdown of 57% from its October 2007 peak to March 2009 trough.', sentence: 'She stress-tested her portfolio to ensure she could handle a 40% drawdown without panicking and selling.' },
      { term: 'Time Horizon', definition: 'The total length of time an investor expects to hold their portfolio before needing to withdraw the money.', example: 'A 25-year-old saving for retirement at 65 has a 40-year time horizon.', sentence: 'With a 30-year time horizon, he could afford to take more risk because his portfolio had decades to recover from any crash.' },
      { term: 'Beta', definition: 'A measure of how much an investment\'s price moves relative to the overall market. Beta of 1 means it moves with the market.', example: 'Tesla has a beta of about 2.0, meaning if the market drops 10%, Tesla typically drops 20%.', sentence: 'He chose low-beta utility stocks to reduce portfolio volatility during the uncertain economic outlook.' },
      { term: 'Standard Deviation', definition: 'A statistical measure of how spread out returns are from the average. Higher standard deviation = more volatility.', example: 'A fund with 8% average return and 12% standard deviation means returns usually fall between -4% and +20%.', sentence: 'The fund\'s low standard deviation of 6% indicated very consistent, predictable returns year over year.' }
    ]),

    // PHASE 3 — PRACTICE
    fb('The extra return investors earn for accepting higher risk is called the risk ___.',['premium','penalty','guarantee','discount'],0),

    q('During the 2008 financial crisis, an investor with a 90/10 stock-bond portfolio saw a 45% decline. An investor with a 40/60 portfolio saw only a 20% decline. Five years later, which investor had more money?',
      ['The conservative 40/60 investor — they lost less', 'The aggressive 90/10 investor — stocks recovered and their higher allocation produced more growth', 'They ended up with exactly the same amount', 'Neither — they both went bankrupt'],
      1,
      'The 90/10 investor ended up ahead. While they experienced a deeper drawdown, the stock market recovered all losses by 2013 and then continued climbing. By 2013, the aggressive portfolio had surpassed its pre-crash high, while the conservative portfolio\'s lower stock allocation meant it captured less of the recovery. Over any 10+ year period, higher stock allocation has historically produced higher total returns.'
    ),

    tr('Risk and Reward Facts',[
      ['What percentage of calendar years has the S&P 500 been positive?','About 74% — the market goes up roughly three out of every four years. But the 26% of down years create the volatility that most investors fear.'],
      ['What\'s the longest the market has taken to recover from a crash?','About 5.5 years (2007-2013). Even after the worst crash since the Great Depression, patient investors fully recovered and then went on to triple their money.'],
      ['How much would you have lost by missing the 10 best days in 20 years?','Over half your total return. The best days often come right after the worst days — selling during crashes means missing the recovery.'],
      ['What\'s the average length of a bear market vs a bull market?','Bear markets average 9.6 months. Bull markets average 2.7 years. Markets spend roughly 3x more time going up than going down.']
    ]),

    ds('Order these investments from lowest risk to highest risk:',[
      'U.S. Treasury Bills (3-month government debt)',
      'Investment-grade corporate bonds',
      'S&P 500 index fund (500 large U.S. stocks)',
      'Individual growth stock (e.g., Tesla)',
      'Cryptocurrency (e.g., Bitcoin)',
      'Leveraged options trading'
    ]),

    sc('You\'re building a portfolio and need to choose between four approaches. Which balances risk and reward most effectively for a 30-year time horizon?',[
      {label:'100% high-yield savings account — no volatility',outcome:'After 30 years at 2% return with 3% inflation, you actually lose purchasing power. Zero volatility = zero real growth. This is the most dangerous "safe" choice.',correct:false},
      {label:'80% diversified stock index, 20% bonds — accept volatility for growth',outcome:'Historically optimal for a 30-year horizon. Expected return ~8-9% annually with manageable drawdowns. You\'ll experience 4-5 bear markets but recover from each one.',correct:true},
      {label:'100% in a single high-growth stock — maximum return potential',outcome:'Concentrated single-stock risk means a 30-50% chance of catastrophic permanent loss. Even Amazon dropped 94%. Most individual stocks actually underperform the index.',correct:false}
    ]),

    sl('Over any 20-year period since 1926, what is the WORST total return of the S&P 500?',
      -20,30,6,'%'),

    tf([
      {s:'The S&P 500 has lost money over every 20-year rolling period in history',a:false},
      {s:'Missing the 10 best trading days in 20 years cuts your return by more than half',a:true},
      {s:'Cash in a savings account is risk-free',a:false},
      {s:'Higher volatility is always bad for investors',a:false},
      {s:'A 25-year-old should generally take more investment risk than a 60-year-old',a:true}
    ]),

    m('Match the Risk Concept',[
      ['Volatility','How much an investment\'s price swings up and down over time'],
      ['Beta','Measures how a stock moves relative to the overall market'],
      ['Drawdown','Peak-to-trough decline during a downturn'],
      ['Risk Premium','Extra return earned for accepting higher risk above the safe rate']
    ]),

    // PHASE 4 — APPLY
    q('Your colleague James is 28 years old and just started his first job. He says: "I\'m putting 100% of my 401(k) in a money market fund because I don\'t want to risk losing any money." Using what you know about the risk-return tradeoff, time horizons, and inflation, what is the most accurate response?',
      [
        'He\'s right — protecting principal is always the top priority',
        'He should accept more stock exposure because his 37-year time horizon virtually eliminates the risk of loss while cash guarantees losing purchasing power to inflation',
        'He should put everything in cryptocurrency for maximum returns',
        'He should wait until he has more money to invest in stocks'
      ],
      1,
      'James has 37 years until retirement. Over any 20-year period in history, diversified stocks have never lost money. Meanwhile, his money market fund earning 2-3% will lose purchasing power every year to 3%+ inflation. Over 37 years, $10,000 in cash becomes worth only $3,300 in real terms. The same $10,000 in a stock index fund historically becomes $140,000+. His "safe" choice virtually guarantees he\'ll retire with far less wealth.'
    ),

    simulationFinale(
      'Allocate $10,000 Across Risk Levels',
      'You have $10,000 to invest for retirement in 25 years. You need to allocate it across five risk levels, then watch what happens during a major market crash and recovery.',
      [
        {
          prompt: 'Decision 1: How do you allocate your $10,000?',
          options: [
            { label: 'All in stocks (100% equity index fund)', consequence: 'Bold choice. Maximum growth potential but you\'ll experience the full force of every crash. Over 25 years, historical average outcome: ~$68,000.', score: 3 },
            { label: '70% stocks, 30% bonds — balanced growth', consequence: 'Solid allocation for a 25-year horizon. You\'ll capture most of the stock market growth with reduced volatility. Historical average: ~$50,000.', score: 3 },
            { label: '50% stocks, 50% bonds — balanced', consequence: 'More conservative than needed for a 25-year horizon. Reduced volatility but also reduced growth. Historical average: ~$38,000.', score: 2 },
            { label: '100% savings account — no risk', consequence: 'At 2% interest with 3% inflation, you\'re losing 1% of purchasing power per year. After 25 years: ~$12,800 nominal but only ~$6,100 in real purchasing power.', score: 0 }
          ]
        },
        {
          prompt: 'Decision 2: A severe recession hits. Your portfolio drops 40% in 6 months. Headlines say "worst crash since 2008." What do you do?',
          options: [
            { label: 'Sell everything — this could get worse', consequence: 'You just locked in your losses permanently. The market recovered within 3 years. You\'ll need to decide when to re-enter — and most people wait too long.', score: 0 },
            { label: 'Hold steady — do nothing and wait', consequence: 'Smart discipline. Markets have recovered from every crash in history. Your portfolio will likely recover within 2-4 years.', score: 2 },
            { label: 'Buy more — stocks are 40% off', consequence: 'Contrarian but historically optimal. Buying during maximum fear has produced the highest 5-year forward returns. You\'re getting stocks at a 40% discount.', score: 3 }
          ]
        },
        {
          prompt: 'Decision 3: Two years later, markets have fully recovered. Your portfolio is back to its pre-crash value. A financial advisor suggests changing your strategy. What do you do?',
          options: [
            { label: 'Switch to all bonds — you never want to go through that again', consequence: 'Emotional decision. You have 23 years left — moving to bonds now means missing decades of stock market growth. The crash is exactly what your time horizon was designed to handle.', score: 0 },
            { label: 'Stay the course with your original allocation', consequence: 'Perfect. Your allocation was chosen for your time horizon, not for current market conditions. Recovery proves the strategy works.', score: 3 },
            { label: 'Move to 100% stocks — you can handle it now', consequence: 'Confidence after recovery is good, but chasing risk after gains is the mirror image of panic-selling during losses. Stick to your plan.', score: 1 }
          ]
        },
        {
          prompt: 'Decision 4: Fifteen years have passed. Your portfolio has grown significantly. You now have 10 years until retirement. Should you adjust your risk?',
          options: [
            { label: 'Gradually shift toward more bonds — reduce risk as retirement approaches', consequence: 'Exactly right. As your time horizon shortens, you have less time to recover from crashes. Gradually reducing stock exposure protects your accumulated wealth.', score: 3 },
            { label: 'Keep the same allocation — what\'s worked will keep working', consequence: 'The allocation that was right at 25 years isn\'t right at 10 years. A crash now could delay retirement by years if you\'re too aggressive.', score: 1 },
            { label: 'Move everything to cash — you\'re close enough to retirement', consequence: 'Too extreme. With 10 years left, you still need some growth to keep pace with inflation. A moderate allocation protects while still growing.', score: 1 }
          ]
        }
      ],
      'The optimal path: Choose an age-appropriate stock-heavy allocation, buy more during the crash, stay the course during recovery, and gradually reduce risk approaching retirement — scoring 12/12.',
      'Risk management is not about avoiding risk — it\'s about matching the right amount of risk to your time horizon and adjusting as that horizon changes. Young investors should embrace volatility because time transforms short-term risk into long-term reward. As retirement approaches, gradually reducing risk protects accumulated wealth.'
    ),

    // PHASE 5 — CONSOLIDATE
    summaryCards('Risk vs. Reward', [
      { takeaway: 'Risk and return are inseparable', detail: 'Every asset class sits on a spectrum: higher potential returns require accepting higher short-term volatility. The risk premium — the extra return for bearing risk — has averaged ~7% for stocks over cash.' },
      { takeaway: 'Time transforms risk into reward', detail: 'Over any 20-year period in history, diversified U.S. stocks have never lost money. Short-term volatility is the price of admission for long-term wealth. Your time horizon determines how much risk you should take.' },
      { takeaway: 'The biggest risk is taking no risk', detail: 'Cash loses purchasing power every year to inflation. Over 30 years, a "safe" savings account loses nearly half its real value. Accepting appropriate investment risk is the only way to build real wealth.' }
    ]),

    whatsNext(
      'Risk vs. Reward',
      'The Magic of Compound Interest',
      'You\'ll discover the mathematical force behind all wealth building — how your returns generate their own returns, and why starting early creates an almost unfair advantage.',
      25
    )
  ],[
    cq('An investor has a 30-year time horizon. Which allocation has historically produced the highest total return?',
      ['100% savings account','50% stocks / 50% bonds','80% stocks / 20% bonds','100% bonds'],
      2,'Over 30-year periods, stock-heavy portfolios have consistently produced the highest returns. An 80/20 portfolio balances growth with some downside protection.'),
    cq('During the 2008 financial crisis, the S&P 500 dropped 57%. How long did it take to fully recover?',
      ['6 months','2 years','About 5.5 years','It never recovered'],
      2,'The S&P 500 peaked in October 2007 and fully recovered by March 2013 — about 5.5 years. Investors who held were rewarded with a subsequent tripling of value.'),
    cq('What is the equity risk premium?',
      ['A fee charged by stock brokers','The extra return stocks earn over risk-free assets like Treasury bills','A guaranteed minimum return on stocks','The price of buying stocks'],
      1,'The equity risk premium is the additional return (~7% historically) that stocks earn above risk-free Treasury bills, compensating investors for accepting volatility.'),
    cq('Why is a 100% cash portfolio actually risky over 30 years?',
      ['Cash can be stolen','Inflation erodes purchasing power — cash loses ~3% real value per year','Banks can go bankrupt','Cash earns too much interest'],
      1,'At 3% inflation, cash loses half its purchasing power every 24 years. Over 30 years, $100,000 in cash is worth only about $41,000 in real purchasing power.'),
    cq('An investor who missed the 10 best trading days in the S&P 500 over a 20-year period lost approximately:',
      ['10% of total return','25% of total return','More than half of total return','No significant impact'],
      2,'Missing just the 10 best days in 20 years cuts total returns by more than half. The best days often come right after the worst — selling during panic means missing the recovery.')
  ]),

  // ═══════════════════════════════════════════════════════════════
  // LESSON 3 — THE MAGIC OF COMPOUND INTEREST
  // ═══════════════════════════════════════════════════════════════
  L(3,'The Magic of Compound Interest',30,[
    // PHASE 1 — HOOK
    hookOpener(
      'The Magic of Compound Interest',
      'Warren Buffett earned 97% of his $100+ billion net worth after age 65. His secret? He started investing at age 11 and let compound interest work for 70+ years.',
      'By the end of this lesson, you\'ll understand exactly how compounding works, why starting early creates an almost unfair advantage, and how ordinary people build extraordinary wealth.',
      'Exponential growth curve showing $10,000 growing to $450,000 over 40 years at 10%'
    ),
    stakesCard(
      { label: 'Starting at age 32 — investing $400/month', detail: 'Total contributions by age 65: $158,400. Final balance at 10% return: ~$850,000. You contributed 19% of the final amount. Compound returns did the rest — but you missed 10 crucial years of exponential growth.' },
      { label: 'Starting at age 22 — investing $400/month', detail: 'Total contributions by age 65: $206,400. Final balance at 10% return: ~$2,500,000. You contributed just 8% of the final amount. That extra decade of compounding generated $1.65 million more — from only $48,000 more in contributions.' }
    ),

    // PHASE 2 — TEACH
    teachingSlide(
      'THE CORE CONCEPT',
      'How Compound Interest Works',
      [
        'Compound interest is earning interest on your interest. In year one, you earn returns on your original investment (the principal). In year two, you earn returns on your principal plus last year\'s returns. Each year, the base grows larger, and your returns accelerate.',
        'This creates an exponential curve — growth that starts slowly but then rockets upward. At 10% annual return, $10,000 becomes $10,000 in year 0, $11,000 in year 1, $12,100 in year 2, then $13,310... $25,937 in year 10... $67,275 in year 20... $174,494 in year 30. Notice how the growth in the last decade dwarfs the growth in the first decade.',
        'The Rule of 72 gives you a quick estimate: divide 72 by your annual return rate to find how many years it takes to double your money. At 8%, money doubles every 9 years. At 10%, every 7.2 years. At 12%, every 6 years. Each doubling builds on the previous one, creating the snowball effect.'
      ],
      [
        { term: 'Compound Interest', definition: 'Interest calculated on both the initial principal and the accumulated interest from previous periods.', example: '$1,000 at 10%: Year 1 = $1,100, Year 2 = $1,210, Year 3 = $1,331. Each year earns more than the last.' },
        { term: 'Principal', definition: 'The original amount of money invested or deposited before any returns are added.', example: 'If you invest $5,000, your principal is $5,000. All returns are calculated on this base initially.' },
        { term: 'Rule of 72', definition: 'A quick formula to estimate how long it takes to double your money: divide 72 by the annual return rate.', example: 'At 8% return: 72 ÷ 8 = 9 years to double. At 10%: 72 ÷ 10 = 7.2 years.' },
        { term: 'Exponential Growth', definition: 'Growth that accelerates over time because each period\'s growth builds on the previous period\'s accumulated total.', example: 'Compound interest creates exponential growth — $10,000 grows faster in year 30 than in year 1 because the base is much larger.' }
      ],
      'SVG snowball rolling downhill, growing larger at each stage: a small snowball labeled "$10K" at the top, medium labeled "$25K" at the middle, and a massive snowball labeled "$175K" at the bottom, with curved arrow showing acceleration.',
      { company: 'Warren Buffett', metric: 'Net worth timeline', outcome: '97% of his $100B+ came after age 65', explanation: 'Buffett started investing at age 11. By 30 he had $1 million. By 50, $67 million. By 65, $3 billion. By 90, $100+ billion. Each decade generated more than all previous decades combined — that\'s the exponential power of compounding.' }
    ),

    microCheck(
      'You invest $10,000 at 10% annual compound return. After 7 years, your money has doubled to $20,000. If you hold for another 7 years (14 years total), approximately how much will you have?',
      ['$30,000 — it grows by $10,000 every 7 years', '$40,000 — it doubles again from $20,000', '$35,000 — growth slows over time', '$25,000 — returns decrease as the investment ages'],
      1,
      'Correct! Compound growth means your money doubles every 7 years at 10%. After 7 years: $20,000. After 14 years: $40,000. After 21 years: $80,000. After 28 years: $160,000. Each doubling produces more money than the previous one because the base keeps growing.',
      'Not quite. At 10%, money doubles every 7.2 years (Rule of 72). After 7 years: $20,000. After 14 years: $40,000. It doesn\'t grow linearly — it doubles again from $20K to $40K. After 21 years: $80K. After 28 years: $160K. That\'s exponential growth.'
    ),

    interactiveGraph(
      'BUILD YOUR WEALTH',
      'The Compound Growth Calculator',
      'exponential',
      'Adjust the starting amount, monthly contribution, and annual return to see how your wealth grows exponentially over time. Watch how small changes create massive differences over decades.',
      [
        'The three levers of compound growth are: principal (starting amount), rate (annual return), and time. Of these three, time is by far the most powerful. Doubling your return rate doubles your final amount, but doubling your time can multiply it by 10x or more.',
        'Monthly contributions turbocharge compounding. Investing $400/month at 10% for 40 years produces $2.5 million — but only $192,000 of that came from your contributions. Over 93% of your final wealth came from compound returns. Your money literally created more money.',
        'The visual difference between simple interest (linear growth) and compound interest (exponential growth) is dramatic. At 10% for 30 years, $10,000 with simple interest becomes $40,000. With compound interest, it becomes $174,494. Compounding produced 4.4x more wealth.'
      ],
      [
        { term: 'Simple Interest', definition: 'Interest calculated only on the original principal amount, not on accumulated interest.', example: '$10,000 at 10% simple interest earns $1,000 per year — always $1,000, never more.' },
        { term: 'Compounding Frequency', definition: 'How often interest is calculated and added to the balance. More frequent compounding produces slightly higher returns.', example: 'Daily compounding produces about 0.5% more than annual compounding at the same rate.' }
      ],
      [
        'At 10%, $10,000 becomes $174,494 in 30 years — but $452,593 in 40 years. The last decade alone added $278,000.',
        'Investing $400/month for 40 years at 10% produces $2.5 million — 93% from compound returns.',
        'A one-time $10,000 investment at birth at 10% becomes $1.17 million by age 50.'
      ],
      [
        { label: 'Starting Amount', min: 1000, max: 50000, default: 10000, unit: '$' },
        { label: 'Monthly Contribution', min: 0, max: 2000, default: 400, unit: '$' },
        { label: 'Annual Return', min: 1, max: 15, default: 10, unit: '%' }
      ],
      { company: 'Fidelity', metric: 'Study of best-performing accounts', outcome: 'The best-performing accounts belonged to people who forgot they had them', explanation: 'Fidelity\'s internal review found that accounts left untouched for decades performed best — because the owners never panic-sold, never tried to time the market, and let compound interest work uninterrupted.' }
    ),

    caseStudy(
      'Ronald Read: The Janitor Who Died with $8 Million',
      [
        { date: '1940s', event: 'Ronald Read grows up in rural Vermont, first in his family to finish high school', context: 'Read has no financial education, no wealthy connections, and no high-paying career ahead. He works as a gas station attendant and later as a janitor at JCPenney.' },
        { date: '1950s-1960s', event: 'Read begins buying blue-chip stocks and reinvesting dividends', context: 'Living extremely frugally, Read invests small amounts consistently. He buys stocks in companies he understands — AT&T, Bank of America, CVS, Procter & Gamble — and never sells.' },
        { date: '1970s-2000s', event: 'Read holds through every crash — 1973, 1987, 2000, 2008', context: 'While others panic-sell, Read simply holds. His dividends get reinvested automatically, buying more shares at lower prices during every crash. His portfolio compounds quietly for decades.' },
        { date: '2014', event: 'Read dies at 92. His estate reveals $8 million in stocks', context: 'The janitor who lived so modestly he used safety pins to hold his coat together had accumulated $8 million. He donated $6 million to his local library and hospital. Compound interest turned small, consistent investments into extraordinary wealth over 60+ years.' }
      ],
      'Ronald Read proves that wealth doesn\'t require a high income, market timing, or financial genius. It requires three things: start early, invest consistently, and never interrupt compound interest. Read invested small amounts in boring blue-chip stocks for 60+ years and let compounding do the rest. Time is the great equalizer — it can make a janitor richer than most doctors and lawyers.'
    ),

    misconceptions(
      'COMPOUNDING MYTHS',
      'What most people get wrong about compound interest',
      [
        {
          myth: 'You need a lot of money to benefit from compound interest.',
          truth: '$100/month at 10% for 40 years becomes $632,000. The amount matters far less than the time. Starting with $100 at age 22 beats starting with $1,000 at age 35.',
          explanation: 'Einstein supposedly called compound interest the eighth wonder of the world. Whether he said it or not, the math is undeniable: $100/month for 40 years contributes $48,000 of your own money but produces $632,000 — a 13x multiplier.'
        },
        {
          myth: 'It\'s too late to start if you\'re already 30, 40, or 50.',
          truth: 'It\'s never too late — but every year you wait makes it significantly harder. Starting at 40 with $500/month still produces $380,000 by 65. The best time to start is always now.',
          explanation: 'While earlier is always better, the second-best time to start is today. Even investing from 40-65 produces substantial wealth. The mistake is thinking "it\'s too late" and therefore never starting at all.'
        },
        {
          myth: 'Compound interest only works in savings accounts.',
          truth: 'Compounding works in any investment where returns are reinvested — stocks, bonds, mutual funds, ETFs, real estate. Stock market compounding at 10% is far more powerful than savings compounding at 1%.',
          explanation: 'A savings account compounding at 1% turns $10,000 into $13,489 in 30 years. The stock market compounding at 10% turns $10,000 into $174,494 in 30 years. Same principle, 13x more wealth.'
        }
      ]
    ),

    keyTermsCards([
      { term: 'Compound Interest', definition: 'Interest earned on both the original investment and on all previously accumulated interest — earning returns on your returns.', example: '$1,000 at 10%: Year 1 = $1,100, Year 2 = $1,210, Year 3 = $1,331. Each year earns more dollars than the previous year.', sentence: 'Thanks to compound interest, her $50,000 investment at age 25 grew to over $1 million by retirement without any additional contributions.' },
      { term: 'Rule of 72', definition: 'A quick formula to estimate how many years it takes to double your money: divide 72 by the annual return rate.', example: 'At 8% return: 72 ÷ 8 = 9 years to double. At 12%: 72 ÷ 12 = 6 years to double.', sentence: 'Using the Rule of 72, he calculated that his 10% return would double his money in about 7.2 years.' },
      { term: 'Exponential Growth', definition: 'Growth that accelerates over time because each period\'s growth is calculated on a larger base than the period before.', example: '$10,000 grows by $1,000 in year 1 at 10%, but by $17,000 in year 30 — because the base has grown from $10K to $170K.', sentence: 'The exponential growth curve of her portfolio showed that the last decade of compounding generated more wealth than the first three decades combined.' },
      { term: 'Time Value of Money', definition: 'The concept that money available now is worth more than the same amount in the future because it can be invested and earn compound returns.', example: '$10,000 today at 10% becomes $174,494 in 30 years. Therefore, $10,000 today is "worth" $174,494 in future value.', sentence: 'Understanding the time value of money convinced him to start investing immediately rather than waiting for a "better time."' },
      { term: 'Dollar-Cost Averaging', definition: 'Investing a fixed amount at regular intervals regardless of market price, automatically buying more shares when prices are low and fewer when high.', example: '$400/month into an index fund: you buy 10 shares at $40, then 13.3 shares when it drops to $30, then 8 shares when it rises to $50.', sentence: 'Dollar-cost averaging removed the stress of market timing — she simply invested $500 every month and let compounding do the work.' },
      { term: 'Future Value', definition: 'The value of a current investment at a specified date in the future, assuming a specific rate of compound growth.', example: 'The future value of $10,000 at 10% annual return after 20 years is $67,275.', sentence: 'He used a future value calculator to see that his $200/month investment would be worth $1.5 million in 40 years.' }
    ]),

    // PHASE 3 — PRACTICE
    fb('The Rule of 72 says that at 8% annual return, your money doubles approximately every ___ years.',['9','6','12','15'],0),

    q('Two twins each invest $400/month at 10% return. Twin A starts at age 22 and stops contributing at age 32 (10 years of contributions). Twin B starts at age 32 and contributes until age 65 (33 years of contributions). At age 65, who has more money?',
      ['Twin B — they contributed for 33 years vs only 10', 'Twin A — despite contributing for only 10 years, their money compounded for 33 extra years', 'They have exactly the same amount', 'Neither — compound interest doesn\'t actually work'],
      1,
      'Twin A has more money! Twin A contributed $48,000 over 10 years and let it compound for 43 years total: ~$2.5M. Twin B contributed $158,400 over 33 years: ~$1.8M. Twin A invested 3.3x less money but ended up with 40% more because those early dollars had decades more to compound. This is the most powerful demonstration of why starting early matters more than contributing more.'
    ),

    tr('Compound Interest Mind-Blowers',[
      ['How much of your retirement wealth comes from compound returns vs your contributions after 40 years?','Over 93%. If you invest $400/month for 40 years at 10%, you contribute $192,000. Your final balance: ~$2.5 million. 93% of your wealth was created by compound returns — not your own money.'],
      ['How much more does a 22-year-old accumulate vs a 32-year-old by age 65?','About 2.5-3x more with the same monthly investment. That single decade of extra compounding creates over $1.5 million in additional wealth.'],
      ['If you put $10,000 in an S&P 500 index fund at birth, how much would it be worth at age 50?','About $1.17 million at 10% average annual return — from a single $10,000 investment. That\'s the power of 50 years of compounding.'],
      ['A penny doubled every day for 30 days equals how much?','$10.7 million. It starts tiny — day 10 is just $5.12. But by day 20 it\'s $5,242. Day 30: $10,737,418. This illustrates how exponential growth accelerates dramatically in later periods.']
    ]),

    ds('Order these scenarios from LEAST to MOST total wealth at age 65:',[
      '$1,000/month from age 55 to 65 (10 years of investing)',
      '$400/month from age 40 to 65 (25 years of investing)',
      '$200/month from age 30 to 65 (35 years of investing)',
      '$100/month from age 22 to 65 (43 years of investing)',
      '$400/month from age 22 to 65 (43 years of investing)',
      '$10,000 lump sum at age 22, untouched until 65'
    ]),

    sc('You receive a $10,000 bonus. You\'re 25 years old. Which option produces the most wealth by age 65?',[
      {label:'Invest $10,000 now in a diversified index fund at ~10% return',outcome:'Correct! $10,000 at 10% for 40 years = $452,593. By investing the full amount immediately, you maximize the time compound interest has to work.',correct:true},
      {label:'Put $10,000 in a savings account earning 2%',outcome:'$10,000 at 2% for 40 years = $22,080. After inflation, you\'ve barely grown. You sacrificed $430,000 in potential compound growth for the "safety" of 2%.', correct:false},
      {label:'Spend $10,000 now — you can invest more later',outcome:'You\'d need to invest about $45,000 at age 35 to match the $452,593 that $10,000 at age 25 would have produced. Delayed investing costs exponentially more.',correct:false}
    ]),

    sl('$10,000 invested at 10% annual return for 40 years grows to approximately:',
      50000,600000,452593,'$'),

    tf([
      {s:'Starting 10 years earlier can double or triple your final wealth',a:true},
      {s:'You need at least $10,000 to benefit from compound interest',a:false},
      {s:'A penny doubled daily for 30 days becomes over $10 million',a:true},
      {s:'Simple interest grows money faster than compound interest',a:false},
      {s:'After 40 years of investing, over 90% of your wealth comes from compound returns',a:true}
    ]),

    m('Match the Compounding Concept',[
      ['Rule of 72','Divide 72 by return rate to estimate doubling time'],
      ['Simple Interest','Returns calculated only on the original principal'],
      ['Future Value','What a current investment will be worth at a future date'],
      ['Dollar-Cost Averaging','Investing fixed amounts at regular intervals']
    ]),

    // PHASE 4 — APPLY
    q('Your friend Sarah is 28. She says: "I know I should invest, but I\'ll start when I\'m 35 — I want to enjoy my money now and I\'ll have a higher salary by then." She plans to invest $600/month starting at 35. Using compound interest math, what\'s the most important thing she needs to understand?',
      [
        'She\'s right — a higher salary will more than compensate for the late start',
        'Even investing just $300/month now would likely produce more wealth by 65 than $600/month starting at 35, because those 7 extra years of compounding are worth more than doubling her contribution',
        'It doesn\'t matter when she starts — the total amount invested is what matters',
        'She should wait until she has $50,000 saved before starting'
      ],
      1,
      '$300/month from age 28 at 10% = ~$1.05 million by 65. $600/month from age 35 at 10% = ~$986,000 by 65. Even investing HALF as much, starting 7 years earlier produces MORE wealth. She\'d need to invest $660/month starting at 35 just to match $300/month starting at 28. Every year of delay requires exponentially more money to catch up. Compounding rewards early starters so dramatically that time beats money.'
    ),

    simulationFinale(
      'The Compounding Race',
      'You and a friend both earn the same salary and want to become millionaires by age 65. You\'ll each make a series of decisions about when and how much to invest. Let\'s see who gets there first.',
      [
        {
          prompt: 'Decision 1: You\'re 22, just got your first job. Your friend says "Let\'s start investing later when we earn more." What do you do?',
          options: [
            { label: 'Start investing $200/month now — even though it\'s tight', consequence: 'Smart move. $200/month at 10% from age 22 to 65 = ~$1.16 million. You\'ll be a millionaire from just $200/month because of 43 years of compounding.', score: 3 },
            { label: 'Agree with your friend — wait until you earn more', consequence: 'Waiting costs more than you think. Every year you delay, you\'d need to invest about 10% more per month to reach the same goal. Those early dollars are the most powerful.', score: 0 },
            { label: 'Save in a high-yield savings account instead', consequence: '$200/month at 3% for 43 years = $222,000. The same money in stocks at 10% = $1.16 million. Your "safe" choice cost you nearly $1 million.', score: 1 }
          ]
        },
        {
          prompt: 'Decision 2: You\'re 30 now. Your investments have grown to $25,000, but a friend asks you to invest in their startup instead. What do you do?',
          options: [
            { label: 'Keep your $25,000 in diversified index funds and continue monthly investing', consequence: 'Consistency wins. That $25,000 alone at 10% for 35 more years becomes $703,000. Plus your continued $200/month adds another $650,000. Stay the course.', score: 3 },
            { label: 'Pull out $25,000 for the startup — it could be the next big thing', consequence: '90% of startups fail. You just gambled 43 years of compound growth — $703,000 in future value — on a 10% chance. Even if you keep contributing $200/month, you\'ve lost years of compounding.', score: 0 },
            { label: 'Take a break from investing — you have $25,000, that\'s enough for now', consequence: 'Stopping contributions disrupts the compounding engine. That $25,000 will grow, but without continued fuel, you\'ll need to invest much more later to reach your goal.', score: 1 }
          ]
        },
        {
          prompt: 'Decision 3: You\'re 40. Your portfolio is at $150,000. You get a $10,000 raise. How do you use it?',
          options: [
            { label: 'Increase monthly investment by $400 (from $200 to $600)', consequence: 'Excellent. That extra $400/month at 10% for 25 more years adds ~$530,000 to your final balance. Increasing contributions as income grows is the key accelerator.', score: 3 },
            { label: 'Lifestyle upgrade — you deserve it', consequence: 'Understandable, but that $400/month in increased spending costs you ~$530,000 in future wealth. Each dollar of lifestyle inflation has a hidden 10-25x compound cost.', score: 0 },
            { label: 'Put the raise in savings for an emergency fund top-up', consequence: 'Emergency funds are important, but if yours is already adequate, excess cash loses to inflation. Consider a split: some to emergency fund, most to investments.', score: 1 }
          ]
        },
        {
          prompt: 'Decision 4: You\'re 55. Your portfolio is at $800,000. Market crashes 35%. Your balance drops to $520,000. What do you do?',
          options: [
            { label: 'Hold steady and keep investing — you have 10 years for recovery', consequence: 'Historically, markets recover within 3-5 years. With 10 years left, staying invested allows your $520,000 to recover and grow past the pre-crash level.', score: 3 },
            { label: 'Sell everything — protect what\'s left', consequence: 'You just permanently locked in a $280,000 loss. Markets recovered within 3 years after every major crash. Selling at the bottom is the single most expensive mistake.', score: 0 },
            { label: 'Reduce stock allocation — you\'re too old for this risk', consequence: 'Some reduction is reasonable at 55, but panic-selling during a crash isn\'t strategic allocation — it\'s emotional reaction. A gradual shift is better than a fear-based one.', score: 1 }
          ]
        }
      ],
      'Start early at 22, stay consistent, increase contributions with raises, and hold through crashes — scoring 12/12. This path turns $200/month into over $2 million.',
      'Compound interest is the most democratic wealth-building tool in existence. It doesn\'t require a high income, market expertise, or luck. It requires three simple behaviors: start now, invest consistently, and never interrupt the compounding process. Time is the irreplaceable ingredient — no amount of money can compensate for lost time.'
    ),

    // PHASE 5 — CONSOLIDATE
    summaryCards('The Magic of Compound Interest', [
      { takeaway: 'Compounding is exponential, not linear', detail: 'Returns generate their own returns, creating accelerating growth. At 10%, $10,000 becomes $174K in 30 years but $452K in 40 years — the last decade alone added $278K.' },
      { takeaway: 'Time is more powerful than money', detail: 'Starting 10 years earlier with half the monthly contribution produces more wealth than starting later with double the amount. Every year of delay requires exponentially more money to catch up.' },
      { takeaway: 'Small amounts create extraordinary wealth', detail: '$200/month from age 22 at 10% = $1.16 million by 65. $100/month from age 22 = $632,000. You don\'t need large sums — you need consistent time in the market.' }
    ]),

    whatsNext(
      'The Magic of Compound Interest',
      'Stocks vs. Bonds',
      'Now that you understand compounding, you\'ll learn about the two most important asset classes — stocks and bonds — how they differ, when each shines, and how to combine them in a portfolio.',
      25
    )
  ],[
    cq('Twin A invests $200/month from age 22-32, then stops. Twin B invests $200/month from age 32-65. At 10% return, who has more at 65?',
      ['Twin B — they invested for 33 years','Twin A — their early start gave compounding more time','They have the same','It depends on market conditions'],
      1,'Twin A\'s 10 years of early investing plus 33 years of compounding beats Twin B\'s 33 years of investing. Early dollars have exponentially more compounding power.'),
    cq('The Rule of 72 says that at 10% return, money doubles every:',
      ['5 years','7.2 years','10 years','12 years'],
      1,'72 ÷ 10 = 7.2 years to double. So $10K becomes $20K in 7.2 years, $40K in 14.4 years, $80K in 21.6 years, and $160K in 28.8 years.'),
    cq('After 40 years of investing $400/month at 10%, approximately what percentage of your wealth came from compound returns (not your contributions)?',
      ['About 50%','About 70%','About 93%','About 100%'],
      2,'You\'d contribute $192,000 over 40 years, but your balance would be ~$2.5 million. Over 93% of your wealth was created by compound returns, not your own money.'),
    cq('Ronald Read, a janitor, died with $8 million. His strategy was:',
      ['Day trading','Cryptocurrency','Consistently investing in blue-chip stocks for 60+ years and reinvesting dividends','Inheritance from a wealthy family'],
      2,'Read invested small amounts in stable companies for decades and never sold. Compound interest turned modest investments into $8 million over 60+ years.'),
    cq('$10,000 invested at 10% at birth is worth approximately how much at age 50?',
      ['$100,000','$500,000','$1.17 million','$10 million'],
      2,'$10,000 × 1.10^50 ≈ $1,173,909. Fifty years of compounding at 10% turns $10K into over $1 million — demonstrating the extraordinary power of long time horizons.')
  ]),

  // ═══════════════════════════════════════════════════════════════
  // LESSON 4 — STOCKS VS. BONDS
  // ═══════════════════════════════════════════════════════════════
  L(4,'Stocks vs. Bonds',30,[
    // PHASE 1 — HOOK
    hookOpener(
      'Stocks vs. Bonds',
      'In 2008, the S&P 500 lost 38.5% — the worst year since the Great Depression. That same year, U.S. Treasury bonds gained 25.9%. Understanding how these two asset classes behave differently is the key to building a resilient portfolio.',
      'By the end of this lesson, you\'ll understand exactly how stocks and bonds work, why they often move in opposite directions, and how combining them creates a portfolio stronger than either alone.',
      'Dual-line chart showing stocks vs bonds performance 2006-2012 with 2008 divergence highlighted'
    ),
    stakesCard(
      { label: '100% stocks portfolio in 2008', detail: 'A $100,000 all-stock portfolio dropped to $61,500 by March 2009. The psychological pressure was immense — many investors panic-sold at the bottom and locked in permanent losses.' },
      { label: '60% stocks / 40% bonds portfolio in 2008', detail: 'A $100,000 60/40 portfolio dropped to only $76,000. The bonds cushioned the blow, and the portfolio recovered to $100,000 a full year earlier than all-stocks. Balanced investors slept better and stayed invested.' }
    ),

    // PHASE 2 — TEACH
    teachingSlide(
      'THE FUNDAMENTALS',
      'Stocks = Ownership, Bonds = Loans',
      [
        'A stock represents partial ownership in a company. When you buy stock, you become a shareholder — you own a tiny piece of the company\'s assets, earnings, and future growth. Your return comes from the stock price rising (capital appreciation) and dividends (cash payments from profits). Stocks have unlimited upside but can also lose all their value if the company fails.',
        'A bond is a loan you make to a company or government. They promise to pay you a fixed interest rate (the coupon) on a regular schedule and return your original investment (face value) at maturity. Bonds are a contractual obligation — the borrower must pay you back. This makes bonds more predictable but limits your upside to the interest rate.',
        'The fundamental difference: stocks give you ownership (equity) with unlimited potential but no guarantees. Bonds give you a contractual claim (debt) with limited upside but predictable income. This is why stocks are called "equity" and bonds are called "fixed income."'
      ],
      [
        { term: 'Equity', definition: 'Ownership stake in a company. Stocks represent equity — you own a share of the company\'s value.', example: 'Buying 100 shares of Apple at $150 means you own $15,000 of equity in a $2.8 trillion company.' },
        { term: 'Fixed Income', definition: 'Investments that pay a predetermined rate of return on a set schedule. Bonds are the primary fixed-income instrument.', example: 'A 10-year U.S. Treasury bond paying 4% coupon gives you $40 per year per $1,000 of face value, guaranteed.' },
        { term: 'Coupon Rate', definition: 'The annual interest rate paid by a bond, expressed as a percentage of the face value.', example: 'A bond with $1,000 face value and 5% coupon pays $50 per year in interest.' },
        { term: 'Dividend', definition: 'A cash payment made by a company to its shareholders, typically from profits.', example: 'Apple pays a quarterly dividend of $0.24 per share — about $960 per year for someone holding 1,000 shares.' }
      ],
      'Two-column comparison: left side shows a stock certificate with key attributes (ownership, variable returns, higher risk, no maturity date); right side shows a bond certificate with key attributes (loan, fixed returns, lower risk, maturity date).',
      { company: 'Vanguard', metric: 'Total returns 1926-2023', outcome: 'Stocks averaged 10.3% annually vs 5.1% for bonds', explanation: 'Over nearly a century, stocks have returned about twice as much as bonds annually. But stocks also had years of -40% or more, while bonds rarely lost more than a few percent. The higher return is compensation for the higher risk.' }
    ),

    microCheck(
      'A company issues a 10-year bond with a 5% coupon and $1,000 face value. An investor buys it. One year later, the company\'s stock price has tripled. How does this affect the bond?',
      ['The bond\'s value also triples', 'The bond is unaffected — it still pays $50/year and returns $1,000 at maturity', 'The bondholder now owns stock too', 'The bond automatically converts to stock'],
      1,
      'Correct! Bonds have a fixed contractual return regardless of the company\'s stock performance. The bondholder receives $50/year and gets $1,000 back at maturity — period. This is both the advantage (predictable income) and disadvantage (no upside participation) of bonds compared to stocks.',
      'Not quite. A bond is a loan contract — it pays fixed interest regardless of stock performance. The bondholder gets $50/year and $1,000 back at maturity. While stockholders tripled their money, the bondholder\'s return is locked in. Bonds don\'t participate in a company\'s upside.'
    ),

    interactiveGraph(
      'DIVERGENCE IN ACTION',
      'Stocks vs. Bonds: 20-Year Performance',
      'comparison',
      'Watch how stocks and bonds perform over 20 years. Toggle the recession overlay to see how they diverge during economic downturns — when stocks crash, bonds often rally.',
      [
        'Over long periods, stocks significantly outperform bonds. $10,000 in stocks at 10% becomes $67,275 in 20 years. The same in bonds at 5% becomes $26,533. But the journey is very different — stocks take a volatile, roller-coaster path while bonds follow a smooth, gradual incline.',
        'The magic happens during recessions. When the economy contracts, investors flee stocks and buy bonds (considered safer). This drives stock prices down and bond prices up simultaneously. In 2008, stocks fell 38% while long-term Treasuries gained 26%. This negative correlation is why combining them reduces portfolio risk.',
        'A 60/40 portfolio (60% stocks, 40% bonds) has historically captured about 80% of stock market returns with only 60% of the volatility. During the 2008 crisis, while all-stocks lost 38%, the 60/40 lost only 22% — and recovered a full year faster. The bonds acted as a shock absorber.'
      ],
      [
        { term: 'Negative Correlation', definition: 'When two assets tend to move in opposite directions — one goes up while the other goes down.', example: 'In 2008, stocks fell 38% while Treasury bonds gained 26% — nearly perfect negative correlation.' },
        { term: 'Flight to Safety', definition: 'During market stress, investors sell risky assets (stocks) and buy safe assets (bonds), driving bond prices up.', example: 'After the COVID crash in March 2020, Treasury bond yields hit record lows as investors desperately bought bonds for safety.' }
      ],
      [
        'Over every 20-year period since 1926, stocks have outperformed bonds.',
        'In 2008, the S&P 500 lost 38.5% while long-term Treasury bonds gained 25.9%.',
        'A 60/40 portfolio has captured ~80% of stock returns with ~60% of the volatility.'
      ],
      [
        { label: 'Stock Allocation', min: 0, max: 100, default: 60, unit: '%' },
        { label: 'Time Period', min: 5, max: 30, default: 20, unit: ' years' }
      ],
      { company: 'Ray Dalio / Bridgewater', metric: 'All Weather Portfolio performance', outcome: 'Positive returns in 86% of calendar years since 1984', explanation: 'Ray Dalio\'s All Weather Portfolio uses a strategic mix of stocks, bonds, gold, and commodities designed to perform in any economic environment. By combining assets that move differently in response to economic changes, the portfolio smooths returns without sacrificing long-term growth.' }
    ),

    caseStudy(
      'The 2008 Financial Crisis: Stocks vs. Bonds Month by Month',
      [
        { date: 'October 2007', event: 'S&P 500 peaks at 1,565. Economy appears strong', context: 'Housing prices are at record highs. Banks are lending freely. Investors are euphoric. The stock market has been climbing for five years straight. Few see trouble ahead.' },
        { date: 'March 2008', event: 'Bear Stearns collapses. S&P drops to 1,316 (-16%)', context: 'The first major bank failure. Treasury bond yields plummet as investors flee to safety. 10-year Treasury yields drop from 4.6% to 3.5% — meaning bond prices are surging.' },
        { date: 'September 2008', event: 'Lehman Brothers bankrupt. S&P crashes to 1,106 (-29%)', context: 'The financial system nearly collapses. Treasury bonds become the ultimate safe haven — yields crash to 2.2% as prices spike. Government bonds gain ~15% while stocks lose 29%.' },
        { date: 'March 2009', event: 'S&P hits bottom at 677 (-57% from peak). Bonds up 25%', context: 'Stocks have lost 57%. Many investors sell in panic. But Treasury bonds have gained 25%+ since the crisis began. A 60/40 portfolio lost "only" 22% — painful but survivable.' },
        { date: 'March 2013', event: 'S&P recovers to pre-crisis highs. 60/40 already recovered in 2011', context: 'The all-stock portfolio takes 5.5 years to recover. The 60/40 portfolio recovered in 3.5 years — because the bond gains during the crash cushioned losses and provided capital to rebalance into cheap stocks.' }
      ],
      'The 2008 crisis is the greatest advertisement for owning bonds alongside stocks. While stocks lost 57%, bonds gained 25%. A 60/40 portfolio lost only 22% and recovered nearly two years faster than an all-stock portfolio. Bonds didn\'t just reduce losses — they provided the stability investors needed to avoid panic-selling at the bottom.'
    ),

    misconceptions(
      'STOCKS & BONDS MYTHS',
      'What most people get wrong about these two asset classes',
      [
        {
          myth: 'Bonds are boring and not worth owning.',
          truth: 'Bonds are the shock absorbers of your portfolio. During the 2008 crash, Treasury bonds gained 25% while stocks lost 57%. Owning bonds is what keeps investors from panic-selling stocks during crashes.',
          explanation: 'Bonds aren\'t meant to generate excitement — they\'re meant to provide stability. A 60/40 portfolio captures 80% of stock returns with only 60% of the volatility. That reduced volatility keeps investors invested during crashes, which is worth far more than the return difference.'
        },
        {
          myth: 'You should be 100% in stocks if you\'re young.',
          truth: 'While a higher stock allocation is appropriate for young investors, some bond exposure reduces volatility enough to prevent the #1 wealth destroyer: panic-selling during a crash.',
          explanation: 'The mathematically optimal portfolio isn\'t useful if you can\'t psychologically hold it during a 50% drawdown. A 80/20 or 90/10 portfolio gives nearly all of the stock market\'s return with meaningfully less volatility.'
        },
        {
          myth: 'When stocks crash, everything crashes.',
          truth: 'High-quality government bonds typically rally during stock crashes — they move in the opposite direction. This negative correlation is the entire reason diversification works.',
          explanation: 'During the COVID crash (March 2020), the S&P 500 fell 34% in 33 days. Long-term Treasury bonds gained 20% in the same period. When investors panic-sell stocks, they buy bonds — driving bond prices up. This is the flight to safety.'
        }
      ]
    ),

    keyTermsCards([
      { term: 'Stock (Equity)', definition: 'A security that represents partial ownership in a company. Stockholders share in profits (dividends) and price appreciation.', example: 'If a company has 1 million shares and you own 1,000, you own 0.1% of the company.', sentence: 'She built her portfolio around a core holding of broad market stock index funds, giving her ownership in thousands of companies.' },
      { term: 'Bond (Fixed Income)', definition: 'A debt instrument where you lend money to an issuer (government or company) in exchange for regular interest payments and return of principal at maturity.', example: 'A $10,000 Treasury bond with 4% coupon pays $400/year for 10 years, then returns your $10,000.', sentence: 'He added Treasury bonds to his portfolio to provide stable income and protection during stock market downturns.' },
      { term: 'Coupon Rate', definition: 'The annual interest rate paid by a bond, calculated as a percentage of the face value.', example: 'A $1,000 bond with 5% coupon pays $50 per year until maturity.', sentence: 'The bond\'s 6% coupon rate meant she received $60 per year for every $1,000 of face value.' },
      { term: 'Yield', definition: 'The total return on a bond considering both coupon payments and the difference between purchase price and face value.', example: 'If you buy a $1,000 bond for $950 with a 5% coupon, your yield is higher than 5% because you paid less than face value.', sentence: 'Rising interest rates pushed new bond yields to 5%, making the older 3% bonds less attractive in comparison.' },
      { term: 'Maturity', definition: 'The date on which a bond\'s face value is repaid to the investor. Short-term bonds mature in 1-3 years; long-term in 10-30 years.', example: 'A 10-year Treasury bond issued in 2024 matures in 2034, when the government repays the full face value.', sentence: 'He chose bonds with 5-year maturities to balance between higher yields and not locking up his money for too long.' },
      { term: '60/40 Portfolio', definition: 'A classic asset allocation of 60% stocks and 40% bonds, designed to balance growth with stability.', example: 'During the 2008 crisis, a 60/40 portfolio lost 22% vs 57% for all-stocks — and recovered 2 years faster.', sentence: 'The 60/40 portfolio has been the default recommendation for moderate-risk investors for decades.' }
    ]),

    // PHASE 3 — PRACTICE
    fb('When investors panic during a stock market crash, they often buy government bonds in a behavior called flight to ___.',['safety','profit','bonds','cash'],0),

    q('In 2008, the S&P 500 fell 38.5%. An investor held a portfolio of 60% S&P 500 stocks and 40% Treasury bonds. The bonds gained 25.9% that year. Approximately how much did the total portfolio change?',
      ['Lost about 38% — same as all stocks', 'Lost about 22% — the bonds cushioned the blow', 'Broke even — the bond gains offset the stock losses', 'Gained money — bonds more than compensated'],
      1,
      'The 60/40 portfolio lost about 22%. Math: (0.60 × -38.5%) + (0.40 × +25.9%) = -23.1% + 10.4% = -12.7% approximately. The bonds didn\'t eliminate losses but turned a catastrophic -38.5% into a manageable -22%. More importantly, this smaller loss meant faster recovery and less psychological pressure to panic-sell.'
    ),

    tr('Stocks vs. Bonds Facts',[
      ['What\'s the historical average annual return of stocks vs bonds?','Stocks: ~10.3% per year since 1926. Bonds: ~5.1% per year. Stocks return roughly twice as much, but with 3-4x the volatility.'],
      ['How do bonds react when interest rates rise?','Bond prices fall when rates rise. A 1% rate increase causes a 10-year bond to lose about 8% of its value. This is called interest rate risk.'],
      ['What is the worst annual loss for U.S. Treasury bonds?','About -13% in 2022 when the Fed raised rates aggressively. Compare to stocks\' worst: -43% in 1931. Bonds\' downside is much more limited.'],
      ['Why does a 60/40 portfolio work so well?','Stocks and bonds often move in opposite directions during crises. When one falls, the other rises. This negative correlation smooths your total portfolio returns.']
    ]),

    ds('Order these from LOWEST average annual return to HIGHEST:',[
      'Savings Account (~1.5%)',
      'Short-Term Treasury Bonds (~3%)',
      'Long-Term Corporate Bonds (~5.5%)',
      'Real Estate Investment Trusts (~7%)',
      'S&P 500 Index Fund (~10%)',
      'Small-Cap Growth Stocks (~12%)'
    ]),

    sc('You\'re analyzing two portfolios. Portfolio A is 100% stocks. Portfolio B is 60% stocks and 40% bonds. A major recession hits and stocks drop 40%. Which portfolio will likely recover to its pre-crash value first?',[
      {label:'Portfolio A — stocks recover faster',outcome:'Actually, Portfolio B typically recovers first. While stocks fell 40%, Portfolio B\'s bonds likely gained value, so the total drop was only ~20%. A 20% recovery is faster than a 40% recovery.',correct:false},
      {label:'Portfolio B — less to recover from, plus bonds can be sold to buy cheap stocks',outcome:'Correct! Portfolio B lost only ~20% due to bond cushioning. Furthermore, rebalancing allows selling appreciated bonds to buy discounted stocks — buying low automatically.',correct:true},
      {label:'They recover at the same time',outcome:'Not typically. Portfolio B starts from a higher post-crash value and can rebalance bonds into cheap stocks, accelerating recovery.',correct:false}
    ]),

    sl('In the 2008 crisis, Treasury bonds GAINED approximately this much while stocks lost 38%:',
      0,40,26,'%'),

    tf([
      {s:'Stocks represent ownership while bonds represent loans',a:true},
      {s:'Bond prices rise when interest rates rise',a:false},
      {s:'A 60/40 portfolio has captured about 80% of stock returns historically',a:true},
      {s:'You should never own bonds if you\'re under 40',a:false},
      {s:'During the 2008 crash, Treasury bonds gained over 25%',a:true}
    ]),

    m('Match the Investment Attribute',[
      ['Stocks','Ownership in a company with unlimited upside potential'],
      ['Bonds','A loan that pays fixed interest and returns principal at maturity'],
      ['Dividend','Cash payment from a company to its shareholders'],
      ['Coupon','Interest payment from a bond issuer to bondholders']
    ]),

    // PHASE 4 — APPLY
    q('Your uncle is 60 years old and plans to retire at 65. His entire $500,000 retirement portfolio is in a single S&P 500 index fund. He says "stocks always win long-term." Based on what you\'ve learned about stocks vs bonds and time horizons, what is the most critical risk he\'s overlooking?',
      [
        'He\'s right — stocks always recover, so his allocation is fine',
        'With only 5 years until retirement, a major crash could cut his portfolio by 40%+ and he may not have time to recover before he needs the money',
        'He should put everything in bonds immediately',
        'He should cash out now and use a savings account'
      ],
      1,
      'With a 5-year time horizon, a 100% stock allocation is extremely risky. If stocks crash 40% like in 2008, his $500,000 becomes $300,000 — and he may need to start withdrawing in 5 years regardless. The S&P 500 took 5.5 years to recover from 2008. He could be forced to sell at the bottom. A gradual shift to 50% stocks / 50% bonds would protect against catastrophic timing risk while still providing growth.'
    ),

    simulationFinale(
      'Building a Retirement Portfolio',
      'You\'re managing a $100,000 retirement portfolio. You\'re 55 years old with 10 years until retirement. A major financial crisis is about to unfold. Your allocation decisions will determine your retirement outcome.',
      [
        {
          prompt: 'Decision 1: Choose your starting allocation for 10 years until retirement.',
          options: [
            { label: '90% stocks / 10% bonds — maximize growth', consequence: 'Aggressive for someone 10 years from retirement. Maximum growth potential but maximum crash exposure. You\'ll feel every market swing intensely.', score: 1 },
            { label: '60% stocks / 40% bonds — balanced approach', consequence: 'Well-matched to your time horizon. Enough stock exposure for growth, enough bonds for stability and crash protection.', score: 3 },
            { label: '20% stocks / 80% bonds — play it safe', consequence: 'Too conservative for a 10-year horizon. You\'ll miss significant growth that you still have time to capture. Over-protecting can cost wealth too.', score: 1 }
          ]
        },
        {
          prompt: 'Decision 2: Two years in, a recession hits. Stocks drop 35%. Your bonds have gained 15%. What do you do?',
          options: [
            { label: 'Rebalance — sell some bonds to buy discounted stocks', consequence: 'Textbook move. Your bonds are up, stocks are down. Rebalancing forces you to buy low and sell high automatically. This is the #1 advantage of holding both asset classes.', score: 3 },
            { label: 'Sell all stocks — move everything to bonds', consequence: 'You just locked in losses and abandoned the asset class that will drive your portfolio\'s recovery. With 8 years left, you have plenty of time for stocks to recover.', score: 0 },
            { label: 'Do nothing — ride it out', consequence: 'Holding is better than selling, but not rebalancing means you miss the opportunity to buy cheap stocks with appreciated bonds. Active rebalancing adds ~0.5% per year in returns.', score: 2 }
          ]
        },
        {
          prompt: 'Decision 3: Five years before retirement. Markets have recovered and your portfolio is up. How do you adjust?',
          options: [
            { label: 'Gradually shift to 40% stocks / 60% bonds over the next 5 years', consequence: 'Perfect glide path. As retirement approaches, you reduce stock exposure to protect accumulated gains while maintaining some growth. This is exactly how target-date funds work.', score: 3 },
            { label: 'Move to 100% stocks — the market is hot', consequence: 'Chasing returns near retirement is gambling with your financial future. A crash now could delay retirement by years.', score: 0 },
            { label: 'Move to 100% bonds — lock in the gains', consequence: 'Too extreme. With 5 years left, you still need stock exposure to outpace inflation. All-bonds means your purchasing power erodes in retirement.', score: 1 }
          ]
        },
        {
          prompt: 'Decision 4: One year before retirement. Another dip — stocks drop 15%. What\'s your move?',
          options: [
            { label: 'Stay calm — your increased bond allocation means the 15% stock drop barely affects your total portfolio', consequence: 'Exactly right. If you\'re at 40% stocks / 60% bonds, a 15% stock drop only impacts ~6% of your total portfolio. Your bonds provide stability when you need it most.', score: 3 },
            { label: 'Panic — sell everything and go to cash', consequence: 'With 60% already in bonds, your total portfolio only dropped ~6%. Panic-selling now crystallizes a small loss into a permanent one and loses bond income in retirement.', score: 0 },
            { label: 'Delay retirement by 3 years to recover', consequence: 'If you followed the glide path, a 15% stock dip affects less than 6% of your portfolio. There\'s likely no need to delay retirement at all.', score: 1 }
          ]
        }
      ],
      'Choose a balanced 60/40 allocation, rebalance during the crash, implement a glide path toward more bonds, and stay calm during the pre-retirement dip — scoring 12/12.',
      'Stocks and bonds are not competing investments — they are complementary tools that serve different purposes at different times. Stocks drive long-term growth. Bonds provide stability and crash protection. The art of portfolio management is adjusting the balance between them as your time horizon changes. Young investors need more stocks. Near-retirees need more bonds. The transition between should be gradual and strategic, not emotional.'
    ),

    // PHASE 5 — CONSOLIDATE
    summaryCards('Stocks vs. Bonds', [
      { takeaway: 'Stocks = ownership, Bonds = loans', detail: 'Stocks give you equity with unlimited upside potential and higher volatility. Bonds give you fixed income with predictable returns and lower volatility. Both serve essential roles in a portfolio.' },
      { takeaway: 'They move in opposite directions during crises', detail: 'In 2008, stocks lost 38% while Treasury bonds gained 26%. This negative correlation is why combining them reduces portfolio risk dramatically.' },
      { takeaway: 'The 60/40 portfolio is a proven foundation', detail: '60% stocks / 40% bonds has historically captured ~80% of stock returns with ~60% of the volatility. During 2008 it lost only 22% vs 38% for all-stocks and recovered 2 years faster.' }
    ]),

    whatsNext(
      'Stocks vs. Bonds',
      'Diversification',
      'You\'ll learn how spreading investments across different asset classes, sectors, and geographies creates a portfolio that\'s stronger than any single investment — and why it\'s called the only free lunch in finance.',
      25
    )
  ],[
    cq('What is the fundamental difference between stocks and bonds?',
      ['Stocks are always better','Stocks represent ownership while bonds represent loans','Bonds always outperform stocks','There is no difference'],
      1,'Stocks = equity (ownership). Bonds = debt (loans). This fundamental distinction drives their different risk-return profiles.'),
    cq('During the 2008 financial crisis, long-term Treasury bonds:',
      ['Lost 38% like stocks','Gained approximately 25-26%','Stayed flat','Lost about 10%'],
      1,'Treasury bonds gained ~26% during 2008 as investors fled stocks for the safety of government bonds — a classic flight to safety.'),
    cq('A 60/40 portfolio (60% stocks, 40% bonds) has historically:',
      ['Matched 100% stock returns','Captured ~80% of stock returns with ~60% of the volatility','Performed worse than all-bonds','Had higher volatility than all-stocks'],
      1,'The 60/40 portfolio captures most of the stock market\'s return while significantly reducing volatility through bond diversification.'),
    cq('When interest rates rise, bond prices:',
      ['Rise','Stay the same','Fall','Double'],
      2,'Bond prices and interest rates move inversely. When rates rise, existing bonds with lower rates become less valuable, so their prices fall.'),
    cq('Why should a 60-year-old nearing retirement consider shifting toward more bonds?',
      ['Bonds always return more','With a shorter time horizon, they may not have time to recover from a stock crash','Bonds are more exciting','They shouldn\'t — stocks are always better'],
      1,'Shorter time horizons mean less time to recover from crashes. Bonds provide stability when you need your money within 5-10 years.')
  ]),

  // ═══════════════════════════════════════════════════════════════
  // LESSON 5 — DIVERSIFICATION
  // ═══════════════════════════════════════════════════════════════
  L(5,'Diversification',30,[
    // PHASE 1 — HOOK
    hookOpener(
      'Diversification',
      'In 2022, Meta (Facebook) stock fell 64% in a single year — investors who put everything in Meta lost nearly two-thirds of their money. That same year, a diversified S&P 500 index fund fell only 18%. Diversification is the difference between a setback and a catastrophe.',
      'By the end of this lesson, you\'ll understand how diversification reduces risk, the different dimensions of diversification, and how to build a portfolio that can survive any market condition.',
      'Comparison chart: Meta stock -64% vs S&P 500 -18% in 2022'
    ),
    stakesCard(
      { label: '100% in Meta stock during 2022', detail: 'A $100,000 investment in Meta alone dropped to $36,000 by November 2022 — a $64,000 loss. Employees who held company stock in their 401(k) saw both their job security and retirement savings threatened simultaneously.' },
      { label: 'Diversified S&P 500 portfolio during 2022', detail: 'A $100,000 S&P 500 investment dropped to $82,000 — an $18,000 loss. While Meta was being destroyed, other companies in the index (energy, healthcare) were rising and offsetting the damage. The portfolio recovered fully within months.' }
    ),

    // PHASE 2 — TEACH
    teachingSlide(
      'THE PRINCIPLE',
      'Don\'t Put All Your Eggs in One Basket',
      [
        'Diversification means spreading your investments across different assets, sectors, and geographies to reduce the impact of any single failure. The core principle: when one investment falls, others should hold steady or rise, cushioning your overall portfolio.',
        'There are four dimensions of diversification. Asset class diversification means holding stocks, bonds, real estate, and cash. Sector diversification means spreading stock holdings across technology, healthcare, energy, finance, and other industries. Geographic diversification means investing in U.S., international, and emerging markets. Time diversification means investing regularly over time through dollar-cost averaging.',
        'The mathematical reason diversification works is correlation. Two investments are positively correlated if they move in the same direction and negatively correlated if they move in opposite directions. A diversified portfolio combines assets with low or negative correlation — so when one falls, others rise or hold steady, smoothing your total returns.'
      ],
      [
        { term: 'Correlation', definition: 'A measure of how two investments move relative to each other, ranging from +1 (move perfectly together) to -1 (move perfectly opposite).', example: 'U.S. tech stocks have ~0.85 correlation with each other but only ~0.3 correlation with Treasury bonds.' },
        { term: 'Systematic Risk', definition: 'Market-wide risk that affects all investments and cannot be diversified away, such as recessions, inflation, or interest rate changes.', example: 'The 2020 COVID crash affected every sector — that\'s systematic risk. Diversification can\'t eliminate it, but it can reduce its impact.' },
        { term: 'Unsystematic Risk', definition: 'Risk specific to a single company or sector that can be eliminated through diversification.', example: 'Meta losing 64% due to its own strategic mistakes is unsystematic risk. Owning 500 stocks eliminates this type of risk.' },
        { term: 'Concentration Risk', definition: 'The danger of having too much of your portfolio in a single stock, sector, or asset class.', example: 'Enron employees who held company stock in their 401(k) lost both their job and retirement savings when the company collapsed.' }
      ],
      'Two-by-two correlation matrix showing four asset classes: U.S. Stocks, Intl Stocks, Bonds, and Real Estate with color coding from dark red (high correlation) to dark green (negative correlation).',
      { company: 'Harry Markowitz', metric: 'Modern Portfolio Theory (Nobel Prize 1990)', outcome: 'Proved mathematically that diversification is the "only free lunch in finance"', explanation: 'Markowitz demonstrated that by combining assets with different correlation patterns, investors can reduce portfolio risk without reducing expected returns. This was revolutionary — getting something for nothing is impossible everywhere in finance except through diversification.' }
    ),

    microCheck(
      'An investor holds 30 technology stocks including Apple, Google, Microsoft, Amazon, and Meta. A tech-industry regulation causes the entire tech sector to drop 30%. How much does the investor\'s portfolio lose?',
      ['Almost nothing — they\'re diversified across 30 stocks', 'About 30% — because all 30 stocks are in the same sector', 'About 15% — partial protection from having 30 stocks', 'The portfolio gains because bad news creates buying opportunities'],
      1,
      'Correct! Owning 30 stocks in the same sector is NOT diversification. If the tech sector drops 30%, all 30 tech stocks drop approximately 30%. True diversification requires spreading across different sectors — technology, healthcare, energy, finance, etc. Sector concentration is one of the most common diversification mistakes.',
      'Not quite. Having 30 stocks sounds diversified, but if they\'re all in the same sector, a sector-wide event hits all of them. A 30% tech drop means a ~30% portfolio loss. True diversification requires spreading across multiple sectors — healthcare, energy, finance, etc.'
    ),

    interactiveGraph(
      'BUILD YOUR MIX',
      'Portfolio Diversification Simulator',
      'pie',
      'Adjust the allocation sliders to build a diversified portfolio. Watch how the risk score and projected volatility change as you add more asset classes and adjust their weights.',
      [
        'A portfolio with a single asset class has the highest concentration risk. Adding a second uncorrelated asset class reduces total portfolio volatility by about 25% without reducing expected returns. Adding a third and fourth can reduce it further. This is the free lunch of diversification.',
        'The optimal number of stocks to eliminate most unsystematic risk is about 30, spread across different sectors. Beyond 30, the diversification benefit diminishes rapidly. An S&P 500 index fund holding 500 stocks is essentially maximally diversified within U.S. equities.',
        'International diversification adds another layer. U.S. and international markets don\'t always move together. During the 2000-2009 "lost decade" when U.S. stocks returned nearly 0%, international stocks returned 30%. Geographic diversification protects against country-specific economic problems.'
      ],
      [
        { term: 'Rebalancing', definition: 'Periodically adjusting your portfolio back to its target allocation by selling assets that have grown and buying those that have shrunk.', example: 'If your 60/40 portfolio drifts to 70/30 after stocks rally, you sell 10% of stocks and buy bonds to restore 60/40.' },
        { term: 'Index Fund', definition: 'A fund that holds all the stocks in a market index, providing instant diversification across hundreds or thousands of companies.', example: 'The Vanguard Total Stock Market Index Fund (VTSAX) holds over 3,500 U.S. stocks in a single fund.' }
      ],
      [
        'Owning 30 stocks across different sectors eliminates ~95% of unsystematic (company-specific) risk.',
        'Adding international stocks to a U.S.-only portfolio has historically reduced volatility by 10-15%.',
        'During the 2000-2009 "lost decade," U.S. stocks returned nearly 0% but international stocks returned 30%.'
      ],
      [
        { label: 'U.S. Stocks', min: 0, max: 100, default: 50, unit: '%' },
        { label: 'International Stocks', min: 0, max: 50, default: 20, unit: '%' },
        { label: 'Bonds', min: 0, max: 60, default: 20, unit: '%' },
        { label: 'Real Estate (REITs)', min: 0, max: 30, default: 10, unit: '%' }
      ],
      { company: 'Enron', metric: 'Employee 401(k) loss (2001)', outcome: 'Employees lost $2 billion in retirement savings', explanation: 'Enron employees were encouraged to hold company stock in their 401(k)s. When Enron collapsed, they lost both their jobs and retirement savings simultaneously. This is the ultimate cautionary tale about concentration risk — never put your career earnings and investments in the same basket.' }
    ),

    caseStudy(
      'Long-Term Capital Management: The $4.6 Billion Lesson in Concentration',
      [
        { date: '1994', event: 'LTCM launches with two Nobel Prize-winning economists and Wall Street legends', context: 'The fund uses sophisticated mathematical models to identify tiny price discrepancies across global bond markets. They leverage these bets enormously — $4.72 billion in capital supports $129 billion in positions (27:1 leverage).' },
        { date: '1995-1997', event: 'LTCM returns 21%, 43%, and 41% — the best track record on Wall Street', context: 'The fund is considered infallible. Its models are based on the idea that markets are rational and extreme events are nearly impossible. They concentrate heavily in specific types of bond arbitrage.' },
        { date: 'August 1998', event: 'Russia defaults on its debt. Global markets panic. LTCM\'s concentrated bets collapse', context: 'LTCM\'s models never predicted a Russian default. Their positions all lose money simultaneously — the correlations they assumed would hold broke down. The fund loses $4.6 billion in weeks.' },
        { date: 'September 1998', event: 'Federal Reserve organizes a $3.6 billion bailout to prevent LTCM from crashing the global financial system', context: 'LTCM was so large and so interconnected that its failure threatened to bring down major banks worldwide. Two Nobel laureates proved that even the smartest people can\'t outsmart diversification.' }
      ],
      'LTCM\'s collapse proves that no model, no strategy, and no team of geniuses can substitute for diversification. Their concentrated, highly leveraged bets in a single strategy worked brilliantly — until they didn\'t. When their assumptions about correlations broke down, they lost everything in weeks. The lesson: diversification isn\'t just about owning different stocks — it\'s about avoiding concentration in any single strategy, asset class, or assumption about how markets work.'
    ),

    misconceptions(
      'DIVERSIFICATION MYTHS',
      'What most people get wrong about portfolio diversification',
      [
        {
          myth: 'Owning 30 stocks means you\'re diversified.',
          truth: '30 stocks in the same sector (e.g., all tech) provides almost no diversification benefit. True diversification requires spreading across different sectors, asset classes, and geographies.',
          explanation: 'During the 2022 tech selloff, Meta fell 64%, Netflix fell 51%, and most tech stocks dropped 30-50%. Owning 30 tech stocks would have meant losing ~40%. A diversified portfolio with energy, healthcare, and utilities would have been much more resilient.'
        },
        {
          myth: 'Diversification means you\'ll never lose money.',
          truth: 'Diversification eliminates unsystematic (company-specific) risk but cannot eliminate systematic (market-wide) risk. In a severe recession, even diversified portfolios lose money — just significantly less.',
          explanation: 'During 2008, even the most diversified portfolios lost 20-30%. But concentrated portfolios lost 50-90%. Diversification doesn\'t prevent all losses — it prevents catastrophic losses and ensures you can recover.'
        },
        {
          myth: 'Too much diversification hurts returns.',
          truth: 'Over-diversification (diworsification) is a real but rare concern. For most investors, broad index funds provide optimal diversification without diluting returns.',
          explanation: 'A total market index fund holding 3,500 stocks has essentially identical returns to one holding 500 stocks, with marginally lower volatility. For individual investors, it\'s nearly impossible to be "too diversified" through index funds.'
        }
      ]
    ),

    keyTermsCards([
      { term: 'Diversification', definition: 'The strategy of spreading investments across different assets, sectors, and geographies to reduce the impact of any single investment\'s failure on the overall portfolio.', example: 'Instead of buying one stock, buying an S&P 500 ETF gives instant diversification across 500 companies in 11 sectors.', sentence: 'Diversification is often called the only free lunch in finance — it reduces risk without reducing expected returns.' },
      { term: 'Correlation', definition: 'A statistical measure of how two investments move relative to each other. +1 = move together, 0 = no relationship, -1 = move in opposite directions.', example: 'U.S. stocks and Treasury bonds have historically had near-zero or negative correlation, making them ideal diversification partners.', sentence: 'By selecting assets with low correlation, she built a portfolio where gains in one area offset losses in another.' },
      { term: 'Unsystematic Risk', definition: 'Risk that is specific to a single company or sector and can be eliminated through diversification.', example: 'Meta losing 64% in 2022 due to its metaverse bet was unsystematic risk — it didn\'t affect healthcare or energy stocks.', sentence: 'Owning a broad index fund eliminates unsystematic risk by spreading exposure across hundreds of companies.' },
      { term: 'Systematic Risk', definition: 'Market-wide risk that affects all investments and cannot be eliminated through diversification (recessions, inflation, interest rate changes).', example: 'The 2020 COVID crash affected every sector simultaneously — that\'s systematic risk that no amount of diversification could avoid.', sentence: 'While diversification eliminates company-specific risk, systematic risk from recessions affects the entire market.' },
      { term: 'Concentration Risk', definition: 'The elevated danger of holding too large a position in a single stock, sector, or asset class.', example: 'Enron employees who held 60%+ of their 401(k) in company stock lost their retirement savings when the company collapsed.', sentence: 'He reduced his concentration risk by selling half of his company stock and reinvesting in a diversified index fund.' },
      { term: 'Rebalancing', definition: 'The process of periodically adjusting your portfolio back to its target asset allocation by selling winners and buying laggards.', example: 'After stocks rallied 25%, his portfolio drifted from 60/40 to 70/30. He sold stocks and bought bonds to restore the 60/40 target.', sentence: 'Annual rebalancing ensures your portfolio doesn\'t drift into unintended concentration as different assets grow at different rates.' }
    ]),

    // PHASE 3 — PRACTICE
    fb('Risk specific to a single company that can be eliminated through diversification is called ___ risk.',['unsystematic','systematic','total','guaranteed'],0),

    q('An investor holds three assets: U.S. stocks, international stocks, and U.S. bonds. During the 2000-2009 "lost decade," U.S. stocks returned nearly 0%. Which of the following best describes what likely happened to this diversified portfolio?',
      ['It also returned 0% since U.S. stocks are the biggest market', 'It still generated positive returns because international stocks returned ~30% and bonds earned ~6% annually during this period', 'It performed worse than U.S. stocks alone', 'All three assets lost money'],
      1,
      'Correct! While U.S. stocks returned nearly 0% from 2000-2009, international stocks returned about 30% total and bonds earned steady 5-6% annually. A globally diversified portfolio earned positive returns during America\'s "lost decade." This is exactly why geographic diversification matters — different regions experience different economic cycles.'
    ),

    tr('Diversification Mind-Openers',[
      ['How many stocks do you need to eliminate most company-specific risk?','About 30, spread across different sectors. Beyond 30, each additional stock provides negligible additional diversification benefit. An index fund with 500 stocks is essentially fully diversified.'],
      ['What happened to Enron employees who held company stock in their 401(k)?','They lost $2 billion collectively. When Enron collapsed, they lost both their income (job) and retirement savings simultaneously. This is why you never concentrate investments in your employer\'s stock.'],
      ['What is the "only free lunch" in finance?','Diversification. Nobel laureate Harry Markowitz proved mathematically that combining uncorrelated assets reduces portfolio risk without reducing expected returns. You get lower risk for free.'],
      ['During 2022, Meta fell 64% while energy stocks gained 55%. What does this teach us?','Different sectors perform differently in the same market environment. A diversified portfolio that held both tech and energy would have had its tech losses partially offset by energy gains.']
    ]),

    ds('Order these portfolios from LEAST diversified to MOST diversified:',[
      '100% in a single stock (e.g., Tesla)',
      '10 stocks in the same sector (all tech)',
      '30 stocks across 5 sectors',
      'S&P 500 index fund (500 U.S. stocks)',
      'Total World Stock Fund (8,000+ stocks globally)',
      '3-fund portfolio: U.S. stocks + international stocks + bonds'
    ]),

    sc('You\'re building a portfolio and deciding between three strategies. Which provides the best diversification?',[
      {label:'Buy the top 10 most popular stocks — they\'re popular for a reason',outcome:'Popular stocks tend to be concentrated in a few sectors (mostly tech). Owning 10 popular stocks gives you heavy tech concentration — the opposite of diversification. In 2022, this portfolio would have lost ~35%.',correct:false},
      {label:'Buy a total market index fund with 3,500+ stocks across all 11 sectors',outcome:'Optimal diversification for U.S. stocks. You own everything — tech, healthcare, energy, finance, industrials, utilities. No sector concentration. During 2022, while tech fell 30%+, energy gained 55%, cushioning your portfolio.',correct:true},
      {label:'Split between 5 different tech ETFs for extra diversification',outcome:'Five tech ETFs is still 100% tech exposure. You\'re diversified within tech but completely undiversified across sectors. A single tech regulatory event would hit your entire portfolio.',correct:false}
    ]),

    sl('Approximately how many stocks across different sectors do you need to eliminate 95% of company-specific (unsystematic) risk?',
      5,100,30,''),

    tf([
      {s:'Owning 30 tech stocks provides good diversification',a:false},
      {s:'Diversification is called the "only free lunch" in finance',a:true},
      {s:'A diversified portfolio can still lose money during a recession',a:false},
      {s:'International stocks provide additional diversification beyond U.S. stocks',a:true},
      {s:'During the 2000-2009 decade, U.S. stocks returned nearly 0% while international stocks gained 30%',a:true}
    ]),

    m('Match the Diversification Type',[
      ['Asset Class','Spreading across stocks, bonds, real estate, and cash'],
      ['Sector','Spreading across technology, healthcare, energy, finance'],
      ['Geographic','Spreading across U.S., international, and emerging markets'],
      ['Time','Investing regularly through dollar-cost averaging']
    ]),

    // PHASE 4 — APPLY
    q('Your coworker tells you she has 70% of her 401(k) in her employer\'s stock because "I know the company well and believe in it." She also holds 20% in a tech-sector ETF and 10% in cash. Based on what you\'ve learned about diversification and concentration risk, what is the most critical issue with her portfolio?',
      [
        'She\'s fine — knowing the company well reduces risk',
        'She has extreme concentration risk — 90% in her employer\'s sector means she could lose both her job and retirement savings simultaneously, like Enron employees did',
        'She needs more cash for safety',
        'She should buy more individual stocks instead of ETFs'
      ],
      1,
      'This is the Enron trap. If her company has problems, she loses her income AND 70% of her retirement. The tech ETF adds another 20% of correlated exposure. She effectively has 90% in a single sector. Enron employees lost $2 billion this exact way. She should: (1) reduce employer stock to maximum 10%, (2) replace with a total market index fund across all sectors, and (3) add bonds for stability. Familiarity with a company creates a false sense of safety.'
    ),

    simulationFinale(
      'Stress-Test Your Portfolio',
      'You\'ve built a $200,000 portfolio. A financial crisis similar to 2008 is about to hit. Your diversification decisions will determine whether you experience a temporary setback or a retirement-threatening catastrophe.',
      [
        {
          prompt: 'Decision 1: Before the crisis, how is your $200,000 allocated?',
          options: [
            { label: '50% U.S. stocks, 20% international stocks, 25% bonds, 5% REITs — broadly diversified', consequence: 'Well-diversified across asset classes and geographies. During a 2008-style crisis, you\'d lose about 22% ($44,000) — painful but recoverable. Your bonds would rally, partially offsetting stock losses.', score: 3 },
            { label: '80% in your 5 favorite tech stocks, 20% cash', consequence: 'Extremely concentrated. In a 2008-style crisis, tech stocks fell 45%+. Your $160,000 in tech becomes ~$88,000. Total portfolio down 36% ($72,000). And it takes years longer to recover.', score: 0 },
            { label: '100% in a single stock you believe in', consequence: 'Maximum concentration risk. Individual stocks can lose 80-100% permanently. In 2008, Bear Stearns, Lehman Brothers, and Washington Mutual went to zero. Your entire retirement could be wiped out.', score: 0 }
          ]
        },
        {
          prompt: 'Decision 2: The crisis hits. Your diversified portfolio is down 22%. Headlines are apocalyptic. What do you do?',
          options: [
            { label: 'Rebalance — sell appreciated bonds to buy discounted stocks', consequence: 'This is the power of diversification in action. Your bonds went up while stocks went down. Selling bonds to buy cheap stocks means you\'re automatically buying low. This alone can add 1-2% annual return over time.', score: 3 },
            { label: 'Sell everything — the world is ending', consequence: 'You just turned a temporary 22% paper loss into a permanent loss. The market recovered within 4 years and tripled within 10 years. Panic-selling during a crisis is the most expensive mistake an investor can make.', score: 0 },
            { label: 'Do nothing — wait for it to pass', consequence: 'Better than selling, but you\'re missing the opportunity to rebalance. Your bonds are up, stocks are cheap — swapping some of each optimizes your recovery.', score: 2 }
          ]
        },
        {
          prompt: 'Decision 3: During recovery, one sector (technology) is surging ahead of everything else. A friend suggests moving everything to tech. What do you do?',
          options: [
            { label: 'Maintain your diversified allocation — today\'s hot sector is tomorrow\'s laggard', consequence: 'Wise decision. In the 2000s, tech crashed and energy boomed. In the 2010s, tech boomed and energy crashed. In 2022, tech crashed and energy boomed again. Chasing sectors is a losing game.', score: 3 },
            { label: 'Move 50% to tech — it\'s clearly the future', consequence: 'Concentration in last year\'s winner is one of the most reliable ways to underperform. Tech surged in the 2010s but crashed in 2000 and 2022. Sector rotation is unpredictable.', score: 0 },
            { label: 'Sell all international stocks to buy more U.S. tech', consequence: 'You\'re abandoning geographic diversification to chase a single sector in a single country. During the 2000-2009 U.S. "lost decade," international stocks gained 30%.', score: 0 }
          ]
        },
        {
          prompt: 'Decision 4: Five years later, your portfolio has recovered and grown to $300,000. How do you optimize your diversification?',
          options: [
            { label: 'Rebalance back to original target allocation and consider adding a new asset class (commodities or TIPS)', consequence: 'Perfect. Rebalancing after growth ensures you don\'t drift into concentration. Adding another uncorrelated asset class (commodities, TIPS, or real assets) further reduces portfolio volatility.', score: 3 },
            { label: 'Leave it as-is — it\'s grown, don\'t touch it', consequence: 'If stocks outperformed, your allocation has drifted (maybe 65% stocks now instead of 50%). Without rebalancing, you\'re taking more risk than intended. Drift is stealth concentration.', score: 1 },
            { label: 'Move everything to bonds — lock in the gains', consequence: 'Switching to all-bonds abandons the growth engine that produced your recovery. With years until retirement, you still need equity exposure for long-term wealth building.', score: 0 }
          ]
        }
      ],
      'Build a broadly diversified portfolio, rebalance into cheap stocks during the crisis, resist sector-chasing during recovery, and rebalance back to target with additional diversification — scoring 12/12.',
      'Diversification is not about maximizing returns — it\'s about surviving the inevitable crises that destroy concentrated portfolios. Every year brings a story of investors who lost everything because they put too much into a single stock, sector, or strategy. Diversification ensures you\'re never one bad event away from financial devastation. It\'s the difference between a setback you recover from and a catastrophe you don\'t.'
    ),

    // PHASE 5 — CONSOLIDATE
    summaryCards('Diversification', [
      { takeaway: 'Diversification is the only free lunch in finance', detail: 'Combining uncorrelated assets reduces portfolio risk without reducing expected returns. It\'s the only strategy in finance that gives you something for nothing — lower risk for free.' },
      { takeaway: 'Four dimensions: asset class, sector, geography, and time', detail: 'True diversification means spreading across stocks/bonds/real estate (asset class), tech/healthcare/energy (sector), U.S./international (geography), and regular investing (time).' },
      { takeaway: 'Concentration risk is the real danger', detail: 'Enron, Lehman Brothers, Meta 2022 — concentration in a single stock can destroy decades of savings. An index fund with 500+ stocks eliminates this risk entirely.' }
    ]),

    whatsNext(
      'Diversification',
      'How Compound Interest Works',
      'Next, you\'ll dive deep into the mechanics of compound interest — understanding the math behind exponential growth and learning to calculate exactly how your money will grow over time.',
      25
    )
  ],[
    cq('In 2022, Meta stock fell 64%. A diversified S&P 500 index fund fell:',
      ['64% — same as Meta','About 18%','About 5%','It gained money'],
      1,'The S&P 500 lost about 18% in 2022 — painful but manageable. Meta\'s 64% loss was company-specific risk that diversification eliminates.'),
    cq('How many stocks across different sectors eliminate ~95% of company-specific risk?',
      ['5','10','30','500'],
      2,'Research shows about 30 stocks spread across different sectors eliminate approximately 95% of unsystematic (company-specific) risk.'),
    cq('Harry Markowitz called diversification:',
      ['A waste of time','The only free lunch in finance','Only for beginners','Too complicated for individuals'],
      1,'Markowitz\'s Nobel Prize-winning work proved that diversification reduces risk without reducing expected returns — the only "free lunch" in finance.'),
    cq('What happened to Enron employees who concentrated their 401(k) in company stock?',
      ['They became millionaires','They lost $2 billion in retirement savings when the company collapsed','Their investments were protected by insurance','Nothing — 401(k)s are guaranteed'],
      1,'Enron employees collectively lost $2 billion in retirement savings. They had concentration risk in its worst form — their income and savings both depended on one company.'),
    cq('During the 2000-2009 U.S. stock market "lost decade," international stocks:',
      ['Also returned 0%','Lost money','Gained approximately 30%','Were unavailable to U.S. investors'],
      2,'While U.S. stocks returned nearly 0% from 2000-2009, international stocks gained about 30%. Geographic diversification protects against country-specific underperformance.')
  ]),

  L(8,'Dollar Cost Averaging',25,[
    c('📊','Invest Consistently, Not All at Once','Dollar cost averaging (DCA) means investing a fixed amount at regular intervals regardless of price. You buy more shares when prices are low and fewer when high.'),
    pc('DCA Example: $100/month into a stock',[
      {prompt:'Month 1: Price $10, shares bought = $100/$10 = ?',options:['5','10','15','20'],correct:1},
      {prompt:'Month 2: Price $5 (dropped!), shares = $100/$5 = ?',options:['10','15','20','25'],correct:2},
      {prompt:'Month 3: Price $8, shares = $100/$8 ≈ ?',options:['10','12.5','15','8'],correct:1},
      {prompt:'Total shares after 3 months: 10 + 20 + 12.5 = ?',options:['40','42.5','45','50'],correct:1}
    ]),
    fb('DCA means investing a ___ amount at regular intervals.',['fixed','random','increasing','variable'],0),
    q('Why is DCA effective?',['It guarantees profits','It removes the need to time the market','It only works in bull markets','It eliminates all risk'],1,'DCA removes emotion and timing from investing decisions.'),
    tf([{s:'DCA means you should try to time market lows',a:false},{s:'With DCA, falling prices let you buy more shares',a:true},{s:'DCA works best with lump sum investing',a:false}]),
    sc('The market dropped 20% this month. You DCA $500/month. What do you do?',[
      {label:'Invest $500 as planned — you\'re buying at a discount!',outcome:'Correct! DCA means sticking to the plan. Lower prices mean more shares per dollar.',correct:true},
      {label:'Stop investing until the market recovers',outcome:'This defeats the purpose of DCA. You miss buying at lower prices.',correct:false},
      {label:'Invest $1,000 to buy the dip',outcome:'While tempting, changing the amount isn\'t DCA — consistency is key.',correct:false}
    ]),
    vi('Chart showing DCA investor vs lump sum investor over 20 years.','What typically happens?',['DCA always wins','Lump sum always wins','Both perform similarly, but DCA reduces timing risk','Neither works'],2),
    sl('If you DCA $200/month for 10 years at 8% return, how much would you have?',20000,50000,36589,'$')
  ],[
    cq('Dollar cost averaging means:',['Investing all at once','Investing fixed amounts at regular intervals','Only buying when prices drop','Timing the market'],1,'DCA = fixed amount, regular schedule.'),
    cq('When prices drop during DCA, you:',['Buy fewer shares','Buy more shares per dollar','Should stop investing','Lose money immediately'],1,'Lower prices = more shares for the same dollar amount.'),
    cq('DCA\'s main benefit is:',['Guaranteed returns','Removing timing decisions','Higher returns than lump sum','Zero risk'],1,'DCA takes emotion and timing out of investing.'),
    cq('DCA works best for:',['Day traders','Long-term investors','People with millions','Professional fund managers'],1,'DCA benefits consistent, long-term investors most.'),
    cq('With DCA, market crashes are:',['Devastating','Opportunities to buy more shares cheaply','Reasons to stop investing','Irrelevant'],1,'Crashes mean your fixed amount buys more shares.')
  ]),

  L(9,'What Is a Portfolio?',25,[
    c('💼','Your Investment Portfolio','A portfolio is the complete collection of your investments — stocks, bonds, ETFs, cash, and other assets. Your mix determines your risk and return profile.'),
    bi('Build Your First Portfolio','Choose allocations that total 100%:',[
      {label:'Stocks (growth)',options:['20%','40%','60%','80%'],correct:2},
      {label:'Bonds (stability)',options:['10%','20%','30%','40%'],correct:1},
      {label:'Cash (safety)',options:['5%','10%','20%','30%'],correct:1},
      {label:'Real Estate (diversifier)',options:['0%','5%','10%','20%'],correct:2}
    ]),
    fb('Your portfolio\'s ___ determines your risk-return tradeoff.',['asset allocation','stock picks','broker','trading frequency'],0),
    q('What is asset allocation?',['Choosing individual stocks','Deciding how to divide money among asset types','Timing when to buy','Picking the best broker'],1,'Asset allocation is the most important investment decision.'),
    m('Portfolio Types',[['Aggressive','80-100% stocks, high risk/return'],['Moderate','60% stocks 40% bonds, balanced'],['Conservative','30% stocks 70% bonds, low risk'],['Income','Dividend stocks and bonds, steady income']]),
    tf([{s:'Asset allocation determines ~90% of portfolio returns variability',a:true},{s:'Everyone should have the same portfolio',a:false},{s:'A good portfolio never loses money',a:false}]),
    vi('Two portfolios: A) 90% stocks 10% bonds. B) 30% stocks 70% bonds.','Which lost more during the 2008 crash?',['Portfolio A (90% stocks)','Portfolio B (30% stocks)','They lost the same','Neither lost money'],0),
    sc('You\'re 25 years old with a 40-year investment horizon. Which portfolio makes most sense?',[
      {label:'80% stocks, 20% bonds — you have time to recover from downturns',outcome:'Correct! With decades ahead, you can afford more stock exposure for higher long-term growth.',correct:true},
      {label:'20% stocks, 80% bonds — play it safe',outcome:'Too conservative for your age. You\'d miss decades of stock market growth.',correct:false},
      {label:'100% cash — no risk!',outcome:'Cash loses to inflation every year. Over 40 years, you\'d lose significant purchasing power.',correct:false}
    ])
  ],[
    cq('A portfolio is:',['One stock you own','Your complete collection of investments','A type of bond','A brokerage account'],1,'Portfolio = all your investments combined.'),
    cq('Asset allocation means:',['Picking stocks','Dividing money among asset types','Day trading','Using leverage'],1,'It\'s how you split money between stocks, bonds, cash, etc.'),
    cq('Studies show asset allocation explains about ___% of return variability:',['10%','30%','60%','90%'],3,'Asset allocation drives ~90% of portfolio return differences.'),
    cq('A 25-year-old should generally have:',['All bonds','All cash','More stocks than bonds','Equal stocks and bonds'],2,'Young investors can afford stock-heavy portfolios.'),
    cq('What is rebalancing?',['Selling everything','Adjusting portfolio back to target allocation','Buying more stocks','Changing brokers'],1,'Rebalancing restores your intended asset mix.')
  ]),

  L(10,'Investment Account Types',50,[
    c('🏦','Where to Hold Investments','Different account types offer different tax benefits. Choosing the right account is as important as choosing the right investments.'),
    tr('Account Types',[['Brokerage','Taxable, no restrictions, flexible'],['401(k)','Employer-sponsored, pre-tax, $23,000 limit'],['Roth IRA','After-tax contributions, tax-free growth'],['Traditional IRA','Pre-tax contributions, taxed at withdrawal']]),
    ds('Order of recommended account priority:',['Max employer 401(k) match','Max Roth IRA','Max remaining 401(k)','Taxable brokerage']),
    fb('A Roth IRA is funded with ___ money, so withdrawals in retirement are tax-free.',['after-tax','pre-tax','borrowed','employer'],0),
    q('What is an employer match?',['A bonus','Free money your employer adds to your 401(k)','A type of stock','A loan from your employer'],1,'If your employer matches 50% up to 6%, that\'s an immediate 50% return!'),
    bi('Optimize Your Account Strategy','Choose the right account for each goal:',[
      {label:'Retirement savings (30+ years)',options:['Checking account','Roth IRA','Credit card','Savings account'],correct:1},
      {label:'Free money from employer',options:['Brokerage','IRA','401(k) match','CD'],correct:2},
      {label:'Flexible investing (no withdrawal restrictions)',options:['401(k)','Roth IRA','Traditional IRA','Taxable brokerage'],correct:3}
    ]),
    tf([{s:'Not taking an employer 401(k) match is leaving free money on the table',a:true},{s:'You can withdraw from a 401(k) anytime without penalty',a:false},{s:'Roth IRA contributions can be withdrawn penalty-free anytime',a:true}]),
    sc('Your employer matches 100% of 401(k) contributions up to 5% of salary. You earn $60,000. What should you do?',[
      {label:'Contribute at least 5% ($3,000) to get the full $3,000 match',outcome:'Correct! That\'s an instant 100% return. You invest $3,000 and immediately have $6,000.',correct:true},
      {label:'Skip the 401(k) — invest on your own',outcome:'You\'re giving up $3,000 in free money. No investment guarantees a 100% return.',correct:false},
      {label:'Contribute 1% just to participate',outcome:'You\'d only get $600 in match instead of $3,000. Always max the match!',correct:false}
    ])
  ],[
    cq('What makes a Roth IRA special?',['Pre-tax contributions','Tax-free withdrawals in retirement','No contribution limits','Employer matching'],1,'Roth = after-tax in, tax-free out.'),
    cq('An employer 401(k) match is:',['A loan','Free money added to your account','A penalty','A type of investment'],1,'Matching is free retirement money from your employer.'),
    cq('Which account has no withdrawal restrictions?',['401(k)','Traditional IRA','Roth IRA','Taxable brokerage'],3,'Brokerage accounts have no age or withdrawal restrictions.'),
    cq('The 2024 401(k) contribution limit is approximately:',['$6,500','$10,000','$23,000','$50,000'],2,'The annual 401(k) limit is $23,000 for those under 50.'),
    cq('What should you do FIRST with investment accounts?',['Open a brokerage','Max out Roth IRA','Get full employer 401(k) match','Buy crypto'],2,'Always capture free money first — employer match is a guaranteed return.')
  ]),

  // Lessons 11-50: Condensed with same structure
  ...[
    {n:11,t:'How the Stock Market Works',e:'🏛️',b:'The stock market is a network of exchanges where buyers and sellers trade shares. Prices are set by supply and demand in real time.'},
    {n:12,t:'Reading a Stock Ticker',e:'📋',b:'A stock ticker displays a company\'s symbol, current price, daily change, and volume. Learning to read one is your first step to market literacy.'},
    {n:13,t:'Market Orders vs Limit Orders',e:'⚡',b:'A market order executes immediately at the current price. A limit order only executes at your specified price or better.'},
    {n:14,t:'What Moves Stock Prices',e:'📰',b:'Stock prices change based on supply and demand, driven by earnings, news, economic data, and investor sentiment.'},
    {n:15,t:'Dividends Explained',e:'💵',b:'Dividends are regular cash payments companies make to shareholders from profits. They provide income and signal financial health.'},
    {n:16,t:'Reading a Stock Chart',e:'📈',b:'Stock charts show price movement over time. Key features include trend lines, volume bars, and moving averages.'},
    {n:17,t:'Sector Investing',e:'🏗️',b:'The market is divided into 11 sectors like Technology, Healthcare, and Energy. Different sectors perform well in different economic conditions.'},
    {n:18,t:'Bull vs Bear Markets',e:'🐂',b:'A bull market rises 20%+ from lows. A bear market falls 20%+ from highs. Both are normal parts of economic cycles.'},
    {n:19,t:'What Is Market Cap?',e:'📐',b:'Market capitalization = share price × total shares. It classifies companies: Large cap ($10B+), Mid cap ($2-10B), Small cap (under $2B).'},
    {n:20,t:'Blue Chip, Growth & Value Stocks',e:'💎',b:'Blue chips are large, stable companies. Growth stocks prioritize expansion. Value stocks trade below their estimated worth.'},
    {n:21,t:'How Bonds Are Priced',e:'💰',b:'Bond prices move inversely to interest rates. When rates rise, existing bond prices fall because new bonds offer better yields.'},
    {n:22,t:'Bond Yields & Interest Rates',e:'📉',b:'Current yield = annual coupon / market price. Yield to maturity accounts for price, coupon, and time until maturity.'},
    {n:23,t:'How ETFs Track Indexes',e:'🎯',b:'Index ETFs use full replication (buying all stocks) or sampling to mirror their benchmark index performance.'},
    {n:24,t:'Expense Ratios & Fees',e:'💸',b:'Expense ratios are annual fees charged by funds, expressed as a percentage. A 0.50% ratio on $10,000 = $50/year in fees.'},
    {n:25,t:'Comparing Funds',e:'🔍',b:'Compare funds using returns, expense ratio, tracking error, diversification, tax efficiency, and assets under management.'},
    {n:26,t:'Building Your First Portfolio',e:'🧱',b:'Start with a simple 3-fund portfolio: U.S. stocks, international stocks, and bonds. Adjust the ratio based on your age and risk tolerance.'},
    {n:27,t:'Asset Allocation by Age',e:'🎂',b:'A common rule: hold your age in bonds (age 25 = 25% bonds). More aggressive: 120 minus your age in stocks.'},
    {n:28,t:'401(k) Deep Dive',e:'🏢',b:'Your 401(k) reduces taxable income, grows tax-deferred, and may include employer matching. Contribution limits are $23,000/year.'},
    {n:29,t:'Roth IRA vs Traditional IRA',e:'🔄',b:'Roth: pay taxes now, withdraw tax-free later. Traditional: tax deduction now, pay taxes on withdrawals. Choose based on future tax expectations.'},
    {n:30,t:'Employer Matching Strategies',e:'🎁',b:'Always contribute enough to get the full match. It\'s an instant 50-100% return on your money depending on the match rate.'},
    {n:31,t:'Target Date Funds',e:'📅',b:'Target date funds automatically adjust from aggressive to conservative as you approach retirement. Choose the fund closest to your retirement year.'},
    {n:32,t:'Rebalancing a Portfolio',e:'⚖️',b:'Rebalancing means selling winners and buying laggards to restore your target allocation. Do it annually or when allocations drift 5%+.'},
    {n:33,t:'Tax-Advantaged Accounts',e:'🛡️',b:'Tax-advantaged accounts like IRAs, 401(k)s, and HSAs reduce your tax burden. Use them to maximize after-tax returns.'},
    {n:34,t:'Capital Gains Taxes',e:'📝',b:'Short-term gains (held < 1 year) are taxed as income. Long-term gains (held 1+ years) get preferential rates of 0%, 15%, or 20%.'},
    {n:35,t:'Inflation & Investments',e:'🎈',b:'Inflation reduces purchasing power ~3%/year. Your investments need to earn more than inflation to truly grow your wealth.'},
    {n:36,t:'The Rule of 72',e:'🔢',b:'Divide 72 by your annual return rate to estimate how many years it takes to double your money. At 8% → 72/8 = 9 years.'},
    {n:37,t:'Historical Market Returns',e:'📊',b:'The S&P 500 has averaged ~10% annually since 1926. After inflation, real returns are ~7%. Past performance doesn\'t guarantee future results.'},
    {n:38,t:'S&P 500 Explained',e:'🇺🇸',b:'The S&P 500 tracks 500 of the largest U.S. companies by market cap. It represents ~80% of total U.S. stock market value.'},
    {n:39,t:'Dow Jones & NASDAQ',e:'🌐',b:'The Dow tracks 30 blue-chip stocks (price-weighted). NASDAQ focuses on tech/growth companies. Each tells a different market story.'},
    {n:40,t:'NASDAQ Composite',e:'💻',b:'The NASDAQ Composite includes 3,000+ stocks listed on the NASDAQ exchange, heavily weighted toward technology and growth companies.'},
    {n:41,t:'Case Study: Warren Buffett',e:'👴',b:'Buffett grew $114 to $100B+ through value investing, patience, and compound growth over 60+ years. His key: buying great companies at fair prices.'},
    {n:42,t:'Common Beginner Mistakes',e:'⚠️',b:'Top mistakes: timing the market, not diversifying, panic selling, ignoring fees, and waiting too long to start investing.'},
    {n:43,t:'When to Sell',e:'🚪',b:'Sell when: your investment thesis changes, you need to rebalance, you reach a goal, or the company fundamentals deteriorate.'},
    {n:44,t:'Emotional Traps in Investing',e:'🧠',b:'Fear and greed drive bad decisions. Loss aversion makes losses feel 2x worse than equivalent gains. Stay rational with a written plan.'},
    {n:45,t:'Building a 10-Year Plan',e:'🗓️',b:'Set specific goals, choose appropriate accounts, define asset allocation, automate contributions, and review annually.'},
    {n:46,t:'Evaluating Portfolio Performance',e:'📏',b:'Compare returns to relevant benchmarks. A 10% return sounds great until you learn the S&P 500 returned 15% that year.'},
    {n:47,t:'Investing with Small Amounts',e:'🪙',b:'Start with $5-50/month through fractional shares and micro-investing. Consistency matters more than amount.'},
    {n:48,t:'Micro-Investing Apps',e:'📱',b:'Apps like Acorns, Stash, and Robinhood let you invest small amounts. Watch for fees that eat into small balances.'},
    {n:49,t:'Investing Checklist',e:'✅',b:'Emergency fund ✓ Employer match ✓ High-interest debt paid ✓ Roth IRA funded ✓ Diversified portfolio ✓ Automated contributions ✓'},
    {n:50,t:'Course Recap & Assessment',e:'🎓',b:'You\'ve covered stocks, bonds, ETFs, compound interest, diversification, accounts, and portfolio building. Let\'s test your knowledge!'}
  ].map(({n,t,e,b}) => L(n,t,n%10===0?50:25,[
    c(e,t,b),
    tr(`${t} — Key Points`,[[`Point 1`,`Core concept of ${t.toLowerCase()}`],[`Point 2`,`Why it matters for investors`],[`Point 3`,`How to apply this knowledge`],[`Point 4`,`Common misconception`]]),
    fb(`Understanding ${t.toLowerCase()} is essential for building ___.`,['wealth','debt','stress','confusion'],0),
    q(`Why is ${t.toLowerCase()} important?`,[`It helps make informed decisions`,`It guarantees profits`,`It eliminates all risk`,`It\'s not important`],0,`${t} is a fundamental concept every investor should understand.`),
    tf([{s:`${t} is only for professional investors`,a:false},{s:`Understanding ${t.toLowerCase()} can improve your financial decisions`,a:true},{s:`You should ignore ${t.toLowerCase()} completely`,a:false}]),
    sc(`You encounter a situation related to ${t.toLowerCase()}. What\'s the best approach?`,[
      {label:'Research and apply what you learned',outcome:'Taking an informed, educated approach leads to better outcomes.',correct:true},
      {label:'Ignore it and hope for the best',outcome:'Ignoring financial concepts usually leads to missed opportunities or losses.',correct:false},
      {label:'Follow the crowd blindly',outcome:'Herd mentality is one of the biggest investing mistakes.',correct:false}
    ]),
    m(`${t} Concepts`,[[`Concept A`,`Definition A`],[`Concept B`,`Definition B`],[`Concept C`,`Definition C`]]),
    sl(`Rate your confidence in ${t.toLowerCase()} (1-10):`,1,10,7,'')
  ],[
    cq(`What is ${t.toLowerCase()} about?`,[`Making quick profits`,`A fundamental investing concept`,`A type of scam`,`Only for experts`],1,`${t} is a core concept in investing fundamentals.`),
    cq(`${t} helps investors by:`,[`Guaranteeing returns`,`Providing knowledge for better decisions`,`Eliminating taxes`,`Replacing financial advisors`],1,`Knowledge leads to better investment decisions.`),
    cq(`A common mistake regarding ${t.toLowerCase()} is:`,[`Learning about it`,`Ignoring it completely`,`Asking questions`,`Starting early`],1,`Ignoring fundamental concepts leads to poor decisions.`),
    cq(`When should you consider ${t.toLowerCase()}?`,[`Never`,`Only in bull markets`,`As part of your overall strategy`,`Only when you\'re rich`],2,`Financial concepts apply at every wealth level.`),
    cq(`The best way to learn about ${t.toLowerCase()} is:`,[`Speculation`,`Study and practice`,`Gambling`,`Avoiding it`],1,`Continuous learning is key to investing success.`)
  ]))
];

export default lessons;
