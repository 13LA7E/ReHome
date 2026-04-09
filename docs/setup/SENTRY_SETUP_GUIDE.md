# 📊 Sentry Dashboard Setup & Usage Guide

## ✅ What's Already Done

Sentry is fully integrated into your ReHome app:
- ✅ Sentry SDK installed
- ✅ Error tracking enabled
- ✅ Performance monitoring configured
- ✅ Session replay enabled (10% of sessions, 100% of errors)
- ✅ Test page created at `/sentry-test`

---

## 🧪 Step 1: Test Your Integration

1. **Visit the test page**: https://rehome-i2vfobast-rehome.vercel.app/sentry-test

2. **Try these tests**:
   - Click "Trigger Error" - Creates a real error
   - Click "Test Caught Error" - Error with custom context
   - Click "Send Message" - Custom info message
   - Click "Test Feedback" - User feedback dialog
   - Click "Test Performance" - Performance monitoring
   - Click "Test Breadcrumbs" - Error with action trail

3. **Check your Sentry dashboard**: https://sentry.io

   Within 30 seconds, you should see errors appearing!

---

## 📈 Step 2: Understand Your Sentry Dashboard

### Issues Tab 🐛
**What it shows**: All errors from your app

**For each error, you can see**:
- **Stack Trace**: Exact file and line number where error occurred
- **Breadcrumbs**: User actions leading to the error (clicks, navigation, API calls)
- **User Context**: Which user experienced it, their device, browser, OS
- **Frequency**: How many times it happened, how many users affected
- **Source Code**: The actual code around the error (if GitHub integration enabled)

**How to use**:
1. Click any error in the list
2. Read the stack trace to find the problem
3. Look at breadcrumbs to understand user actions
4. Click "Open in GitHub" to see the code
5. Mark as "Resolved" when fixed
6. Sentry will reopen if error happens again

### Performance Tab ⚡
**What it shows**: Slow pages and API calls

**Key metrics**:
- **Page Load Time**: How fast your pages load
- **API Response Time**: How long API calls take
- **Database Queries**: Slow database operations
- **User Misery**: Users experiencing poor performance

**How to use**:
1. Sort by "Duration" to find slowest operations
2. Click transaction to see detailed breakdown
3. Look for spans (sub-operations) taking too long
4. Optimize the slow parts

### Session Replay 🎬
**What it shows**: Video-like recordings of user sessions

**Features**:
- Mouse movements and clicks
- Scrolling and page navigation
- Console logs and errors
- Network requests

**How to use**:
1. Click any error with a replay icon
2. Watch exactly what the user did
3. See the error happen in real-time
4. Debug visual and UX issues

### Releases Tab 📦
**What it shows**: Errors grouped by deployment version

**Benefits**:
- See if new deployment introduced errors
- Compare error rates between versions
- Track improvements over time

---

## 🔔 Step 3: Set Up Alerts (Get Notified)

### Basic Alert (Email on Every Error)
1. Go to: **Settings → Alerts**
2. Click **"Create Alert"**
3. Configure:
   ```
   When: A new issue is created
   If: All environments
   Then: Send a notification to [your email]
   ```
4. Save

### High-Priority Alert (Too Many Errors)
1. Create another alert:
   ```
   When: The issue is seen more than 10 times in 1 hour
   If: All environments
   Then: Send a notification to [your email]
   ```
2. This catches when errors spike

### Critical Error Alert
1. Create alert:
   ```
   When: A new issue is created
   If: Issue level is "fatal" OR Issue level is "error"
   Then: Send a notification to [your email]
   ```

---

## 🔗 Step 4: Set Up Integrations

### GitHub Integration (Highly Recommended!)
**Benefits**:
- Links errors to exact lines in GitHub
- Creates GitHub issues automatically
- See commits that caused errors

**Setup**:
1. Go to: **Settings → Integrations**
2. Search for "GitHub"
3. Click "Install"
4. Authorize with your GitHub account
5. Select the "ReHome" repository

**Now errors will show**:
- "Open in GitHub" button
- Suspect commits (who broke it)
- Link to exact file/line

### Discord/Slack Integration
**Benefits**: Instant notifications in your Discord/Slack

**Setup**:
1. Settings → Integrations → Discord/Slack
2. Follow OAuth flow
3. Select channel for notifications

**You'll get messages like**:
```
🚨 New Error in ReHome
TypeError: Cannot read property 'name' of undefined
File: src/pages/Upload.tsx:45
Affected: 3 users
View: [Link to Sentry]
```

---

## 🎯 Step 5: Use Sentry in Your Code

### Capture Custom Errors
```typescript
import * as Sentry from "@sentry/react";

try {
  // Your code
  await uploadImage(file);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: "image_upload",
      user_action: "upload_button_click"
    },
    contexts: {
      file: {
        size: file.size,
        type: file.type
      }
    }
  });
  
  toast.error("Upload failed. Our team has been notified.");
}
```

### Add Breadcrumbs
```typescript
// Track user actions
Sentry.addBreadcrumb({
  category: "user_action",
  message: "User clicked upload button",
  level: "info"
});

// Track API calls
Sentry.addBreadcrumb({
  category: "api",
  message: "Calling upload API",
  level: "info",
  data: { endpoint: "/api/upload" }
});
```

### Track Performance
```typescript
await Sentry.startSpan(
  { name: "Process Image", op: "image.processing" },
  async () => {
    await processImage(file);
  }
);
```

