# 🔐 Enable Google Sign-In for ReHome

## The Error
`"Unsupported provider: provider is not enabled"`

This means Google OAuth isn't enabled in your Supabase project.

---

## ✅ Solution: Enable Google Provider

### Step 1: Go to Supabase Auth Providers

**Open this link**:
```
https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/providers
```

### Step 2: Enable Google Provider

1. Find **"Google"** in the list of providers
2. Toggle it **ON** (enable it)
3. You'll see it needs configuration...

---

## 🔑 Option 1: Quick Setup (Use Supabase's OAuth)

If you just want to test quickly, Supabase provides default OAuth credentials:

1. In the Google provider settings
2. Leave **"Use Supabase OAuth credentials"** enabled
3. Click **"Save"**

**That's it!** Google sign-in will work immediately with Supabase's shared credentials.

---

## 🚀 Option 2: Production Setup (Your Own Google OAuth)

For production, you should create your own Google OAuth credentials:

### A. Create Google OAuth Credentials

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Configure consent screen if prompted:
   - User Type: **External**
   - App name: **ReHome**
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue through all steps

### B. Create OAuth Client ID

1. Application type: **Web application**
2. Name: **ReHome - Production**
3. **Authorized JavaScript origins**:
   ```
   https://13la7e.github.io
   https://dspwgwivmqvyskikbfdq.supabase.co
   ```
4. **Authorized redirect URIs**:
   ```
   https://dspwgwivmqvyskikbfdq.supabase.co/auth/v1/callback
   ```
5. Click **"Create"**
6. Copy your **Client ID** and **Client Secret**

### C. Add to Supabase

1. Go back to: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/providers
2. Click on **"Google"**
3. Toggle **"Use Supabase OAuth credentials"** to **OFF**
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **"Save"**

---

## 🧪 Test Google Sign-In

After enabling:

1. Go to your live site: https://13la7e.github.io/ReHome/#/auth
2. Click **"Continue with Google"** button
3. Select your Google account
4. Approve permissions
5. You'll be redirected back and automatically logged in! ✅

---

## 🔄 Update Redirect URL in Code (Optional)

If you want users to land on a specific page after Google login:

**File**: `src/pages/Auth.tsx`

Change line 136:
```typescript
redirectTo: `${window.location.origin}/`,
```

To:
```typescript
redirectTo: `${window.location.origin}/ReHome/#/`,
```

This ensures proper routing with HashRouter.

---

## 📝 Summary

**QUICK FIX** (for testing):
1. Go to: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/providers
2. Enable **Google** provider
3. Use Supabase's OAuth credentials (default)
4. Save
5. Test immediately!

**PRODUCTION** (recommended):
1. Create Google OAuth credentials in Google Console
2. Add them to Supabase
3. More secure and professional

---

## 🐛 Troubleshooting

### "redirect_uri_mismatch" error
- Make sure redirect URI in Google Console is exactly:
  ```
  https://dspwgwivmqvyskikbfdq.supabase.co/auth/v1/callback
  ```

### "Access blocked: This app has not completed Google verification"
- This is normal in development
- Click "Advanced" → "Go to ReHome (unsafe)"
- OR complete Google verification process (for production)

### Still getting "provider not enabled"
- Make sure you clicked **"Save"** in Supabase
- Wait 30 seconds for changes to propagate
- Hard refresh your app (Ctrl+Shift+R)

---

## ✅ Quick Links

- **Enable Provider**: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/providers
- **Google Console**: https://console.cloud.google.com/apis/credentials
- **Your Live Site**: https://13la7e.github.io/ReHome/#/auth

---

**DO THIS NOW**: Enable Google provider in Supabase (takes 30 seconds!)
