-- Create AI Tips table
CREATE TABLE public.ai_tips (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tip_text text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_tips ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read tips
CREATE POLICY "Anyone can view AI tips"
ON public.ai_tips
FOR SELECT
USING (true);

-- Insert 20 diverse AI tips
INSERT INTO public.ai_tips (tip_text, category) VALUES
('Consider dollar-cost averaging into your positions rather than timing the market. This strategy reduces the impact of volatility and removes emotional decision-making.', 'strategy'),
('Diversification isn''t just about different stocks—spread across asset classes like bonds, real estate, and international markets.', 'diversification'),
('Before making any trade, ask yourself: What''s my exit strategy? Define both profit targets and stop-loss levels.', 'risk-management'),
('The best investors focus on time in the market, not timing the market. Consistency beats perfection.', 'mindset'),
('Review your portfolio quarterly, not daily. Frequent checking can lead to emotional, impulsive decisions.', 'discipline'),
('Consider tax-loss harvesting to offset capital gains. Strategic losses can reduce your tax burden significantly.', 'tax-strategy'),
('Options aren''t just for speculation—they can hedge existing positions and generate income through covered calls.', 'options'),
('Correlation matters: During market crashes, assets that normally move independently often fall together. True diversification is harder than it seems.', 'advanced'),
('Your biggest trading enemy is your own psychology. Document your trades and review them to identify emotional patterns.', 'psychology'),
('Compound interest is powerful, but compound learning is exponential. Master one strategy deeply before moving to the next.', 'learning'),
('Market volatility creates opportunities. While others panic, disciplined investors find bargains.', 'opportunity'),
('Rebalancing forces you to sell high and buy low automatically. Set a schedule and stick to it.', 'portfolio-management'),
('Leverage amplifies both gains and losses. Use it sparingly and only when you fully understand the risks.', 'leverage'),
('The safest portfolio isn''t the one with the lowest risk—it''s the one you can hold through a downturn without panic selling.', 'risk-tolerance'),
('Economic indicators lag behind market movements. By the time data confirms a trend, prices have already adjusted.', 'economics'),
('Sector rotation strategies can outperform buy-and-hold during volatile periods. Understand business cycles.', 'sector-analysis'),
('Your emergency fund should never be invested in volatile assets. Liquidity and safety first, returns second.', 'fundamentals'),
('Dividend aristocrats aren''t exciting, but they provide reliable income and often outperform during bear markets.', 'income-investing'),
('Learn to read earnings reports beyond the headline numbers. Guidance, margins, and cash flow tell the real story.', 'fundamental-analysis'),
('Backtesting reveals how strategies performed historically, but remember: past performance doesn''t guarantee future results. Market conditions evolve.', 'analysis');