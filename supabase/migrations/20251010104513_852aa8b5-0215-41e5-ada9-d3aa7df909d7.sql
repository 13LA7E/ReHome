-- Create a secure function that returns partners with field-level access control
CREATE OR REPLACE FUNCTION public.get_partners_safe()
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  verified BOOLEAN,
  rating NUMERIC,
  created_at TIMESTAMPTZ,
  -- Sensitive fields only for admins
  phone TEXT,
  email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    -- Admins get full access including contact info
    RETURN QUERY
    SELECT 
      p.id,
      p.name,
      p.type,
      p.address,
      p.latitude,
      p.longitude,
      p.verified,
      p.rating,
      p.created_at,
      p.phone,
      p.email
    FROM public.partners p
    WHERE p.verified = true OR has_role(auth.uid(), 'admin'::app_role)
    ORDER BY p.name;
  ELSE
    -- Regular authenticated users get limited info (no phone/email)
    RETURN QUERY
    SELECT 
      p.id,
      p.name,
      p.type,
      p.address,
      p.latitude,
      p.longitude,
      p.verified,
      p.rating,
      p.created_at,
      NULL::TEXT as phone,  -- Hide phone
      NULL::TEXT as email   -- Hide email
    FROM public.partners p
    WHERE p.verified = true
    ORDER BY p.name;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_partners_safe() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.get_partners_safe() IS 'Returns partners with field-level security: contact info only visible to admins';