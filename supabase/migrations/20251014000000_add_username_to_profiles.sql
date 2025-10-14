-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE;

-- Add constraint to ensure username is lowercase and alphanumeric with underscores
ALTER TABLE public.profiles
ADD CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$');

-- Add comment
COMMENT ON COLUMN public.profiles.username IS 'Unique username for the user, lowercase alphanumeric with underscores only';

-- Update the handle_new_user function to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'username', NULL)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  INSERT INTO public.impact_metrics (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;
