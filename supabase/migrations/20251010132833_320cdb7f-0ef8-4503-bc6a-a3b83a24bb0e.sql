-- Allow anonymous users to read redemptions by QR code for verification
CREATE POLICY "Allow verification by QR code"
ON public.redemptions
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anonymous users to update redemption status during verification
CREATE POLICY "Allow status update during verification"
ON public.redemptions
FOR UPDATE
TO anon, authenticated
USING (status = 'pending')
WITH CHECK (status = 'completed');

-- Drop the overly restrictive anonymous deny policy
DROP POLICY IF EXISTS "Deny anonymous access to redemptions" ON public.redemptions;