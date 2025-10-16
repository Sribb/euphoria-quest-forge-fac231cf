-- Create atomic coin increment function to prevent race conditions
CREATE OR REPLACE FUNCTION increment_coins(
  user_id_param uuid,
  amount integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance integer;
BEGIN
  UPDATE profiles
  SET coins = coins + amount
  WHERE id = user_id_param
  RETURNING coins INTO new_balance;
  
  RETURN new_balance;
END;
$$;