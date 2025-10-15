-- Create stocks table for individual stock pages
CREATE TABLE IF NOT EXISTS public.stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  exchange TEXT NOT NULL,
  sector TEXT,
  industry TEXT,
  market_cap BIGINT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

-- Anyone can view stocks (public data)
CREATE POLICY "Anyone can view stocks"
ON public.stocks
FOR SELECT
TO authenticated
USING (true);

-- Insert popular stocks
INSERT INTO public.stocks (symbol, name, exchange, sector, industry, description) VALUES
('AAPL', 'Apple Inc.', 'NASDAQ', 'Technology', 'Consumer Electronics', 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'),
('MSFT', 'Microsoft Corporation', 'NASDAQ', 'Technology', 'Software', 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.'),
('GOOGL', 'Alphabet Inc.', 'NASDAQ', 'Technology', 'Internet Content & Information', 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.'),
('AMZN', 'Amazon.com Inc.', 'NASDAQ', 'Consumer Cyclical', 'Internet Retail', 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.'),
('TSLA', 'Tesla Inc.', 'NASDAQ', 'Consumer Cyclical', 'Auto Manufacturers', 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.'),
('META', 'Meta Platforms Inc.', 'NASDAQ', 'Technology', 'Internet Content & Information', 'Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables.'),
('NVDA', 'NVIDIA Corporation', 'NASDAQ', 'Technology', 'Semiconductors', 'NVIDIA Corporation operates as a visual computing company worldwide.'),
('JPM', 'JPMorgan Chase & Co.', 'NYSE', 'Financial', 'Banks', 'JPMorgan Chase & Co. operates as a financial services company worldwide.'),
('V', 'Visa Inc.', 'NYSE', 'Financial', 'Credit Services', 'Visa Inc. operates as a payments technology company worldwide.'),
('WMT', 'Walmart Inc.', 'NYSE', 'Consumer Defensive', 'Discount Stores', 'Walmart Inc. engages in the operation of retail, wholesale, and other units worldwide.'),
('DIS', 'Walt Disney Company', 'NYSE', 'Communication Services', 'Entertainment', 'The Walt Disney Company operates as an entertainment company worldwide.'),
('NFLX', 'Netflix Inc.', 'NASDAQ', 'Communication Services', 'Entertainment', 'Netflix, Inc. provides entertainment services.'),
('BAC', 'Bank of America Corp', 'NYSE', 'Financial', 'Banks', 'Bank of America Corporation operates as a financial institution worldwide.'),
('JNJ', 'Johnson & Johnson', 'NYSE', 'Healthcare', 'Drug Manufacturers', 'Johnson & Johnson researches and develops, manufactures, and sells various products in the healthcare field worldwide.'),
('PG', 'Procter & Gamble Co', 'NYSE', 'Consumer Defensive', 'Household & Personal Products', 'The Procter & Gamble Company provides branded consumer packaged goods to consumers in North and Latin America, Europe, the Asia Pacific, Greater China, India, the Middle East, and Africa.')
ON CONFLICT (symbol) DO NOTHING;