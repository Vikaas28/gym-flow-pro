-- Create members table
CREATE TABLE IF NOT EXISTS members (
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

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_is_active ON members(is_active);
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_member_id ON attendance(member_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own members" ON members;
DROP POLICY IF EXISTS "Users can insert their own members" ON members;
DROP POLICY IF EXISTS "Users can update their own members" ON members;
DROP POLICY IF EXISTS "Users can delete their own members" ON members;
DROP POLICY IF EXISTS "Users can view their own attendance records" ON attendance;
DROP POLICY IF EXISTS "Users can insert their own attendance records" ON attendance;
DROP POLICY IF EXISTS "Users can delete their own attendance records" ON attendance;

-- Create RLS policies for members
CREATE POLICY "Users can view their own members"
  ON members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own members"
  ON members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own members"
  ON members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own members"
  ON members FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for attendance
CREATE POLICY "Users can view their own attendance records"
  ON attendance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attendance records"
  ON attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own attendance records"
  ON attendance FOR DELETE
  USING (auth.uid() = user_id);
