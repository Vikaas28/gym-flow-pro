# 🔧 ERROR FIX GUIDE - Complete Troubleshooting

## The Most Common Errors You're Seeing

### Error #1: "Email not confirmed" after signup
**✅ FIXED**: Check that in Supabase:
- Authentication → Providers → Email
- Toggle "Confirm email" is **OFF** (disabled)
- Click Save

### Error #2: "public.members does not exist"
**Possible Causes:**
1. Migration didn't run
2. Migration ran but failed
3. Wrong table name

**✅ FIX**: In Supabase SQL Editor, run this:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see: `members` and `attendance`

If not, run the migration again.

### Error #3: "Permission denied" when adding member
**Cause**: RLS policies are blocking access

**✅ FIX**: In Supabase SQL Editor, run this:

```sql
-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'members';
```

You should see 4 policies for members table.

---

## Step-by-Step Fix Process

### STEP 1: Clear Everything (5 minutes)

**In Supabase:**
1. Go to SQL Editor
2. New Query
3. Run this to DROP and recreate:

```sql
-- Drop tables if they exist
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Now run the migration again
-- (Copy entire content from your migrations file)
```

Then paste the entire migration file content and run it.

### STEP 2: Verify Tables Exist (30 seconds)

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('members', 'attendance');
```

**You should see:**
- members
- attendance

### STEP 3: Verify RLS Policies (30 seconds)

```sql
SELECT schemaname, tablename, policyname, permissive 
FROM pg_policies 
WHERE tablename IN ('members', 'attendance')
ORDER BY tablename;
```

**You should see 7 policies** (4 for members, 3 for attendance).

### STEP 4: Clear Browser Cache (1 minute)

1. Press **F12** (DevTools)
2. Go to **Application** tab
3. Click **Clear Site Data** (clears everything)
4. Close DevTools
5. **Close the browser tab completely**
6. **Open a new browser tab** and go to your app

### STEP 5: Create New Account (2 minutes)

1. Go to your app
2. Click "Create Account"
3. Fill in with **new email** (important!)
4. Use any password (e.g., "Test123!@")
5. Click "Create Account"

**You should:**
- See success message
- Auto-redirect to Dashboard
- No email confirmation needed

### STEP 6: Test Adding Member (1 minute)

1. Click "Add New Member"
2. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "1234567890"
   - Select "Basic" membership
3. Click "Add Member"

**You should see:**
- Success message
- Member appears in list

---

## If You Still See Errors

### Try This Debug Script

**In browser (F12 → Console), paste this:**

```javascript
// Test 1: Check if authenticated
supabase.auth.getUser().then(r => {
  console.log('Current user:', r.data.user?.id);
}).catch(e => console.log('Auth error:', e.message));

// Test 2: Check members table access
supabase.from('members').select().then(r => {
  console.log('Members data:', r.data);
  if (r.error) console.log('Error:', r.error.message);
}).catch(e => console.log('Query error:', e.message));

// Test 3: Check user ID
supabase.auth.getUser().then(r => {
  const userId = r.data.user?.id;
  console.log('Your user ID:', userId);
});
```

**Copy the output and tell me what you see.**

---

## Common Error Messages & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| `"relation 'public.members' does not exist"` | Table not created | Run migration in SQL Editor |
| `"Email confirmation required"` | Email verify is ON | Disable in Providers |
| `"permission denied for schema public"` | RLS issues | Check policies exist |
| `"JWT invalid"` | Bad token | Clear storage, log in again |
| `"column 'user_id' does not exist"` | Schema mismatch | Drop and recreate tables |
| `"new row violates row-level security policy"` | RLS blocking insert | Check user_id is being passed |

---

## The NUCLEAR OPTION (If nothing works)

### Complete Reset

**In Supabase SQL Editor:**

```sql
-- Step 1: Drop everything
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Step 2: Create tables fresh
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  membership_type TEXT NOT NULL CHECK (membership_type IN ('basic', 'premium', 'vip')),
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, email)
);

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Add indexes
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_is_active ON members(is_active);
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_member_id ON attendance(member_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- Step 4: Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Step 5: Add policies
CREATE POLICY "Users can view their own members"
  ON members FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own members"
  ON members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own members"
  ON members FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own members"
  ON members FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own attendance"
  ON attendance FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attendance"
  ON attendance FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attendance"
  ON attendance FOR DELETE USING (auth.uid() = user_id);
```

**Then:**
1. Clear browser cache (F12 → Application → Clear)
2. Close browser tab
3. Create new account
4. Test

---

## What The Fixes Do

### ✅ AuthContext Fix
- Auto-logs in user after signup
- Handles email confirmation bypass

### ✅ Signup Page Fix
- Better error messages
- Small delay before redirect
- Better logging

### ✅ Migration Fix
- Drops old policies to avoid conflicts
- Recreates all policies fresh
- Safer re-runs

---

## If Error Still Appears

**Tell me:**
1. The exact error message (copy from F12 Console)
2. Which step you're on (signup/login/add member)
3. Output of the SQL queries above
4. Screenshot of the error

Then I can give you the exact fix! 💪

---

**Most Important:** Make sure email confirmation is **DISABLED** in Supabase!

Go check that first!
