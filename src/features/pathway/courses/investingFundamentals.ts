
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
    fb('Investing is putting money to work so it grows faster than ___.',['inflation','taxes','bills','debt'],0),

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

  L(2,'Stocks Explained',25,[
    c('🏢','What Are Stocks?','A stock represents a small ownership share in a company. When you buy stock, you become a partial owner — called a shareholder.'),
    tr('Stock Basics',[['Share','One unit of stock ownership'],['Shareholder','Person who owns stock'],['Ticker','Short code identifying a stock (e.g., AAPL)'],['Exchange','Marketplace where stocks trade']]),
    fb('When you buy a stock, you become a partial ___ of the company.',['owner','employee','creditor','manager'],0),
    vi('Imagine a company worth $1 billion with 1 billion shares outstanding.','What is the price per share?',['$1','$10','$100','$1,000'],0),
    q('Why do companies issue stock?',['To raise money for growth','To pay employees','To reduce taxes','To buy other companies'],0,'Companies sell shares to raise capital for operations and expansion.'),
    tf([{s:'Owning stock means you own part of a company',a:true},{s:'All stocks pay dividends',a:false},{s:'Stock prices can go to zero',a:true}]),
    sc('A company you own stock in reports record earnings. What likely happens to the stock price?',[
      {label:'Price increases',outcome:'Strong earnings typically drive stock prices up as investors value the company higher.',correct:true},
      {label:'Price decreases',outcome:'Usually the opposite — good news tends to raise prices.',correct:false},
      {label:'Nothing changes',outcome:'Markets react to new information, so earnings reports almost always cause movement.',correct:false}
    ]),
    m('Match Stock Terms',[['NYSE','New York Stock Exchange'],['NASDAQ','Tech-heavy electronic exchange'],['IPO','First time a company sells stock publicly'],['Market Cap','Total value of all shares']])
  ],[
    cq('A stock represents:',['A loan to a company','Ownership in a company','A government bond','A bank deposit'],1,'Stock = equity = ownership.'),
    cq('What is a ticker symbol?',['A stock price','A short code for a stock','A tax form','An exchange rate'],1,'Tickers like AAPL or GOOGL identify stocks.'),
    cq('Where are stocks traded?',['Banks','Stock exchanges','Insurance companies','The Federal Reserve'],1,'Stocks trade on exchanges like NYSE and NASDAQ.'),
    cq('What is market capitalization?',['Annual revenue','Total shares × price per share','Dividends paid','Trading volume'],1,'Market cap = share price × shares outstanding.'),
    cq('An IPO is when:',['A company goes private','A company first sells stock to public','Stock price doubles','A company pays dividends'],1,'IPO = Initial Public Offering.')
  ]),

  L(3,'Bonds Explained',25,[
    c('📜','What Are Bonds?','A bond is a loan you make to a company or government. They promise to pay you back with interest over a set period.'),
    tr('Bond Anatomy',[['Face Value','Amount paid back at maturity (usually $1,000)'],['Coupon Rate','Annual interest rate paid'],['Maturity','When the bond expires and face value is returned'],['Yield','Total return considering price paid']]),
    fb('A bond\'s ___ is the interest rate it pays annually.',['coupon rate','face value','maturity date','credit rating'],0),
    q('Who issues bonds?',['Only the government','Only corporations','Governments, corporations, and municipalities','Only banks'],2,'All three issue bonds to raise capital.'),
    ds('Order bond risk from lowest to highest:',['U.S. Treasury Bonds','Municipal Bonds','Investment-Grade Corporate','High-Yield (Junk) Bonds']),
    tf([{s:'Bonds are generally safer than stocks',a:true},{s:'Bonds always return more than stocks',a:false},{s:'Bond prices fall when interest rates rise',a:true}]),
    pc('Calculate annual interest on a $1,000 bond with 5% coupon',[
      {prompt:'What is the face value?',options:['$500','$1,000','$5,000','$10,000'],correct:1},
      {prompt:'What is the coupon rate?',options:['3%','5%','8%','10%'],correct:1},
      {prompt:'Annual interest = $1,000 × 0.05 = ?',options:['$25','$50','$100','$500'],correct:1}
    ]),
    sc('Interest rates just rose 1%. What happens to your existing bonds?',[
      {label:'Bond prices fall',outcome:'Correct! When new bonds offer higher rates, existing lower-rate bonds become less attractive, so their prices drop.',correct:true},
      {label:'Bond prices rise',outcome:'Actually the opposite — higher rates make existing bonds less valuable.',correct:false},
      {label:'Nothing happens',outcome:'Bond prices are inversely related to interest rates.',correct:false}
    ])
  ],[
    cq('A bond is best described as:',['Ownership in a company','A loan to an issuer','A savings account','A stock option'],1,'Bonds are debt instruments — you lend money.'),
    cq('Face value is:',['The current market price','Amount repaid at maturity','Annual interest earned','The bond rating'],1,'Face value (par value) is repaid when the bond matures.'),
    cq('When interest rates rise, bond prices:',['Rise','Stay the same','Fall','Double'],2,'Bond prices and interest rates move inversely.'),
    cq('Which bond type has the LOWEST risk?',['Corporate junk bonds','Municipal bonds','U.S. Treasury bonds','Convertible bonds'],2,'Treasuries are backed by the U.S. government.'),
    cq('A 5% coupon on a $1,000 bond pays:',['$5/year','$50/year','$500/year','$5,000/year'],1,'$1,000 × 0.05 = $50 annual interest.')
  ]),

  L(4,'What Are ETFs?',25,[
    c('📦','Exchange-Traded Funds','An ETF is a basket of stocks, bonds, or other assets that trades on an exchange like a single stock. It gives you instant diversification.'),
    tr('ETF Features',[['Diversification','Holds many assets in one fund'],['Low Cost','Usually lower fees than mutual funds'],['Liquidity','Buy/sell anytime during market hours'],['Transparency','Holdings disclosed daily']]),
    fb('An ETF trades on an exchange just like a ___.',['stock','bond','savings account','CD'],0),
    q('What is the main advantage of ETFs over individual stocks?',['Higher returns guaranteed','Instant diversification','No risk','Free trading'],1,'ETFs spread your money across many assets automatically.'),
    m('ETF vs Individual Stock',[['ETF','Holds many assets in one fund'],['Individual Stock','Ownership in one company'],['Index ETF','Tracks a market index like S&P 500'],['Sector ETF','Focuses on one industry']]),
    tf([{s:'ETFs can only hold stocks',a:false},{s:'You can buy ETFs during market hours',a:true},{s:'ETFs are always actively managed',a:false}]),
    vi('SPY is an ETF tracking the S&P 500 with 500 stocks inside. If you buy 1 share of SPY...','How many companies do you effectively own?',['1','50','500','5,000'],2),
    sl('What is the typical expense ratio for a broad index ETF?',0,200,10,'basis pts')
  ],[
    cq('An ETF is best described as:',['A single stock','A basket of assets trading like a stock','A bank account','A government bond'],1,'ETFs bundle multiple assets into one tradeable fund.'),
    cq('ETFs provide instant:',['Profits','Losses','Diversification','Debt'],2,'Buying one ETF gives exposure to many assets.'),
    cq('How do ETFs differ from mutual funds?',['ETFs trade all day; mutual funds at end of day','ETFs are always more expensive','Mutual funds have more transparency','No difference'],0,'ETFs trade throughout the day on exchanges.'),
    cq('What does SPY track?',['NASDAQ','Dow Jones','S&P 500','Russell 2000'],2,'SPY tracks the S&P 500 index.'),
    cq('A low expense ratio means:',['Higher fees','Lower annual costs','More risk','Less diversification'],1,'Lower expense ratios save you money on fees.')
  ]),

  L(5,'Mutual Funds vs Index Funds',25,[
    c('⚖️','Mutual vs Index Funds','Mutual funds pool money from investors to buy a portfolio of assets. Index funds are a type of mutual fund that passively tracks a market index.'),
    tr('Key Differences',[['Active Management','Fund manager picks stocks, higher fees'],['Passive Management','Tracks an index, lower fees'],['Expense Ratio','Annual fee as % of investment'],['Benchmark','Index the fund tries to match or beat']]),
    fb('An index fund passively tracks a market ___.',['index','manager','prediction','trend'],0),
    q('Why do most actively managed funds underperform index funds?',['Bad luck','Higher fees and difficulty beating the market consistently','They invest in bad stocks','They don\'t try'],1,'Studies show ~80% of active funds underperform their benchmark after fees.'),
    ds('Order from lowest to highest typical fees:',['Index Fund (0.03%)','ETF (0.10%)','Actively Managed Mutual Fund (0.75%)','Hedge Fund (2%)']),
    sc('You\'re choosing between a fund with 0.03% fees and one with 1.00% fees, both tracking the S&P 500. Over 30 years on $10,000:',[
      {label:'Pick the 0.03% fund',outcome:'After 30 years at 10% return: ~$164,000 vs ~$132,000. The low-fee fund earns you $32,000 more!',correct:true},
      {label:'Pick the 1.00% fund — higher fees must mean better returns',outcome:'Higher fees don\'t guarantee better performance. You\'d lose ~$32,000 to fees over 30 years.',correct:false},
      {label:'It doesn\'t matter',outcome:'Fees compound over time and make a massive difference — $32,000+ in this case.',correct:false}
    ]),
    tf([{s:'Most active managers beat the market long-term',a:false},{s:'Index funds have lower fees than most mutual funds',a:true},{s:'You can only buy mutual funds through a broker',a:false}]),
    sl('What percentage of actively managed funds fail to beat their index over 15 years?',30,100,85,'%')
  ],[
    cq('An index fund:',['Is actively managed','Tracks a specific market index','Always beats the market','Has the highest fees'],1,'Index funds passively mirror a benchmark index.'),
    cq('Active management means:',['A computer picks stocks','A manager selects investments trying to beat the market','The fund never changes','Investors vote on stocks'],1,'Active managers research and select individual investments.'),
    cq('Why are fees important?',['They don\'t matter','They compound and reduce returns over time','Higher fees guarantee better returns','Fees are tax deductible'],1,'Even small fee differences compound to large amounts over decades.'),
    cq('Approximately what % of active funds underperform their index?',['20%','50%','80%','100%'],2,'About 80% of active funds fail to beat their benchmark.'),
    cq('A 0.03% expense ratio on $10,000 means annual fees of:',['$3','$30','$300','$3,000'],0,'$10,000 × 0.0003 = $3 per year.')
  ]),

  L(6,'How Compound Interest Works',30,[
    c('🌱','The Magic of Compounding','Compound interest means earning interest on your interest. It\'s the most powerful force in investing — small amounts grow exponentially over time.'),
    pc('Calculate compound growth on $1,000 at 10% for 3 years',[
      {prompt:'Year 1: $1,000 × 1.10 = ?',options:['$1,050','$1,100','$1,200','$1,010'],correct:1},
      {prompt:'Year 2: $1,100 × 1.10 = ?',options:['$1,200','$1,210','$1,220','$1,150'],correct:1},
      {prompt:'Year 3: $1,210 × 1.10 = ?',options:['$1,310','$1,321','$1,331','$1,300'],correct:2}
    ]),
    fb('Compound interest means earning interest on your ___.',['interest','principal only','debt','salary'],0),
    vi('A chart shows $1,000 growing to $17,449 over 30 years at 10% annually.','What drove most of the growth?',['The original $1,000','Annual contributions','Compound interest on reinvested returns','Inflation'],2),
    sl('If you invest $100/month at 8% for 30 years, approximately how much will you have?',50000,250000,150030,'$'),
    q('What is the Rule of 72?',['Divide 72 by return rate to estimate doubling time','A tax rule','A bond maturity rule','A trading strategy'],0,'72 ÷ rate = years to double. At 8%, money doubles in ~9 years.'),
    tf([{s:'$1,000 at 10% for 30 years grows to over $17,000',a:true},{s:'Simple interest grows faster than compound interest',a:false},{s:'Starting early matters more than investing larger amounts later',a:true}]),
    sc('You\'re 25. A friend says "I\'ll start investing at 35 — I have time." What do you tell them?',[
      {label:'Starting 10 years earlier could mean 2-3x more at retirement',outcome:'Correct! At 10% return, $5,000/year from 25-65 = ~$2.4M vs starting at 35 = ~$900K. That decade costs over $1.5M!',correct:true},
      {label:'They\'re right, 10 years won\'t matter',outcome:'Actually, those 10 extra years of compounding can more than double the final amount.',correct:false},
      {label:'Tell them to invest more later to make up for it',outcome:'They\'d need to invest 2-3x as much monthly to catch up — compounding heavily favors early starters.',correct:false}
    ])
  ],[
    cq('Compound interest is:',['Interest only on the original amount','Interest on interest and principal','A type of bond','A tax benefit'],1,'Compound = interest earning interest.'),
    cq('The Rule of 72 tells you:',['How to pick stocks','How long to double your money','The best interest rate','When to sell'],1,'72 ÷ return rate ≈ years to double.'),
    cq('At 8%, money doubles in approximately:',['5 years','9 years','15 years','20 years'],1,'72 ÷ 8 = 9 years.'),
    cq('Why is starting early so important?',['You get better interest rates','Compounding has more time to work','Stocks are cheaper when you\'re young','Banks give youth discounts'],1,'More time = more compounding cycles = exponentially more growth.'),
    cq('$1,000 at 10% compounded for 1 year equals:',['$1,010','$1,050','$1,100','$1,200'],2,'$1,000 × 1.10 = $1,100.')
  ]),

  L(7,'Diversification',25,[
    c('🎯','Don\'t Put All Eggs in One Basket','Diversification means spreading investments across different assets, sectors, and regions to reduce risk without sacrificing expected returns.'),
    bi('Build a Diversified Portfolio','Allocate your $10,000 investment across asset classes:',[
      {label:'U.S. Stocks',options:['0%','30%','60%','100%'],correct:2},
      {label:'International Stocks',options:['0%','20%','50%','80%'],correct:1},
      {label:'Bonds',options:['0%','15%','40%','70%'],correct:1},
      {label:'Cash',options:['0%','5%','25%','50%'],correct:1}
    ]),
    q('What does diversification reduce?',['All risk','Systematic risk','Unsystematic (company-specific) risk','Returns'],2,'Diversification eliminates company-specific risk but not market-wide risk.'),
    tf([{s:'Owning 30 tech stocks is well-diversified',a:false},{s:'Diversification can reduce risk without reducing expected returns',a:true},{s:'You need millions to diversify properly',a:false}]),
    m('Types of Diversification',[['Asset Class','Stocks, bonds, real estate, cash'],['Sector','Technology, healthcare, energy, finance'],['Geographic','U.S., Europe, Asia, Emerging Markets'],['Time','Investing regularly over time (DCA)']]),
    vi('Portfolio A: 100% in one stock. Portfolio B: 500 stocks across 11 sectors.','Which has lower risk?',['Portfolio A','Portfolio B','Same risk','Cannot tell'],1),
    sc('Your coworker puts 100% of their 401k into their company stock. What\'s the risk?',[
      {label:'Double jeopardy — if the company fails, they lose both job and savings',outcome:'Exactly! Concentration in employer stock is extremely dangerous. See: Enron employees lost everything.',correct:true},
      {label:'No risk — they know the company well',outcome:'Familiarity doesn\'t equal safety. Enron employees "knew" their company too.',correct:false},
      {label:'It\'s fine for short-term',outcome:'Even short-term, concentration risk is real. A single bad quarter can devastate a single stock.',correct:false}
    ]),
    sl('How many stocks do you need to eliminate most unsystematic risk?',5,100,30,'stocks')
  ],[
    cq('Diversification means:',['Buying one great stock','Spreading investments across different assets','Timing the market','Only buying bonds'],1,'Diversification = spreading risk across assets.'),
    cq('Owning 30 tech stocks is:',['Well diversified','Only sector-diversified','Not diversified — all in one sector','Impossible'],2,'Same sector = concentrated risk.'),
    cq('Diversification eliminates:',['All risk','Market risk','Company-specific risk','Currency risk'],2,'It removes unsystematic risk, not systematic/market risk.'),
    cq('A diversified portfolio typically includes:',['Only stocks','Only bonds','Mix of stocks, bonds, and other assets','Only cash'],2,'True diversification spans multiple asset classes.'),
    cq('About how many stocks eliminate most company-specific risk?',['5','10','30','500'],2,'Research shows ~30 stocks across sectors removes most unsystematic risk.')
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
