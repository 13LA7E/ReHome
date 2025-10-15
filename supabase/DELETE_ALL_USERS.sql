-- =====================================================
-- DELETE ALL USERS FROM DATABASE
-- =====================================================
-- ⚠️ WARNING: This will permanently delete ALL users!
-- Run this in: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/sql
-- =====================================================

-- Delete all users (CASCADE will handle related data)
DELETE FROM auth.users;

-- Verify deletion
SELECT COUNT(*) as remaining_users FROM auth.users;

-- =====================================================
-- RESULT: All users deleted! 🗑️
-- =====================================================
-- All related data will be automatically deleted:
-- • Profiles
-- • User roles
-- • Impact metrics
-- • Items
-- • Pickup requests
-- • Redemptions
-- • Notifications
-- • Referrals
-- (Thanks to CASCADE delete constraints)
-- =====================================================
