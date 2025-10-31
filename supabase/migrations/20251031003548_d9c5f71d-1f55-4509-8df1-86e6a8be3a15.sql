-- Enable RLS on news_cache table
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

-- Since this table is only accessed by edge functions with service role key,
-- we don't need public policies. Edge functions bypass RLS with service role.