-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Add avatar_url column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add constraint to ensure username is lowercase and alphanumeric with underscores
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'username_format'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$');
  END IF;
END $$;

-- Add comments
COMMENT ON COLUMN public.profiles.username IS 'Unique username for the user, lowercase alphanumeric with underscores only';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL to user avatar image';

-- Update the handle_new_user function to include username and avatar
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

-- Create storage bucket for avatars if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Storage policies for avatars
DO $$
BEGIN
  -- Anyone can view avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Anyone can view avatars'
  ) THEN
    CREATE POLICY "Anyone can view avatars"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'avatars');
  END IF;

  -- Authenticated users can upload avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload avatars'
  ) THEN
    CREATE POLICY "Authenticated users can upload avatars"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
      );
  END IF;

  -- Users can update own avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update own avatars'
  ) THEN
    CREATE POLICY "Users can update own avatars"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  -- Users can delete own avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete own avatars'
  ) THEN
    CREATE POLICY "Users can delete own avatars"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;
