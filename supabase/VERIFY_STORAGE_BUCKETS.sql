-- =====================================================
-- VERIFY STORAGE BUCKETS EXIST
-- =====================================================
-- Run this to check if avatars and item-images buckets exist
-- https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/sql
-- =====================================================

-- Check if buckets exist
SELECT id, name, public, created_at
FROM storage.buckets
ORDER BY created_at DESC;

-- Check storage policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- If avatars bucket doesn't exist, create it:
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- =====================================================
-- If item-images bucket doesn't exist, create it:
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'item-images',
  'item-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- =====================================================
-- Create/Update storage policies for avatars
-- =====================================================

-- Anyone can view avatars
CREATE POLICY IF NOT EXISTS "Anyone can view avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Authenticated users can upload avatars
CREATE POLICY IF NOT EXISTS "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

-- Users can update own avatars
CREATE POLICY IF NOT EXISTS "Users can update own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can delete own avatars
CREATE POLICY IF NOT EXISTS "Users can delete own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- =====================================================
-- Create/Update storage policies for item-images
-- =====================================================

-- Anyone can view item images
CREATE POLICY IF NOT EXISTS "Anyone can view item images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'item-images');

-- Authenticated users can upload item images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload item images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'item-images');

-- Users can update own item images
CREATE POLICY IF NOT EXISTS "Users can update own item images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'item-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Users can delete own item images
CREATE POLICY IF NOT EXISTS "Users can delete own item images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'item-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- =====================================================
-- VERIFY AGAIN
-- =====================================================

SELECT 
  'Buckets' as check_type,
  COUNT(*) as count,
  STRING_AGG(name, ', ') as items
FROM storage.buckets
WHERE id IN ('avatars', 'item-images')

UNION ALL

SELECT 
  'Policies' as check_type,
  COUNT(*) as count,
  STRING_AGG(policyname, ', ') as items
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND (
  policyname LIKE '%avatar%'
  OR policyname LIKE '%item%'
);

-- =====================================================
-- Expected Results:
-- =====================================================
-- Buckets: 2 (avatars, item-images)
-- Policies: 8 (4 for avatars, 4 for item-images)
-- =====================================================
