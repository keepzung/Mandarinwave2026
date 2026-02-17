-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_key TEXT UNIQUE NOT NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  href TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_course_enrollments table for tracking user course interests
CREATE TABLE IF NOT EXISTS user_course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_status TEXT DEFAULT 'interested', -- interested, enrolled, completed
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for courses (public read access)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (is_active = true);

-- Create policies for user_course_enrollments
CREATE POLICY "Users can view their own enrollments"
  ON user_course_enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments"
  ON user_course_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON user_course_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert initial course data
INSERT INTO courses (course_key, title_zh, title_en, description_zh, description_en, category, color, icon, href) VALUES
  ('group', '小班课程', 'Small Group Classes', '4-6人小班，互动性强', '4-6 students, highly interactive', 'group', 'blue', 'Users', '/courses/group'),
  ('one-on-one', '一对一', 'One-on-One', '个性化定制课程，灵活时间安排', 'Personalized courses with flexible scheduling', 'private', 'orange', 'BookOpen', '/courses/one-on-one'),
  ('kids', '少儿中文', 'Kids'' Chinese', '趣味互动，快乐学中文', 'Fun and interactive learning for children', 'kids', 'blue', 'Baby', '/courses/kids'),
  ('hsk', 'HSK考试', 'HSK Preparation', '针对性备考，高通过率', 'Targeted prep with high pass rates', 'exam', 'orange', 'GraduationCap', '/courses/hsk'),
  ('culture', '定制课程', 'Customed Courses', '高端定制化中文学习服务', 'Premium customized Chinese learning services', 'culture', 'blue', 'Sparkles', '/courses/culture'),
  ('business', '商务中文', 'Business Chinese', '专业商务场景中文培训', 'Professional business Chinese training', 'business', 'orange', 'Briefcase', '/courses/business'),
  ('winter-camp', '冬令营', 'Winter Camp', '寒假沉浸式中文学习体验', 'Immersive Chinese learning during winter break', 'camp', 'blue', 'Snowflake', '/courses/winter-camp'),
  ('summer-camp', '夏令营', 'Summer Camp', '暑期沉浸式中文学习体验', 'Immersive Chinese learning during summer break', 'camp', 'orange', 'Sun', '/courses/summer-camp'),
  ('city-tour', '城市旅行', 'City Tour', '在旅行中体验中文和文化', 'Experience Chinese language and culture through travel', 'tour', 'blue', 'MapPin', '/courses/city-tour')
ON CONFLICT (course_key) DO NOTHING;

-- Add course_id to booking_inquiries table
ALTER TABLE booking_inquiries ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id);
ALTER TABLE booking_inquiries ADD COLUMN IF NOT EXISTS preferred_date TEXT;
ALTER TABLE booking_inquiries ADD COLUMN IF NOT EXISTS preferred_time TEXT;
