# 🚀 Supabase Migration Guide

## ✅ Completed Steps
- [x] Environment variables updated in `.env`
- [x] Database migration SQL created

## 📋 Steps to Complete (Do These Now!)

### Step 1: Run Database Migration

1. Open your Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/sql
   ```

2. Click **"New Query"**

3. Copy the entire contents of `supabase/migrations/COMPLETE_DATABASE_SETUP.sql`

4. Paste into the SQL Editor

5. Click **"Run"** (or press Ctrl+Enter)

6. Wait for "Success" message (should take ~5 seconds)

---

### Step 2: Create Storage Buckets

#### Create "avatars" Bucket:

1. Go to Storage: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/storage/buckets

2. Click **"New bucket"**
   - Name: `avatars`
   - Public: ✅ **YES**
   - Click "Save"

3. Click on the `avatars` bucket

4. Go to **"Policies"** tab

5. Add these 4 policies:

   **Policy 1: Public Read**
   - Operation: SELECT
   - Policy name: "Public can view avatars"
   - Policy definition:
     ```sql
     bucket_id = 'avatars'
     ```

   **Policy 2: Authenticated Insert**
   - Operation: INSERT
   - Policy name: "Authenticated users can upload"
   - Policy definition:
     ```sql
     bucket_id = 'avatars' AND auth.role() = 'authenticated'
     ```

   **Policy 3: User Update Own**
   - Operation: UPDATE
   - Policy name: "Users can update own avatar"
   - Policy definition:
     ```sql
     bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
     ```

   **Policy 4: User Delete Own**
   - Operation: DELETE
   - Policy name: "Users can delete own avatar"
   - Policy definition:
     ```sql
     bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
     ```

#### Create "item-images" Bucket:

Repeat the exact same steps above but with bucket name `item-images` instead of `avatars`.

---

### Step 3: Regenerate TypeScript Types

1. Open terminal in VS Code (Ctrl + `)

2. Run this command:
   ```bash
   npx supabase gen types typescript --project-id dspwgwivmqvyskikbfdq > src/integrations/supabase/types.ts
   ```

3. Wait for completion (~10 seconds)

4. You should see the file `src/integrations/supabase/types.ts` update

---

### Step 4: Test Your App

1. Start development server:
   ```bash
   npm run dev
   ```

2. Open browser: http://localhost:5173/ReHome/

3. Test these features:
   - ✅ Sign up with new account (should create profile, metrics, referral code)
   - ✅ Upload an item
   - ✅ View notifications (bell icon)
   - ✅ Visit /blog
   - ✅ Visit /referral
   - ✅ Check /settings (avatar upload)

---

## 🎨 Optional: Create PWA Icons

Your app is configured as a Progressive Web App (PWA), but needs icons:

1. Take your ReHome logo

2. Create these sizes:
   - 192x192 pixels → save as `public/icon-192.png`
   - 512x512 pixels → save as `public/icon-512.png`
   - 72x72 pixels → save as `public/apple-touch-icon.png`

3. You can use online tools like:
   - https://www.pwabuilder.com/imageGenerator
   - https://favicon.io/

---

## 📦 Deploy to GitHub Pages

Once everything works locally:

```bash
npm run build
git add .
git commit -m "Complete Phase 2 migration to new Supabase"
git push
```

Your site will auto-deploy to GitHub Pages!

---

## ❓ Troubleshooting

### "Table does not exist" errors
- Make sure Step 1 (SQL migration) completed successfully
- Check tables exist: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/editor

### TypeScript errors still showing
- Make sure Step 3 (type generation) completed
- Restart VS Code (Ctrl+Shift+P → "Reload Window")

### "Storage bucket not found" errors
- Make sure Step 2 (storage buckets) completed
- Check buckets exist: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/storage/buckets

### Can't upload images
- Make sure storage bucket policies are created (Step 2)
- Check that buckets are marked as "Public"

---

## 📊 What Was Created

### Phase 1 Tables:
- ✅ profiles (user info)
- ✅ user_roles (role assignments)
- ✅ impact_metrics (environmental tracking)
- ✅ partners (donation organizations)
- ✅ items (uploaded donations)
- ✅ pickup_requests (scheduling)
- ✅ rewards (redemption catalog)
- ✅ redemptions (user redemptions)

### Phase 2 Tables:
- ✅ blog_posts (news/blog)
- ✅ testimonials (user reviews)
- ✅ notifications (in-app alerts)
- ✅ referrals (referral program)
- ✅ partner_stats (partner analytics)

### Features:
- ✅ Row Level Security (RLS) on all tables
- ✅ Helper functions (generate_referral_code, create_notification)
- ✅ Auto-trigger on new user signup
- ✅ Sample partner data
- ✅ Sample reward data
- ✅ Performance indexes

---

## 🎉 You're All Set!

After completing Steps 1-4, your ReHome app will be fully migrated to your own Supabase with all Phase 2 features working! 🚀
