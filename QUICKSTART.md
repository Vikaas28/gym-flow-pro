# 🚀 Quick Start Guide

Get your GYM Flow Pro up and running in 5 minutes!

## Step 1: Set Up Supabase (2 minutes)

### 1.1 Create Project
- Go to https://supabase.com
- Sign in or create account
- Click "New Project"
- Fill in project details
- Wait for creation (1-2 minutes)

### 1.2 Get Your Credentials
- Click on your project
- Go to "Settings" → "API"
- Copy these values:
  - **Project URL** → Save as `VITE_SUPABASE_URL`
  - **anon public** key → Save as `VITE_SUPABASE_PUBLISHABLE_KEY`
  - **Project ID** (from Settings → General) → Save as `VITE_SUPABASE_PROJECT_ID`

### 1.3 Create Database Tables
- In Supabase, click "SQL Editor"
- Click "New Query"
- Copy entire content of: `supabase/migrations/001_initial_schema.sql`
- Paste into the query editor
- Click "Run"
- Wait for completion (should be quick)

### 1.4 Enable Email Authentication
- Click "Authentication" in left menu
- Click "Providers"
- Find "Email" and make sure it's enabled
- Done! ✅

---

## Step 2: Configure Your App (1 minute)

### 2.1 Create .env File
In the `gym_flow_pro` folder, create a file named `.env` with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=your-project-id
```

Replace with your actual values from Step 1.2

### 2.2 Save the File
Make sure the file is named exactly `.env` (not `.env.txt`)

---

## Step 3: Install & Run (2 minutes)

### Option A: Using Bun (Recommended)
```bash
cd gym_flow_pro
bun install
bun run dev
```

### Option B: Using npm
```bash
cd gym_flow_pro
npm install
npm run dev
```

### You should see:
```
  ➜  Local:   http://localhost:5173/
```

Open that URL in your browser! 🎉

---

## Step 4: Test It Out (30 seconds)

### Create an Account
1. You'll see a login page
2. Click "Create Account"
3. Enter:
   - **Full Name**: Your name
   - **Email**: Your email
   - **Password**: Any password
4. Click "Create Account"
5. You're in! 🎊

### Add a Member
1. Click "Add New Member"
2. Fill in member details
3. Click "Add Member"
4. Member appears in the list!

### Mark Attendance
1. Click "Mark Attendance"
2. Select a member
3. Click "Mark Attendance"
4. See check-in in the list!

---

## Checklist

Before you start, make sure:

- [ ] Supabase project created
- [ ] API keys copied
- [ ] SQL migration executed
- [ ] Email auth enabled
- [ ] `.env` file created with correct values
- [ ] Dependencies installed (`bun install`)
- [ ] Dev server running (`bun run dev`)

---

## Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **SQL Editor**: Your Project → SQL Editor
- **Authentication**: Your Project → Authentication
- **Database**: Your Project → Database
- **API Documentation**: https://supabase.com/docs

---

## Common First-Time Mistakes

❌ **Don't**: 
- Copy paste wrong credentials
- Forget to run the SQL migration
- Use `REACT_APP_` instead of `VITE_` for env variables
- Skip email authentication setup

✅ **Do**:
- Double-check your credentials
- Run the SQL migration before using the app
- Use `VITE_` prefix for environment variables
- Enable email authentication in Supabase

---

## If Something Goes Wrong

1. **Check the browser console** (F12 → Console)
2. **Look for error messages** - they tell you what's wrong
3. **Check `.env` file** - wrong credentials is #1 cause
4. **Verify database migration** - run it again if unsure
5. **See TROUBLESHOOTING.md** - detailed solutions for issues

---

## Next Steps

Once everything is working:

1. **Read DATABASE_SETUP.md** - understand the database
2. **Read IMPLEMENTATION_SUMMARY.md** - what was built
3. **Explore the code** - in `src/` folder
4. **Customize as needed** - add more features!

---

## Support

**Issue**: App won't start
- **Solution**: Check console errors and `.env` file

**Issue**: Can't sign up
- **Solution**: Check Supabase email is enabled

**Issue**: Members not saving
- **Solution**: Check database migration was run

**Issue**: Still stuck?
- **Read**: TROUBLESHOOTING.md for detailed guide

---

🎉 **You're all set!** 

Now go build something awesome! 💪

Questions? Check the documentation files included with the project.
