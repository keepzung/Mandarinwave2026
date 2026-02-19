-- Fix infinite recursion in user_profiles and dependent tables
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Admins can manage teachers" ON public.teachers;

-- Create a security definer function to check if user is admin
-- This breaks the recursion by using a function with elevated privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies using the security definer function
-- This prevents infinite recursion

-- User profiles: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR SELECT
    USING (is_admin());

-- Class schedules: Admins can manage all schedules
CREATE POLICY "Admins can manage schedules" ON public.class_schedules
    FOR ALL
    USING (is_admin());

-- Teachers: Admins can manage teachers
CREATE POLICY "Admins can manage teachers" ON public.teachers
    FOR ALL
    USING (is_admin());

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
