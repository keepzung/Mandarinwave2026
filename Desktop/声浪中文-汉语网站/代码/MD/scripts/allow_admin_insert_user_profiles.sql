-- Fix RLS policy for user_profiles to allow admin to add students
-- Admin authentication is handled at application level via admin_accounts

-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Allow user profile creation (INSERT)" ON user_profiles;

-- Create a permissive insert policy
-- This allows any user to insert into user_profiles
-- Admin validation is already handled in the application layer
CREATE POLICY "Allow profile creation"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

-- Keep the existing policies for SELECT and UPDATE
-- These ensure users can only see/edit their own profiles unless they're admin
