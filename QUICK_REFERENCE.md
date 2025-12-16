# 🚀 QUICK REFERENCE CARD

## Setup in 10 Minutes

```
┌──────────────────────────────────────┐
│  STEP 1: Supabase (2 min)           │
├──────────────────────────────────────┤
│ • Create project                     │
│ • Enable Email auth                  │
│ • Copy API keys                      │
└──────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────┐
│  STEP 2: Run Migration (1 min)      │
├──────────────────────────────────────┤
│ • Copy SQL from migrations file      │
│ • Paste in SQL Editor                │
│ • Execute                            │
└──────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────┐
│  STEP 3: .env File (1 min)          │
├──────────────────────────────────────┤
│ VITE_SUPABASE_URL=...               │
│ VITE_SUPABASE_PUBLISHABLE_KEY=...   │
│ VITE_SUPABASE_PROJECT_ID=...        │
└──────────────────────────────────────┘
                  ↓
┌──────────────────────────────────────┐
│  STEP 4: Install & Run (1 min)     │
├──────────────────────────────────────┤
│ $ bun install                        │
│ $ bun run dev                        │
│ Open: http://localhost:5173          │
└──────────────────────────────────────┘
                  ↓
         ✅ YOU'RE DONE!
```

---

## File Locations

```
gym_flow_pro/
├── .env ........................... ⭐ CREATE THIS
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql ... 📊 DATABASE SCHEMA
├── src/
│   ├── App.tsx ................... 🛣️ ROUTES
│   ├── contexts/
│   │   ├── AuthContext.tsx ....... 🔐 AUTHENTICATION
│   │   └── MembersContext.tsx .... 👥 MEMBERS DATA
│   └── pages/
│       ├── Login.tsx ............. 🔑 LOGIN
│       ├── Signup.tsx ............ 📝 SIGNUP
│       ├── Dashboard.tsx ......... 📊 DASHBOARD
│       ├── AddMember.tsx ......... ➕ ADD MEMBER
│       ├── MembersList.tsx ....... 📋 MEMBERS LIST
│       └── MarkAttendance.tsx .... ✅ ATTENDANCE
├── START_HERE.md ................. 🚀 READ FIRST
├── QUICKSTART.md ................. ⚡ 5 MIN SETUP
├── DATABASE_SETUP.md ............ 🗄️ DATABASE HELP
├── ARCHITECTURE.md .............. 📐 SYSTEM DESIGN
└── TROUBLESHOOTING.md ........... 🔧 PROBLEMS
```

---

## Key Credentials Template

Create `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs... (long key)
VITE_SUPABASE_PROJECT_ID=your-project-id
```

Get values from: **Supabase → Settings → API**

---

## Common Commands

```bash
# Install dependencies
bun install           # or: npm install

# Start dev server
bun run dev           # or: npm run dev

# Build for production
bun run build         # or: npm run build

# Preview production build
bun run preview       # or: npm run preview
```

---

## Database Tables

```
✅ members
├── id (UUID Primary Key)
├── user_id (FK to auth.users)
├── full_name (TEXT)
├── email (TEXT)
├── phone (TEXT)
├── join_date (DATE)
├── is_active (BOOLEAN)
├── membership_type (basic|premium|vip)
└── photo_url (TEXT optional)

✅ attendance
├── id (UUID Primary Key)
├── user_id (FK to auth.users)
├── member_id (FK to members)
├── member_name (TEXT)
├── date (DATE)
└── time (TIME)
```

---

## Authentication Flow

```
User → Signup/Login → Supabase Auth
         ↓
    JWT Token Created
         ↓
    Stored in localStorage
         ↓
    Auto-refresh on page load
         ↓
    Redirect to Dashboard
```

---

## Protected Routes

```
✅ /dashboard    - Requires auth
✅ /members      - Requires auth
✅ /add-member   - Requires auth
✅ /attendance   - Requires auth

❌ /login        - No auth required
❌ /signup       - No auth required
❌ /             - Home page
```

---

## Feature Checklist

```
AUTHENTICATION
✅ Email/Password Signup
✅ Email/Password Login
✅ Session Management
✅ Protected Routes
✅ Auto Token Refresh

MEMBERS
✅ Add Member
✅ Edit Member
✅ Delete Member
✅ Filter By Status
✅ Search Members

ATTENDANCE
✅ Mark Check-in
✅ Prevent Duplicates
✅ View Today's List
✅ Record Timestamp

DASHBOARD
✅ Member Stats
✅ Active Count
✅ Attendance Count
✅ Today's Check-ins
```

---

## Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Table does not exist" | Migration not run | Run SQL migration |
| "Unauthorized" | Not logged in | Log in first |
| "Email already exists" | Email taken | Use different email |
| "Invalid JWT" | Session expired | Log in again |
| "VITE_* undefined" | Wrong .env | Check env variables |
| "Connection refused" | Network issue | Check internet |

---

## Debugging Tips

```javascript
// In browser console (F12)

// Check authentication
supabase.auth.getSession()
supabase.auth.getUser()

// Check members data
supabase.from('members').select()

// Check attendance
supabase.from('attendance').select()

// Clear local storage
localStorage.clear()
```

---

## File Size Reference

```
Source Files:      ~500 lines modified
Documentation:     ~10,000 words
Database Schema:   ~200 lines SQL
Total Config:      ~100 lines
```

---

## Browser Requirements

```
✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)

Requires:
✅ JavaScript enabled
✅ localStorage enabled
✅ Cookies enabled
```

---

## Hosting Options

After getting it running locally, you can deploy to:

```
✅ Vercel (Recommended)
✅ Netlify
✅ GitHub Pages
✅ Your own server
✅ Docker container
```

(Supabase handles the backend automatically)

---

## Performance Tips

```
✅ Supabase handles caching
✅ Indexes speed up queries
✅ RLS isolates user data
✅ Lazy loading for pages
✅ Optimized components
```

---

## Security Checklist

```
✅ Row Level Security (RLS)
✅ Password encryption
✅ Session tokens
✅ HTTPS only (on production)
✅ No secrets in code
✅ Environment variables for keys
✅ Protected routes
✅ User data isolation
```

---

## Support Matrix

```
Issue              | Solution
-------------------|------------------
Can't sign up      | Check email auth enabled
Can't log in       | Check credentials
Data not saving    | Check migration was run
Session lost       | Normal - log in again
API errors         | Check internet
Wrong credentials  | Check .env file
```

---

## Time Estimates

```
Setup:             ~10 minutes
First test:        ~5 minutes
Understanding:     ~30 minutes
Customization:     ~1-2 hours
Full mastery:      ~1 week
```

---

## Key Contacts

```
Supabase Support: https://supabase.com/support
React Docs:       https://react.dev
Vite Docs:        https://vitejs.dev
TypeScript:       https://www.typescriptlang.org
```

---

## Reminders

```
🔴 DON'T:
  • Commit .env to git
  • Share your API keys
  • Use test data in production
  • Ignore error messages

🟢 DO:
  • Save .env locally only
  • Use environment variables
  • Read error messages carefully
  • Check browser console (F12)
  • Read documentation first
```

---

## Success Indicators

```
✅ App loads at http://localhost:5173
✅ Can create account
✅ Can log in
✅ Can add member
✅ Can mark attendance
✅ Data persists after refresh
```

---

## Next Actions

1. ➡️ Read: **START_HERE.md**
2. ➡️ Follow: **5-step setup**
3. ➡️ Test: **Using checklist**
4. ➡️ Celebrate: **🎉 It works!**

---

**Print this page or bookmark it for quick reference!** 📌

---

*Last Updated: December 2024*
