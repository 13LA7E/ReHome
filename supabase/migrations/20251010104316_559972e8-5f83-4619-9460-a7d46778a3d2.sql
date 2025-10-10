-- Drop the overly permissive policy that allows everyone to view partner contact info
DROP POLICY IF EXISTS "Everyone can view verified partners" ON public.partners;

-- Create a secure policy that only allows authenticated users to view partners
CREATE POLICY "Authenticated users can view verified partners"
ON public.partners
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (verified = true OR has_role(auth.uid(), 'admin'::app_role))
);

-- Admin policy remains unchanged (already secure)
-- Admins can manage partners: USING (has_role(auth.uid(), 'admin'::app_role))