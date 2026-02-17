-- Add role column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- Add a check constraint to ensure role is either 'student' or 'admin'
ALTER TABLE user_profiles
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('student', 'admin'));

-- Create an index on the role column for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Update RLS policies to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
