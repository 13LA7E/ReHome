-- =====================================================
-- GRANT ADMIN ACCESS + INFINITE POINTS
-- =====================================================
-- ⚠️ IMPORTANT: Sign up FIRST at https://13la7e.github.io/ReHome/#/auth
-- Then run this SQL to grant admin role + infinite points
-- =====================================================

-- First, let's check which users exist
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- =====================================================
-- Now grant admin to the MOST RECENT user (your account)
-- =====================================================

DO $$
DECLARE
  admin_user_id UUID;
  user_email TEXT;
BEGIN
  -- Get the MOST RECENTLY created user (that's you!)
  SELECT id, email INTO admin_user_id, user_email
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found. Please sign up at https://13la7e.github.io/ReHome/#/auth first!';
  END IF;
  
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Granting admin to: %', user_email;
  RAISE NOTICE '================================================';
  
  -- Grant admin role (check if already exists first)
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = admin_user_id AND role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin');
    RAISE NOTICE '✅ Admin role granted!';
  ELSE
    RAISE NOTICE '✅ Already has admin role!';
  END IF;
  
  -- Update profile
  UPDATE public.profiles
  SET username = 'admin',
      full_name = 'ReHome Admin'
  WHERE id = admin_user_id;
  RAISE NOTICE '✅ Profile updated!';
  
  -- Give INFINITE POINTS and stats
  UPDATE public.impact_metrics
  SET
    total_items = 999999,
    waste_diverted_kg = 999999.99,
    co2_saved_kg = 999999.99,
    lives_impacted = 999999,
    community_points = 999999999  -- 999 MILLION POINTS!
  WHERE user_id = admin_user_id;
  RAISE NOTICE '✅ Infinite points granted! (999,999,999)';
  
  -- Update referral code
  UPDATE public.referrals
  SET referral_code = 'ADMIN2025',
      status = 'completed'
  WHERE referrer_id = admin_user_id;
  RAISE NOTICE '✅ Referral code updated!';
  
  -- Send welcome notification
  PERFORM public.create_notification(
    admin_user_id,
    '👑 Admin Access Granted!',
    'You now have admin privileges with 999,999,999 points!',
    'success',
    '/admin'
  );
  RAISE NOTICE '✅ Notification sent!';
  
  RAISE NOTICE '';
  RAISE NOTICE '================================================';
  RAISE NOTICE '🎉 SUCCESS! Admin setup complete!';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Email: %', user_email;
  RAISE NOTICE 'Role: Admin';
  RAISE NOTICE 'Points: 999,999,999';
  RAISE NOTICE '';
  RAISE NOTICE 'You can now:';
  RAISE NOTICE '  • Access /admin dashboard';
  RAISE NOTICE '  • Manage blog posts';
  RAISE NOTICE '  • Approve testimonials';
  RAISE NOTICE '  • Send notifications';
  RAISE NOTICE '  • Redeem unlimited rewards';
  RAISE NOTICE '';
  RAISE NOTICE 'Login at: https://13la7e.github.io/ReHome/#/auth';
  RAISE NOTICE '================================================';
END $$;

-- =====================================================
-- VERIFY ADMIN SETUP
-- =====================================================

SELECT 
  u.email,
  p.username,
  p.full_name,
  ur.role,
  im.community_points as points,
  im.total_items,
  im.co2_saved_kg
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.impact_metrics im ON im.user_id = u.id
WHERE ur.role = 'admin'
ORDER BY u.created_at DESC
LIMIT 1;
