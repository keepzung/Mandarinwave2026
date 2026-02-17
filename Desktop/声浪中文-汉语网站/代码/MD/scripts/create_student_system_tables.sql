-- Create course packages table
CREATE TABLE IF NOT EXISTS course_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  class_count INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  validity_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student purchases table
CREATE TABLE IF NOT EXISTS student_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES user_profiles(user_id),
  package_id UUID NOT NULL REFERENCES course_packages(id),
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  total_classes INTEGER NOT NULL,
  used_classes INTEGER DEFAULT 0,
  remaining_classes INTEGER NOT NULL,
  expiry_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active', -- active, expired, cancelled
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table for student-teacher communication
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample course packages
INSERT INTO course_packages (name_zh, name_en, description_zh, description_en, class_count, price, validity_days) VALUES
('体验套餐', 'Trial Package', '5节课，适合初次体验', '5 classes, perfect for first-time learners', 5, 299.00, 30),
('基础套餐', 'Basic Package', '20节课，3个月有效期', '20 classes, valid for 3 months', 20, 999.00, 90),
('标准套餐', 'Standard Package', '50节课，6个月有效期', '50 classes, valid for 6 months', 50, 2199.00, 180),
('VIP套餐', 'VIP Package', '100节课，12个月有效期', '100 classes, valid for 12 months', 100, 3999.00, 365);

-- Enable RLS
ALTER TABLE course_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_packages
CREATE POLICY "Anyone can view active packages"
  ON course_packages FOR SELECT
  USING (is_active = true);

-- RLS Policies for student_purchases
CREATE POLICY "Students can view their own purchases"
  ON student_purchases FOR SELECT
  USING (student_id IN (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can insert their own purchases"
  ON student_purchases FOR INSERT
  WITH CHECK (student_id IN (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Allow purchase management"
  ON student_purchases FOR ALL
  USING (true);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  USING (to_user_id = auth.uid());

-- Create function to update remaining classes
CREATE OR REPLACE FUNCTION update_remaining_classes()
RETURNS TRIGGER AS $$
BEGIN
  NEW.remaining_classes := NEW.total_classes - NEW.used_classes;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic calculation
CREATE TRIGGER update_remaining_classes_trigger
BEFORE UPDATE ON student_purchases
FOR EACH ROW
EXECUTE FUNCTION update_remaining_classes();
