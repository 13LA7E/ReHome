-- Drop the overly permissive RLS policy that exposes contact info
DROP POLICY IF EXISTS "Authenticated users can view verified partners" ON public.partners;

-- Create a restricted policy that only allows admins to query the table directly
CREATE POLICY "Only admins can query partners table directly"
ON public.partners
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Grant execute permission on the safe function to all authenticated users
GRANT EXECUTE ON FUNCTION public.get_partners_safe() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.get_partners_safe() IS 'Safe function to retrieve partner information with field-level access control. Regular users get name, address, location, and rating only. Admins get full contact information including phone and email.';