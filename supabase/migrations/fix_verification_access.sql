-- Enable anonymous verification for redemptions
-- This allows partners to verify QR codes without authentication

-- Drop the restrictive anonymous policy for redemptions
DROP POLICY IF EXISTS "Deny anonymous access to redemptions" ON public.redemptions;

-- Create a policy that allows reading redemptions for verification
CREATE POLICY "Allow redemption verification"
ON public.redemptions FOR SELECT
TO anon
USING (true);

-- Allow anonymous updates only for completing redemptions (verification process)
CREATE POLICY "Allow redemption completion"
ON public.redemptions FOR UPDATE
TO anon
USING (status = 'pending')
WITH CHECK (status = 'completed');

-- Drop the restrictive policy for rewards if it exists  
DROP POLICY IF EXISTS "Deny anonymous access to rewards" ON public.rewards;

-- Allow anonymous access to read reward details for verification
CREATE POLICY "Allow anonymous reward reading for verification"
ON public.rewards FOR SELECT
TO anon
USING (active = true);

-- Ensure authenticated users can still manage their own redemptions
CREATE POLICY "Users can view own redemptions"
ON public.redemptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own redemptions"
ON public.redemptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);