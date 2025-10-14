# Database Migration Guide

## Running the Username & Avatar Migration

The error you saw (`Could not find the 'username' column`) occurs because the database migration hasn't been applied yet. Here's how to fix it:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Copy the entire contents of: `supabase/migrations/20251014000000_add_username_to_profiles.sql`
5. Paste it into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`
7. You should see "Success. No rows returned"

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to your project directory
cd c:\Website\rehomeht

# Link to your Supabase project (first time only)
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
supabase db push
```

### Option 3: Manual SQL Execution

Connect to your Supabase database and run this SQL:

```sql
-- Add username column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Add avatar_url column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add username validation constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'username_format'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_]+$');
  END IF;
END $$;
```

## What This Migration Adds

### Database Changes:
- ✅ `username` column to profiles table (unique, lowercase alphanumeric + underscores)
- ✅ `avatar_url` column to profiles table
- ✅ `avatars` storage bucket for profile pictures
- ✅ Storage policies for secure avatar management

### Features Enabled:
- ✅ Username support during signup
- ✅ Username display in navigation (@username)
- ✅ Avatar upload in Settings page
- ✅ Avatar display throughout the app
- ✅ Google Sign-In support

## Verifying the Migration

After running the migration, verify it worked:

1. Go to your Supabase Dashboard → **Table Editor** → **profiles**
2. You should see two new columns:
   - `username` (text, unique)
   - `avatar_url` (text)
3. Go to **Storage** → You should see an `avatars` bucket

## Troubleshooting

### If you still see errors:
1. Make sure you ran the entire migration SQL
2. Check that your Supabase project is selected
3. Refresh your browser cache (Ctrl+F5)
4. Sign out and sign back in

### If username is taken:
The migration creates a unique constraint on username. Make sure usernames are unique when testing.

### If avatar upload fails:
1. Check that the `avatars` bucket exists in Supabase Storage
2. Verify the storage policies are created
3. Make sure the file is under 5MB and is an image format

## Need Help?

If you encounter issues:
1. Check the browser console for detailed error messages
2. Check Supabase logs in the Dashboard → Logs
3. Make sure you're using the latest deployed version of the app
