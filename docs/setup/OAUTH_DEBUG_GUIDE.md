# 🔍 Google OAuth Still Not Working - Debug Guide

## The Problem
After clicking Google sign-in and selecting account, you're not being logged in.

## Most Likely Cause: Supabase Site URL Misconfigured

### ✅ CRITICAL FIX - Update Supabase Site URL

**Go to this exact page**:
```
https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/url-configuration
```

### Check These Settings:

#### 1. **Site URL** (MUST BE EXACT):
```
https://13la7e.github.io/ReHome/#/
```
⚠️ **Include the trailing slash!**
⚠️ **Include /ReHome/#/ not just /ReHome/**

#### 2. **Redirect URLs** (Add ALL of these):
```
https://13la7e.github.io/ReHome/**
https://13la7e.github.io/ReHome/#/
https://13la7e.github.io/ReHome/#/auth
https://13la7e.github.io/**
http://localhost:8080/ReHome/**
http://localhost:8080/ReHome/#/
http://localhost:8080/ReHome/#/auth
```

Click **"Save"** at the bottom!

---

## 🧪 Test After Fixing Site URL

### Step 1: Clear Browser Cache
1. Press **Ctrl + Shift + Delete**
2. Clear "Cookies and other site data"
3. Clear "Cached images and files"
4. Time range: **All time**
5. Click "Clear data"

### Step 2: Open Incognito/Private Window
- Chrome: **Ctrl + Shift + N**
- Firefox: **Ctrl + Shift + P**
- Edge: **Ctrl + Shift + N**

### Step 3: Test Google OAuth
1. Go to: https://13la7e.github.io/ReHome/#/auth
2. Open browser console (**F12**)
3. Go to "Console" tab
4. Click "Continue with Google"
5. Select your Google account
6. **Watch the console logs**

### Step 4: Check Console Logs
You should see:
```
Auth state change: SIGNED_IN user@email.com
Initial session: user@email.com
```

If you see those logs, OAuth is working!

---

## 🐛 Other Possible Issues

### Issue 1: Google OAuth Credentials Wrong
**Check**: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/providers

Make sure:
- ✅ Google is enabled (toggle is ON)
- ✅ Client ID: [Your Google OAuth Client ID from Google Console]
- ✅ Client Secret: [Your Google OAuth Client Secret from Google Console]
- ✅ Click "Save"

### Issue 2: Google Console Redirect URI
**Check**: https://console.cloud.google.com/apis/credentials

Find your OAuth client and verify **Authorized redirect URIs**:
```
https://dspwgwivmqvyskikbfdq.supabase.co/auth/v1/callback
```

Should be EXACTLY that. Click "Save" if you change it.

### Issue 3: Session Not Persisting
**Check localStorage**:
1. Open console (**F12**)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Look under "Local Storage" → your site URL
4. Look for keys starting with `sb-`
5. If empty after OAuth, there's a session storage issue

---

## 🔧 Quick Debug Script

Run this in your browser console AFTER trying Google sign-in:

```javascript
// Check if we have a session
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
console.log('User:', session?.user?.email);

// Check localStorage
console.log('LocalStorage keys:', Object.keys(localStorage).filter(k => k.includes('sb-')));

// Try to get user
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user?.email);
```

If session is `null`, OAuth didn't complete successfully.

---

## 🎯 Step-by-Step Fix Checklist

Do these IN ORDER:

### 1. ✅ Fix Supabase Site URL
- [ ] Go to: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/url-configuration
- [ ] Set Site URL to: `https://13la7e.github.io/ReHome/#/`
- [ ] Add all redirect URLs listed above
- [ ] Click "Save"

### 2. ✅ Verify Google OAuth Settings
- [ ] Go to: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/providers
- [ ] Google is enabled
- [ ] Credentials are correct
- [ ] Click "Save"

### 3. ✅ Wait for Changes to Propagate
- [ ] Wait 30 seconds after saving

### 4. ✅ Test in Incognito
- [ ] Open incognito window
- [ ] Open console (F12)
- [ ] Go to: https://13la7e.github.io/ReHome/#/auth
- [ ] Click "Continue with Google"
- [ ] Watch console for logs

### 5. ✅ Check What Happens
**If you see console logs but not logged in**:
- The session is being created but not persisting
- Check if third-party cookies are blocked
- Try a different browser

**If you see no console logs**:
- OAuth callback isn't reaching the app
- Site URL is wrong
- Redirect URLs don't match

**If you see error in console**:
- Share the error message!

---

## 🚨 Most Common Fix

**90% of OAuth issues are fixed by**:

1. Setting Site URL to EXACTLY: `https://13la7e.github.io/ReHome/#/`
2. Adding wildcard redirect: `https://13la7e.github.io/ReHome/**`
3. Clearing browser cache
4. Testing in incognito

---

## 📞 Need More Help?

After trying the above, if it still doesn't work, tell me:

1. What do you see in the browser console after clicking Google sign-in?
2. Do you see the auth state change logs?
3. What happens after you select your Google account?
4. Any error messages?

**First**: Try updating the Site URL - that fixes 90% of cases! 🎯

---

## 🔗 Quick Links

- **Site URL Config**: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/url-configuration
- **OAuth Providers**: https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/providers
- **Google Console**: https://console.cloud.google.com/apis/credentials
- **Your App**: https://13la7e.github.io/ReHome/#/auth

**START HERE**: Update Site URL first! ⬆️
