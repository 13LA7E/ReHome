# 🔧 Fix Email Confirmation Link

## Problem
When you sign up, the confirmation email link points to `localhost` instead of your live site, so clicking it doesn't work.

## Solution: Update Site URL in Supabase

### Step 1: Go to Authentication Settings

Open this link:
```
https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/url-configuration
```

### Step 2: Update Site URL

Find the **"Site URL"** field and change it to:
```
https://13la7e.github.io/ReHome/#/
```

### Step 3: Update Redirect URLs

Scroll down to **"Redirect URLs"** section.

Click **"Add URL"** and add these URLs:
```
https://13la7e.github.io/ReHome/#/auth
https://13la7e.github.io/ReHome/#/
http://localhost:8080/ReHome/#/
http://localhost:8080/ReHome/#/auth
```

### Step 4: Save Changes

Click **"Save"** at the bottom of the page.

---

## Alternative: Disable Email Confirmation (Faster for Testing)

If you want to skip email verification entirely:

### Go to Email Templates
```
https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/templates
```

### Disable "Confirm signup" requirement

1. Click on **"Confirm signup"** template
2. Toggle **"Enable"** to OFF
3. Save

**OR**

### Disable Email Confirmation Requirement

Go to:
```
https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/providers
```

1. Find **"Email"** provider settings
2. Uncheck **"Confirm email"**
3. Save

---

## Quick Test After Fixing

1. Sign up with a new email
2. Check your inbox
3. Click the confirmation link
4. Should redirect to: `https://13la7e.github.io/ReHome/#/auth`
5. You'll be automatically logged in!

---

## For Development (Optional)

If you want both localhost AND production to work:

**Site URL**: `https://13la7e.github.io/ReHome/#/`

**Redirect URLs** (add all of these):
- `https://13la7e.github.io/ReHome/#/auth`
- `https://13la7e.github.io/ReHome/#/`
- `http://localhost:8080/ReHome/#/auth`
- `http://localhost:8080/ReHome/#/`
- `http://localhost:5173/ReHome/#/auth`
- `http://localhost:5173/ReHome/#/`

This way it works in both development and production!

---

## Summary

**Quick Link to Fix**:
https://supabase.com/dashboard/project/dspwgwivmqvyskikbfdq/auth/url-configuration

**Change Site URL to**:
```
https://13la7e.github.io/ReHome/#/
```

**Add Redirect URLs**:
```
https://13la7e.github.io/ReHome/#/auth
http://localhost:8080/ReHome/#/auth
```

That's it! ✅
