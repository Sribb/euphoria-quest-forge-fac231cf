-- Fix search_path for calculate_level_from_xp function
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(xp integer)
RETURNS integer
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT level FROM public.xp_level_thresholds 
     WHERE xp_required <= xp 
     ORDER BY level DESC 
     LIMIT 1),
    1
  );
$$;