
-- Update investing pathway lessons to match the official lesson plan PDF
UPDATE lessons SET 
  title = 'Introduction to Investing',
  description = 'Understand the difference between saving and investing, how money grows over time through different asset types, and why starting early with consistent contributions makes a huge difference in building long-term wealth.'
WHERE pathway = 'investing' AND order_index = 1;

UPDATE lessons SET 
  title = 'Risk vs. Reward',
  description = 'Learn why investments with higher potential returns come with greater risk, how volatility and stability affect outcomes, and why personal goals and comfort levels should guide how much risk you take.'
WHERE pathway = 'investing' AND order_index = 2;

UPDATE lessons SET 
  title = 'The Magic of Compound Interest',
  description = 'Discover how investments grow exponentially when earnings are reinvested, how compound interest differs from simple interest, and why time is the most powerful factor in investing.'
WHERE pathway = 'investing' AND order_index = 3;

UPDATE lessons SET 
  title = 'Stocks vs. Bonds',
  description = 'Compare the two most common investment types — stocks offering higher growth with more volatility, and bonds providing fixed income with greater stability — and learn how mixing them creates balance.'
WHERE pathway = 'investing' AND order_index = 4;

UPDATE lessons SET 
  title = 'Diversification',
  description = 'Learn how spreading investments across asset classes, industries, and regions reduces risk and improves stability, and why index funds and ETFs help achieve broad exposure.'
WHERE pathway = 'investing' AND order_index = 5;

UPDATE lessons SET 
  title = 'Market Psychology: Fear & Greed',
  description = 'Understand how emotions like fear and greed influence investing decisions, recognize herd mentality and behavioral biases, and learn that emotional discipline leads to better long-term outcomes.'
WHERE pathway = 'investing' AND order_index = 6;

UPDATE lessons SET 
  title = 'Value Investing: Price vs. Intrinsic Value',
  description = 'Learn to identify investments priced below their true worth using intrinsic value analysis, the margin of safety concept, and patient long-term thinking.'
WHERE pathway = 'investing' AND order_index = 7;

UPDATE lessons SET 
  title = 'Fundamental Analysis: Reading the Numbers',
  description = 'Master balance sheets, income statements, and cash flow statements along with key metrics like P/E ratio and return on equity to evaluate a company''s financial health.'
WHERE pathway = 'investing' AND order_index = 8;

UPDATE lessons SET 
  title = 'Economic Moats: Competitive Advantages',
  description = 'Understand why some companies consistently outperform others by identifying economic moats like strong brands, patents, network effects, and high barriers to entry.'
WHERE pathway = 'investing' AND order_index = 9;

UPDATE lessons SET 
  title = 'Portfolio Management: Building Your Strategy',
  description = 'Learn how to combine individual investments into a coherent plan using asset allocation, diversification, and risk balancing to maximize returns while controlling risk.'
WHERE pathway = 'investing' AND order_index = 10;

UPDATE lessons SET 
  title = 'Long-Term Wealth Building: The 30-Year Plan',
  description = 'Create a realistic strategy for long-term financial success emphasizing compounding, growth-focused assets, consistent contributions, and retirement planning.'
WHERE pathway = 'investing' AND order_index = 11;

UPDATE lessons SET 
  title = 'Your Investment Checklist',
  description = 'Bring together all core investing concepts into a structured investment process covering diversification, risk management, fundamental analysis, and portfolio monitoring.'
WHERE pathway = 'investing' AND order_index = 12;

UPDATE lessons SET 
  title = 'Technical Analysis Fundamentals',
  description = 'Learn to read price charts using candlestick patterns, support and resistance levels, and trend lines to identify potential entry and exit points.'
WHERE pathway = 'investing' AND order_index = 13;

UPDATE lessons SET 
  title = 'Investment Psychology',
  description = 'Explore how emotions and cognitive biases like fear, greed, overconfidence, and anchoring affect investment behavior and learn to prevent impulsive decisions.'
WHERE pathway = 'investing' AND order_index = 14;

UPDATE lessons SET 
  title = 'Options Trading Fundamentals',
  description = 'Understand calls, puts, basic strategies, and the unique risk-reward profiles of options as tools for hedging risk or increasing returns.'
WHERE pathway = 'investing' AND order_index = 15;

UPDATE lessons SET 
  title = 'ETFs & Index Funds',
  description = 'Learn how ETFs and index funds offer low-cost diversification, reduce individual stock risk, and why passive investing is a reliable approach for long-term growth.'
WHERE pathway = 'investing' AND order_index = 16;

UPDATE lessons SET 
  title = 'Bonds & Fixed Income',
  description = 'Understand income-focused investing, the differences between government and corporate bonds, how yields work, and why duration and interest rates affect bond prices.'
WHERE pathway = 'investing' AND order_index = 17;

UPDATE lessons SET 
  title = 'Market Cycles & Timing',
  description = 'Recognize that markets move in repeating phases — expansion, peak, recession, recovery — and learn how different sectors perform in each phase.'
WHERE pathway = 'investing' AND order_index = 18;

UPDATE lessons SET 
  title = 'Cryptocurrency Basics',
  description = 'Explore digital assets and blockchain technology including Bitcoin and Ethereum, their use cases, high volatility risks, and the importance of strict position sizing.'
WHERE pathway = 'investing' AND order_index = 19;

UPDATE lessons SET 
  title = 'Dividend Investing',
  description = 'Learn how stocks generate income through dividends, understand dividend yield and payout ratios, and see how reinvested dividends compound returns over time.'
WHERE pathway = 'investing' AND order_index = 20;

UPDATE lessons SET 
  title = 'Technical Indicators Deep Dive',
  description = 'Apply advanced charting tools like RSI, MACD, moving averages, and momentum indicators to support timing decisions in different market conditions.'
WHERE pathway = 'investing' AND order_index = 21;

UPDATE lessons SET 
  title = 'REITs & Real Estate Investing',
  description = 'Gain real estate exposure through financial markets with REITs, understanding their income-focused structure, interest rate sensitivity, and liquidity advantages.'
WHERE pathway = 'investing' AND order_index = 22;

UPDATE lessons SET 
  title = 'Margin Trading & Leverage',
  description = 'Understand how borrowing to invest magnifies both gains and losses, learn about margin requirements and margin calls, and why leverage must be used cautiously.'
WHERE pathway = 'investing' AND order_index = 23;

UPDATE lessons SET 
  title = 'Building Your First Portfolio',
  description = 'Create a realistic investment portfolio focusing on asset selection, diversification, periodic rebalancing, and understanding that overall structure matters more than individual picks.'
WHERE pathway = 'investing' AND order_index = 24;

UPDATE lessons SET 
  title = 'Short Selling Basics',
  description = 'Learn strategies that profit from declining prices, how short selling works including borrowing shares and regulatory limits, and why it carries the risk of unlimited loss.'
WHERE pathway = 'investing' AND order_index = 25;
