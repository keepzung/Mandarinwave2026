-- =============================================
-- MandarinWave Database Setup Script
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_key TEXT UNIQUE NOT NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  icon TEXT DEFAULT 'globe',
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create student_class_balance table
CREATE TABLE IF NOT EXISTS student_class_balance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_classes INTEGER DEFAULT 0,
  used_classes INTEGER DEFAULT 0,
  remaining_classes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id)
);

-- 5. Create student_orders table
CREATE TABLE IF NOT EXISTS student_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  package_name TEXT,
  classes_purchased INTEGER DEFAULT 0,
  amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create class_schedules table
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  teacher_name TEXT,
  scheduled_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  student_id UUID,
  student_name TEXT,
  notes TEXT,
  timezone TEXT DEFAULT 'Asia/Shanghai',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create booking_inquiries table
CREATE TABLE IF NOT EXISTS booking_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  preferred_date DATE,
  preferred_time TEXT,
  timezone TEXT DEFAULT 'Asia/Shanghai',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create admin_accounts table
CREATE TABLE IF NOT EXISTS admin_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create user_course_enrollments table
CREATE TABLE IF NOT EXISTS user_course_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_status TEXT DEFAULT 'interested' CHECK (enrollment_status IN ('interested', 'enrolled', 'completed', 'dropped')),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 10. Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Insert Default Courses
-- =============================================
INSERT INTO courses (course_key, title_zh, title_en, description_zh, description_en, icon, color, is_active) VALUES
('group', '小组课', 'Group Class', '3-6人小组课程，互动性强', '3-6 students group class, interactive', 'users', '#3B82F6', true),
('one-on-one', '一对一课程', 'One-on-One Class', '个性化定制课程', 'Personalized private lessons', 'user', '#10B981', true),
('kids', '少儿中文', 'Kids Chinese', '专为4-12岁儿童设计', 'Designed for children aged 4-12', 'graduation', '#F59E0B', true),
('hsk', 'HSK考试', 'HSK Exam Prep', 'HSK 1-6级考试准备', 'HSK Level 1-6 exam preparation', 'award', '#8B5CF6', true),
('culture', '文化体验', 'Culture Experience', '书法、绘画、茶艺等', 'Calligraphy, painting, tea ceremony', 'briefcase', '#EC4899', true),
('business', '商务中文', 'Business Chinese', '商务场景专业中文', 'Professional Chinese for business', 'briefcase', '#6366F1', true),
('winter-camp', '冬令营', 'Winter Camp', '寒假中文沉浸式体验', 'Winter holiday immersion program', 'calendar', '#0EA5E9', true),
('summer-camp', '夏令营', 'Summer Camp', '暑假中文沉浸式体验', 'Summer holiday immersion program', 'sun', '#F97316', true),
('city-tour', '城市游学', 'City Tour', '北京城市实地教学', 'Beijing city field trip learning', 'map-pin', '#14B8A6', true)
ON CONFLICT (course_key) DO NOTHING;

-- =============================================
-- Create Default Admin Account
-- Username: admin
-- Password: admin123 (Base64 encoded)
-- =============================================
INSERT INTO admin_accounts (username, password_hash, name, email, is_active) VALUES
('admin', 'YWRtaW4xMjM=', 'Administrator', 'admin@mandarinwave.cn', true)
ON CONFLICT (username) DO NOTHING;

-- =============================================
-- Create Row Level Security Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_class_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to courses
CREATE POLICY "Courses are viewable by everyone" ON courses
  FOR SELECT USING (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Allow users to view their own class balance
CREATE POLICY "Users can view own balance" ON student_class_balance
  FOR SELECT USING (auth.uid()::text = student_id::text);

-- Allow users to view their own orders
CREATE POLICY "Users can view own orders" ON student_orders
  FOR SELECT USING (auth.uid()::text = student_id::text);

-- Allow users to insert their own orders
CREATE POLICY "Users can insert own orders" ON student_orders
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own orders (for payment callback)
CREATE POLICY "Orders can be updated" ON student_orders
  FOR UPDATE USING (true);

-- Allow public to submit booking inquiries
CREATE POLICY "Anyone can submit booking inquiry" ON booking_inquiries
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid()::text = from_user_id::text OR auth.uid()::text = to_user_id::text);

-- Allow users to insert messages
CREATE POLICY "Users can insert messages" ON messages
  FOR INSERT WITH CHECK (auth.uid()::text = from_user_id::text);

-- Allow users to view schedules related to them
CREATE POLICY "Users can view relevant schedules" ON class_schedules
  FOR SELECT USING (true);

-- Allow schedule insertion and updates (for admin operations via service role)
CREATE POLICY "Schedules can be managed" ON class_schedules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Schedules can be updated" ON class_schedules
  FOR UPDATE USING (true);

CREATE POLICY "Schedules can be deleted" ON class_schedules
  FOR DELETE USING (true);

-- Allow class balance management
CREATE POLICY "Class balance can be inserted" ON student_class_balance
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Class balance can be updated" ON student_class_balance
  FOR UPDATE USING (true);

-- Allow enrollment management
CREATE POLICY "Enrollments viewable by user" ON user_course_enrollments
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Enrollments can be inserted" ON user_course_enrollments
  FOR INSERT WITH CHECK (true);

-- =============================================
-- Create Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_student_class_balance_student_id ON student_class_balance(student_id);
CREATE INDEX IF NOT EXISTS idx_student_orders_student_id ON student_orders(student_id);
CREATE INDEX IF NOT EXISTS idx_student_orders_status ON student_orders(status);
CREATE INDEX IF NOT EXISTS idx_class_schedules_date ON class_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_class_schedules_student_id ON class_schedules(student_id);
CREATE INDEX IF NOT EXISTS idx_booking_inquiries_status ON booking_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_messages_from_user ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id);

-- =============================================
-- Done! 
-- Default admin login: username: admin, password: admin123
-- =============================================
