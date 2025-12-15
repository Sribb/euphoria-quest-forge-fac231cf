// Comprehensive lesson content based on proven investing principles
// Sources: Warren Buffett, Benjamin Graham, Peter Lynch, Ray Dalio, Investopedia

export interface LessonSection {
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  scenario?: {
    situation: string;
    choices: { text: string; outcome: string; isCorrect: boolean }[];
  };
}

export const getLessonContent = (lessonOrderIndex: number): LessonSection[] => {
  const lessonContents: Record<number, LessonSection[]> = {
    1: [ // Introduction to Investing
      {
        title: "What is Investing?",
        content: "Investing is the act of allocating money with the expectation of generating income or profit over time. Unlike saving—which focuses on preserving capital—investing aims to grow wealth by purchasing assets that appreciate in value or generate returns. According to Benjamin Graham's 'The Intelligent Investor', successful investing requires patience, discipline, and a clear understanding of fundamental principles. The Federal Reserve emphasizes that investing is essential for long-term financial security and retirement planning.",
        quiz: {
          question: "What is the primary goal of investing compared to saving?",
          options: [
            "To preserve capital safely",
            "To grow wealth through assets that appreciate over time",
            "To keep money liquid for emergencies",
            "To avoid all financial risks"
          ],
          correctAnswer: 1,
          explanation: "Unlike saving which focuses on preservation, investing aims to grow wealth by purchasing assets that appreciate in value or generate returns over time."
        }
      },
      {
        title: "Saving vs. Investing",
        content: "Saving and investing serve different purposes in your financial life. Saving provides security and liquidity for short-term needs—think emergency funds in high-yield savings accounts. Investing, however, focuses on long-term wealth accumulation through assets like stocks, bonds, and real estate. While savings accounts may offer 0.5-2% annual returns, a diversified investment portfolio historically averages 7-10% annually. The key is maintaining both: 3-6 months of expenses in savings, with surplus funds invested for growth.",
        quiz: {
          question: "What's the primary difference between saving and investing?",
          options: [
            "Saving is for short-term needs; investing is for long-term growth",
            "Saving is risky; investing is safe",
            "Saving is only for retirement",
            "There is no difference"
          ],
          correctAnswer: 0,
          explanation: "Saving preserves capital for immediate needs with low returns, while investing grows wealth over time with higher potential returns and calculated risk."
        }
      },
      {
        title: "The Power of Compound Interest",
        content: "Albert Einstein called compound interest 'the eighth wonder of the world.' It's the process where your investment earnings generate their own earnings. For example: $10,000 invested at 10% annually becomes $25,937 in 10 years, $67,275 in 20 years, and $174,494 in 30 years. Warren Buffett's wealth stems not from stock-picking genius alone, but from 80+ years of compounding. Start early—a 25-year-old investing $200 monthly until 65 accumulates $1.4 million at 8% returns, while a 35-year-old doing the same accumulates just $640,000.",
        quiz: {
          question: "If you invest $10,000 at 10% annually, approximately how much will you have in 30 years through compound interest?",
          options: [
            "$40,000",
            "$67,000",
            "$174,000",
            "$250,000"
          ],
          correctAnswer: 2,
          explanation: "Through compound interest, $10,000 grows to approximately $174,494 in 30 years at 10% annual returns, demonstrating the exponential power of compounding."
        }
      },
      {
        title: "Time in Market vs. Timing the Market",
        content: "Academic research from Investopedia shows that timing the market—predicting short-term price movements—is nearly impossible even for professionals. The S&P 500's best days often follow its worst days. Missing just the 10 best trading days over 20 years reduces returns by 50%. Warren Buffett advises: 'Time in the market beats timing the market.' Stay invested through volatility. Dollar-cost averaging—investing fixed amounts regularly—smooths out price fluctuations and removes emotion from decisions.",
        quiz: {
          question: "According to research, what happens if you miss the market's best days?",
          options: [
            "Your returns improve",
            "Nothing significant changes",
            "Your returns can be cut in half",
            "You save money on fees"
          ],
          correctAnswer: 2,
          explanation: "Studies show missing the market's best 10 days over 20 years can reduce returns by approximately 50%, highlighting why staying invested is crucial."
        }
      },
    ],
    
    2: [ // Risk vs. Reward
      {
        title: "Understanding Investment Risk",
        content: "Risk in investing refers to the possibility of losing some or all of your investment capital. According to Modern Portfolio Theory, risk and return are directly correlated—higher potential returns come with higher risk exposure. However, risk isn't inherently bad; it's the price of opportunity. Ray Dalio's 'Principles' emphasizes understanding your risk tolerance—your psychological and financial capacity to withstand losses without panic-selling during downturns.",
        quiz: {
          question: "According to Modern Portfolio Theory, what is the relationship between risk and return?",
          options: [
            "They are inversely related",
            "They are directly correlated",
            "They are not related at all",
            "Risk always exceeds return"
          ],
          correctAnswer: 1,
          explanation: "Risk and return are directly correlated—higher potential returns come with higher risk exposure, which is a fundamental principle of investing."
        }
      },
      {
        title: "The Risk-Return Spectrum",
        content: "Different investments offer varying risk-return profiles: Cash/Savings (0-2% return, minimal risk). Government Bonds (2-5% return, low risk). Corporate Bonds (4-7% return, moderate risk). Large-Cap Stocks (7-10% return, moderate-high risk). Small-Cap Stocks/Emerging Markets (10-15%+ return, high risk). The spectrum demonstrates a fundamental truth: to achieve higher returns, you must accept higher volatility and potential losses. Your asset allocation should reflect your time horizon and risk tolerance.",
        quiz: {
          question: "Which investment typically offers the highest potential return but also the highest risk?",
          options: [
            "Government bonds",
            "Large-cap stocks",
            "Small-cap stocks and emerging markets",
            "Savings accounts"
          ],
          correctAnswer: 2,
          explanation: "Small-cap stocks and emerging market investments historically offer the highest potential returns but come with the greatest volatility and risk of capital loss."
        }
      },
      {
        title: "Assessing Your Risk Tolerance",
        content: "Your risk tolerance depends on three factors: Time horizon—investors with 30+ years can weather short-term volatility. Financial capacity—never invest money you'll need within 5 years. Emotional temperament—can you sleep soundly if your portfolio drops 30%? A simple test: If a $100,000 portfolio dropped to $70,000 tomorrow, would you: A) Panic and sell everything? B) Feel concerned but stay invested? C) See it as a buying opportunity? Answer honestly. Your comfort with volatility determines your optimal asset mix.",
        quiz: {
          question: "What is one of the three key factors that determines your risk tolerance?",
          options: [
            "Your favorite color",
            "Your time horizon for investments",
            "Your height",
            "The current market conditions"
          ],
          correctAnswer: 1,
          explanation: "Time horizon is a critical factor—investors with longer time frames (30+ years) can weather short-term volatility better than those needing money soon."
        }
      },
      {
        title: "Managing Risk Through Diversification",
        content: "Ray Dalio's 'All Weather Portfolio' demonstrates risk management through diversification—spreading investments across uncorrelated assets. When stocks fall 40% (as in 2008), bonds often rise, cushioning losses. The key insight: you can't eliminate risk, but you can manage it intelligently. Diversification is the only 'free lunch' in investing—it reduces portfolio volatility without sacrificing expected returns. We'll explore diversification strategies in depth in Lesson 5.",
        quiz: {
          question: "When stocks fall significantly, what typically happens to bonds?",
          options: [
            "They also fall proportionally",
            "They often rise, cushioning losses",
            "Nothing happens",
            "They become worthless"
          ],
          correctAnswer: 1,
          explanation: "Bonds often move inversely to stocks—when stocks fall, bonds frequently rise, which is why diversification across both helps manage portfolio risk."
        }
      },
    ],

    3: [ // Compound Interest
      {
        title: "The Mathematics of Compounding",
        content: "Compound interest is interest earning interest. Simple formula: Future Value = Present Value × (1 + rate)^years. But the magic lies in time and consistency. Warren Buffett started investing at age 11—giving him 80+ years of compounding. He often jokes his biggest investing mistake was 'starting too late.' The difference between 7% and 10% annual returns over 40 years on $10,000: at 7% = $149,744; at 10% = $452,592. Just 3% more annually triples your wealth through compounding.",
        quiz: {
          question: "At what age did Warren Buffett start investing?",
          options: [
            "Age 7",
            "Age 11",
            "Age 18",
            "Age 25"
          ],
          correctAnswer: 1,
          explanation: "Warren Buffett started investing at age 11, giving him 80+ years of compounding, which he credits as a key factor in his wealth accumulation."
        }
      },
      {
        title: "The Rule of 72",
        content: "A mental math shortcut: divide 72 by your annual return percentage to estimate how long until your money doubles. At 8% returns: 72 ÷ 8 = 9 years to double. At 12%: 6 years. At 6%: 12 years. This illustrates why even small return differences matter enormously over time. Peter Lynch used this rule to quickly evaluate investment timeframes. It also shows why minimizing fees is crucial—a 1% fee extends your doubling time significantly, costing tens of thousands over decades.",
        quiz: {
          question: "Using the Rule of 72, how long will it take to double your money at 9% annual returns?",
          options: [
            "6 years",
            "8 years",
            "10 years",
            "12 years"
          ],
          correctAnswer: 1,
          explanation: "72 ÷ 9 = 8 years. The Rule of 72 provides a quick mental calculation for doubling time."
        }
      },
      {
        title: "Starting Early: The Greatest Advantage",
        content: "Consider two investors: Early Eddie invests $5,000 annually from age 25-35 (10 years, $50,000 total) then stops. Late Larry invests $5,000 annually from age 35-65 (30 years, $150,000 total). At 8% returns, Eddie ends with $787,174 while Larry has $566,416. Eddie invested 1/3 the amount but has 40% more wealth—purely from starting 10 years earlier. The Federal Reserve emphasizes this in retirement planning: time is your greatest asset, far more valuable than perfect stock selection.",
        quiz: {
          question: "In the Early Eddie vs Late Larry example, who ends up with more wealth despite investing less total money?",
          options: [
            "Late Larry, because he invested more total",
            "Early Eddie, because he started 10 years earlier",
            "They end up with the same amount",
            "Neither, they both lose money"
          ],
          correctAnswer: 1,
          explanation: "Early Eddie ends with more wealth ($787,174 vs $566,416) despite investing 1/3 the total amount, demonstrating the power of starting early."
        }
      },
      {
        title: "Reinvesting Dividends: Compound Your Compounding",
        content: "Dividends—cash payments from company profits—can be reinvested to purchase more shares, creating compounding on top of compounding. Historical data from Investopedia shows that reinvested dividends account for nearly 40% of total stock market returns over the long term. A $10,000 investment in the S&P 500 from 1980-2020 with dividends reinvested grew to approximately $760,000, versus just $320,000 without reinvestment. Always enable automatic dividend reinvestment in your brokerage account.",
        quiz: {
          question: "What percentage of long-term stock market returns historically comes from reinvested dividends?",
          options: [
            "About 10%",
            "About 25%",
            "About 40%",
            "About 60%"
          ],
          correctAnswer: 2,
          explanation: "Studies show reinvested dividends contribute approximately 40% of total returns over extended periods, demonstrating the power of compounding on compounding."
        }
      },
    ],

    4: [ // Stocks vs. Bonds
      {
        title: "Understanding Stocks (Equities)",
        content: "Stocks represent ownership shares in a company. When you buy Apple stock, you own a fraction of Apple Inc. As part-owner, you benefit from company growth and profit distribution (dividends). According to Jack Bogle's research, stocks have historically returned 9-10% annually over long periods, outpacing inflation and building real wealth. However, stocks are volatile—prices fluctuate daily based on earnings, sentiment, and economic conditions. Stocks are optimal for long-term goals (10+ years) due to their higher growth potential.",
        quiz: {
          question: "What do stocks represent when you purchase them?",
          options: [
            "A loan to the company",
            "Ownership shares in the company",
            "A temporary rental agreement",
            "Government bonds"
          ],
          correctAnswer: 1,
          explanation: "Stocks represent ownership shares—when you buy stock, you become a partial owner of that company and benefit from its growth and profits."
        }
      },
      {
        title: "Understanding Bonds (Fixed Income)",
        content: "Bonds are loans you make to governments or corporations. When you buy a bond, you're lending money in exchange for regular interest payments plus repayment of principal at maturity. Government bonds (Treasuries) are extremely safe with 2-5% returns. Corporate bonds offer 4-7% but carry default risk. Bonds provide stability and predictable income, making them ideal for capital preservation and near-term needs. As Investopedia notes, bonds typically move inversely to stocks—when stock markets crash, bond values often rise, providing portfolio balance.",
        quiz: {
          question: "What is the primary difference between stocks and bonds?",
          options: [
            "Stocks are loans; bonds are ownership",
            "Stocks represent ownership; bonds are loans to companies",
            "Both are the same investment",
            "Bonds are always riskier than stocks"
          ],
          correctAnswer: 1,
          explanation: "Stocks give you ownership equity in a company, while bonds represent debt—you're lending money to the issuer."
        }
      },
      {
        title: "Asset Allocation Strategies",
        content: "Asset allocation—your mix of stocks vs. bonds—is the single most important investment decision, accounting for 90% of portfolio performance variability. A common rule of thumb: subtract your age from 110 to get your stock percentage. At 30 years old: 80% stocks, 20% bonds. At 60: 50% stocks, 50% bonds. This shifts from growth to preservation as you age. Ray Dalio's 'All Weather' portfolio uses 30% stocks, 40% long-term bonds, 15% intermediate bonds, 7.5% gold, and 7.5% commodities for balance across economic conditions.",
        quiz: {
          question: "According to the age-based rule of thumb, what percentage should a 30-year-old have in stocks?",
          options: [
            "30% stocks",
            "50% stocks",
            "80% stocks",
            "100% stocks"
          ],
          correctAnswer: 2,
          explanation: "Using the 110 minus age rule: 110 - 30 = 80% stocks, which balances growth potential with appropriate risk for a younger investor."
        }
      },
      {
        title: "Rebalancing Your Portfolio",
        content: "Over time, strong stock performance can skew your allocation. If your 70/30 stock/bond split becomes 85/15 after a bull market, you're taking more risk than intended. Rebalancing means selling some winners (stocks) to buy losers (bonds), returning to target allocation. This discipline forces you to 'sell high and buy low' systematically. Experts recommend annual rebalancing or when allocations drift 5+ percentage points from targets. While counterintuitive, rebalancing both reduces risk and often improves returns.",
        quiz: {
          question: "How often do experts recommend rebalancing your portfolio?",
          options: [
            "Daily",
            "Weekly",
            "Annually or when allocations drift 5+ percentage points",
            "Never"
          ],
          correctAnswer: 2,
          explanation: "Experts recommend rebalancing annually or when your allocations drift 5+ percentage points from targets to maintain your intended risk level."
        }
      },
    ],

    5: [ // Diversification
      {
        title: "The Diversification Principle",
        content: "Based on Modern Portfolio Theory by Harry Markowitz, diversification reduces unsystematic risk (company-specific risk) without eliminating systematic risk (market risk). Peter Lynch explained: 'Not putting all eggs in one basket means if one egg breaks, you still have breakfast.' Historical data shows a portfolio of 20-30 stocks from different sectors captures most diversification benefits. Beyond 30 stocks, additional diversification yields diminishing returns. The goal: maximize return per unit of risk taken.",
        quiz: {
          question: "What type of risk does diversification primarily reduce?",
          options: [
            "All investment risk",
            "Company-specific (unsystematic) risk",
            "Market (systematic) risk only",
            "Currency risk"
          ],
          correctAnswer: 1,
          explanation: "Diversification primarily reduces unsystematic risk (company-specific risk) but cannot eliminate systematic risk (overall market risk)."
        }
      },
      {
        title: "Diversifying Across Asset Classes",
        content: "True diversification extends beyond just owning multiple stocks. Asset classes include: Domestic stocks (US large-cap, mid-cap, small-cap). International stocks (developed and emerging markets). Bonds (government, corporate, municipal). Real estate (REITs). Commodities (gold, oil). Each class reacts differently to economic conditions. When US stocks falter, international equities or bonds may thrive. A well-diversified portfolio reduces volatility—the emotional rollercoaster that causes panic selling at the worst times.",
        quiz: {
          question: "How many stocks typically capture most diversification benefits?",
          options: [
            "5-10 stocks",
            "20-30 stocks",
            "100+ stocks",
            "Just 1 index fund"
          ],
          correctAnswer: 1,
          explanation: "Research shows 20-30 stocks from different sectors eliminate most company-specific risk, though a single broad index fund can achieve similar diversification."
        }
      },
      {
        title: "Sector and Geographic Diversification",
        content: "Don't concentrate in one industry. In the 2000 dot-com crash, tech-heavy portfolios lost 80%+. In 2008, financial sector stocks collapsed. Spreading across technology, healthcare, consumer goods, energy, and financial sectors protects against sector-specific downturns. Geographic diversification is equally critical—US stocks represent only 55% of global market cap. International exposure provides growth opportunities and reduces reliance on any single economy. Warren Buffett owns international stocks through Berkshire Hathaway despite his 'America-first' reputation.",
        quiz: {
          question: "What percentage of global market capitalization do US stocks represent?",
          options: [
            "About 25%",
            "About 55%",
            "About 75%",
            "About 95%"
          ],
          correctAnswer: 1,
          explanation: "US stocks represent approximately 55% of global market capitalization, highlighting the importance of international diversification for complete exposure."
        }
      },
      {
        title: "The Dangers of Over-Diversification",
        content: "Warren Buffett warns: 'Diversification is protection against ignorance. It makes little sense if you know what you're doing.' While beginners should diversify broadly, owning 100+ stocks dilutes returns and makes monitoring impossible. Peter Lynch built wealth by concentrating in his 10-15 best ideas. The sweet spot: 20-30 quality companies across sectors for most investors. Use low-cost index funds for broad exposure. Reserve individual stocks for opportunities you deeply understand. Quality over quantity.",
        quiz: {
          question: "According to Warren Buffett, what is diversification protection against?",
          options: [
            "Market crashes",
            "Ignorance",
            "Inflation",
            "Taxes"
          ],
          correctAnswer: 1,
          explanation: "Buffett said 'Diversification is protection against ignorance'—suggesting concentrated bets make sense when you deeply understand your investments."
        }
      },
    ],

    6: [ // Market Psychology
      {
        title: "Fear and Greed: The Market's Emotions",
        content: "Warren Buffett's most famous quote: 'Be fearful when others are greedy, and greedy when others are fearful.' Markets are driven by human emotions, not rational analysis. During greed-fueled bubbles (2000 tech bubble, 2021 meme stocks), valuations become absurd and crashes follow. Fear-driven selloffs (2008 financial crisis, 2020 COVID crash) create generational buying opportunities. The chart's daily swings reflect this emotional pendulum. Successful investors recognize and exploit these psychological extremes, buying quality assets when panic creates fire-sale prices.",
        quiz: {
          question: "According to Warren Buffett, what should you do when others are fearful?",
          options: [
            "Be fearful as well",
            "Be greedy and look for opportunities",
            "Exit the market completely",
            "Stop investing"
          ],
          correctAnswer: 1,
          explanation: "Buffett advises to 'be greedy when others are fearful'—meaning look for buying opportunities when panic creates undervalued assets."
        }
      },
      {
        title: "The 2008 Financial Crisis Case Study",
        content: "The 2008 crisis exemplifies market psychology. As Lehman Brothers collapsed, panic swept markets. The S&P 500 fell 57% from peak to trough. Fear was universal—many predicted capitalism's end. Yet this was precisely when Buffett invested $15 billion in blue-chip stocks and wrote his famous 'Buy American. I Am.' op-ed. Those who sold at the bottom locked in losses; those who bought at the bottom secured life-changing returns. By 2013, markets fully recovered. By 2020, they'd doubled those highs. Fear creates opportunity for the prepared and patient.",
        quiz: {
          question: "What did Warren Buffett do during the 2008 financial crisis?",
          options: [
            "Sold all his stocks",
            "Invested billions in quality companies",
            "Stopped investing completely",
            "Moved entirely to cash"
          ],
          correctAnswer: 1,
          explanation: "Buffett invested $15+ billion during the crisis, buying quality companies at panic-induced discounts, demonstrating contrarian investing at its finest."
        }
      },
      {
        title: "Bubble Psychology and Warning Signs",
        content: "Every bubble follows the same pattern: Innovation/story (internet, crypto, AI). Initial success. Media hype. FOMO (Fear Of Missing Out). Parabolic price rises. 'This time is different' narrative. Bubble burst. Warning signs according to Benjamin Graham: Prices disconnected from fundamentals. Everyone from taxi drivers to bartenders giving stock tips. Extreme valuations (P/E ratios 50+). Margin debt at record highs. When you see these signs, exercise caution. As Howard Marks wrote, 'We can't predict, but we can prepare.'",
        quiz: {
          question: "What does FOMO stand for in market psychology?",
          options: [
            "Fear Of Market Operations",
            "Fear Of Missing Out",
            "Fear Of Money Options",
            "Fear Of Making Orders"
          ],
          correctAnswer: 1,
          explanation: "FOMO (Fear Of Missing Out) is a powerful psychological driver during bubbles, causing investors to buy at inflated prices out of fear of missing gains."
        }
      },
      {
        title: "Contrarian Investing Strategy",
        content: "Contrarian investing means going against the herd. When pessimism peaks and quality stocks trade at bargain prices, contrarians accumulate. When optimism peaks and valuations become absurd, contrarians trim positions or stay in cash. This requires emotional discipline—buying when headlines scream disaster feels terrifying. Ray Dalio's principle: 'Pain + Reflection = Progress.' Study past crises: 1987, 2000, 2008, 2020. Each seemed apocalyptic. Each created fortunes for contrarians. Build cash reserves during bull markets to deploy when bear markets arrive.",
        quiz: {
          question: "What is a key warning sign of a market bubble?",
          options: [
            "Low valuations",
            "Everyone giving stock tips and 'this time is different' narratives",
            "High interest rates",
            "Strong fundamentals"
          ],
          correctAnswer: 1,
          explanation: "Bubbles feature widespread speculation, extreme valuations, and the dangerous belief that 'this time is different,' signaling unsustainable prices."
        }
      },
    ],

    7: [ // Value Investing
      {
        title: "Benjamin Graham's Core Principle",
        content: "Value investing originated with Benjamin Graham's 1949 masterpiece 'The Intelligent Investor.' The core concept: every asset has an intrinsic value based on fundamentals (earnings, assets, growth). Market price fluctuates wildly around this intrinsic value, driven by emotion. Value investors calculate intrinsic value through fundamental analysis, then buy when market price falls significantly below it. Graham's metaphor: 'Mr. Market' is a manic-depressive business partner who offers to buy or sell every day. Ignore his mood swings; focus on underlying value.",
        quiz: {
          question: "What does Benjamin Graham's 'Mr. Market' metaphor represent?",
          options: [
            "A wise investment advisor",
            "A manic-depressive partner offering daily prices",
            "The government regulator",
            "Your broker"
          ],
          correctAnswer: 1,
          explanation: "Mr. Market is Graham's metaphor for the market as a manic-depressive partner making irrational daily offers, teaching us to focus on value, not mood swings."
        }
      },
      {
        title: "Price vs. Intrinsic Value",
        content: "Warren Buffett, Graham's most famous student, explains: 'Price is what you pay; value is what you get.' A $50 stock isn't cheap if the business is worth $40. A $50 stock is a bargain if the business is worth $100. Intrinsic value derives from: Future cash flows. Quality of earnings. Competitive position. Management capability. Growth prospects. Asset value. The chart shows price—volatile and emotion-driven. Value investing requires looking through price to calculate true business worth.",
        quiz: {
          question: "According to value investing, what determines if a stock is cheap or expensive?",
          options: [
            "The stock price alone",
            "How much it's fallen from its high",
            "The relationship between price and intrinsic value",
            "Trading volume"
          ],
          correctAnswer: 2,
          explanation: "Value investing compares market price to calculated intrinsic value—a stock is cheap only if price is significantly below true business worth."
        }
      },
      {
        title: "Margin of Safety",
        content: "Graham's margin of safety principle: never pay full calculated value for any investment. If you determine a stock is worth $100, only buy at $60-70. This safety margin: Protects against analytical errors (your calculation might be wrong). Cushions against unexpected events. Improves returns (buying at 30% discount instantly gives 43% upside to fair value). Reduces emotional stress during volatility. Buffett considers margin of safety the three most important words in investing. It's your insurance policy against uncertainty.",
        quiz: {
          question: "If you calculate a stock is worth $100, at what price should you buy it according to margin of safety?",
          options: [
            "$100 exactly",
            "$110 to account for growth",
            "$60-70 for a safety margin",
            "$50 or less only"
          ],
          correctAnswer: 2,
          explanation: "Margin of safety means buying at $60-70 when intrinsic value is $100, providing cushion against errors and enhancing returns."
        }
      },
      {
        title: "Finding Undervalued Companies",
        content: "Value opportunities emerge when: Temporary problems create fear (Johnson & Johnson during 1982 Tylenol crisis). Entire sectors fall out of favor (financials after 2008). Good companies in boring industries get ignored (waste management, insurance). Accounting scandals taint the whole industry. Market crashes indiscriminately punish all stocks. Peter Lynch: 'The best opportunities come when excellent companies are surrounded by clouds of gloom.' Stock screeners can find candidates with low P/E, low P/B, high dividend yield—then fundamental analysis determines true value.",
        quiz: {
          question: "What is Benjamin Graham's 'margin of safety'?",
          options: [
            "Always buying the biggest companies",
            "Only investing in bonds",
            "Buying assets at a significant discount to intrinsic value",
            "Selling when stocks rise 10%"
          ],
          correctAnswer: 2,
          explanation: "Margin of safety means purchasing assets at prices well below calculated intrinsic value, providing cushion against errors and enhancing returns."
        }
      },
    ],

    8: [ // Fundamental Analysis
      {
        title: "The Three Financial Statements",
        content: "Three statements reveal a company's financial health: 1) Balance Sheet: Assets (what it owns), Liabilities (what it owes), Equity (net worth). Look for: low debt, high cash, growing equity. 2) Income Statement: Revenue (sales), Expenses (costs), Net Income (profit). Look for: growing revenues, expanding margins, consistent profits. 3) Cash Flow Statement: Cash from operations, investing, financing. Look for: positive free cash flow, operating cash exceeds net income. Master these and you'll see through accounting gimmicks to business reality.",
        quiz: {
          question: "Which financial statement shows Assets, Liabilities, and Equity?",
          options: [
            "Income Statement",
            "Cash Flow Statement",
            "Balance Sheet",
            "Tax Return"
          ],
          correctAnswer: 2,
          explanation: "The Balance Sheet shows what a company owns (Assets), owes (Liabilities), and its net worth (Equity) at a specific point in time."
        }
      },
      {
        title: "Return on Equity (ROE)",
        content: "ROE measures how efficiently management converts shareholder capital into profits. Formula: Net Income ÷ Shareholder Equity × 100. Warren Buffett targets companies with 15%+ ROE sustained over 10+ years. Why it matters: A 15% ROE means every dollar of shareholder equity generates 15 cents of annual profit. Companies sustaining high ROE possess competitive advantages—pricing power, brand strength, operational efficiency. Compare ROE within industries: technology 20%+, banking 10-15%, utilities 8-12%. Consistent high ROE beats flashy growth every time.",
        quiz: {
          question: "According to Warren Buffett, what is an ideal Return on Equity (ROE) for a quality investment?",
          options: [
            "5% or higher",
            "10% or higher",
            "15% or higher",
            "25% or higher"
          ],
          correctAnswer: 2,
          explanation: "Buffett seeks companies with 15%+ ROE sustained over many years, indicating efficient capital deployment and competitive advantages."
        }
      },
      {
        title: "Debt-to-Equity Ratio",
        content: "This ratio reveals financial leverage and bankruptcy risk. Formula: Total Debt ÷ Shareholder Equity. A ratio of 0.5 means the company has 50 cents of debt for every dollar of equity. Lower is generally better—less debt means less financial risk. However, context matters: Utilities and real estate naturally carry more debt. Technology and services should have minimal debt. In 2008, overleveraged companies (debt/equity >2.0) collapsed while conservatively financed firms survived. Peter Lynch: 'Debt is Wall Street's way of turning a sure thing into a long shot.'",
        quiz: {
          question: "What does a Debt-to-Equity ratio of 0.5 indicate?",
          options: [
            "The company has 50% more debt than equity",
            "The company has 50 cents of debt for every dollar of equity",
            "The company has no debt",
            "The company is bankrupt"
          ],
          correctAnswer: 1,
          explanation: "A debt-to-equity ratio of 0.5 means the company has 50 cents of debt for every dollar of equity, indicating moderate leverage."
        }
      },
      {
        title: "Free Cash Flow (FCF)",
        content: "FCF is the ultimate truth—actual cash generated after necessary capital expenditures. Formula: Operating Cash Flow - Capital Expenditures. Companies can manipulate earnings through accounting, but cash is cash. Peter Lynch: 'Earnings are an opinion; cash is a fact.' Strong FCF means: Company can fund growth internally. Dividends and buybacks are sustainable. Flexibility during downturns. Potential for value-creating acquisitions. Look for growing FCF and FCF yield (FCF ÷ Market Cap) above 5%. This metric separates winners from accounting mirages.",
        quiz: {
          question: "Why is Free Cash Flow considered more reliable than reported earnings?",
          options: [
            "It's easier to calculate",
            "It's actual cash generated, harder to manipulate than accounting earnings",
            "It's always higher than earnings",
            "It's not actually more reliable"
          ],
          correctAnswer: 1,
          explanation: "FCF represents real cash after necessary spending, making it harder to manipulate through accounting tricks than earnings figures."
        }
      },
      {
        title: "Management Quality Assessment",
        content: "Numbers matter, but so do the people running the company. Warren Buffett: 'Look for three qualities: integrity, intelligence, and energy. Without the first, the other two will kill you.' Assess management by: Track record of capital allocation. Honest communication (admitting mistakes). Owner-operator mindset (significant stock ownership). Long-term strategic thinking vs. quarterly earnings obsession. Read annual letters to shareholders—great managers explain clearly and take responsibility. Be wary of excessive executive compensation, frequent acquisitions, and overly promotional language.",
        quiz: {
          question: "According to Buffett, which quality is most important in management?",
          options: [
            "Intelligence",
            "Energy",
            "Integrity",
            "Charisma"
          ],
          correctAnswer: 2,
          explanation: "Buffett emphasizes integrity as the most crucial quality—without it, intelligence and energy can actually harm the company and shareholders."
        }
      },
    ],

    9: [ // Economic Moats
      {
        title: "What is an Economic Moat?",
        content: "Warren Buffett popularized the 'moat' concept—competitive advantages that protect companies from rivals, like a castle's moat protects from invaders. Companies with wide moats sustain high returns on capital for decades, compounding shareholder wealth. Moats allow pricing power, customer retention, and resilience during downturns. Michael Porter's competitive strategy framework identifies how companies build and maintain these advantages. Buffett: 'We're trying to find a business with a wide and long-lasting moat protecting a terrific economic castle.'",
        quiz: {
          question: "What does an economic moat represent?",
          options: [
            "A company's physical location",
            "Competitive advantages protecting from rivals",
            "The company's debt level",
            "Marketing budget"
          ],
          correctAnswer: 1,
          explanation: "An economic moat represents durable competitive advantages that protect a company from competitors, like a castle's moat protects from invaders."
        }
      },
      {
        title: "Brand Power Moat",
        content: "Strong brands command premium pricing and customer loyalty. Examples: Coca-Cola: Customers pay extra for the brand despite generic alternatives costing less. Apple: Brand loyalty drives repeat purchases and 40%+ profit margins. Nike: Athletic wear premium justified by brand prestige. Brand moats require decades of consistent quality and marketing investment. They're extremely durable—Coca-Cola has maintained its moat for 130+ years. Even during recessions, strong brands retain pricing power when competitors must discount heavily to survive.",
        quiz: {
          question: "What is the primary advantage of a brand power moat?",
          options: [
            "Lower production costs",
            "Ability to charge premium prices and maintain customer loyalty",
            "More retail locations",
            "Better technology"
          ],
          correctAnswer: 1,
          explanation: "Brand power allows companies to charge premium prices because customers perceive unique value, driving higher margins and customer retention."
        }
      },
      {
        title: "Network Effects Moat",
        content: "Network effects occur when a product becomes more valuable as more people use it. Examples: Visa/Mastercard: More cardholders attract more merchants; more merchants attract more cardholders. Facebook: Value increases with more friends/connections. Amazon Marketplace: More sellers attract buyers; more buyers attract sellers. This creates winner-take-most markets—the largest network has geometric advantages. Once established, network effect moats are nearly impregnable. Competitors face a 'chicken-and-egg' problem: they need users to attract users.",
        quiz: {
          question: "What makes network effects a powerful moat?",
          options: [
            "Lower production costs",
            "Products become more valuable as more people use them",
            "Patent protection",
            "Brand recognition"
          ],
          correctAnswer: 1,
          explanation: "Network effects create value that grows with each user, creating winner-take-most markets where the largest network has geometric advantages."
        }
      },
      {
        title: "Cost Advantage Moat",
        content: "Some companies achieve structural cost advantages competitors cannot match. Examples: Walmart: Scale enables bulk purchasing, efficient logistics, lower costs. Costco: Volume-driven pricing with added membership fee revenue. Geico: Direct insurance model eliminates agent costs. Cost advantages allow aggressive pricing that still generates profits, while competitors lose money matching prices. This expands market share and entrenches the advantage further. Buffett bought GEICO recognizing this moat could compound for decades.",
      },
      {
        title: "Switching Costs Moat",
        content: "High switching costs trap customers even if better alternatives exist. Examples: Microsoft Office: Retraining employees and converting files is expensive. Oracle databases: Migrating enterprise data is risky and costly. Autodesk (CAD software): Engineers' workflows built around specific tools. Companies with switching cost moats enjoy recurring revenue, predictable cash flows, and pricing power. Customer acquisition is expensive but retention is cheap. Look for enterprise software, specialty equipment, and integrated systems where switching is prohibitively expensive or risky.",
        quiz: {
          question: "Which company demonstrates a switching cost moat?",
          options: [
            "A restaurant chain",
            "Microsoft Office suite",
            "A retail clothing store",
            "A commodity producer"
          ],
          correctAnswer: 1,
          explanation: "Microsoft Office has high switching costs—businesses resist change due to retraining needs, file compatibility, and workflow disruption."
        }
      },
      {
        title: "Intangible Assets Moat",
        content: "Patents, licenses, and regulations create exclusive advantages. Examples: Pharmaceutical patents: 20-year monopolies on drugs. Media licenses: FCC broadcast licenses worth billions. Regulatory approvals: FDA approval creates barriers. While patents eventually expire, the lead time to develop competing products maintains advantages. Companies with regulatory moats (utilities, defense contractors) enjoy stable cash flows and limited competition. Charlie Munger: 'A great business is one that will still be great in 25 years.' Moats determine which businesses achieve this.",
        quiz: {
          question: "How long do pharmaceutical patents typically provide monopoly protection?",
          options: [
            "5 years",
            "10 years",
            "20 years",
            "Forever"
          ],
          correctAnswer: 2,
          explanation: "Pharmaceutical patents typically provide 20-year monopolies on drugs, creating powerful intangible asset moats during that period."
        }
      },
    ],

    10: [ // Portfolio Management
      {
        title: "Strategic Asset Allocation",
        content: "Strategic allocation is your long-term target mix—the foundation of portfolio management. Based on research, asset allocation determines 90%+ of return variability. Ray Dalio's All Weather Portfolio (30% stocks, 40% long-term bonds, 15% intermediate bonds, 7.5% gold, 7.5% commodities) aims for consistent returns across economic environments. Alternatively, a 70/30 stock/bond mix suits moderate risk tolerance. Your strategic allocation should align with: Time horizon. Risk tolerance. Financial goals. Income needs. Set it based on fundamentals, not market timing.",
      },
      {
        title: "Tactical Asset Allocation",
        content: "Tactical allocation involves temporary deviations from strategic targets to exploit opportunities. If your 70% stock target has reached 85% after a bull run, tactical rebalancing sells stocks to buy bonds, locking in gains and reducing risk. Alternatively, if high-quality stocks crash 40%, tactically overweighting stocks captures value. This requires discipline—it feels wrong to sell winners and buy losers. But systematic tactical adjustments improve risk-adjusted returns. Set rules: rebalance when positions drift 5+ percentage points, or review quarterly regardless of performance.",
        quiz: {
          question: "What percentage of portfolio return variability is determined by asset allocation?",
          options: [
            "About 30%",
            "About 50%",
            "About 70%",
            "Over 90%"
          ],
          correctAnswer: 3,
          explanation: "Studies show asset allocation (stocks vs bonds vs cash mix) determines over 90% of portfolio return variability, making it the most crucial decision."
        }
      },
      {
        title: "Rebalancing Strategies",
        content: "Rebalancing maintains target allocations and forces disciplined buying low/selling high. Three approaches: Calendar rebalancing: Annual, quarterly, or semi-annual review and adjustment. Threshold rebalancing: Act when allocations drift 5+ percentage points. Opportunistic rebalancing: During extreme moves (20%+ market swings). Tax considerations: Rebalance tax-advantaged accounts first; realize gains/losses strategically in taxable accounts. Rebalancing seems counterintuitive but data proves it reduces risk while often improving returns. It's disciplined contrarianism built into your process.",
      },
      {
        title: "Tax-Efficient Investing",
        content: "Taxes can erode returns significantly. Strategies to minimize tax drag: Hold investments 1+ year for long-term capital gains rates (0-20% vs. ordinary income rates up to 37%). Maximize tax-advantaged accounts (401k, IRA, HSA). Place tax-inefficient assets (bonds, REITs) in tax-deferred accounts; tax-efficient assets (stocks, index funds) in taxable accounts. Tax-loss harvesting: Sell losers to offset gains. Consider municipal bonds if in high tax brackets. A 1% annual tax savings compounds to 25-30% more wealth over 30 years.",
        quiz: {
          question: "How long must you hold an investment for long-term capital gains treatment?",
          options: [
            "6 months",
            "1 year",
            "2 years",
            "5 years"
          ],
          correctAnswer: 1,
          explanation: "Holding investments for more than one year qualifies for long-term capital gains rates (0-20%), significantly lower than ordinary income rates."
        }
      },
      {
        title: "Dollar-Cost Averaging",
        content: "Dollar-cost averaging (DCA) means investing fixed amounts regularly regardless of price. Example: Investing $500 monthly buys more shares when prices are low, fewer when high, averaging your cost over time. Benefits: Removes emotion and timing risk. Builds discipline and consistency. Reduces regret from poorly-timed lump sums. Investopedia research shows DCA performs nearly as well as lump-sum investing but with lower volatility and psychological comfort. Perfect for 401k contributions and building positions gradually. Buffett: 'If you aren't willing to own a stock for 10 years, don't even think about owning it for 10 minutes.'",
      },
    ],

    11: [ // Long-Term Wealth Building
      {
        title: "Warren Buffett's Forever Holding Period",
        content: "Buffett's favorite holding period: 'Forever.' When you buy exceptional businesses at fair prices, there's no reason to sell. Berkshire Hathaway has held Coca-Cola since 1988, See's Candies since 1972, American Express through multiple crises. These forever holds compound value for decades. Short-term trading incurs: Transaction costs. Taxes (short-term rates are punitive). Timing risk (missing best days). Emotional stress. Long-term holding captures: Full benefit of compounding. Minimal taxes (unrealized gains). Lower costs. Emotional calm. Focus on finding companies you'd happily own for 30+ years.",
      },
      {
        title: "Ignoring Short-Term Noise",
        content: "Daily price movements are noise, not signal. In 30 years of investing, there will be: 7,500+ trading days. Dozens of 'market crashes.' Countless breaking news headlines. Political crises, wars, recessions. Yet if you own quality companies, none of it matters. Amazon fell 95% during the 2000-2002 bear market. Anyone who sold lost everything; anyone who held or bought more became wealthy. The chart's daily swings mean nothing to a 30-year investor. Peter Lynch: 'Far more money has been lost by investors preparing for corrections than lost in corrections themselves.' Stay the course.",
        quiz: {
          question: "According to Peter Lynch, where do investors lose more money?",
          options: [
            "During actual market corrections",
            "Preparing for corrections and missing gains",
            "From high fees",
            "From inflation"
          ],
          correctAnswer: 1,
          explanation: "Lynch observed that investors lose more by selling prematurely to avoid corrections they try to predict, missing subsequent gains."
        }
      },
      {
        title: "Avoiding Common Investor Mistakes",
        content: "The biggest wealth destroyers: 1) Panic selling during downturns: Turns temporary losses into permanent losses. 2) Chasing performance: Buying last year's winners often means buying peaks. 3) Overtrading: Each trade costs money and triggers taxes. 4) Following tips: Do your own research or use index funds. 5) Ignoring fees: A 1% annual fee costs 30%+ of wealth over 30 years. 6) Emotional decisions: Fear and greed override logic. 7) Leverage/margin: Amplifies losses and forces selling at bottoms. Stick to your plan, avoid these traps, and long-term success follows.",
      },
      {
        title: "Tax Advantages of Long-Term Holdings",
        content: "The tax code rewards patience. Holding stocks 1+ year qualifies for long-term capital gains rates (0%, 15%, or 20% depending on income) versus ordinary income rates up to 37%. Better yet: unrealized gains aren't taxed at all. Buffett's Berkshire stock purchased in 1965 has appreciated 5,000,000%—all gains untaxed for 60 years. Upon death, cost basis steps up to market value, erasing capital gains tax entirely. This 'buy and hold forever' strategy not only captures full compounding but also minimizes lifetime taxes dramatically. Every trade triggers taxes; every hold defers them.",
        quiz: {
          question: "What happens to capital gains taxes when you hold stocks until death?",
          options: [
            "Taxes double",
            "Heirs pay full capital gains",
            "Cost basis steps up, eliminating capital gains tax",
            "Taxes are the same as if sold"
          ],
          correctAnswer: 2,
          explanation: "Under current US tax law, inherited stocks receive a stepped-up cost basis to market value at death, eliminating accumulated capital gains taxes."
        }
      },
      {
        title: "Building Generational Wealth",
        content: "True wealth building extends beyond your lifetime. Strategies: 1) Start retirement accounts for children (Roth IRAs for minors with earned income). 2) Fund 529 education accounts with growth potential. 3) Teach investing principles early—financial literacy is the greatest inheritance. 4) Use trusts for estate planning and multigenerational wealth transfer. 5) Focus on quality companies that will thrive for 50+ years. The Walton family (Walmart), Buffett family, and other generational fortunes share common threads: long-term thinking, quality businesses, patience, and passing down both wealth and wisdom to steward it properly.",
      },
    ],

    12: [ // Investment Checklist
      {
        title: "Building Your Personal Framework",
        content: "Charlie Munger: 'Investing is not a zero-sum game. It's about finding good quality businesses at reasonable prices and holding them.' Your investment checklist codifies wisdom into repeatable process. Before buying any stock, systematically evaluate it. This prevents emotional decisions and cognitive biases. Warren Buffett reviews his mental checklist before every investment. Your checklist evolves with experience but starts with proven principles: business quality, valuation, management, competitive position, and personal understanding.",
      },
      {
        title: "Business Understanding Test",
        content: "Peter Lynch: 'Never invest in a business you cannot explain to a 10-year-old in two minutes.' Questions to ask: What does the company do? How does it make money? Who are its customers? Why do customers choose it over competitors? Can I explain its revenue model simply? If you can't pass this test, move on. Complexity introduces risk. Buffett avoided technology stocks for decades because he couldn't understand their moats and economics. Stick to your circle of competence—industries and business models you genuinely understand.",
        quiz: {
          question: "According to Peter Lynch, how do you know you understand a business well enough to invest?",
          options: [
            "You've read the 10-K filing",
            "You can explain it to a 10-year-old in two minutes",
            "You've visited the company headquarters",
            "You own the company's products"
          ],
          correctAnswer: 1,
          explanation: "Lynch's test: if you can't explain the business simply and clearly to a child, you don't understand it well enough to invest."
        }
      },
      {
        title: "Moat Identification",
        content: "Every investment should possess at least one strong competitive advantage. Checklist questions: Does the company have brand power? (Can it charge premium prices?) Are there network effects? (Does it get more valuable with more users?) Does it have cost advantages? (Can it be the low-cost producer?) Are switching costs high? (Are customers locked in?) Does it have intangible assets? (Patents, licenses, regulations?) Without a moat, competitors will erode profits over time. Moats allow companies to sustain high returns on capital for decades—the key to compounding wealth.",
      },
      {
        title: "Financial Health Assessment",
        content: "Strong businesses generate cash and manage capital wisely. Checklist items: Return on Equity: 15%+ sustained over 10 years? Debt-to-Equity: Low and manageable relative to industry? Free Cash Flow: Positive and growing? Profit Margins: Stable or expanding? Revenue Growth: Consistent and sustainable (5-10% annually)? Management compensation: Reasonable and aligned with shareholders? A company passing all checks demonstrates operational excellence, financial discipline, and shareholder-friendly management—the foundation of quality investments.",
        quiz: {
          question: "What's a key indicator of strong financial health in a company?",
          options: [
            "Highest stock price in its industry",
            "15%+ ROE sustained over many years",
            "Newest products",
            "Most employees"
          ],
          correctAnswer: 1,
          explanation: "Sustained 15%+ ROE indicates efficient capital deployment and durable competitive advantages—core elements of financial health."
        }
      },
      {
        title: "Valuation Analysis",
        content: "Even great companies are bad investments at excessive prices. Valuation checks: P/E Ratio: Reasonable relative to growth rate and history? PEG Ratio: Price/Earnings-to-Growth below 1.5? Dividend Yield: Competitive and sustainable? Price-to-Book: Reasonable for industry? Discounted Cash Flow: Does intrinsic value exceed price by 30%+ (margin of safety)? Compare valuations to: Historical averages. Industry peers. Market averages. Benjamin Graham: 'The three most important words in investing are margin of safety.' Never overpay, even for excellent businesses.",
      },
      {
        title: "The Final Decision Framework",
        content: "After completing your checklist, make a binary decision: If you can check most boxes with conviction, buy and hold. If multiple boxes are uncertain or negative, pass and wait for better opportunities. Discipline yourself: No investment is perfect—seek good businesses at great prices. Don't force investments—waiting for fat pitches increases success rates. Review your checklist annually for each holding—businesses change over time. Keep a journal documenting your reasoning—learn from successes and mistakes. Buffett: 'You only have to be right a few times in your investing career—as long as you never make a catastrophic error.' Your checklist prevents those errors.",
        quiz: {
          question: "What should you do if a company fails several items on your investment checklist?",
          options: [
            "Buy it anyway and hope for the best",
            "Pass and wait for better opportunities",
            "Average down if price falls further",
            "Ask friends for advice"
          ],
          correctAnswer: 1,
          explanation: "Disciplined investors pass on opportunities that don't meet their criteria, waiting patiently for investments that check all boxes."
        }
      },
    ],

    // Lesson 13: Technical Analysis Fundamentals
    13: [
      {
        title: "Introduction to Technical Analysis",
        content: "Technical analysis studies past price movements to predict future market behavior. Unlike fundamental analysis which examines company financials, technical analysis focuses purely on price patterns and trading volume. Key premise: Market prices reflect all available information, and price movements follow identifiable patterns. According to Investopedia, technical analysis is used by traders worldwide to identify entry and exit points.",
      },
      {
        title: "Reading Price Charts",
        content: "Three main chart types: Line charts show closing prices over time—simple but limited. Bar charts display open, high, low, and close (OHLC) for each period. Candlestick charts visually represent the same OHLC data with color-coded bodies. Green/white candles indicate price rose (close > open). Red/black candles indicate price fell (close < open). Candlesticks are most popular because patterns are easier to identify visually.",
      },
      {
        title: "Support and Resistance",
        content: "Support levels are price floors where buying pressure historically prevents further decline. Resistance levels are ceilings where selling pressure stops advances. These levels form due to psychological price points and historical trading activity. When support breaks, it often becomes resistance (and vice versa). Traders use these levels to identify potential entry and exit points.",
      },
      {
        title: "Trend Lines and Moving Averages",
        content: "Trends are directional price movements: uptrend (higher highs and lows), downtrend (lower highs and lows), or sideways. Moving averages smooth price data to identify trends. Common types: 50-day and 200-day moving averages. Golden cross (short MA crosses above long MA) signals bullish momentum. Death cross (short MA crosses below long MA) signals bearish momentum.",
      },
    ],

    // Lesson 14: Investment Psychology
    14: [
      {
        title: "The Psychology of Investing",
        content: "Behavioral finance studies how emotions and biases affect investment decisions. Daniel Kahneman's research shows humans are not rational actors—we're prone to systematic errors. Understanding your psychological biases is crucial for investment success. The market is driven by collective human behavior, making psychology as important as fundamentals.",
      },
      {
        title: "Common Cognitive Biases",
        content: "Confirmation bias: Seeking information that confirms existing beliefs. Loss aversion: Feeling losses twice as strongly as equivalent gains. Recency bias: Overweighting recent events in predictions. Anchoring: Fixating on initial price points regardless of current fundamentals. Herd mentality: Following the crowd without independent analysis. Overconfidence: Overestimating your ability to predict outcomes.",
      },
      {
        title: "Emotional Decision Making",
        content: "Fear causes panic selling at market bottoms. Greed drives buying at market tops. FOMO (Fear of Missing Out) leads to chasing hot stocks. Regret causes holding losers too long hoping to break even. The key is developing systematic rules that remove emotion from decisions. Warren Buffett: 'Be fearful when others are greedy, and greedy when others are fearful.'",
      },
      {
        title: "Building Mental Discipline",
        content: "Create an investment policy statement before emotions run high. Set predetermined buy and sell criteria. Use automatic investing to remove timing decisions. Keep an investment journal to learn from mistakes. Take breaks during high volatility to avoid reactive decisions. Remember: The biggest enemy of good investing is usually yourself.",
      },
    ],

    // Lesson 15: Options Trading Fundamentals
    15: [
      {
        title: "What Are Options?",
        content: "Options are contracts giving the right (not obligation) to buy or sell an asset at a specific price before a certain date. Call options: Right to BUY at the strike price. Put options: Right to SELL at the strike price. Options cost a premium and expire on specific dates. They can be used for speculation, income, or hedging existing positions.",
      },
      {
        title: "Call Options Explained",
        content: "A call option profits when the underlying stock rises above the strike price plus premium paid. Example: Stock at $100, you buy a $105 call for $3. Breakeven: $108 ($105 strike + $3 premium). If stock reaches $115, profit = ($115 - $105 - $3) × 100 = $700. Maximum loss is limited to premium paid ($300). Calls provide leveraged upside exposure with defined risk.",
      },
      {
        title: "Put Options Explained",
        content: "Put options profit when the underlying stock falls below the strike price minus premium. Example: Stock at $100, you buy a $95 put for $2. Breakeven: $93 ($95 strike - $2 premium). If stock drops to $85, profit = ($95 - $85 - $2) × 100 = $800. Puts provide downside protection or speculative profit from declines. Often called 'insurance' for your portfolio.",
      },
      {
        title: "Basic Options Strategies",
        content: "Covered call: Own stock, sell call options for income. Protective put: Own stock, buy puts as insurance. Bull call spread: Buy lower strike call, sell higher strike call. These strategies modify risk/reward profiles. Options are complex—start with paper trading before real money. Never risk more than you can afford to lose on options.",
      },
    ],

    // Lesson 16: ETFs and Index Funds  
    16: [
      {
        title: "Understanding Index Funds and ETFs",
        content: "Index funds and ETFs track market indices like the S&P 500, providing instant diversification. ETFs trade like stocks throughout the day. Index mutual funds trade once daily at market close. Jack Bogle pioneered index investing, proving most active managers underperform indices over time. Both offer low-cost, diversified exposure to broad markets or specific sectors.",
      },
      {
        title: "The Power of Low Costs",
        content: "Expense ratios compound significantly over time. Example: $100,000 invested for 30 years at 7% return. With 0.03% fees (index fund): $742,000 final value. With 1.00% fees (active fund): $574,000 final value. The 0.97% difference costs $168,000! Warren Buffett bet $1 million that an S&P 500 index fund would beat hedge funds over 10 years—and won.",
      },
      {
        title: "Types of ETFs",
        content: "Broad market ETFs: SPY, VTI, QQQ track major indices. Sector ETFs: Technology (XLK), Healthcare (XLV), Energy (XLE). International ETFs: Developed markets (VEA), emerging markets (VWO). Bond ETFs: Government (TLT), corporate (LQD), municipal (MUB). Specialty: Real estate (VNQ), commodities (GLD), dividends (VYM). Build a diversified portfolio using just 3-5 ETFs.",
      },
      {
        title: "Building an ETF Portfolio",
        content: "Classic three-fund portfolio: Total US stock market, total international, total bond market. Adjust allocations based on age and risk tolerance. Rebalance annually to maintain target weights. Consider tax efficiency—bonds in tax-advantaged accounts, stocks in taxable. Start simple, add complexity only when warranted. Most investors need nothing more than 3-5 low-cost ETFs.",
      },
    ],

    // Lesson 17: Bonds and Fixed Income
    17: [
      {
        title: "Bond Fundamentals",
        content: "Bonds are loans to governments or corporations. You lend money (principal), receive regular interest (coupon), and get principal back at maturity. Face value: Typically $1,000 per bond. Coupon rate: Annual interest percentage. Maturity date: When principal is repaid. Yield: Total return if held to maturity. Bonds provide stable income and capital preservation.",
      },
      {
        title: "Bond Pricing and Yields",
        content: "Bond prices and yields move inversely. When interest rates rise, existing bond prices fall. When rates fall, bond prices rise. Duration measures price sensitivity to rate changes. Longer duration = more sensitive. A bond with 10-year duration loses approximately 10% if rates rise 1%. Understanding this relationship is crucial for fixed-income investing.",
      },
      {
        title: "Types of Bonds",
        content: "Treasury bonds: US government-backed, lowest risk, lowest yield. Municipal bonds: State/local governments, often tax-free. Corporate bonds: Company debt, higher yields with credit risk. High-yield (junk) bonds: Lower-rated companies, highest yields and risk. TIPS: Treasury Inflation-Protected Securities, protect against inflation. I-Bonds: Savings bonds with inflation protection.",
      },
      {
        title: "Bonds in Your Portfolio",
        content: "Bonds reduce portfolio volatility and provide income. Traditional rule: Bond allocation = your age (60 years old = 60% bonds). Modern approach adjusts for low rates and longer lifespans. Bonds shine during stock market crashes—often rising when stocks fall. Use bond ladders (staggered maturities) to manage interest rate risk. Consider bond funds for diversification and simplicity.",
      },
    ],

    // Lesson 19: Cryptocurrency Basics
    19: [
      {
        title: "What is Cryptocurrency?",
        content: "Cryptocurrency is digital money secured by cryptography and recorded on a blockchain. Bitcoin (2009): First cryptocurrency, created by Satoshi Nakamoto. Blockchain: Decentralized ledger recording all transactions. No central authority—transactions verified by network participants. Limited supply (21 million Bitcoin maximum) creates scarcity. Cryptocurrencies enable peer-to-peer transactions without intermediaries.",
      },
      {
        title: "Major Cryptocurrencies",
        content: "Bitcoin (BTC): Digital gold, store of value, largest market cap. Ethereum (ETH): Smart contract platform for decentralized applications. Stablecoins (USDC, USDT): Pegged to US dollar for stability. Other altcoins vary widely in purpose, technology, and risk. Market cap and trading volume indicate relative importance. Stick to established cryptocurrencies as a beginner.",
      },
      {
        title: "Crypto Risks and Volatility",
        content: "Extreme volatility: 50-80% drawdowns occur regularly. Regulatory uncertainty: Government actions can crash prices. Security risks: Lost keys mean lost funds—forever. Scams and fraud: Rug pulls, fake tokens, phishing attacks. No investor protection: Unlike stocks, no SIPC insurance. Only invest what you can afford to lose completely.",
      },
      {
        title: "Crypto Security Best Practices",
        content: "Never share private keys or seed phrases—EVER. Use hardware wallets for significant holdings. Enable 2FA on all exchange accounts. Verify addresses carefully before sending. Start with small amounts while learning. Use reputable exchanges only. Diversify across multiple assets. Consider dollar-cost averaging to reduce timing risk.",
      },
    ],

    // Lesson 20: Dividend Investing
    20: [
      {
        title: "The Power of Dividends",
        content: "Dividends are cash payments from company profits to shareholders. Dividend yield = Annual dividend ÷ Stock price. High-quality dividend stocks provide growing income streams. Reinvested dividends account for ~40% of historical market returns. Dividend investing suits investors seeking income and lower volatility.",
      },
      {
        title: "Dividend Aristocrats",
        content: "Dividend Aristocrats: S&P 500 companies with 25+ consecutive years of dividend increases. Examples: Johnson & Johnson, Coca-Cola, Procter & Gamble. These companies demonstrate financial strength and management commitment. Dividend Kings have 50+ years of increases. Aristocrats historically outperform with lower volatility.",
      },
      {
        title: "Evaluating Dividend Stocks",
        content: "Key metrics for dividend investing: Payout ratio: Dividends as % of earnings (below 60% is sustainable). Dividend growth rate: Annual increase percentage. Free cash flow coverage: Can the company afford dividends? Debt levels: High debt threatens dividend safety. Sector considerations: Utilities and REITs typically pay higher yields. Avoid yield traps—extremely high yields often signal distress.",
        quiz: {
          question: "What is a healthy payout ratio for sustainable dividends?",
          options: [
            "Above 90%",
            "Below 60%",
            "Exactly 100%",
            "It doesn't matter"
          ],
          correctAnswer: 1,
          explanation: "A payout ratio below 60% indicates the company retains enough earnings to grow while maintaining dividend payments."
        }
      },
      {
        title: "Building a Dividend Portfolio",
        content: "Diversify across sectors and industries. Focus on dividend growth, not just high yield. Reinvest dividends to compound returns. Use dividend ETFs (VYM, SCHD) for instant diversification. Consider tax implications—qualified dividends taxed at lower rates. Balance dividend stocks with growth stocks for optimal long-term returns.",
      },
    ],

    // Lesson 21: Real Estate Investing
    21: [
      {
        title: "Introduction to Real Estate Investing",
        content: "Real estate is one of the oldest wealth-building strategies, offering income, appreciation, and tax benefits. Unlike stocks, real estate is a tangible asset you can see and improve. According to the Federal Reserve, real estate represents about 25% of American household wealth. Options include: direct property ownership, REITs, real estate crowdfunding, and real estate partnerships.",
        quiz: {
          question: "What percentage of American household wealth does real estate represent?",
          options: ["10%", "25%", "50%", "75%"],
          correctAnswer: 1,
          explanation: "According to the Federal Reserve, real estate represents approximately 25% of American household wealth."
        }
      },
      {
        title: "Direct Property Investment",
        content: "Owning rental properties provides monthly cash flow, appreciation potential, and significant tax deductions. The 1% rule: Monthly rent should equal 1% of purchase price. Cash-on-cash return measures annual income relative to cash invested. Cap rate (NOI ÷ Property Value) helps compare properties. Consider: location, condition, tenant quality, property management, and maintenance costs.",
      },
      {
        title: "Real Estate Investment Trusts (REITs)",
        content: "REITs are companies that own, operate, or finance income-producing real estate. They must distribute 90% of taxable income as dividends. Types include: residential, commercial, industrial, healthcare, and data centers. REITs provide real estate exposure without property management hassles. They trade like stocks, offering liquidity traditional real estate lacks. Average REIT dividend yields range from 3-6%.",
        quiz: {
          question: "What percentage of taxable income must REITs distribute as dividends?",
          options: ["50%", "75%", "90%", "100%"],
          correctAnswer: 2,
          explanation: "REITs are required to distribute at least 90% of their taxable income to shareholders as dividends."
        }
      },
      {
        title: "Real Estate Investment Strategies",
        content: "Buy and hold: Long-term appreciation and rental income. House hacking: Live in one unit, rent others. BRRRR: Buy, Rehab, Rent, Refinance, Repeat. Fix and flip: Buy distressed, renovate, sell quickly. Real estate syndications: Pool money with other investors. Each strategy has different risk/return profiles and capital requirements. Start with REITs or crowdfunding before buying physical property.",
      },
    ],

    // Lesson 22: Tax-Advantaged Investing
    22: [
      {
        title: "Understanding Tax-Advantaged Accounts",
        content: "Tax-advantaged accounts legally reduce your tax burden while saving for retirement. The IRS provides incentives to encourage long-term saving. Pre-tax accounts (401k, Traditional IRA): Contributions reduce current taxes; withdrawals taxed in retirement. Post-tax accounts (Roth IRA, Roth 401k): No current deduction; withdrawals are tax-free. HSAs offer triple tax advantage: deduction, tax-free growth, and tax-free healthcare withdrawals.",
        quiz: {
          question: "What makes HSAs uniquely powerful for tax savings?",
          options: [
            "Only one tax advantage",
            "Double tax advantage",
            "Triple tax advantage",
            "No tax advantages"
          ],
          correctAnswer: 2,
          explanation: "HSAs offer triple tax advantage: tax-deductible contributions, tax-free growth, and tax-free withdrawals for healthcare expenses."
        }
      },
      {
        title: "401(k) and Employer Plans",
        content: "401(k) plans allow up to $23,000 annual contributions (2024). Many employers match contributions—this is FREE money. A 50% match on 6% of salary adds thousands annually. Vesting schedules determine when employer contributions become yours. Investment options vary; choose low-cost index funds when available. Always contribute enough to capture the full employer match.",
      },
      {
        title: "IRA Strategies",
        content: "Traditional IRA: $7,000 annual limit (2024), $8,000 if 50+. Tax deduction depends on income and employer plan access. Roth IRA: Same limits, income restrictions apply ($161,000 single, $240,000 married). Backdoor Roth: High earners contribute to traditional IRA, convert to Roth. SEP-IRA and Solo 401(k): Self-employed can contribute up to $69,000 annually.",
        quiz: {
          question: "What is the 2024 annual contribution limit for IRAs?",
          options: ["$5,000", "$6,000", "$7,000", "$10,000"],
          correctAnswer: 2,
          explanation: "The 2024 IRA contribution limit is $7,000 ($8,000 for those 50 and older)."
        }
      },
      {
        title: "Tax-Efficient Investing",
        content: "Asset location matters: Hold bonds in tax-advantaged accounts (interest is taxed heavily). Keep stocks in taxable accounts (capital gains taxed lower). Tax-loss harvesting: Sell losers to offset gains. Avoid wash sales: Can't repurchase substantially identical security within 30 days. Long-term capital gains (held 1+ year) taxed at 0-20% vs. short-term at income rates.",
      },
    ],

    // Lesson 23: Retirement Planning
    23: [
      {
        title: "Retirement Planning Fundamentals",
        content: "Retirement planning determines how much you need and how to get there. The 4% rule: Withdraw 4% of portfolio annually for sustainable 30-year retirement. For $50,000 annual expenses, you need $1.25 million saved. Modern research suggests 3.5% may be safer given longer lifespans. Consider: Social Security benefits, pensions, healthcare costs, and inflation.",
        quiz: {
          question: "According to the 4% rule, how much do you need saved for $50,000 annual retirement expenses?",
          options: ["$500,000", "$1 million", "$1.25 million", "$2 million"],
          correctAnswer: 2,
          explanation: "The 4% rule: $50,000 ÷ 0.04 = $1.25 million needed to safely withdraw $50,000 annually."
        }
      },
      {
        title: "Calculating Your Retirement Number",
        content: "Step 1: Estimate annual retirement expenses (often 70-80% of current spending). Step 2: Subtract guaranteed income (Social Security, pensions). Step 3: Multiply remaining need by 25-30 (inverse of 3-4% withdrawal rate). Example: $60,000 expenses - $24,000 Social Security = $36,000 needed. $36,000 × 25 = $900,000 portfolio target. Adjust for inflation—expenses double roughly every 20 years.",
      },
      {
        title: "Retirement Account Strategies",
        content: "In your 20s-30s: Maximize Roth contributions (lower tax bracket now). In your 40s-50s: Balance Traditional and Roth based on current vs. expected retirement taxes. At 50+: Catch-up contributions add $7,500 to 401(k), $1,000 to IRA. Before retirement: Build 1-2 years of expenses in cash/bonds for sequence risk protection. Consider Roth conversions during low-income years.",
        quiz: {
          question: "Why might young investors prefer Roth accounts?",
          options: [
            "Higher contribution limits",
            "Lower tax bracket now means tax-free growth benefits later",
            "Employer matching is better",
            "Required by law"
          ],
          correctAnswer: 1,
          explanation: "Young investors often have lower incomes/tax brackets, making it advantageous to pay taxes now and enjoy tax-free growth and withdrawals later."
        }
      },
      {
        title: "Social Security Optimization",
        content: "You can claim Social Security from age 62-70. Claiming at 62: Reduced benefits (~70% of full amount). Full Retirement Age (67 for most): 100% of calculated benefit. Delaying to 70: ~132% of full benefit (8% increase per year). Spousal strategies: Lower-earning spouse can claim on higher earner's record. Break-even analysis helps determine optimal claiming age based on life expectancy.",
      },
    ],

    // Lesson 24: International Investing
    24: [
      {
        title: "Why Invest Internationally?",
        content: "US stocks represent only ~60% of global market capitalization. International diversification reduces country-specific risk. Different economies grow at different rates—emerging markets offer higher growth potential. Currency movements can add returns or provide hedging benefits. Jack Bogle recommended 20-40% international allocation for most investors.",
        quiz: {
          question: "What percentage of global market capitalization do US stocks represent?",
          options: ["40%", "60%", "80%", "95%"],
          correctAnswer: 1,
          explanation: "US stocks represent approximately 60% of global market cap—meaning 40% of investment opportunities are overseas."
        }
      },
      {
        title: "Developed vs. Emerging Markets",
        content: "Developed markets (Europe, Japan, Australia): Lower risk, mature economies, stable currencies. ETFs: VEA, EFA, IEFA. Emerging markets (China, India, Brazil): Higher risk, faster growth, more volatility. ETFs: VWO, EEM, IEMG. Frontier markets (Vietnam, Nigeria): Highest risk, earliest development stage. Developed markets offer stability; emerging markets offer growth potential.",
      },
      {
        title: "Currency Considerations",
        content: "International investments include currency exposure. When US dollar weakens, international returns improve (and vice versa). Hedged ETFs eliminate currency risk but add costs. Unhedged exposure provides diversification benefits. Long-term: Currency movements tend to even out. For most investors, accepting currency exposure is appropriate for diversification benefits.",
        quiz: {
          question: "What happens to international returns when the US dollar weakens?",
          options: [
            "They decrease",
            "They improve",
            "No change",
            "Currency doesn't affect returns"
          ],
          correctAnswer: 1,
          explanation: "When the US dollar weakens, international investments translated back to dollars are worth more, improving returns."
        }
      },
      {
        title: "Building International Exposure",
        content: "Simple approach: Total international stock fund (VXUS, IXUS) covers developed and emerging markets. Three-fund portfolio: US stocks, international stocks, bonds. Consider allocation: 20-40% of stocks in international. Many US companies derive significant revenue internationally—partial natural diversification. ADRs (American Depositary Receipts) allow buying individual foreign stocks on US exchanges.",
      },
    ],

    // Lesson 25: Alternative Investments
    25: [
      {
        title: "Beyond Stocks and Bonds",
        content: "Alternative investments include assets outside traditional stocks, bonds, and cash. Examples: commodities, precious metals, real estate, private equity, hedge funds, collectibles, cryptocurrencies. Alternatives can provide diversification because they often move differently than stocks. However, they may have lower liquidity, higher fees, and more complexity. Most advisors recommend limiting alternatives to 5-20% of portfolio.",
        quiz: {
          question: "What's a key benefit of alternative investments?",
          options: [
            "Guaranteed returns",
            "Zero fees",
            "Diversification from stocks",
            "Daily liquidity"
          ],
          correctAnswer: 2,
          explanation: "Alternatives often move differently than traditional assets, providing valuable portfolio diversification."
        }
      },
      {
        title: "Commodities and Precious Metals",
        content: "Commodities include oil, natural gas, agricultural products, and metals. Gold serves as a traditional store of value and inflation hedge. Silver has industrial uses alongside precious metal status. Ways to invest: Physical metals, ETFs (GLD, SLV), mining stocks, futures. Commodities don't produce income—returns come purely from price appreciation. Consider 5-10% allocation for inflation protection.",
      },
      {
        title: "Private Equity and Venture Capital",
        content: "Private equity invests in non-public companies. Venture capital funds early-stage startups with high growth potential. Historically limited to wealthy investors ($250,000+ minimums). Crowdfunding platforms now offer retail access. High potential returns but extreme risk—most startups fail. Illiquid: Money locked up for 7-10+ years. Consider only with a well-diversified core portfolio already established.",
        quiz: {
          question: "What's a major drawback of private equity investments?",
          options: [
            "Too low returns",
            "Illiquidity—money locked for years",
            "Too easy to access",
            "Government guaranteed"
          ],
          correctAnswer: 1,
          explanation: "Private equity typically requires 7-10+ years of illiquidity, meaning you cannot access your invested capital."
        }
      },
      {
        title: "Art, Collectibles, and Other Alternatives",
        content: "Collectible categories: Fine art, wine, classic cars, sports memorabilia, rare coins. Platforms like Masterworks allow fractional art ownership. Returns are highly variable and markets less efficient. High transaction costs and storage/insurance expenses. Passion investments work best when you'd value ownership regardless of returns. Avoid allocating more than 5% to collectibles without expertise.",
      },
    ],

    // Lesson 26: Fundamental Analysis Deep Dive
    26: [
      {
        title: "Financial Statement Analysis",
        content: "Fundamental analysis evaluates a company's intrinsic value through financial statements. Income Statement: Revenue, costs, profits—shows operational performance. Balance Sheet: Assets, liabilities, equity—shows financial position. Cash Flow Statement: Operating, investing, financing flows—shows actual cash movements. Warren Buffett: 'Accounting is the language of business.' Learn to read these statements fluently.",
        quiz: {
          question: "Which financial statement shows a company's actual cash movements?",
          options: [
            "Income Statement",
            "Balance Sheet",
            "Cash Flow Statement",
            "Annual Report"
          ],
          correctAnswer: 2,
          explanation: "The Cash Flow Statement tracks actual cash movements from operations, investing, and financing activities."
        }
      },
      {
        title: "Key Financial Ratios",
        content: "Profitability ratios: Gross margin, operating margin, net margin, ROE, ROIC. Valuation ratios: P/E, P/B, P/S, EV/EBITDA. Liquidity ratios: Current ratio, quick ratio. Leverage ratios: Debt-to-equity, interest coverage. Efficiency ratios: Asset turnover, inventory turnover. Compare ratios to industry peers and historical averages for context.",
      },
      {
        title: "Analyzing Revenue and Earnings",
        content: "Revenue growth: Is the company growing organically or through acquisitions? Earnings quality: Are profits from core operations or one-time events? Consistency: Look for stable, predictable growth patterns. Guidance: Management projections vs. analyst expectations. Red flags: Declining margins, rising receivables faster than sales, frequent restructuring charges.",
        quiz: {
          question: "What's a red flag when analyzing company earnings?",
          options: [
            "Consistent revenue growth",
            "Rising receivables faster than sales",
            "Stable profit margins",
            "Positive cash flow"
          ],
          correctAnswer: 1,
          explanation: "Receivables growing faster than sales may indicate aggressive accounting or collection problems."
        }
      },
      {
        title: "Reading Annual Reports and 10-Ks",
        content: "Annual reports contain management discussion, financial statements, and risk factors. 10-K filings with the SEC provide detailed unvarnished information. Focus on: MD&A section for management's view, risk factors, and footnotes. Look for: Accounting policy changes, related party transactions, off-balance-sheet items. Warren Buffett reads 500+ pages of reports daily—this research builds conviction.",
      },
    ],

    // Lesson 27: Sector Analysis
    27: [
      {
        title: "Understanding Market Sectors",
        content: "The stock market divides into 11 GICS sectors: Information Technology, Healthcare, Financials, Consumer Discretionary, Communication Services, Industrials, Consumer Staples, Energy, Utilities, Real Estate, and Materials. Each sector has unique characteristics, growth drivers, and risks. Sector rotation strategies shift allocations based on economic cycles. Understanding sectors helps build balanced portfolios.",
        quiz: {
          question: "How many GICS sectors make up the stock market?",
          options: ["5", "8", "11", "15"],
          correctAnswer: 2,
          explanation: "The Global Industry Classification Standard (GICS) divides markets into 11 sectors."
        }
      },
      {
        title: "Cyclical vs. Defensive Sectors",
        content: "Cyclical sectors thrive in economic expansions: Technology, Consumer Discretionary, Financials, Industrials. They fall harder in recessions. Defensive sectors maintain stability regardless of economy: Utilities, Consumer Staples, Healthcare. Energy and Materials are commodity-dependent cycles. Real Estate is interest-rate sensitive. Balance cyclical growth potential with defensive stability.",
      },
      {
        title: "Sector Rotation Strategies",
        content: "Economic cycles favor different sectors: Early recovery: Financials, Industrials, Consumer Discretionary. Mid-cycle: Technology, Communication Services. Late cycle: Energy, Materials, Healthcare. Recession: Utilities, Consumer Staples, Healthcare. While timing is difficult, understanding relationships helps position portfolios. Many investors simply maintain diversification across all sectors.",
        quiz: {
          question: "Which sectors typically perform best in early economic recovery?",
          options: [
            "Utilities and Healthcare",
            "Financials and Consumer Discretionary",
            "Energy and Materials",
            "Consumer Staples"
          ],
          correctAnswer: 1,
          explanation: "Early recovery favors cyclical sectors like Financials and Consumer Discretionary that benefit from renewed economic activity."
        }
      },
      {
        title: "Evaluating Sector ETFs",
        content: "Sector ETFs provide targeted exposure without individual stock selection. SPDR sectors: XLK (Tech), XLF (Financials), XLV (Healthcare), etc. Consider: expense ratios, holdings concentration, tracking accuracy. Top holdings often dominate—check if you're comfortable with concentration. Equal-weight ETFs (like RSP) reduce mega-cap dominance. Sector bets are active decisions—maintain core diversified holdings.",
      },
    ],

    // Lesson 28: Growth vs. Value Investing
    28: [
      {
        title: "Defining Growth and Value",
        content: "Growth investing seeks companies with above-average earnings growth, willing to pay premium valuations. Value investing seeks undervalued companies trading below intrinsic worth. Growth stocks: Higher P/E ratios, reinvesting profits for expansion, often technology/healthcare. Value stocks: Lower valuations, established businesses, often paying dividends. Both styles work over time; leadership rotates based on conditions.",
        quiz: {
          question: "What's a characteristic of value stocks?",
          options: [
            "High P/E ratios",
            "Lower valuations relative to fundamentals",
            "No dividends",
            "Only technology companies"
          ],
          correctAnswer: 1,
          explanation: "Value stocks trade at lower valuations relative to earnings, book value, or other fundamentals."
        }
      },
      {
        title: "Growth Investing Strategies",
        content: "Growth investors look for: Revenue growth 15%+ annually. Expanding market opportunity. Competitive advantages enabling sustained growth. Reinvestment of profits into expansion. Risks: High valuations vulnerable to disappointment. Growth requires patience—companies may not profit for years. Peter Lynch sought 'growth at a reasonable price' (GARP)—combining growth with valuation discipline.",
      },
      {
        title: "Value Investing Strategies",
        content: "Value investors seek: Low P/E, P/B, or P/S ratios vs. history/peers. High dividend yields. Strong balance sheets with low debt. Catalyst for value realization. Benjamin Graham's teachings: Buy $1 of assets for $0.50. Warren Buffett evolved Graham's approach: 'wonderful companies at fair prices.' Value traps exist—some stocks are cheap for good reasons.",
        quiz: {
          question: "Who taught Warren Buffett value investing principles?",
          options: [
            "Peter Lynch",
            "Benjamin Graham",
            "Ray Dalio",
            "Jack Bogle"
          ],
          correctAnswer: 1,
          explanation: "Benjamin Graham, known as the father of value investing, taught Buffett at Columbia and wrote 'The Intelligent Investor.'"
        }
      },
      {
        title: "Blending Growth and Value",
        content: "Core-satellite approach: Index funds as core, selective growth/value tilts. Factor investing: Blend value, growth, quality, momentum factors. GARP: Growth at a reasonable price balances both styles. Total market funds naturally blend both. Avoid timing style rotations—both outperform at different times. Most successful investors incorporate elements of both philosophies.",
      },
    ],

    // Lesson 29: Margin and Leverage
    29: [
      {
        title: "Understanding Margin Trading",
        content: "Margin is borrowing money from your broker to buy securities. Initial margin: Typically 50%—borrow up to half the purchase price. Maintenance margin: Minimum equity required (usually 25-30%). Margin call: If equity falls below maintenance, must deposit funds or sell. Interest charges apply on borrowed amounts. Margin amplifies both gains AND losses—use extreme caution.",
        quiz: {
          question: "What happens when your account equity falls below maintenance margin?",
          options: [
            "Nothing",
            "Automatic profit",
            "Margin call requiring deposit or sale",
            "Free trading"
          ],
          correctAnswer: 2,
          explanation: "A margin call requires you to deposit additional funds or sell securities to restore required equity levels."
        }
      },
      {
        title: "The Dangers of Leverage",
        content: "Example: Buy $20,000 of stock with $10,000 cash + $10,000 margin. Stock rises 10% to $22,000: Your equity = $12,000 (20% gain on cash). Stock falls 10% to $18,000: Your equity = $8,000 (20% loss on cash). At -50%, you're wiped out entirely. Historic crashes often occur rapidly—margin calls force selling into declines, accelerating losses. Many experienced investors avoid margin entirely.",
      },
      {
        title: "Leveraged ETFs",
        content: "Leveraged ETFs (2x, 3x) use derivatives to multiply daily index returns. Example: TQQQ provides 3x daily Nasdaq-100 returns. Critical issue: Volatility decay erodes returns over time. A -10% day followed by +10% doesn't return to even—it's actually down. Leveraged ETFs are designed for day trading, not long-term holding. Avoid unless you fully understand the mathematical decay problem.",
        quiz: {
          question: "Why are leveraged ETFs problematic for long-term holding?",
          options: [
            "Too low returns",
            "Volatility decay erodes returns over time",
            "They're too safe",
            "Low fees"
          ],
          correctAnswer: 1,
          explanation: "Daily rebalancing causes mathematical decay—over time, leveraged ETFs underperform their stated multiple significantly."
        }
      },
      {
        title: "Responsible Use of Leverage",
        content: "If using leverage: Never exceed 10-20% of portfolio. Have cash reserves for margin calls. Use only for well-understood positions. Set stop losses to limit downside. Better leverage alternatives: Home mortgage (low rate, tax-deductible). 401(k) employer match (100% guaranteed return). Options with defined risk. Most millionaires built wealth slowly without leverage—time and compounding beat risky shortcuts.",
      },
    ],

    // Lesson 30: Short Selling
    30: [
      {
        title: "How Short Selling Works",
        content: "Short selling profits from price declines: Borrow shares from broker, sell at current price. Later, buy shares back (hopefully lower) and return to lender. Profit = Sale price - Repurchase price - Borrowing costs. Example: Short 100 shares at $50, cover at $40 = $1,000 profit. Short squeezes occur when prices rise, forcing shorts to cover at losses, accelerating the rise.",
        quiz: {
          question: "How do short sellers profit?",
          options: [
            "When prices rise",
            "When prices fall",
            "Through dividends",
            "Interest payments"
          ],
          correctAnswer: 1,
          explanation: "Short sellers profit when stock prices decline—they sell borrowed shares high and buy them back lower."
        }
      },
      {
        title: "Risks of Short Selling",
        content: "Unlimited loss potential: Stock can rise infinitely (theoretically). Carrying costs: Interest on borrowed shares, dividend payments owed. Short squeeze risk: Forced covering amplifies losses. Margin requirements: Must maintain margin as prices move against you. Time works against you: Carrying costs accumulate while waiting for decline. The market can stay irrational longer than you can stay solvent.",
      },
      {
        title: "Famous Short Squeezes",
        content: "GameStop (2021): Retail investors coordinated purchases forcing hedge fund shorts to cover, causing 1,700% price spike. Volkswagen (2008): Briefly became world's most valuable company during squeeze. Short interest data is public—high short interest creates squeeze potential. Short selling requires conviction AND perfect timing. Professional short sellers like Jim Chanos spend months researching before shorting.",
        quiz: {
          question: "What caused the GameStop short squeeze in 2021?",
          options: [
            "Company earnings beat expectations",
            "Coordinated retail buying forced short covering",
            "Dividend announcement",
            "Merger news"
          ],
          correctAnswer: 1,
          explanation: "Retail investors coordinated buying pressure that forced heavily-shorted hedge funds to cover, creating a massive squeeze."
        }
      },
      {
        title: "Alternatives to Direct Short Selling",
        content: "Inverse ETFs: SH (inverse S&P 500), SQQQ (3x inverse Nasdaq). Put options: Defined risk, profit from declines. Pair trades: Long one stock, short related one to hedge. These alternatives offer downside exposure without unlimited loss risk. For most investors, cash allocation during uncertainty is safer than active shorting. Short selling is a specialized skill—most investors should avoid it.",
      },
    ],

    // Lesson 31: Dollar-Cost Averaging
    31: [
      {
        title: "DCA: A Systematic Approach",
        content: "Dollar-cost averaging (DCA) means investing fixed amounts at regular intervals regardless of price. When prices are high, you buy fewer shares. When prices are low, you buy more shares. This removes emotion and timing from investing decisions. Studies show DCA reduces regret and improves investor outcomes by eliminating paralysis. Automated investing through 401(k)s is natural DCA.",
        quiz: {
          question: "What happens when prices are low during dollar-cost averaging?",
          options: [
            "You buy fewer shares",
            "You buy more shares",
            "You stop investing",
            "Nothing changes"
          ],
          correctAnswer: 1,
          explanation: "With fixed dollar amounts, lower prices mean you automatically buy more shares—a key benefit of DCA."
        }
      },
      {
        title: "DCA vs. Lump Sum",
        content: "Research shows lump sum beats DCA about 66% of the time over the long term—markets rise more often than fall. However: DCA reduces volatility and regret. Starting with lump sum right before a crash is psychologically devastating. Compromise: Invest half immediately, DCA the rest over 6-12 months. For ongoing savings, DCA is the natural approach since you don't have lump sums available.",
      },
      {
        title: "Implementing DCA",
        content: "Set up automatic investments on the same day each month. Choose broad market index funds or ETFs. Reinvest dividends automatically. Never check prices on investment day—it's irrelevant. Increase contributions with raises. During crashes, maintain or increase contributions—you're buying at sale prices. Consistency over decades matters far more than timing.",
        quiz: {
          question: "What should you do during market crashes with DCA?",
          options: [
            "Stop all investing",
            "Maintain or increase contributions",
            "Sell everything",
            "Switch to bonds only"
          ],
          correctAnswer: 1,
          explanation: "Crashes are sale opportunities—maintaining or increasing contributions buys more shares at lower prices."
        }
      },
      {
        title: "Value Averaging Alternative",
        content: "Value averaging: Adjust contributions to hit portfolio value targets. Example: Target $1,000 growth monthly. If portfolio rises $800, contribute $200. If it falls $300, contribute $1,300. This naturally buys more when cheap, less when expensive. Requires more active management than DCA. May require cash reserves for large contributions during downturns. Both DCA and value averaging beat emotional timing attempts.",
      },
    ],

    // Lesson 32: Investment Fees and Costs
    32: [
      {
        title: "The Impact of Fees",
        content: "Small fee differences compound to massive wealth differences. Example over 40 years with $100,000 at 7%: 0.10% fee: $1,427,000. 1.00% fee: $1,009,000. 2.00% fee: $698,000. A 1.9% fee difference costs $729,000! Fees are guaranteed drags; performance is uncertain. Warren Buffett: 'Performance comes and goes; fees never falter.'",
        quiz: {
          question: "Over 40 years, what's the approximate cost difference between 0.1% and 2% annual fees on $100,000?",
          options: [
            "$50,000",
            "$200,000",
            "$729,000",
            "$1,000,000"
          ],
          correctAnswer: 2,
          explanation: "The compounding effect of fee differences is enormous—nearly $730,000 difference over 40 years."
        }
      },
      {
        title: "Types of Investment Fees",
        content: "Expense ratio: Annual fund operating costs (seek below 0.20%). Load fees: Sales charges when buying (front) or selling (back) funds—avoid completely. Trading commissions: Per-trade costs (many brokers now $0). Advisory fees: Financial advisor charges (typically 0.5-1.5% of assets). 12b-1 fees: Marketing costs within fund expenses. Read prospectuses carefully—fees hide in footnotes.",
      },
      {
        title: "Hidden Costs",
        content: "Bid-ask spreads: Difference between buying and selling prices. Trading costs within funds: Turnover creates transaction costs. Tax inefficiency: High turnover generates taxable distributions. Cash drag: Uninvested cash in funds earns nothing. Active funds average 70-100% annual turnover; index funds have 3-5%. Choose low-turnover funds for tax efficiency.",
        quiz: {
          question: "Why is high fund turnover costly?",
          options: [
            "Better returns",
            "Creates taxable events and transaction costs",
            "Lower expenses",
            "More diversification"
          ],
          correctAnswer: 1,
          explanation: "High turnover generates transaction costs and realizes taxable gains that reduce after-tax returns."
        }
      },
      {
        title: "Minimizing Costs",
        content: "Index funds: Vanguard, Fidelity, Schwab offer 0.03-0.10% expense ratios. Commission-free ETFs: Most brokers offer thousands. Tax-advantaged accounts: Avoid annual tax drag. Buy-and-hold: Minimize trading costs. Fiduciary advisors: If needed, fee-only over commission-based. Every dollar saved in fees compounds tax-free—fee reduction is guaranteed return improvement.",
      },
    ],

    // Lesson 33: Behavioral Finance
    33: [
      {
        title: "How Emotions Sabotage Returns",
        content: "DALBAR studies show average equity fund investors underperform the S&P 500 by ~4% annually. Why? Buying high (greed) and selling low (fear). Holding winners too long and losers longer. Chasing past performance. Overconfidence in stock-picking ability. Behavioral finance studies these systematic errors. Understanding your biases is the first step to overcoming them.",
        quiz: {
          question: "By how much do average investors typically underperform market benchmarks annually?",
          options: [
            "1%",
            "2%",
            "4%",
            "10%"
          ],
          correctAnswer: 2,
          explanation: "DALBAR studies show average investors underperform by roughly 4% annually due to behavioral mistakes."
        }
      },
      {
        title: "Key Cognitive Biases",
        content: "Anchoring: Fixating on purchase price regardless of current fundamentals. Confirmation bias: Seeking information that supports existing beliefs. Disposition effect: Selling winners too soon, holding losers too long. Mental accounting: Treating money differently based on source. Narrative fallacy: Creating stories to explain random events. Recognize these patterns in your own thinking.",
      },
      {
        title: "Emotional Biases",
        content: "Loss aversion: Losses feel 2x more painful than equivalent gains feel good. Regret aversion: Avoiding decisions that might cause regret. Herding: Following the crowd feels safe but leads to buying tops and selling bottoms. Overconfidence: Believing you're above average (mathematically impossible for everyone). Status quo bias: Preferring current state even when changes would help.",
        quiz: {
          question: "How much more painful do losses feel compared to equivalent gains?",
          options: [
            "Same",
            "1.5x more",
            "2x more",
            "4x more"
          ],
          correctAnswer: 2,
          explanation: "Research shows losses feel approximately twice as painful as equivalent gains feel good—driving risk aversion."
        }
      },
      {
        title: "Building Better Behavior",
        content: "Automate investing: Remove emotional decisions. Written investment policy: Define rules before emotions run high. Reduce checking frequency: Daily monitoring increases trading mistakes. Diversification: Less concentration reduces regret on individual positions. Long-term focus: Zoom out beyond daily noise. Investment journal: Track decisions and outcomes to learn from patterns. The best investors master their psychology.",
      },
    ],

    // Lesson 34: Portfolio Construction
    34: [
      {
        title: "Modern Portfolio Theory Basics",
        content: "Harry Markowitz's Modern Portfolio Theory (MPT) demonstrates that portfolio risk isn't simply the average of component risks. Uncorrelated assets reduce overall volatility without sacrificing returns. The efficient frontier shows optimal risk/return combinations. Diversification is the only 'free lunch' in investing. MPT won the Nobel Prize and forms the foundation of portfolio construction.",
        quiz: {
          question: "What did Harry Markowitz's Modern Portfolio Theory demonstrate?",
          options: [
            "More stocks always means more risk",
            "Uncorrelated assets reduce portfolio risk",
            "Only bonds are safe",
            "Timing the market works"
          ],
          correctAnswer: 1,
          explanation: "MPT showed that combining uncorrelated assets reduces overall portfolio risk without sacrificing expected returns."
        }
      },
      {
        title: "Asset Allocation Decisions",
        content: "Asset allocation accounts for ~90% of portfolio return variability. Start with stocks vs. bonds split based on timeline and risk tolerance. Within stocks: US vs. international, large vs. small, growth vs. value. Within bonds: Government vs. corporate, short vs. long duration. Add alternatives (REITs, commodities) for additional diversification. Target-date funds automate this process.",
      },
      {
        title: "Correlation and Diversification",
        content: "Correlation measures how assets move together (-1 to +1). Correlation of +1: Move exactly together (no diversification benefit). Correlation of 0: Move independently (excellent diversification). Correlation of -1: Move opposite (perfect hedge). US stocks and bonds: ~0.0 correlation. US stocks and international stocks: ~0.7 (diversified but related). Seek assets with low or negative correlations to your core holdings.",
        quiz: {
          question: "What correlation between assets provides the best diversification?",
          options: [
            "+1",
            "+0.5",
            "0 or negative",
            "Correlation doesn't matter"
          ],
          correctAnswer: 2,
          explanation: "Zero or negative correlation means assets move independently or opposite, providing maximum diversification benefits."
        }
      },
      {
        title: "Building Your Portfolio",
        content: "Three-fund portfolio: Total US stock, total international stock, total bond market. Core-satellite: Broad index core with tactical positions around edges. Factor-based: Tilt toward value, momentum, quality factors. All-weather: Balance across economic environments. Start simple—3 funds suffices for most investors. Complexity doesn't improve returns but does increase costs and mistakes.",
      },
    ],

    // Lesson 35: Due Diligence Process
    35: [
      {
        title: "Research Before Buying",
        content: "Due diligence is the systematic investigation before investing. Warren Buffett reads hundreds of pages before every investment. Peter Lynch visited companies, talked to employees and customers. Research prevents emotional decisions and reveals red flags. The investment process matters more than any single pick. Develop a consistent framework applied to every opportunity.",
        quiz: {
          question: "Why is a systematic due diligence process important?",
          options: [
            "It guarantees profits",
            "It prevents emotional decisions and reveals red flags",
            "It's required by law",
            "It's not important"
          ],
          correctAnswer: 1,
          explanation: "Systematic research prevents emotional decisions, reveals potential problems, and creates investment discipline."
        }
      },
      {
        title: "Quantitative Analysis",
        content: "Financial statement review: Income statement, balance sheet, cash flows. Key ratios: P/E, P/B, ROE, debt/equity, current ratio. Trend analysis: How metrics are changing over time. Peer comparison: How does the company compare to competitors? Valuation: Is current price reasonable relative to intrinsic value? Quantitative screens filter opportunities; qualitative analysis provides conviction.",
      },
      {
        title: "Qualitative Analysis",
        content: "Business model: How does the company make money? Is it sustainable? Competitive advantages: Moats that protect profitability. Management quality: Track record, alignment with shareholders, capital allocation. Industry dynamics: Growth trends, competitive intensity, disruption risks. Corporate culture: Innovation, ethics, employee satisfaction. The best businesses combine strong financials with durable qualitative advantages.",
        quiz: {
          question: "What does qualitative analysis focus on?",
          options: [
            "Financial ratios only",
            "Business model, moats, and management quality",
            "Historical stock prices",
            "Trading volume"
          ],
          correctAnswer: 1,
          explanation: "Qualitative analysis examines non-numerical factors: business model sustainability, competitive moats, and management quality."
        }
      },
      {
        title: "Making the Decision",
        content: "Create a checklist covering all research areas. Seek disconfirming evidence—argue against your thesis. Calculate intrinsic value using multiple methods. Require margin of safety (30%+ discount to value). Size positions based on conviction and risk. Document reasoning to review later. If anything doesn't check out, move on—there will always be other opportunities.",
      },
    ],

    // Lesson 36: Market Cycles and Timing
    36: [
      {
        title: "Understanding Market Cycles",
        content: "Markets move in cycles driven by economic conditions and investor psychology. Bull markets: Extended periods of rising prices (average 5 years). Bear markets: Declines of 20%+ (average 14 months). Corrections: Declines of 10-20% (occur yearly on average). Crashes: Rapid severe declines (occur roughly every decade). Cycles are inevitable but timing is impossible—prepare psychologically and financially for both.",
        quiz: {
          question: "How long does the average bull market last?",
          options: [
            "6 months",
            "2 years",
            "5 years",
            "10 years"
          ],
          correctAnswer: 2,
          explanation: "Bull markets historically average about 5 years, though individual cycles vary significantly."
        }
      },
      {
        title: "The Futility of Market Timing",
        content: "Studies consistently show timing attempts fail: Missing the 10 best days over 20 years cuts returns in half. Best and worst days often cluster together. Professional market timers fail more than succeed. Even correct predictions require getting re-entry timing right. Peter Lynch: 'Far more money has been lost by investors preparing for corrections, or trying to anticipate corrections, than has been lost in corrections themselves.'",
      },
      {
        title: "Preparing for Bear Markets",
        content: "Accept they're coming: ~1 every 3-4 years historically. Maintain appropriate asset allocation for your risk tolerance. Keep emergency fund separate from investments. Avoid panic: Create written plan to follow during declines. View as opportunities: Lower prices mean better future returns. Consider automatic rebalancing: Sells high, buys low systematically. Those who survive bear markets often do best in subsequent bulls.",
        quiz: {
          question: "How should you view bear markets?",
          options: [
            "Time to sell everything",
            "Opportunities to buy at lower prices",
            "Signs to stop investing",
            "Rare events"
          ],
          correctAnswer: 1,
          explanation: "Bear markets offer opportunities to buy quality assets at discounted prices, improving long-term returns for patient investors."
        }
      },
      {
        title: "Staying the Course",
        content: "Time in market > timing the market. Contribute consistently regardless of conditions. Rebalance periodically to maintain risk levels. Focus on controllables: savings rate, costs, behavior. Tune out financial media during volatility—it's entertainment, not advice. Remember: The market has recovered from every crash in history. Patient investors are rewarded; panicked investors lock in losses.",
      },
    ],

    // Lesson 37: Income Investing
    37: [
      {
        title: "Building Income Streams",
        content: "Income investing prioritizes regular cash payments over price appreciation. Sources: dividends, bond interest, REIT distributions, preferred stock payments. Particularly valuable for: retirees needing cash flow, risk-averse investors wanting tangible returns. Growing income can outpace inflation over time. Dividend growth investors focus on increasing payments rather than highest current yield.",
        quiz: {
          question: "What's the main goal of income investing?",
          options: [
            "Maximum capital gains",
            "Regular cash payments",
            "Tax losses",
            "Beating the market"
          ],
          correctAnswer: 1,
          explanation: "Income investing prioritizes receiving regular cash payments through dividends, interest, and distributions."
        }
      },
      {
        title: "Dividend Income Strategies",
        content: "High dividend yield: Focus on above-average payouts (3-5%+). Dividend growth: Focus on companies increasing payouts annually. Dividend aristocrats: 25+ consecutive years of increases. Mix approaches: Core holdings in growers, satellite in high yield. Reinvest dividends in accumulation phase; take cash in retirement. Watch payout ratios—extremely high yields often indicate trouble.",
      },
      {
        title: "Fixed Income Strategies",
        content: "Bond ladders: Stagger maturities for consistent income and rate flexibility. Barbell strategy: Short-term and long-term bonds, nothing in middle. TIPS: Inflation-protected treasury bonds for real income. Municipal bonds: Tax-free income for high-bracket investors. I-Bonds: Inflation-adjusted savings bonds (limited annual purchases). Match duration to when you'll need the money.",
        quiz: {
          question: "What's the benefit of a bond ladder?",
          options: [
            "Highest possible yield",
            "Consistent income and interest rate flexibility",
            "Maximum price appreciation",
            "No risk"
          ],
          correctAnswer: 1,
          explanation: "Bond ladders provide consistent income as bonds mature, while allowing reinvestment at current rates."
        }
      },
      {
        title: "Creating a Complete Income Portfolio",
        content: "Diversify income sources: Stocks, bonds, REITs, preferred shares. Balance yield and growth: Some high current income, some growing payments. Consider taxes: Qualified dividends taxed lower than bond interest. Plan for inflation: Growing dividends and TIPS protect purchasing power. Calculate coverage: Ensure income exceeds expenses with margin of safety. Review annually and adjust for changing needs and rates.",
      },
    ],

    // Lesson 38: Value Investing Deep Dive
    38: [
      {
        title: "Benjamin Graham's Value Principles",
        content: "Benjamin Graham, the father of value investing, taught: Mr. Market offers prices daily—sometimes rational, often emotional. Exploit his mood swings. Margin of safety: Only buy when price is well below intrinsic value. Focus on intrinsic value, not market price. Be patient—wait for fat pitches. His 1949 book 'The Intelligent Investor' remains essential reading.",
        quiz: {
          question: "What is Graham's 'margin of safety'?",
          options: [
            "A diversified portfolio",
            "Buying only when price is well below intrinsic value",
            "Stop-loss orders",
            "Insurance on investments"
          ],
          correctAnswer: 1,
          explanation: "Margin of safety means buying assets for significantly less than their calculated intrinsic value, protecting against errors."
        }
      },
      {
        title: "Calculating Intrinsic Value",
        content: "Methods to estimate intrinsic value: Discounted Cash Flow (DCF): Present value of future cash flows. Earnings power value: Normalized earnings × appropriate multiple. Asset-based: Net asset value for asset-heavy businesses. Relative valuation: Compare multiples to peers and history. Use multiple methods and look for convergence. Intrinsic value is a range, not a precise number.",
      },
      {
        title: "Finding Undervalued Stocks",
        content: "Where to look for value: Out-of-favor industries (cyclical downturns). Spinoffs (often sold indiscriminately). Small caps (less analyst coverage). Turnaround situations (temporary problems). 52-week low lists. Insider buying (management knows the business). Screening tools: Low P/E, P/B; high dividend yield; positive earnings. Then apply qualitative analysis to understand why it's cheap.",
        quiz: {
          question: "Why might spinoffs offer value opportunities?",
          options: [
            "They're always better companies",
            "Often sold indiscriminately by index funds",
            "Higher dividends",
            "More media coverage"
          ],
          correctAnswer: 1,
          explanation: "Spinoffs are often sold by index funds and institutions that don't want the new company, creating buying opportunities."
        }
      },
      {
        title: "Avoiding Value Traps",
        content: "Value traps are cheap stocks that stay cheap or decline further. Warning signs: Declining industry with no turnaround catalyst. Deteriorating competitive position. Poor management with no change coming. High debt becoming unmanageable. Accounting irregularities. Cheap isn't enough—you need a reason for value to be realized. Catalysts: New management, strategic alternatives, activist investors, industry recovery.",
      },
    ],

    // Lesson 39: Growth Investing Deep Dive
    39: [
      {
        title: "Finding Growth Opportunities",
        content: "Growth investing seeks companies expanding faster than the market. Look for: Revenue growth 15%+ annually. Expanding total addressable market. Product innovation and market share gains. Operating leverage improving margins. Strong reinvestment returns. Peter Lynch sought 'tenbaggers'—stocks that grow 10x. Many successful growth investors focus on what they know and observe in daily life.",
        quiz: {
          question: "What annual revenue growth rate typically defines a growth stock?",
          options: [
            "3%+",
            "8%+",
            "15%+",
            "50%+"
          ],
          correctAnswer: 2,
          explanation: "Growth stocks typically exhibit 15%+ annual revenue growth, significantly above market averages."
        }
      },
      {
        title: "Evaluating Growth Sustainability",
        content: "Key questions: Is the market expanding or is the company just taking share? Are customers recurring or one-time? What's the competitive moat protecting growth? Is growth profitable or buying revenue with losses? How long can high growth continue? Rule of 40 (SaaS companies): Revenue growth % + profit margin % should exceed 40%. Sustainable growth requires profitable unit economics.",
      },
      {
        title: "Growth at a Reasonable Price",
        content: "GARP balances growth enthusiasm with valuation discipline. PEG ratio: P/E divided by growth rate (seek PEG below 1.5). Compare valuations to growth rates—high growth justifies higher P/E. Warren Buffett evolved from pure value to GARP: 'wonderful companies at fair prices.' Even great companies are bad investments at extreme valuations. Set price targets based on reasonable future valuations.",
        quiz: {
          question: "What PEG ratio generally indicates reasonable value?",
          options: [
            "Above 3",
            "Exactly 2",
            "Below 1.5",
            "PEG doesn't matter"
          ],
          correctAnswer: 2,
          explanation: "PEG below 1.5 suggests the stock's P/E multiple is reasonable relative to its growth rate."
        }
      },
      {
        title: "Managing Growth Stock Positions",
        content: "Position sizing: Growth stocks are volatile—don't over-concentrate. Adding to winners: Consider adding as thesis confirms. Selling discipline: Fundamental deterioration vs. temporary setbacks. Valuation limits: Set price targets when to take profits. Tax management: Hold winners for long-term capital gains treatment. Growth investing requires patience—compounding takes years to show dramatic results.",
      },
    ],

    // Lesson 40: Factor Investing
    40: [
      {
        title: "What Are Investment Factors?",
        content: "Factors are characteristics that explain stock returns beyond market exposure. Academic research has identified factors that persistently outperform over time. Major factors: Value (cheap stocks), Size (small companies), Momentum (recent winners), Quality (profitable stable companies), Low Volatility. Factors have academic backing and long historical records. Factor investing bridges passive and active management.",
        quiz: {
          question: "What are investment factors?",
          options: [
            "Industry sectors",
            "Characteristics explaining excess returns",
            "Market cap ranges",
            "Geographic regions"
          ],
          correctAnswer: 1,
          explanation: "Factors are stock characteristics (like value or momentum) that explain returns beyond simple market exposure."
        }
      },
      {
        title: "Major Factor Strategies",
        content: "Value: Low P/E, P/B stocks (historically +2-3% annually over market). Size: Small cap stocks (historically +2% over large caps). Momentum: Recent winners continue outperforming (strongest factor). Quality: High profitability, low debt companies. Low Volatility: Paradoxically, low-vol stocks often match high-vol returns with less risk. Each factor has periods of outperformance and underperformance—diversify across factors.",
      },
      {
        title: "Implementing Factor Strategies",
        content: "Smart beta ETFs: Rules-based factor exposure (lower cost than active). Factor funds from major providers: Vanguard, Fidelity, DFA. Multi-factor funds: Combine several factors for diversification. Single-factor ETFs: Concentrated exposure (more volatile). Consider: Expense ratios matter—factors have modest premiums. Turnover creates taxes in taxable accounts.",
        quiz: {
          question: "Why diversify across multiple factors?",
          options: [
            "One factor always works",
            "Each factor has periods of underperformance",
            "Only momentum matters",
            "Factors never work"
          ],
          correctAnswer: 1,
          explanation: "Each factor experiences periods of underperformance; combining factors smooths returns over time."
        }
      },
      {
        title: "Factor Timing and Patience",
        content: "Factor premiums are long-term phenomena requiring decades of patience. Value underperformed for 10+ years before 2022 resurgence. Momentum can reverse violently in market turns. Don't chase recent factor performance—it often reverses. Maintain consistent factor exposure or accept market-cap weighting. Factor investing works but requires discipline through underperformance periods.",
      },
    ],

    // Lesson 41: ESG Investing
    41: [
      {
        title: "What is ESG Investing?",
        content: "ESG investing considers Environmental, Social, and Governance factors alongside financial analysis. Environmental: Climate impact, resource usage, pollution. Social: Labor practices, community relations, product safety. Governance: Board composition, executive pay, shareholder rights. ESG investing has grown dramatically—over $35 trillion in ESG assets globally. Motivations vary: values alignment, risk management, or belief in outperformance.",
        quiz: {
          question: "What does ESG stand for?",
          options: [
            "Earnings, Stocks, Growth",
            "Environmental, Social, Governance",
            "European Standard Guidelines",
            "Equity Share Group"
          ],
          correctAnswer: 1,
          explanation: "ESG stands for Environmental, Social, and Governance—the three pillars of sustainable investing criteria."
        }
      },
      {
        title: "ESG Investment Approaches",
        content: "Negative screening: Exclude industries (tobacco, weapons, fossil fuels). Positive screening: Select best ESG performers within sectors. ESG integration: Consider ESG as risk factors alongside traditional analysis. Impact investing: Seek measurable positive outcomes. Shareholder engagement: Vote proxies and engage companies on ESG issues. Choose the approach matching your values and objectives.",
      },
      {
        title: "ESG Performance Debate",
        content: "ESG performance evidence is mixed and debated: Some studies show ESG leaders outperform on risk-adjusted basis. Others find no significant difference or underperformance. ESG may help avoid disasters (governance failures, environmental liabilities). Energy sector exclusion hurt during 2022 oil rally. Greenwashing concerns: Not all ESG funds are equally rigorous. Focus on ESG for values alignment; don't expect guaranteed outperformance.",
        quiz: {
          question: "What is a legitimate concern about ESG investing?",
          options: [
            "Always outperforms",
            "Greenwashing—not all funds are equally rigorous",
            "No options available",
            "Required by law"
          ],
          correctAnswer: 1,
          explanation: "Greenwashing is a real concern—ESG criteria and rigor vary significantly across funds and providers."
        }
      },
      {
        title: "Building an ESG Portfolio",
        content: "Research fund methodologies—ESG means different things to different providers. Compare holdings—some ESG funds still hold controversial companies. Consider expense ratios—ESG funds often charge more. Check tracking error if using ESG index funds. Supplement with direct engagement—vote your proxies. Balance ESG preferences with diversification needs. Your values matter—invest in ways that let you sleep at night.",
      },
    ],

    // Lesson 42: Tax-Loss Harvesting
    42: [
      {
        title: "Understanding Tax-Loss Harvesting",
        content: "Tax-loss harvesting sells losing positions to realize losses that offset taxable gains. Capital losses offset capital gains dollar-for-dollar. Excess losses offset up to $3,000 of ordinary income annually. Remaining losses carry forward indefinitely. This strategy lowers taxes without changing portfolio allocation. Robo-advisors automate this process; manual investors can do it too.",
        quiz: {
          question: "How much ordinary income can excess capital losses offset annually?",
          options: [
            "$1,000",
            "$3,000",
            "$10,000",
            "Unlimited"
          ],
          correctAnswer: 1,
          explanation: "After offsetting capital gains, up to $3,000 of capital losses can offset ordinary income each year."
        }
      },
      {
        title: "The Wash Sale Rule",
        content: "IRS wash sale rule: Can't claim loss if you buy 'substantially identical' security within 30 days before or after sale. This 61-day window requires planning. Strategies: Switch to similar but not identical investment (different index fund). Wait 31 days then repurchase (risk missing gains). Harvest losses in taxable accounts while maintaining positions in IRAs. Track wash sales across all accounts—including spouse's.",
      },
      {
        title: "Implementing Tax-Loss Harvesting",
        content: "Review portfolio for losses, especially after market declines. Prioritize short-term losses (offset gains taxed at income rates). Consider transaction costs vs. tax benefits. Maintain intended asset allocation through similar replacements. Example: Sell S&P 500 fund at loss, buy total market fund. After 31 days, can switch back if desired. Harvest throughout the year, not just December.",
        quiz: {
          question: "Why prioritize harvesting short-term losses?",
          options: [
            "They're worth less",
            "They offset gains taxed at higher income tax rates",
            "Long-term losses don't count",
            "IRS requires it"
          ],
          correctAnswer: 1,
          explanation: "Short-term capital gains are taxed at ordinary income rates (up to 37%), so offsetting them provides greater tax savings."
        }
      },
      {
        title: "Long-term Tax Considerations",
        content: "Harvesting resets cost basis—future gains will be larger. Evaluate net present value of deferring vs. eliminating taxes. If expecting lower future tax bracket, harvesting is clearly beneficial. If higher future bracket, consider implications. Step-up in basis at death eliminates gains—relevant for estate planning. Tax-loss harvesting works best in early accumulation years when you're in lower brackets.",
      },
    ],

    // Lesson 43: Estate Planning for Investors
    43: [
      {
        title: "Estate Planning Basics",
        content: "Estate planning ensures assets transfer according to your wishes with minimal taxes. Key documents: Will, trust(s), power of attorney, healthcare directive. Beneficiary designations on retirement accounts override wills. Step-up in cost basis at death eliminates capital gains on appreciated assets. Estate tax exemption (2024): $13.61 million per person. Planning matters regardless of wealth level—it's about control and protection.",
        quiz: {
          question: "What happens to cost basis of appreciated assets at death?",
          options: [
            "It resets to zero",
            "It steps up to current market value",
            "Nothing changes",
            "It becomes taxable immediately"
          ],
          correctAnswer: 1,
          explanation: "The cost basis 'steps up' to market value at death, eliminating capital gains taxes on appreciation."
        }
      },
      {
        title: "Trusts for Investors",
        content: "Revocable living trusts: Avoid probate, maintain control during life. Irrevocable trusts: Remove assets from estate, provide asset protection. Dynasty trusts: Multigenerational wealth transfer. Charitable remainder trusts: Income during life, charity at death. Bypass trusts: Maximize estate tax exemptions for married couples. Trust complexity requires professional guidance—costs are worth it for substantial estates.",
      },
      {
        title: "Gifting Strategies",
        content: "Annual gift exclusion: $18,000 per recipient (2024) without gift tax implications. Lifetime exemption: $13.61 million beyond annual exclusions. 529 contributions: Can superfund 5 years' gifts ($90,000) in one year. Direct payments for education/medical don't count toward limits. Gifting appreciated assets moves gains out of your estate. Start early—consistent gifting compounds over generations.",
        quiz: {
          question: "What is the 2024 annual gift tax exclusion per recipient?",
          options: [
            "$10,000",
            "$15,000",
            "$18,000",
            "$25,000"
          ],
          correctAnswer: 2,
          explanation: "The 2024 annual gift tax exclusion is $18,000 per recipient without using lifetime exemption."
        }
      },
      {
        title: "Charitable Planning",
        content: "Donating appreciated assets: Avoid capital gains while getting full deduction. Donor-advised funds: Contribute now, distribute to charities over time. Qualified charitable distributions: Direct IRA distributions to charity (age 70.5+). Charitable remainder trusts: Income stream plus eventual charitable gift. Charitable lead trusts: Charity receives income, remainder to heirs. Philanthropy can be integrated with estate planning for tax efficiency.",
      },
    ],

    // Lesson 44: Building Wealth Over Decades
    44: [
      {
        title: "The Millionaire Next Door",
        content: "Research on millionaires reveals common traits: They live below their means. They allocate time and money efficiently. They prioritize financial independence over status displays. Many are first-generation wealthy (80%+). Most common paths: Business ownership, high-income professions, consistent saving/investing. Wealth is what you don't see—the spending that didn't happen. Building wealth is boring and slow—but it works.",
        quiz: {
          question: "What percentage of millionaires are first-generation wealthy?",
          options: [
            "20%",
            "50%",
            "80%+",
            "Nearly 100%"
          ],
          correctAnswer: 2,
          explanation: "Research shows over 80% of millionaires are first-generation—they built their wealth, not inherited it."
        }
      },
      {
        title: "The Power of Savings Rate",
        content: "Savings rate impacts retirement timeline more than investment returns. At 10% savings rate: ~50 years to retirement. At 25% savings rate: ~30 years to retirement. At 50% savings rate: ~17 years to retirement. At 75% savings rate: ~7 years to retirement. The math: Higher savings reduces expenses AND accelerates accumulation. Focus on increasing income and reducing spending—you control both.",
      },
      {
        title: "Avoiding Lifestyle Inflation",
        content: "Lifestyle inflation: Spending rises with income, preventing wealth building. Hedonic adaptation: We quickly adjust to new luxuries, wanting more. Strategy: When income increases, save 50%+ of the raise. Automate savings increases to remove temptation. Track spending to maintain awareness. Find fulfillment outside consumption. Many high earners are broke; many modest earners are wealthy. The difference is behavior.",
        quiz: {
          question: "What is lifestyle inflation?",
          options: [
            "Prices rising over time",
            "Spending rising with income",
            "Interest rates increasing",
            "Portfolio volatility"
          ],
          correctAnswer: 1,
          explanation: "Lifestyle inflation is when spending increases proportionally with income, preventing wealth accumulation."
        }
      },
      {
        title: "Wealth Building Mindset",
        content: "Think in decades, not days. Embrace the boring consistency of systematic investing. Avoid comparing to others—run your own race. Focus on process (savings rate, costs, behavior) not outcomes (returns). Celebrate milestones but don't rest on them. Continual learning: Markets change, strategies evolve. Your biggest asset is human capital—invest in yourself. Wealth building is a marathon; start today and stay the course.",
      },
    ],

    // Lesson 45: Financial Independence
    45: [
      {
        title: "The FIRE Movement",
        content: "FIRE: Financial Independence, Retire Early. Core concept: Accumulate 25x annual expenses to live off investments indefinitely. Variations: LeanFIRE (frugal lifestyle), FatFIRE (higher spending), CoastFIRE (front-load saving), BaristaFIRE (part-time work with benefits). The movement emphasizes intentional living and rejecting consumerism. Financial independence provides options—you don't have to retire, but you can.",
        quiz: {
          question: "How much do you need to accumulate for financial independence using the 4% rule?",
          options: [
            "10x annual expenses",
            "15x annual expenses",
            "25x annual expenses",
            "50x annual expenses"
          ],
          correctAnswer: 2,
          explanation: "The 4% rule suggests you need 25x annual expenses (1/0.04 = 25) to safely withdraw indefinitely."
        }
      },
      {
        title: "Calculating Your FI Number",
        content: "Step 1: Track current spending accurately for 6-12 months. Step 2: Estimate retirement expenses (may be lower or higher). Step 3: Multiply by 25 for 4% withdrawal rate (or 33 for safer 3%). Example: $50,000 annual expenses × 25 = $1.25 million FI number. Include healthcare costs—significant before Medicare eligibility. Plan for taxes on withdrawals from traditional accounts.",
      },
      {
        title: "Accelerating the Path to FI",
        content: "Increase income: Career advancement, side businesses, skills development. Decrease expenses: Housing (biggest lever), transportation, food. Optimize taxes: Maximize tax-advantaged accounts. Investment efficiency: Low costs, tax-loss harvesting. Geographic arbitrage: Lower cost-of-living areas. The gap between income and expenses is everything. High earners who spend everything never reach FI; modest earners with high savings rates do.",
        quiz: {
          question: "What's the biggest lever for reducing expenses?",
          options: [
            "Coffee",
            "Housing",
            "Subscriptions",
            "Clothing"
          ],
          correctAnswer: 1,
          explanation: "Housing typically represents 25-35% of spending—changes here have the largest impact on savings rate."
        }
      },
      {
        title: "Life After FI",
        content: "Financial independence is a beginning, not an end. Most FIRE achievers continue working—on their terms. Pursue meaningful activities: passion projects, volunteering, family. Guard against lifestyle inflation depleting your nest egg. Stay engaged mentally and socially—retirement isolation is real. Maintain flexibility in spending for market downturns. The goal isn't to stop working—it's to have choices about how you spend your time.",
      },
    ],

    // Lesson 46: Investment Psychology Mastery
    46: [
      {
        title: "Mastering Your Investment Mindset",
        content: "Long-term investment success is 80% psychology, 20% strategy. The best strategy you can't stick with loses to a good strategy you can. Key mental shifts: Embrace volatility as the price of returns. See market drops as opportunities, not disasters. Focus on process over outcomes. Accept you can't control returns—only behavior. Develop emotional intelligence about money. Your mindset determines your results.",
        quiz: {
          question: "What percentage of investment success is psychology according to many experts?",
          options: [
            "20%",
            "50%",
            "80%",
            "100%"
          ],
          correctAnswer: 2,
          explanation: "Many experts argue that 80% of investment success comes from psychology and behavior, not strategy."
        }
      },
      {
        title: "Developing Patience",
        content: "Markets reward patience, punish impatience. Average holding periods have declined from 8 years (1960s) to 6 months (2020s). Short-term trading generates fees, taxes, and behavioral errors. The best returns accrue to those who can sit and wait. Warren Buffett: 'The stock market is a device for transferring money from the impatient to the patient.' Practice patience in small ways to build the muscle for big moments.",
      },
      {
        title: "Managing Fear and Greed",
        content: "Fear: Sell low, miss recoveries, seek false safety. Counter: Remember past recoveries; focus on time horizon; automate. Greed: Buy high, concentrate, take excessive risk. Counter: Stick to allocation; remember past bubbles; maintain discipline. Keep an investment journal to identify your triggers. Create rules in advance: 'If the market drops 20%, I will add to positions.' Remove emotion by removing decisions in the moment.",
        quiz: {
          question: "What's the best way to manage emotional investing?",
          options: [
            "Check portfolio daily",
            "Follow financial news constantly",
            "Create rules in advance and automate",
            "React quickly to market moves"
          ],
          correctAnswer: 2,
          explanation: "Creating rules in advance and automating removes emotion from the decision-making process."
        }
      },
      {
        title: "Building Unshakeable Conviction",
        content: "Conviction comes from understanding, not hope. Study investment history—every crash has recovered. Know your strategy deeply—why it works and when it struggles. Diversify to survive your mistakes. Build slowly—the market tests everyone's conviction. Find your personal 'why'—goals that transcend market noise. The investors who succeed are those who can't be shaken out. Be that investor.",
      },
    ],

    // Lesson 47: Advanced Tax Strategies
    47: [
      {
        title: "Tax-Efficient Account Placement",
        content: "Different investments have different tax profiles—place them strategically. Tax-advantaged accounts (IRAs, 401k): Bonds (interest taxed as income), REITs, actively traded funds. Taxable accounts: Index funds, growth stocks (unrealized gains), municipal bonds. Roth accounts: Highest growth potential assets (gains are tax-free forever). This 'asset location' strategy can add 0.5%+ annually to after-tax returns.",
        quiz: {
          question: "Where should you hold REITs for tax efficiency?",
          options: [
            "Taxable accounts",
            "Tax-advantaged accounts like IRAs",
            "Checking accounts",
            "Doesn't matter"
          ],
          correctAnswer: 1,
          explanation: "REIT dividends are taxed as ordinary income, so holding them in tax-advantaged accounts shields this income."
        }
      },
      {
        title: "Roth Conversion Strategies",
        content: "Roth conversions: Move traditional IRA/401k money to Roth, paying taxes now. Benefits: Tax-free growth and withdrawals forever; no RMDs. Optimal timing: Low-income years (early retirement, career transitions, sabbaticals). Fill lower tax brackets each year with conversions. Consider state taxes—convert before moving to high-tax state. Pro rata rule affects those with pre-tax IRA funds. Plan conversions over multiple years to manage tax brackets.",
      },
      {
        title: "Qualified Opportunity Zones",
        content: "QOZs offer tax benefits for investing capital gains in designated areas. Benefits: Defer current gains, reduce by 10% if held 5+ years, eliminate future gains if held 10+ years. Investments typically through Qualified Opportunity Funds (QOFs). Higher risk: Often underdeveloped areas with uncertain returns. Complexity: Many rules and requirements. Consider for large, concentrated gains—seek professional guidance.",
        quiz: {
          question: "What happens to QOZ gains if held for 10+ years?",
          options: [
            "Taxed at normal rates",
            "Deferred",
            "Eliminated entirely",
            "Taxed at 50%"
          ],
          correctAnswer: 2,
          explanation: "QOZ investments held 10+ years have appreciation gains eliminated entirely—a powerful tax benefit."
        }
      },
      {
        title: "Charitable Giving Tax Strategies",
        content: "Donate appreciated stock: Avoid capital gains AND get full deduction. Bunch deductions: Alternate years of large charitable gifts to exceed standard deduction. Donor-Advised Funds: Contribute in high-income years, distribute later. Qualified Charitable Distributions: Direct IRA to charity, avoiding income (70.5+). Charitable Remainder Trusts: Complex but powerful for large estates. Align charitable intent with tax strategy for maximum impact.",
      },
    ],

    // Lesson 48: International Tax Considerations
    48: [
      {
        title: "Foreign Tax Credit",
        content: "International investments often face foreign withholding taxes on dividends. Foreign Tax Credit: Offset US taxes with foreign taxes paid. Claimed on Form 1116 (or directly on Form 1040 if under $300 single/$600 married). Holding international investments in tax-advantaged accounts wastes the foreign tax credit. Consider tax-efficient placement: International stocks in taxable accounts to claim credits.",
        quiz: {
          question: "Where should you hold international stocks for tax efficiency?",
          options: [
            "Only in IRAs",
            "Taxable accounts to claim foreign tax credits",
            "Only in 401(k)s",
            "Savings accounts"
          ],
          correctAnswer: 1,
          explanation: "Taxable accounts allow claiming foreign tax credits; in tax-advantaged accounts, those credits are lost."
        }
      },
      {
        title: "Tax Treaties and Withholding",
        content: "US has tax treaties with many countries reducing withholding rates. Treaty rates vary: UK 15%, Japan 10%, China 10%. Non-treaty countries may withhold 25-30%. ADRs have foreign taxes embedded in pricing. Check fund prospectuses for expected foreign tax drag. Ireland-domiciled ETFs may have favorable treaty rates. These details matter more as international allocation grows.",
      },
      {
        title: "PFIC Rules for Foreign Funds",
        content: "Passive Foreign Investment Company (PFIC) rules create punitive US taxation. Foreign mutual funds and ETFs are often PFICs. Consequences: Excess distributions taxed at highest rates plus interest. Avoid: Use US-domiciled funds for international exposure. If holding PFICs: Consider QEF or Mark-to-Market elections. This primarily affects US investors holding foreign-domiciled funds directly.",
        quiz: {
          question: "What should US investors avoid due to PFIC rules?",
          options: [
            "US index funds",
            "Foreign-domiciled mutual funds",
            "Treasury bonds",
            "Domestic stocks"
          ],
          correctAnswer: 1,
          explanation: "PFIC rules create punitive taxation on foreign-domiciled funds; use US-domiciled funds for international exposure."
        }
      },
      {
        title: "Expatriate and Dual-Citizen Considerations",
        content: "US citizens owe taxes on worldwide income regardless of residence. FBAR: Report foreign accounts exceeding $10,000 total. FATCA: Report foreign financial assets above thresholds. Dual citizens face complexity—both countries may tax. Expatriation has tax consequences ('exit tax' on unrealized gains). Plan carefully before international moves or renouncing citizenship. International tax situations require specialized professional advice.",
      },
    ],

    // Lesson 49: Risk Management Mastery
    49: [
      {
        title: "Comprehensive Risk Assessment",
        content: "Investment risk extends beyond market volatility. Market risk: Overall market declines. Concentration risk: Too much in single position or sector. Sequence risk: Poor returns early in retirement. Inflation risk: Purchasing power erosion. Longevity risk: Outliving your money. Behavioral risk: Your own mistakes. Currency risk: Exchange rate movements. Identify all risks facing your specific situation, then address each systematically.",
        quiz: {
          question: "What is sequence risk?",
          options: [
            "Buying stocks in the wrong order",
            "Poor returns early in retirement depleting portfolio",
            "Market timing risk",
            "Currency fluctuations"
          ],
          correctAnswer: 1,
          explanation: "Sequence risk is the danger of poor returns early in retirement when withdrawals magnify losses."
        }
      },
      {
        title: "Position Sizing and Concentration",
        content: "Concentration builds wealth; diversification preserves it. Position limits prevent catastrophic losses from any single holding. Consider: No single stock exceeding 5% of portfolio. No sector exceeding 25%. Rebalance when limits are exceeded. Exceptions for company stock (vesting schedules)—plan for diversification. Even high-conviction ideas can go to zero—protect against the unthinkable.",
      },
      {
        title: "Hedging Strategies",
        content: "Hedging reduces risk at a cost (like insurance). Simple hedges: Cash allocation, bond allocation. Options hedges: Protective puts, collars. Inverse ETFs: Profit from declines (short-term only). Diversification across asset classes. Most investors should rely on diversification and allocation rather than complex hedges. The cost of hedging often exceeds the benefit for long-term investors.",
        quiz: {
          question: "What's the simplest form of hedging for most investors?",
          options: [
            "Complex options strategies",
            "Diversification and proper allocation",
            "Leveraged inverse ETFs",
            "Short selling"
          ],
          correctAnswer: 1,
          explanation: "For most investors, proper diversification and allocation provide effective risk management without complexity."
        }
      },
      {
        title: "Creating a Risk Management Plan",
        content: "Document your risk tolerances and limits. Set rebalancing rules and triggers. Establish emergency fund (6-12 months expenses). Review insurance coverage: life, disability, liability. Create an investment policy statement. Plan for bear markets in advance—what will you do? Review quarterly but don't overreact to short-term moves. Risk management is about preparation, not prediction. Prepare for the worst; expect the best.",
      },
    ],

    // Lesson 50: Becoming a Complete Investor
    50: [
      {
        title: "Integrating Everything You've Learned",
        content: "Successful investing combines knowledge, strategy, and psychology. Foundation: Understand risk/return, compounding, diversification. Strategy: Asset allocation, tax efficiency, cost minimization. Psychology: Patience, discipline, emotional control. Continuous improvement: Learn from mistakes, stay curious. The complete investor integrates all elements into a cohesive, personalized approach. Your investment journey is unique—build a system that works for you.",
        quiz: {
          question: "What are the three pillars of successful investing?",
          options: [
            "Stocks, bonds, cash",
            "Knowledge, strategy, psychology",
            "Buying, selling, holding",
            "Analysis, trading, timing"
          ],
          correctAnswer: 1,
          explanation: "Successful investing requires knowledge (understanding), strategy (approach), and psychology (discipline)."
        }
      },
      {
        title: "Creating Your Investment Philosophy",
        content: "Every great investor develops a personal philosophy. Questions to answer: What is your purpose for investing? What risks are you willing to take? What time horizon guides your decisions? How do you define success? What strategies align with your personality? Write your investment philosophy—1-2 pages max. Review and refine annually. Your philosophy is your anchor during market storms.",
      },
      {
        title: "Building Your Support System",
        content: "Investing doesn't have to be solitary. Consider: Fee-only fiduciary advisors for complex situations. Investment communities for learning and accountability. Books and podcasts from trusted sources. Mentors who've achieved what you seek. Be careful: Avoid sources with conflicts of interest. Tune out noise; seek signal. Your support system should reinforce good behavior, not encourage speculation.",
        quiz: {
          question: "What type of financial advisor is generally recommended?",
          options: [
            "Commission-based brokers",
            "Fee-only fiduciary advisors",
            "Bank tellers",
            "Insurance salespeople"
          ],
          correctAnswer: 1,
          explanation: "Fee-only fiduciary advisors are legally required to act in your best interest without commission conflicts."
        }
      },
      {
        title: "Your Lifetime Investment Journey",
        content: "You've completed this curriculum—congratulations! But learning never stops. Markets evolve, strategies improve, your situation changes. Key principles endure: Start early, stay consistent, keep costs low, diversify, stay disciplined. Review your portfolio annually. Adjust as life changes. Teach others what you've learned. The best investors are perpetual students. Your journey continues—invest wisely, live fully, and build the financial future you deserve.",
      },
    ],
  };

  return lessonContents[lessonOrderIndex] || [];
};
        content: "Dividend yield: Higher isn't always better—may signal trouble. Payout ratio: Dividends as percentage of earnings (under 60% is sustainable). Dividend growth rate: Look for consistent annual increases. Free cash flow: Must support dividend payments. Debt levels: Excessive debt threatens dividend safety.",
      },
      {
        title: "Building a Dividend Portfolio",
        content: "Diversify across sectors to avoid concentration risk. Balance high-yield with dividend growth stocks. Reinvest dividends for compounding (DRIP programs). Consider tax implications—dividends taxed as income. Use dividend ETFs (VYM, SCHD) for instant diversification. Focus on total return, not just yield.",
      },
    ],
  };

  return lessonContents[lessonOrderIndex] || [];
};
