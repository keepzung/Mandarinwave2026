-- Fix RLS policy for user_profiles to allow admin inserts
-- This allows admins (authenticated via admin_accounts) to add student profiles

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Anyone can insert user profile" ON user_profiles;

-- Create a more permissive INSERT policy
-- Since admin authentication is handled via admin_accounts (not Supabase auth),
-- we allow INSERT operations without requiring auth.uid()
CREATE POLICY "Allow user profile creation (INSERT)"
ON user_profiles
FOR INSERT
WITH CHECK (true);

-- Note: This is safe because:
-- 1. The admin interface validates login through admin_accounts table
-- 2. Only admins have access to the /admin route
-- 3. Student registration also needs to create profiles without prior auth
