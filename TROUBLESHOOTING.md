# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Table does not exist" Error

**Problem**: Getting error like `relation "members" does not exist`

**Solution**:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and execute
6. Refresh the application

---

### 2. Authentication Not Working

**Problem**: Login/signup not working or giving errors

**Solution**:
1. Check `.env` file has correct values:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc... (long string)
   ```
2. Verify in Supabase console that Email auth is enabled:
   - Go to Authentication → Providers
   - Enable "Email" if not already enabled
3. Clear browser localStorage: Open DevTools → Application → Clear Storage
4. Reload the application
5. Try signing up with a new email

---

### 3. Data Not Saving to Database

**Problem**: Adding members or marking attendance doesn't persist

**Solution**:
1. Check browser console (F12 → Console) for errors
2. Verify you're logged in (check `/dashboard` redirects correctly)
3. Ensure RLS policies are enabled:
   - Go to Supabase → SQL Editor
   - Run: `SELECT * FROM information_schema.table_privileges WHERE table_name='members';`
   - Should show RLS enabled
4. Check that the user is authenticated before trying to save
5. Look for "Unauthorized" or "JWT invalid" errors

---

### 4. Session Lost After Refresh

**Problem**: Session not persisting, logged out after page refresh

**Solution**:
1. This is normal behavior in some cases. Users should:
   - Click "Sign In" again
   - Session will be restored from Supabase
2. To make sessions persist longer:
   - Supabase automatically handles this with JWT tokens
   - Clear browser cookies/cache and try again
3. Check browser DevTools → Application → Cookies
   - Should see `sb-*` cookies from Supabase

---

### 5. "Unauthorized" Error in API Calls

**Problem**: Getting 401/403 errors when performing operations

**Solution**:
1. Ensure user is authenticated:
   ```
   - Check if auth.user exists in AuthContext
   - Check localStorage for auth token
   ```
2. Verify RLS policies:
   ```sql
   -- Run in SQL Editor to check:
   SELECT * FROM pg_policies WHERE tablename = 'members';
   ```
3. Make sure user_id in database matches auth.user.id
4. Refresh the page to re-authenticate

---

### 6. Members/Attendance Not Loading

**Problem**: Empty list or loading spinner never stops

**Solution**:
1. Check browser console for network errors
2. Verify Supabase connection:
   ```js
   // In browser console:
   supabase.auth.getUser().then(console.log)
   ```
3. Ensure RLS policies allow SELECT:
   ```sql
   -- Verify policies exist:
   SELECT * FROM pg_policies WHERE tablename = 'members';
   ```
4. Check network tab (F12 → Network) for failed requests
5. Try logging out and back in

---

### 7. "Email already exists" Error

**Problem**: Cannot sign up with certain email

**Solution**:
1. This is by design - each email can only be used once
2. Use a different email address
3. Or to reset: Ask to be deleted from Supabase (contact admin)
4. Then sign up with same email again

---

### 8. .env Variables Not Working

**Problem**: Environment variables not recognized

**Solution**:
1. Make sure variables start with `VITE_`:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   ```
2. Restart dev server after changing .env:
   ```bash
   # Stop the dev server (Ctrl+C)
   bun run dev  # or npm run dev
   ```
3. Verify file location: `.env` should be in project root
4. Never commit `.env` to git - add to `.gitignore`

---

### 9. "Invalid JSON Web Token" Error

**Problem**: JWT token errors in console

**Solution**:
1. Token may have expired - log out and log back in
2. Clear localStorage:
   ```js
   localStorage.clear()
   ```
3. Refresh page
4. Sign in again with credentials

---

### 10. Supabase Connection Issues

**Problem**: Cannot connect to Supabase at all

**Solution**:
1. Check internet connection
2. Verify Supabase status: https://status.supabase.com
3. Test connection in browser console:
   ```js
   fetch('https://your-project.supabase.co/rest/v1/', {
     headers: { 'apikey': 'your-key' }
   }).then(r => r.json()).then(console.log)
   ```
4. Check firewall isn't blocking Supabase
5. Try with VPN disabled

---

## Debug Checklist

Before asking for help, verify:

- [ ] `.env` file has correct Supabase credentials
- [ ] Database migration has been applied
- [ ] Supabase Email authentication is enabled
- [ ] User is logged in (check `/dashboard`)
- [ ] RLS policies are created (check SQL Editor)
- [ ] Browser console has no JavaScript errors
- [ ] Network tab shows successful API calls
- [ ] Cookies/localStorage has authentication data
- [ ] Dev server has been restarted after .env changes
- [ ] Using correct email format for signup

---

## Useful Commands

### Restart Development Server
```bash
# Stop current server (Ctrl+C)
bun run dev     # with Bun
npm run dev     # with npm
```

### Clear Browser Cache
```js
// In browser console:
localStorage.clear()
sessionStorage.clear()
// Then refresh page (Ctrl+R or Cmd+R)
```

### Check Authentication Status
```js
// In browser console:
supabase.auth.getSession().then(console.log)
supabase.auth.getUser().then(console.log)
```

### Test Supabase Connection
```js
// In browser console:
supabase.from('members').select().then(console.log)
```

---

## Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "relation does not exist" | Migration not run | Apply SQL migration |
| "Unauthorized" | No valid auth | Log in again |
| "Email already exists" | Email registered | Use different email |
| "Invalid JWT" | Token expired | Log in again |
| "Column does not exist" | Schema mismatch | Re-run migration |
| "Row level security" | RLS policy denied | Check RLS policies |
| "No rows returned" | No data for user | User has no members yet |
| "Connection refused" | Can't reach Supabase | Check internet/firewall |

---

## Getting More Help

1. **Check Browser Console**: F12 → Console tab
2. **Check Network Errors**: F12 → Network tab
3. **Check Supabase Logs**: Dashboard → Logs
4. **Verify SQL Syntax**: Run migrations in SQL Editor first
5. **Test Isolated Code**: Use browser console to test
6. **Review Documentation**: Check DATABASE_SETUP.md

---

## Quick Reset

If everything breaks, here's how to reset:

1. **Clear Client**:
   ```bash
   rm -rf node_modules .next
   bun install  # or npm install
   bun run dev
   ```

2. **Clear Browser**:
   - F12 → Application → Clear Storage
   - Close and reopen browser

3. **Reset Database** (if needed):
   - Go to Supabase → Database
   - Drop all tables
   - Re-run migration from `001_initial_schema.sql`

4. **Re-authenticate**:
   - Sign out
   - Sign up with new email
   - Log in

---

**Remember**: Most issues are related to:
1. Incorrect environment variables
2. Missing database migration
3. Not being logged in
4. RLS policies blocking access

Check these first! ✅
