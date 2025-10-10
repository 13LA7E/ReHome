-- Add explicit deny policy for anonymous access to profiles table
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- Add explicit deny policy for anonymous access to redemptions table
CREATE POLICY "Deny anonymous access to redemptions"
ON public.redemptions
FOR ALL
TO anon
USING (false);

-- Add explicit deny policy for anonymous access to partners table
CREATE POLICY "Deny anonymous access to partners"
ON public.partners
FOR ALL
TO anon
USING (false);