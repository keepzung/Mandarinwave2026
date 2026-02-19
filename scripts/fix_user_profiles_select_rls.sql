-- Fix RLS policy for user_profiles to ensure users can read their own profile
-- This fixes the "User profile not found" error during payment completion

-- Drop existing restrictive SELECT policy if exists
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Create a more permissive SELECT policy that allows:
-- 1. Users to view their own profile (using auth.uid())
-- 2. Also allows reading profile when user_id matches the authenticated user
CREATE POLICY "Users can view their own profile"
ON user_profiles
FOR SELECT
USING (
  auth.uid() = user_id
);

-- Also ensure the admin policy doesn't interfere with regular user access
-- The admin policy should be additive, not restrictive
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Recreate admin view policy using security definer function
-- Only if the is_admin() function exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
    EXECUTE 'CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (is_admin())';
  END IF;
END
$$;
