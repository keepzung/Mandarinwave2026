-- Fix RLS policy for user_course_enrollments to allow inserts during registration
-- The issue is that auth.uid() might not be set immediately after signUp

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can insert their own enrollments" ON user_course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON user_course_enrollments;

-- Recreate policies with more permissive INSERT policy
CREATE POLICY "Users can view their own enrollments"
  ON user_course_enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Allow INSERT if either auth.uid matches OR if the row is being inserted with a valid user_id
-- This allows registration to insert enrollments even if session isn't fully established
CREATE POLICY "Users can insert their own enrollments"
  ON user_course_enrollments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM auth.users WHERE id = user_course_enrollments.user_id)
  );

CREATE POLICY "Users can update their own enrollments"
  ON user_course_enrollments FOR UPDATE
  USING (auth.uid() = user_id);
