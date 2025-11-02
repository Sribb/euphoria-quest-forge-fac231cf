-- Fix 1: Enable RLS on news_cache table
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

-- Read-only access for authenticated users
CREATE POLICY "Anyone can read news cache"
ON public.news_cache
FOR SELECT
TO authenticated
USING (true);

-- Only service role can modify (via edge functions)
-- No INSERT/UPDATE/DELETE policies for regular users


-- Fix 2: Add authorization check to increment_coins function
CREATE OR REPLACE FUNCTION public.increment_coins(user_id_param uuid, amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_balance integer;
BEGIN
  -- Authorization check: Only allow users to increment their own coins
  -- OR allow service role (edge functions) to increment any user's coins
  IF user_id_param != auth.uid() AND auth.jwt()->>'role' != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: Cannot increment coins for other users';
  END IF;
  
  UPDATE profiles
  SET coins = coins + amount
  WHERE id = user_id_param
  RETURNING coins INTO new_balance;
  
  RETURN new_balance;
END;
$$;


-- Fix 3: Add missing INSERT policies for transaction_logs (needed by orderService)
CREATE POLICY "Users can insert own transaction logs"
ON public.transaction_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


-- Fix 4: Add missing INSERT policies for settlements (needed by orderService)
CREATE POLICY "Users can create own settlements"
ON public.settlements
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


-- Fix 5: Add missing UPDATE policy for settlements (needed by process-settlements function)
CREATE POLICY "Users can update own settlements"
ON public.settlements
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);


-- Fix 6: Add missing INSERT/UPDATE policies for transactions (needed by edge functions)
CREATE POLICY "Service can insert transactions"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can update transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);