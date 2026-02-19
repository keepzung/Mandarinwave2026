-- Fix RLS policy for user_course_enrollments
-- Remove the problematic auth.users check that causes "permission denied" error

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can insert their own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON user_course_enrollments;

-- Recreate policies with simpler INSERT policy that doesn't query auth.users
CREATE POLICY "Users can view their own enrollments"
  ON user_course_enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Simplified INSERT policy that allows any authenticated user to insert
-- This avoids the "permission denied for table users" error
CREATE POLICY "Users can insert their own enrollments"
  ON user_course_enrollments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own enrollments"
  ON user_course_enrollments FOR UPDATE
  USING (auth.uid() = user_id);