### Set User Context
```typescript
// When user logs in
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username
});

// When user logs out
Sentry.setUser(null);
```

---

## 📊 Step 6: Dashboard Tips & Best Practices

### Daily Workflow
1. **Morning**: Check Sentry dashboard for overnight errors
2. **After deployment**: Monitor for new errors
3. **Weekly**: Review performance metrics
4. **Monthly**: Clean up resolved issues

### Priority System
**Mark errors by severity**:
- 🔴 **Critical**: App crashes, payment failures, data loss
- 🟡 **High**: Major features broken, many users affected
- 🟢 **Medium**: Minor bugs, edge cases
- ⚪ **Low**: Cosmetic issues, rare occurrences

### Use Tags to Organize
Add tags to categorize errors:
```typescript
Sentry.captureException(error, {
  tags: {
    feature: "payments",      // Which feature
    severity: "high",         // How important
    user_type: "premium",     // Which users
    browser: "safari"         // Which browser
  }
});
```

Then filter dashboard by tags!

### Search & Filters
**Powerful search queries**:
- `is:unresolved` - Only unsolved errors
- `is:assigned:me` - Errors assigned to you
- `event.type:error` - Only errors (not messages)
- `user.email:*@gmail.com` - Errors from Gmail users
- `browser.name:Safari` - Safari-specific errors

---

## 🎓 Common Patterns

### Pattern 1: API Error Handling
```typescript
const response = await supabase.from('items').select('*');

if (response.error) {
  Sentry.captureException(response.error, {
    tags: { api: 'supabase', table: 'items' },
    contexts: {
      query: { action: 'select', table: 'items' }
    }
  });
}
```

### Pattern 2: Form Validation Errors
```typescript
const handleSubmit = async (data) => {
  try {
    validateForm(data);
  } catch (validationError) {
    // Don't send validation errors to Sentry (user error, not bug)
    // Just show to user
    toast.error(validationError.message);
    return;
  }
  
  try {
    await submitForm(data);
  } catch (serverError) {
    // DO send server errors to Sentry (our bug)
    Sentry.captureException(serverError, {
      tags: { form: 'contact' }
    });
  }
};
```

### Pattern 3: Async Errors
```typescript
// Catch errors in async operations
const fetchData = async () => {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    Sentry.captureException(error);
    throw error; // Re-throw so UI can handle it
  }
};
```

---

## 🚀 Advanced Features

### Source Maps (See Actual Code, Not Minified)
Already configured! Vercel automatically uploads source maps.

### Release Tracking
Add to your deployment:
```bash
# In your CI/CD or deployment script
vercel --prod --env SENTRY_RELEASE=$(git rev-parse HEAD)
```

### Custom Dashboards
Create custom dashboards:
1. Go to "Dashboards" tab
2. Add widgets for:
   - Error rate over time
   - Errors by browser
   - Errors by page
   - Slowest pages

---

## 📝 Quick Reference

### Useful Links
- **Your Dashboard**: https://sentry.io
- **Test Page**: https://rehome-i2vfobast-rehome.vercel.app/sentry-test
- **Sentry Docs**: https://docs.sentry.io/platforms/javascript/guides/react/

### When to Use Sentry
✅ **Use for**:
- Uncaught exceptions
- API failures
- Database errors
- Performance issues
- Unexpected behavior

❌ **Don't use for**:
- User validation errors (their mistake, not a bug)
- Expected error states (404 pages)
- Debug logging (use console.log)
- Sensitive data (passwords, credit cards)

### Sentry Terminology
- **Issue**: A group of similar errors
- **Event**: A single error occurrence
- **Breadcrumb**: User action before error
- **Tag**: Searchable label for errors
- **Context**: Additional data about error
- **Release**: Version of your deployed code
- **Transaction**: Performance measurement

---

## 🎯 Success Metrics

Track these in Sentry:
- **Error Rate**: Errors per user session (aim: <1%)
- **Resolution Time**: How fast you fix errors (aim: <24h)
- **Affected Users**: Unique users hitting errors (aim: <5%)
- **Page Load Time**: P95 load time (aim: <3s)

---

## ⚠️ Important Notes

1. **Remove Test Page**: Delete `/sentry-test` route before production launch
2. **Privacy**: Sentry records user actions - comply with privacy policy
3. **Quotas**: Free tier has limits - monitor usage
4. **Sensitive Data**: Never log passwords, tokens, or PII

---

## 🆘 Troubleshooting

**Errors not appearing in Sentry?**
1. Check VITE_SENTRY_DSN is set correctly
2. Test in production (Sentry disabled in dev)
3. Check browser console for Sentry errors
4. Verify firewall isn't blocking sentry.io

**Too many errors?**
1. Set up filters to ignore known issues
2. Adjust sample rates in main.tsx
3. Use "Resolve" button to clean up

**Can't see user info?**
Add to AuthProvider.tsx:
```typescript
if (user) {
  Sentry.setUser({
    id: user.id,
    email: user.email
  });
}
```

---

## 🎉 You're All Set!

Sentry is now tracking all errors in your app. Visit the test page, trigger some errors, and watch them appear in your dashboard!

**Next steps**:
1. Visit test page and trigger errors
2. Check Sentry dashboard
3. Set up email alerts
4. Install GitHub integration
5. Start fixing those bugs! 🐛
