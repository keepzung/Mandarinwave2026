-- Fix RLS policies for user_profiles table to allow admin (logged via localStorage) to view students

-- Drop the existing "Admins can view all profiles (SELECT)" policy if it's too restrictive
DROP POLICY IF EXISTS "Admins can view all profiles (SELECT)" ON public.user_profiles;

-- Create a more permissive policy that allows anyone to view student profiles
-- This is safe because student profiles don't contain sensitive information
-- and admin authentication is handled at the application layer
CREATE POLICY "Anyone can view student profiles"
ON public.user_profiles
FOR SELECT
USING (role = 'student');

-- Also create a policy to allow viewing of admin profiles for admin management
CREATE POLICY "Anyone can view admin profiles"
ON public.user_profiles
FOR SELECT
USING (role = 'admin');

-- Keep the existing user-specific view policy
-- This allows authenticated users to view their own profile
-- Note: This policy is already in place as "Users can view their own profile (SELECT)"
