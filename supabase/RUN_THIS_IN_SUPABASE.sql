-- =====================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- This adds username and avatar support to your ReHome app
-- Copy and paste this entire file into Supabase SQL Editor and click RUN

-- Step 1: Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Step 2: Add avatar_url column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Step 3: Add constraint to ensure username is lowercase and alphanumeric with underscores
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'username_format'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$');
  END IF;
END $$;

-- Step 4: Add comments
COMMENT ON COLUMN public.profiles.username IS 'Unique username for the user, lowercase alphanumeric with underscores only';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user avatar image';

-- Step 5: Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'username', NULL),
    COALESCE(new.raw_user_meta_data->>'avatar_url', NULL)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  INSERT INTO public.impact_metrics (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;

-- =====================================================
-- IMPORTANT: After running this, you need to manually create
-- the 'avatars' storage bucket in Supabase Dashboard:
-- 
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: avatars
-- 4. Public bucket: YES (checked)
-- 5. File size limit: 5MB
-- 6. Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- 7. Click "Create bucket"
-- 8. Click on the avatars bucket → Policies
-- 9. Create these policies using the "New Policy" button:
--
--    Policy 1: "Anyone can view avatars"
--    - Allowed operation: SELECT
--    - Target roles: public
--    - Policy definition: bucket_id = 'avatars'
--
--    Policy 2: "Authenticated users can upload"
--    - Allowed operation: INSERT
--    - Target roles: authenticated
--    - Policy definition: bucket_id = 'avatars'
--
--    Policy 3: "Users can update own avatars"
--    - Allowed operation: UPDATE
--    - Target roles: authenticated
--    - Policy definition: bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
--
--    Policy 4: "Users can delete own avatars"
--    - Allowed operation: DELETE
--    - Target roles: authenticated
--    - Policy definition: bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
--
-- =====================================================

-- Verification query - run this after to check everything worked:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public';
