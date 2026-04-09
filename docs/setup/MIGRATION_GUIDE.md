# Database Migration Guide

## Running the Username & Avatar Migration

The errors you saw occur because the database hasn't been set up yet:
- `Could not find the 'username' column` - Database migration not run
- `Bucket not found` - Storage bucket not created

Here's how to fix both issues:

## Step 1: Run the SQL Migration (REQUIRED)

### Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your **ReHome** project
3. Go to **SQL Editor** in the left sidebar
4. Open a new query
5. Copy the **ENTIRE** contents of: `supabase/RUN_THIS_IN_SUPABASE.sql`
   - Or use: `supabase/migrations/20251014000000_add_username_to_profiles.sql`
6. Paste it into the SQL Editor
7. Click **Run** or press `Ctrl+Enter`
8. You should see "Success. No rows returned" ✅

## Step 2: Create the Avatars Storage Bucket (REQUIRED)

After running the SQL, you need to manually create the storage bucket:

1. In Supabase Dashboard, go to **Storage** in the left sidebar
2. Click **"New bucket"** button
3. Fill in the form:
   - **Name:** `avatars`
   - **Public bucket:** ✅ **YES** (check this box)
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`
4. Click **"Create bucket"**

### Step 2b: Set Up Storage Policies

1. Click on the newly created **avatars** bucket
2. Go to the **"Policies"** tab
3. Click **"New Policy"** and create these 4 policies:

#### Policy 1: View Avatars
- **Policy name:** `Anyone can view avatars`
- **Allowed operation:** SELECT
- **Target roles:** public
- **Policy definition:** 
  ```sql
  bucket_id = 'avatars'
  ```

#### Policy 2: Upload Avatars
- **Policy name:** `Authenticated users can upload`
- **Allowed operation:** INSERT
- **Target roles:** authenticated
- **Policy definition:**
  ```sql
  bucket_id = 'avatars' AND auth.role() = 'authenticated'
  ```

#### Policy 3: Update Avatars
- **Policy name:** `Users can update own avatars`
- **Allowed operation:** UPDATE
- **Target roles:** authenticated
- **Policy definition:**
  ```sql
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  ```

#### Policy 4: Delete Avatars
- **Policy name:** `Users can delete own avatars`
- **Allowed operation:** DELETE
- **Target roles:** authenticated
- **Policy definition:**
  ```sql
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  ```

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
