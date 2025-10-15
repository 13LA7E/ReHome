-- =====================================================
-- CREATE ADMIN ACCOUNT WITH INFINITE POINTS
-- =====================================================
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/sql
-- =====================================================

-- Admin Account Credentials:
-- Email: admin@rehome.app
-- Password: ReHome@Admin2025
-- Points: 999,999,999 (basically infinite)

-- Step 1: Create the auth user (this creates the account)
-- Note: You'll need to confirm the email or disable email confirmation

-- First, let's check if user already exists and delete if needed
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@rehome.app';
  
  IF admin_user_id IS NOT NULL THEN
    -- Delete existing admin user and all related data
    DELETE FROM auth.users WHERE id = admin_user_id;
    RAISE NOTICE 'Deleted existing admin user';
  END IF;
END $$;

-- Step 2: Insert admin user directly into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@rehome.app',
  crypt('ReHome@Admin2025', gen_salt('bf')), -- Password hashed with bcrypt
  NOW(), -- Email confirmed immediately
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"ReHome Admin","username":"admin"}',
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  FALSE,
  NULL
)
RETURNING id;

-- Step 3: Get the admin user ID for next steps
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@rehome.app';
  
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, username, avatar_url)
  VALUES (
    admin_user_id,
    'admin@rehome.app',
    'ReHome Admin',
    'admin',
    NULL
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = 'admin@rehome.app',
    full_name = 'ReHome Admin',
    username = 'admin';
  
  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Create impact metrics with INFINITE POINTS
  INSERT INTO public.impact_metrics (
    user_id,
    total_items,
    waste_diverted_kg,
    co2_saved_kg,
    lives_impacted,
    community_points
  )
  VALUES (
    admin_user_id,
    999999,        -- 999,999 items donated
    999999.99,     -- 999,999 kg waste diverted
    999999.99,     -- 999,999 kg CO2 saved
    999999,        -- 999,999 lives impacted
    999999999      -- 999,999,999 POINTS (basically infinite!)
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    total_items = 999999,
    waste_diverted_kg = 999999.99,
    co2_saved_kg = 999999.99,
    lives_impacted = 999999,
    community_points = 999999999;
  
  -- Create referral code
  INSERT INTO public.referrals (referrer_id, referral_code, status)
  VALUES (admin_user_id, 'ADMIN2025', 'completed')
  ON CONFLICT (referral_code) DO NOTHING;
  
  -- Send welcome notification
  PERFORM public.create_notification(
    admin_user_id,
    '👑 Welcome Admin!',
    'You have been granted admin access with unlimited points!',
    'success',
    '/admin'
  );
  
  RAISE NOTICE 'Admin account created successfully!';
  RAISE NOTICE 'User ID: %', admin_user_id;
  RAISE NOTICE 'Email: admin@rehome.app';
  RAISE NOTICE 'Password: ReHome@Admin2025';
  RAISE NOTICE 'Points: 999,999,999';
END $$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if admin account was created
SELECT 
  u.id,
  u.email,
  p.full_name,
  p.username,
  ur.role,
  im.community_points,
  im.total_items
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.impact_metrics im ON im.user_id = u.id
WHERE u.email = 'admin@rehome.app';

-- =====================================================
-- ADMIN CREDENTIALS
-- =====================================================
-- 
-- Email: admin@rehome.app
-- Password: ReHome@Admin2025
-- Points: 999,999,999
-- Role: Admin
-- 
-- Login at: https://13la7e.github.io/ReHome/#/auth
-- 
-- After logging in, you can:
-- ✅ Access /admin dashboard
-- ✅ Manage blog posts
-- ✅ Approve testimonials
-- ✅ Send notifications to users
-- ✅ View all user stats
-- ✅ Redeem unlimited rewards (you have infinite points!)
-- 
-- =====================================================
