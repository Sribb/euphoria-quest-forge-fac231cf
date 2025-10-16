-- Insert comprehensive investing lessons based on proven principles
-- Delete existing lessons if any
DELETE FROM lessons;

-- Reset sequences
ALTER SEQUENCE IF EXISTS lessons_order_index_seq RESTART WITH 1;

-- Insert 12 sequential lessons based on verified investing principles
INSERT INTO lessons (title, description, content, difficulty, duration_minutes, order_index, is_locked) VALUES
(
  'Introduction to Investing: The Foundation',
  'Learn the fundamental concepts of investing and why it matters for your financial future',
  'Based on principles from "The Intelligent Investor" by Benjamin Graham and Federal Reserve educational resources. Understanding investing is the first step toward financial independence. This lesson covers: What is investing? The difference between saving and investing. The power of compound interest. Why time in the market beats timing the market. Real-world examples of long-term wealth building.',
  'beginner',
  15,
  1,
  false
),
(
  'Risk vs. Reward: Understanding the Trade-Off',
  'Master the fundamental relationship between risk and potential returns in investing',
  'Based on Modern Portfolio Theory and Ray Dalio''s "Principles". Every investment involves risk. Higher potential returns typically come with higher risk. This lesson teaches: Risk tolerance assessment. The risk-return spectrum. Diversification as risk management. How to balance risk with your goals. Real examples of risk-adjusted returns.',
  'beginner',
  20,
  2,
  true
),
(
  'The Magic of Compound Interest',
  'Discover Einstein''s "eighth wonder of the world" and how it builds wealth over time',
  'Warren Buffett''s wealth came not from finding the best stocks, but from compounding over 80+ years. This lesson covers: The mathematics of compounding. $10,000 at 10% returns: 10 years = $25,937, 20 years = $67,275, 30 years = $174,494. Starting early vs. starting late. The rule of 72. Real Buffett examples of 50+ year holdings.',
  'beginner',
  18,
  3,
  true
),
(
  'Stocks vs. Bonds: Building Your Asset Mix',
  'Learn the characteristics of major asset classes and how to allocate your portfolio',
  'Based on Investopedia modules and Jack Bogle''s "Common Sense on Mutual Funds". Understanding asset classes is crucial for portfolio construction. This lesson teaches: Stocks (equity ownership). Bonds (debt instruments). Asset allocation strategies. Age-based allocation rules. Rebalancing your portfolio.',
  'beginner',
  22,
  4,
  true
),
(
  'Diversification: Don''t Put All Eggs in One Basket',
  'Learn how proper diversification reduces risk while maintaining returns',
  'Based on Modern Portfolio Theory and Peter Lynch''s "One Up on Wall Street". Diversification is your insurance policy. This lesson covers: Why diversification works. Across asset classes, sectors, and geographies. Over-diversification dangers. Building a diversified portfolio. Real-world diversification examples.',
  'intermediate',
  20,
  5,
  true
),
(
  'Market Psychology: Fear and Greed',
  'Understand investor emotions and how to profit from market inefficiencies',
  'Based on Warren Buffett''s principle: "Be fearful when others are greedy, and greedy when others are fearful." This lesson teaches: The psychology of market cycles. Fear-driven selloffs create opportunities. Greed-driven bubbles create danger. The 2008 crisis as a case study. Contrarian investing strategies.',
  'intermediate',
  25,
  6,
  true
),
(
  'Value Investing: Price vs. Intrinsic Value',
  'Master Benjamin Graham and Warren Buffett''s approach to finding undervalued companies',
  'Based on "The Intelligent Investor" and "Security Analysis" by Benjamin Graham. Value investing is buying a dollar for 50 cents. This lesson covers: Market price vs. intrinsic value. Margin of safety concept. Fundamental analysis basics. Quality businesses at discount prices. Value investing success stories.',
  'intermediate',
  28,
  7,
  true
),
(
  'Fundamental Analysis: Reading the Numbers',
  'Learn to analyze financial statements and identify quality companies',
  'Based on CFA Institute standards and Peter Lynch''s investment philosophy. Numbers tell the truth. This lesson teaches: The three key financial statements. Return on Equity (ROE) and why 15%+ matters. Debt-to-Equity ratios. Free cash flow generation. Profit margin trends. Management quality assessment.',
  'intermediate',
  30,
  8,
  true
),
(
  'Competitive Advantages: Economic Moats',
  'Discover how to identify companies with sustainable competitive advantages',
  'Based on Warren Buffett''s "moat" concept and Michael Porter''s competitive strategy. A moat protects a castle; an economic moat protects profits. This lesson covers: Brand power (Coca-Cola, Apple). Network effects (Visa, Facebook). Cost advantages (Walmart). Switching costs (Microsoft). Intangible assets (patents). How moats compound value over decades.',
  'advanced',
  25,
  9,
  true
),
(
  'Portfolio Management: Building Your Strategy',
  'Learn how to construct and manage a portfolio aligned with your goals',
  'Based on Ray Dalio''s "All Weather Portfolio" and institutional investment practices. A portfolio is more than a collection of stocks. This lesson teaches: Strategic asset allocation. Tactical adjustments. Rebalancing strategies. Tax-efficient investing. Portfolio monitoring and review. Dollar-cost averaging.',
  'advanced',
  30,
  10,
  true
),
(
  'Long-Term Wealth Building: The 30-Year Plan',
  'Develop a comprehensive strategy for building lasting wealth through patient investing',
  'Based on Warren Buffett''s favorite holding period: "Forever." This lesson covers: The power of long-term thinking. Ignoring short-term noise. Avoiding common investor mistakes. Tax advantages of long-term holdings. Estate planning basics. Building generational wealth.',
  'advanced',
  25,
  11,
  true
),
(
  'Putting It All Together: Your Investment Checklist',
  'Create your personal investment framework using lessons from legendary investors',
  'Based on Charlie Munger''s mental models and Warren Buffett''s investment checklist. Before buying any investment, use a systematic approach. This lesson teaches: Building your investment checklist. Business understanding test. Moat identification. Financial health assessment. Management evaluation. Valuation analysis. The final decision framework.',
  'advanced',
  35,
  12,
  true
);

-- Add check to ensure lesson unlocking logic
COMMENT ON TABLE lessons IS 'Lessons unlock sequentially - next lesson unlocks when previous is completed';