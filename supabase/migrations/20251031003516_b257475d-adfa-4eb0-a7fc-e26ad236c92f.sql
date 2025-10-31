-- Create news cache table to store fetched news and reduce API calls
CREATE TABLE IF NOT EXISTS public.news_cache (
  id INTEGER PRIMARY KEY DEFAULT 1,
  news_items JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_cache_updated_at ON public.news_cache(updated_at);

-- Insert initial row
INSERT INTO public.news_cache (id, news_items, updated_at)
VALUES (1, '[]'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;