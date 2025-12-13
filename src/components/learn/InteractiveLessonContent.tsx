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
