-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Keep the existing insert and update policies (they are already secure)
-- Users can insert own profile: WITH CHECK (auth.uid() = id)
-- Users can update own profile: USING (auth.uid() = id)