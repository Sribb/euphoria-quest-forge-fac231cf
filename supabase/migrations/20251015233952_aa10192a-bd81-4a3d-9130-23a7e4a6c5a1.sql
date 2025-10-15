-- Fix Community: Allow users to view other users' display names and avatars
-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies that allow viewing public profile info
CREATE POLICY "Users can view all profiles public info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can still only update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);