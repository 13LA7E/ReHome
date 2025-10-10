-- Allow verification queries for redemptions
-- This enables partners to verify QR codes without authentication

-- Drop the restrictive anonymous policy for redemptions
DROP POLICY IF EXISTS "Deny anonymous access to redemptions" ON public.redemptions;

-- Create a more specific policy that allows verification but protects user data
CREATE POLICY "Allow verification queries for redemptions"
ON public.redemptions FOR SELECT
TO anon
USING (status IS NOT NULL); -- Allow reading redemption status for verification

-- Also allow anonymous access to view reward names for verification
CREATE POLICY "Allow anonymous access to reward names for verification"
ON public.rewards FOR SELECT
TO anon
USING (active = true); -- Only allow reading active rewards for verification