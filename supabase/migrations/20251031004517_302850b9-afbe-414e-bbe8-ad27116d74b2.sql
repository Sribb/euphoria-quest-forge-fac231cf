-- Create news cache table for storing API responses
CREATE TABLE IF NOT EXISTS public.news_cache (
  id INTEGER PRIMARY KEY DEFAULT 1,
  news_data JSONB NOT NULL,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_cache_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

-- Add constraint to ensure only one row
CREATE UNIQUE INDEX IF NOT EXISTS news_cache_single_row_idx ON public.news_cache (id);