
-- Add pathway column to lessons table
ALTER TABLE public.lessons ADD COLUMN pathway text DEFAULT 'investing';

-- Assign pathways based on order_index
-- Personal Finance: retirement, estate, budgeting, passive income, financial independence
UPDATE public.lessons SET pathway = 'personal_finance' WHERE order_index IN (11, 28, 29, 44, 48, 49);

-- Corporate Finance: financial statements, annual reports, valuation, earnings, IPOs
UPDATE public.lessons SET pathway = 'corporate_finance' WHERE order_index IN (8, 30, 31, 32, 33);

-- Trading & Technical Analysis: technical analysis, psychology, indicators, margin, short selling, momentum, algo
UPDATE public.lessons SET pathway = 'trading' WHERE order_index IN (13, 14, 21, 23, 25, 36, 42, 45);

-- Alternative Assets: crypto, REITs, international, alternatives, ESG, factor investing, commodities
UPDATE public.lessons SET pathway = 'alternatives' WHERE order_index IN (19, 22, 27, 39, 40, 41);
