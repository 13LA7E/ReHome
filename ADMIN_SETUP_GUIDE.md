# 👑 Admin Account Creation Guide

## Quick Method: Use Supabase Dashboard

Since we can't create auth users directly via SQL (security limitation), here's the easiest way:

### Step 1: Sign Up Normally

1. Go to: **https://13la7e.github.io/ReHome/#/auth**
2. Click "Sign Up"
3. Use these credentials:
   - **Email**: `admin@rehome.app`
   - **Password**: `ReHome@Admin2025`
   - **Full Name**: `ReHome Admin`
4. Complete the sign-up

### Step 2: Grant Admin Role + Infinite Points

Once signed up, run this SQL in Supabase:

**Go to**: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/sql

**Copy and paste this**:

```sql
-- Get the user ID for admin@rehome.app
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find the admin user
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@rehome.app';
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User admin@rehome.app not found. Please sign up first!';
  END IF;
  
  -- Grant admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Update username
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
  
  -- Send notification
  PERFORM public.create_notification(
    admin_user_id,
    '👑 Admin Access Granted!',
    'You now have admin privileges with 999,999,999 points!',
    'success',
    '/admin'
  );
  
  RAISE NOTICE '✅ Admin access granted successfully!';
  RAISE NOTICE 'User ID: %', admin_user_id;
  RAISE NOTICE 'Points: 999,999,999';
END $$;

-- Verify admin setup
SELECT 
  p.full_name,
  p.username,
  ur.role,
  im.community_points,
  im.total_items
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
LEFT JOIN public.impact_metrics im ON im.user_id = p.id
WHERE p.username = 'admin';
```

---

## Alternative: Use Your Own Email

If you want to use your own email instead:

### Step 1: Sign up with your email
Go to https://13la7e.github.io/ReHome/#/auth and sign up normally

### Step 2: Grant yourself admin + infinite points

Replace `YOUR_EMAIL@example.com` with your actual email:

```sql
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find your user (CHANGE THIS EMAIL!)
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'YOUR_EMAIL@example.com';  -- ⚠️ CHANGE THIS!
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found. Please sign up first!';
  END IF;
  
  -- Grant admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Give INFINITE POINTS
  UPDATE public.impact_metrics
  SET
    total_items = 999999,
    waste_diverted_kg = 999999.99,
    co2_saved_kg = 999999.99,
    lives_impacted = 999999,
    community_points = 999999999  -- 999 MILLION POINTS!
  WHERE user_id = admin_user_id;
  
  RAISE NOTICE '✅ Admin access granted!';
END $$;
```

---

## 🎯 What You'll Get

After running the SQL:

- ✅ **Role**: Admin (full access)
- ✅ **Points**: 999,999,999 (basically infinite!)
- ✅ **Items Donated**: 999,999
- ✅ **CO2 Saved**: 999,999 kg
- ✅ **Lives Impacted**: 999,999

### Admin Capabilities:

1. **Blog Management** (`/admin`)
   - Create, edit, delete blog posts
   - Publish/unpublish articles
   - Manage tags and featured images

2. **Testimonial Management**
   - Approve/reject testimonials
   - Feature testimonials on homepage
   - Moderate user reviews

3. **User Management**
   - View all user statistics
   - Send notifications to any user
   - Monitor platform activity

4. **Unlimited Rewards**
   - Redeem any reward instantly
   - Never run out of points
   - Test reward system thoroughly

---

## 📧 Recommended Admin Credentials

**Option 1: Dedicated Admin Account**
- Email: `admin@rehome.app`
- Password: `ReHome@Admin2025`

**Option 2: Your Personal Email**
- Use your own email
- Choose your own password
- Grant yourself admin via SQL

---

## 🔐 Security Note

The admin role gives full access to:
- All user data
- Content management
- System notifications

Keep the admin credentials secure!

---

**After setup, login at**: https://13la7e.github.io/ReHome/#/auth
