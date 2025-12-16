# GYM Flow Pro - Setup Guide

## Overview
GYM Flow Pro is a modern gym management system built with React, TypeScript, and Supabase. It includes authentication, member management, and attendance tracking.

## Prerequisites
- Node.js (v18 or higher)
- Bun or npm
- Supabase account (https://supabase.com)

## Database Setup

### 1. Create Supabase Project
1. Go to [Supabase Console](https://supabase.com)
2. Create a new project
3. Copy your project credentials to `.env` file

### 2. Apply Database Schema
Run the SQL migrations to set up your database tables:

1. Go to Supabase Dashboard → Your Project
2. Navigate to SQL Editor
3. Create a new query and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Execute the query

This creates:
- **members** table: Stores gym member information
  - `id` (UUID)
  - `user_id` (UUID) - References auth user
  - `full_name` (TEXT)
  - `email` (TEXT)
  - `phone` (TEXT)
  - `join_date` (DATE)
  - `is_active` (BOOLEAN)
  - `membership_type` (TEXT: 'basic', 'premium', 'vip')
  - `photo_url` (TEXT, optional)

- **attendance** table: Stores attendance records
  - `id` (UUID)
  - `user_id` (UUID) - References auth user
  - `member_id` (UUID) - References members
  - `member_name` (TEXT)
  - `date` (DATE)
  - `time` (TIME)

### 3. Enable Authentication
1. Go to Supabase Dashboard → Authentication
2. Enable "Email" as an auth provider
3. Confirm Email is enabled for user signups

## Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

Get these values from:
- Supabase Dashboard → Project Settings → API
- Copy the "Project URL" and "anon" key

## Installation & Running

### Using Bun (Recommended)
```bash
cd gym_flow_pro
bun install
bun run dev
```

### Using npm
```bash
cd gym_flow_pro
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Features Implemented

### ✅ Authentication
- Email/Password signup
- Email/Password login
- Automatic session management
- Protected routes (redirects to login if not authenticated)
- User profile management

### ✅ Member Management
- Add new members with full details
- View all members with filters (active/inactive)
- Search members by name, email, or phone
- Update member information
- Deactivate/Activate members
- Delete members
- Display membership types (Basic, Premium, VIP)
- All data persisted to Supabase

### ✅ Attendance Tracking
- Mark attendance for members
- Prevent duplicate check-ins on same day
- View today's check-ins
- Attendance history stored in database
- Search and filter attendance records

### ✅ Dashboard
- Real-time statistics:
  - Total members count
  - Active members count
  - Inactive members count
  - Today's attendance count
- Quick action buttons
- Welcome message with user info

## Database Features

### Row Level Security (RLS)
All tables have RLS enabled to ensure:
- Users can only view their own data
- Users can only modify their own records
- Complete data isolation between users

### Indexes
Performance indexes on:
- `user_id` (members and attendance)
- `is_active` (members)
- `member_id` (attendance)
- `date` (attendance)

## Project Structure

```
src/
├── contexts/
│   ├── AuthContext.tsx      # Supabase authentication logic
│   └── MembersContext.tsx   # Members and attendance management
├── pages/
│   ├── Login.tsx            # Login page
│   ├── Signup.tsx           # Sign up page
│   ├── Dashboard.tsx        # Main dashboard
│   ├── MembersList.tsx      # Members list and management
│   ├── AddMember.tsx        # Add new member form
│   └── MarkAttendance.tsx   # Attendance marking
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   └── Sidebar.tsx
│   └── ui/                  # shadcn/ui components
├── integrations/
│   └── supabase/
│       ├── client.ts        # Supabase client
│       └── types.ts         # Database types
└── App.tsx                  # Main app with routes
```

## Key Changes from Original

1. **Removed all dummy data** - Uses real Supabase database
2. **Real authentication** - Supabase email/password auth
3. **Database tables** - Members and Attendance tables with RLS
4. **Async operations** - All data operations are now async
5. **Error handling** - Proper error messages from Supabase
6. **Session persistence** - Automatic session management
7. **Protected routes** - Dashboard and member pages require login

## Testing the Application

### 1. Sign Up
- Go to `/signup`
- Enter email, password, and full name
- Click "Create Account"

### 2. Log In
- Go to `/login`
- Use your created credentials
- You'll be redirected to dashboard

### 3. Add Members
- Click "Add New Member"
- Fill in member details
- Select membership type
- Click "Add Member"

### 4. Mark Attendance
- Go to "Mark Attendance"
- Select a member
- Click "Mark Attendance"
- See real-time check-in list

### 5. View Members
- Go to "Members"
- Search and filter members
- Edit or delete members
- Toggle member status

## Troubleshooting

### "Table does not exist" error
- Make sure you've run the SQL migration in Supabase
- Check that you're using the correct project

### "Unauthorized" error
- Ensure RLS policies are created (they're in the migration)
- Check your Supabase authentication is enabled

### Data not saving
- Verify `.env` variables are correct
- Check Supabase connection in browser console
- Ensure you're logged in

### Session lost on refresh
- This is normal if cookies are cleared
- Log in again - session will be restored from Supabase

## Next Steps

You can enhance the application by:
- Adding member photo uploads to Supabase Storage
- Creating attendance reports and exports
- Adding payment/membership renewal tracking
- Implementing trainer assignment features
- Creating admin panel for gym management
- Adding email notifications
- Creating mobile app with React Native

## Support

For issues or questions:
1. Check Supabase console for database errors
2. Review browser console for JavaScript errors
3. Verify environment variables are set correctly
4. Check Supabase RLS policies are applied

---

Happy gym management! 💪
