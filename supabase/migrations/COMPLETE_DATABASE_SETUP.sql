-- =====================================================
-- COMPLETE ReHome DATABASE SETUP
-- =====================================================
-- Run this ONCE in your new Supabase SQL Editor
-- This creates ALL tables needed for ReHome (Phase 1 + Phase 2)
-- 
-- Dashboard: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/sql
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- PHASE 1: CORE TABLES
-- =====================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$')
);

-- 2. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'partner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- 3. IMPACT METRICS TABLE
CREATE TABLE IF NOT EXISTS public.impact_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_items INTEGER DEFAULT 0,
  waste_diverted_kg NUMERIC(10,2) DEFAULT 0,
  co2_saved_kg NUMERIC(10,2) DEFAULT 0,
  lives_impacted INTEGER DEFAULT 0,
  community_points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  categories TEXT[] DEFAULT ARRAY[]::TEXT[],
  rating NUMERIC(2,1) DEFAULT 5.0,
  total_pickups INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('books', 'clothes', 'electronics', 'ewaste', 'furniture')),
  image_url TEXT NOT NULL,
  confidence NUMERIC(3,2) DEFAULT 0,
  is_reusable BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'picked_up', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PICKUP REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. REWARDS TABLE
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tree_planting', 'discount', 'voucher')),
  image_url TEXT,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. REDEMPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE SET NULL,
  points_spent INTEGER NOT NULL,
  qr_code_data TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired')),
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- PHASE 2: NEW FEATURE TABLES
-- =====================================================

-- 9. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  tags TEXT[]
);

-- 10. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'pickup', 'reward', 'achievement')),
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 13. PARTNER STATS TABLE
CREATE TABLE IF NOT EXISTS public.partner_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
  total_pickups INTEGER DEFAULT 0,
  completed_pickups INTEGER DEFAULT 0,
  pending_pickups INTEGER DEFAULT 0,
  total_weight_kg NUMERIC(10,2) DEFAULT 0,
  average_rating NUMERIC(2,1) DEFAULT 5.0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_user_id ON public.pickup_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_partner_id ON public.pickup_requests(partner_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_status ON public.pickup_requests(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured, approved);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_stats ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, check_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND user_roles.role = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- USER ROLES POLICIES
CREATE POLICY "Anyone can view roles" ON public.user_roles FOR SELECT USING (true);

-- IMPACT METRICS POLICIES
CREATE POLICY "Users can view own metrics" ON public.impact_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own metrics" ON public.impact_metrics FOR UPDATE USING (auth.uid() = user_id);

-- PARTNERS POLICIES
CREATE POLICY "Anyone can view active partners" ON public.partners FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage partners" ON public.partners FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ITEMS POLICIES
CREATE POLICY "Users can view own items" ON public.items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items" ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON public.items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all items" ON public.items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- PICKUP REQUESTS POLICIES
CREATE POLICY "Users can view own requests" ON public.pickup_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create requests" ON public.pickup_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Partners can view their requests" ON public.pickup_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.partners
    WHERE partners.id = pickup_requests.partner_id
    AND partners.contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);
CREATE POLICY "Partners can update their requests" ON public.pickup_requests FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.partners
    WHERE partners.id = pickup_requests.partner_id
    AND partners.contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- REWARDS POLICIES
CREATE POLICY "Anyone can view active rewards" ON public.rewards FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage rewards" ON public.rewards FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- REDEMPTIONS POLICIES
CREATE POLICY "Users can view own redemptions" ON public.redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create redemptions" ON public.redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- BLOG POSTS POLICIES
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage posts" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- TESTIMONIALS POLICIES
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Users can create testimonials" ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- REFERRALS POLICIES
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can create referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- PARTNER STATS POLICIES
CREATE POLICY "Partners can view own stats" ON public.partner_stats FOR SELECT USING (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to generate referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
BEGIN
  code := 'REF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  RETURN code;
END;
$$;

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (p_user_id, p_title, p_message, p_type, p_link)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, username, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'username', NULL),
    COALESCE(new.raw_user_meta_data->>'avatar_url', NULL)
  );
  
  -- Assign default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  -- Initialize impact metrics
  INSERT INTO public.impact_metrics (user_id)
  VALUES (new.id);
  
  -- Create referral code
  INSERT INTO public.referrals (referrer_id, referral_code)
  VALUES (new.id, public.generate_referral_code());
  
  -- Send welcome notification
  PERFORM public.create_notification(
    new.id,
    '🎉 Welcome to ReHome!',
    'Start your first donation today and earn points!',
    'success',
    '/upload'
  );
  
  RETURN new;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SEED DATA (SAMPLE PARTNERS & REWARDS)
