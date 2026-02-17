-- Create schedule table for class scheduling
CREATE TABLE IF NOT EXISTS public.class_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    teacher_name TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT DEFAULT 'Asia/Shanghai',
    student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_name TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_schedules_date ON public.class_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_schedules_student ON public.class_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON public.class_schedules(status);

-- Enable RLS
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can manage all schedules
CREATE POLICY "Admins can manage schedules" ON public.class_schedules
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.user_id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Students can view their own schedules
CREATE POLICY "Students can view their schedules" ON public.class_schedules
    FOR SELECT
    USING (student_id = auth.uid());

-- Anyone can view unassigned schedules (for booking)
CREATE POLICY "Anyone can view unassigned schedules" ON public.class_schedules
    FOR SELECT
    USING (student_id IS NULL);

-- Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    specialties TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for teachers
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Anyone can view active teachers
CREATE POLICY "Anyone can view active teachers" ON public.teachers
    FOR SELECT
    USING (is_active = true);

-- Admins can manage teachers
CREATE POLICY "Admins can manage teachers" ON public.teachers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.user_id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Insert some sample teachers
INSERT INTO public.teachers (name, email, specialties, is_active) VALUES
    ('李老师', 'teacher.li@mandarinwave.cn', ARRAY['HSK', 'Business Chinese'], true),
    ('王老师', 'teacher.wang@mandarinwave.cn', ARRAY['Kids Chinese', 'Culture'], true),
    ('张老师', 'teacher.zhang@mandarinwave.cn', ARRAY['One-on-One', 'Conversation'], true)
ON CONFLICT (email) DO NOTHING;
