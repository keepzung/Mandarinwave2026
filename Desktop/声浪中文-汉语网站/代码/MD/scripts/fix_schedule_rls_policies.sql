-- Drop and recreate RLS policies for class_schedules with explicit INSERT permission

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Students can view their schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Anyone can view unassigned schedules" ON public.class_schedules;

-- Ensure is_admin() function exists
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- Create separate policies for each operation to be more explicit
CREATE POLICY "Admins can insert schedules" ON public.class_schedules
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin());

CREATE POLICY "Admins can update schedules" ON public.class_schedules
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can delete schedules" ON public.class_schedules
    FOR DELETE
    TO authenticated
    USING (is_admin());

CREATE POLICY "Admins can view all schedules" ON public.class_schedules
    FOR SELECT
    TO authenticated
    USING (is_admin());

CREATE POLICY "Students can view their schedules" ON public.class_schedules
    FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Anyone can view unassigned schedules" ON public.class_schedules
    FOR SELECT
    TO authenticated
    USING (student_id IS NULL);

-- Also fix teachers table policies
DROP POLICY IF EXISTS "Admins can manage teachers" ON public.teachers;
DROP POLICY IF EXISTS "Anyone can view active teachers" ON public.teachers;

CREATE POLICY "Admins can insert teachers" ON public.teachers
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin());

CREATE POLICY "Admins can update teachers" ON public.teachers
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can delete teachers" ON public.teachers
    FOR DELETE
    TO authenticated
    USING (is_admin());

CREATE POLICY "Anyone can view active teachers" ON public.teachers
    FOR SELECT
    TO authenticated
    USING (is_active = true OR is_admin());

-- Temporary policy to allow all authenticated users (for testing)
-- Comment out these lines in production
-- CREATE POLICY "Temp: Allow all authenticated users" ON public.class_schedules
--     FOR ALL
--     TO authenticated
--     USING (true)
--     WITH CHECK (true);
