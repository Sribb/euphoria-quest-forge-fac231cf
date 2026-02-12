
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Euphoria User')
  );
  
  -- Check if signup metadata indicates educator role
  IF NEW.raw_user_meta_data->>'signup_role' = 'educator' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'educator');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  INSERT INTO public.streaks (user_id, current_streak, longest_streak, last_login_date)
  VALUES (NEW.id, 0, 0, CURRENT_DATE);
  
  INSERT INTO public.portfolios (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;