-- =====================================================

-- Insert sample partners
INSERT INTO public.partners (name, description, categories, contact_email, address, active) VALUES
  ('Qatar Charity', 'Leading humanitarian organization providing aid to those in need', ARRAY['clothes', 'books', 'furniture'], 'contact@qatarcharity.org', 'Doha, Qatar', true),
  ('Eid Charity', 'Supporting families and communities through charitable donations', ARRAY['clothes', 'electronics', 'furniture'], 'info@eidcharity.org', 'Doha, Qatar', true),
  ('Qatar Red Crescent', 'Humanitarian organization providing emergency relief and development programs', ARRAY['clothes', 'books', 'furniture'], 'info@qrcs.org.qa', 'Doha, Qatar', true),
  ('Tech For Good Qatar', 'Refurbishing electronics for educational purposes', ARRAY['electronics', 'ewaste'], 'hello@techforgood.qa', 'Doha, Qatar', true)
ON CONFLICT DO NOTHING;

-- Insert sample rewards
INSERT INTO public.rewards (name, description, points_required, type, active) VALUES
  ('Plant 1 Tree', 'Plant a tree in your name to offset carbon emissions', 100, 'tree_planting', true),
  ('Plant 5 Trees', 'Plant 5 trees and make a bigger environmental impact', 450, 'tree_planting', true),
  ('10% Discount Voucher', 'Get 10% off at partner stores', 200, 'discount', true),
  ('25% Discount Voucher', 'Get 25% off at partner stores', 500, 'discount', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE public.profiles IS 'User profile information';
COMMENT ON TABLE public.user_roles IS 'User role assignments (user, admin, partner)';
COMMENT ON TABLE public.impact_metrics IS 'Environmental and community impact tracking';
COMMENT ON TABLE public.partners IS 'Donation partner organizations';
COMMENT ON TABLE public.items IS 'Donated items with AI classification';
COMMENT ON TABLE public.pickup_requests IS 'Pickup scheduling and tracking';
COMMENT ON TABLE public.rewards IS 'Redeemable rewards catalog';
COMMENT ON TABLE public.redemptions IS 'User reward redemption history';
COMMENT ON TABLE public.blog_posts IS 'Blog posts and news articles';
COMMENT ON TABLE public.testimonials IS 'User testimonials and reviews';
COMMENT ON TABLE public.notifications IS 'In-app notifications for users';
COMMENT ON TABLE public.referrals IS 'User referral program tracking';
COMMENT ON TABLE public.partner_stats IS 'Statistics dashboard for partners';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify all tables were created
SELECT 
  schemaname, 
  tablename, 
  tableowner 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- =====================================================
-- SETUP COMPLETE! 
-- =====================================================
-- 
-- ✅ All tables created
-- ✅ All indexes added
-- ✅ All RLS policies configured
-- ✅ Helper functions created
-- ✅ Sample data inserted
-- 
-- NEXT STEPS:
-- 
-- 1. Create Storage Bucket for Avatars:
--    - Go to Storage in Supabase Dashboard
--    - Click "New bucket"
--    - Name: "avatars"
--    - Public: YES
--    - Create these policies:
--      * SELECT: public can view (bucket_id = 'avatars')
--      * INSERT: authenticated users (bucket_id = 'avatars')
--      * UPDATE: users own files (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
--      * DELETE: users own files (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
--
-- 2. Create Storage Bucket for Item Images:
--    - Click "New bucket"
--    - Name: "item-images"
--    - Public: YES
--    - Create same policies as avatars bucket
--
-- 3. Regenerate TypeScript types:
--    Run in terminal: npx supabase gen types typescript --project-id dspwgwivmqvyskikbfdq > src/integrations/supabase/types.ts
--
-- 4. Test your app:
--    npm run dev
--
-- =====================================================
