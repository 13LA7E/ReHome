-- =====================================================
-- GRANT ADMIN ACCESS + INFINITE POINTS
-- =====================================================
-- Run AFTER signing up with admin@rehome.app
-- https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/sql
-- =====================================================

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find the admin user
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@rehome.app';
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User admin@rehome.app not found. Please sign up at https://13la7e.github.io/ReHome/#/auth first!';
  END IF;
  
  -- Grant admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Update profile
  UPDATE public.profiles
  SET username = 'admin',
      full_name = 'ReHome Admin'
  WHERE id = admin_user_id;
  
  -- Give INFINITE POINTS and stats
  UPDATE public.impact_metrics
  SET
    total_items = 999999,
    waste_diverted_kg = 999999.99,
    co2_saved_kg = 999999.99,
    lives_impacted = 999999,
    community_points = 999999999  -- 999 MILLION POINTS!
  WHERE user_id = admin_user_id;
  
  -- Update referral code
  UPDATE public.referrals
  SET referral_code = 'ADMIN2025',
      status = 'completed'
  WHERE referrer_id = admin_user_id;
  
  -- Send welcome notification
  PERFORM public.create_notification(
    admin_user_id,
    '👑 Admin Access Granted!',
    'You now have admin privileges with 999,999,999 points!',
    'success',
    '/admin'
  );
  
  RAISE NOTICE '✅ SUCCESS! Admin access granted!';
  RAISE NOTICE 'User ID: %', admin_user_id;
  RAISE NOTICE 'Username: admin';
  RAISE NOTICE 'Points: 999,999,999';
  RAISE NOTICE 'Role: Admin';
  RAISE NOTICE '';
  RAISE NOTICE 'Login at: https://13la7e.github.io/ReHome/#/auth';
  RAISE NOTICE 'Email: admin@rehome.app';
  RAISE NOTICE 'Password: ReHome@Admin2025';
END $$;

-- Verify admin setup
SELECT 
  p.username,
  p.full_name,
  ur.role,
  im.community_points as points,
  im.total_items
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
LEFT JOIN public.impact_metrics im ON im.user_id = p.id
WHERE p.username = 'admin';
