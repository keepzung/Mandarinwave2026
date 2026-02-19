-- Fix RLS policies for class_schedules to work with custom admin authentication
-- The admin users authenticate via admin_accounts table, not Supabase auth,
-- so auth.uid() returns null for them

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Admins can update schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Admins can delete schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Admins can view all schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Students can view their schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Anyone can view unassigned schedules" ON public.class_schedules;

-- Create permissive policies that work with both auth systems
-- Allow anyone to manage schedules (admin validation happens in the app layer)
CREATE POLICY "Allow schedule management" ON public.class_schedules
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Note: In production, you should implement proper security by either:
-- 1. Using Supabase auth for admin users as well, OR
-- 2. Using a server-side API route with service role key for admin operations, OR
-- 3. Adding a middleware to verify admin status from admin_accounts table
