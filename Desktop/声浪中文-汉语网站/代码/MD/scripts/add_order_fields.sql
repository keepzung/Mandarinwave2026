-- Add course_id and package_id fields to student_orders table
-- Run this in Supabase SQL Editor

-- Add course_id column
ALTER TABLE student_orders 
ADD COLUMN IF NOT EXISTS course_id UUID;

-- Add package_id column  
ALTER TABLE student_orders
ADD COLUMN IF NOT EXISTS package_id TEXT;

-- Add validity_days column
ALTER TABLE student_orders
ADD COLUMN IF NOT EXISTS validity_days INTEGER DEFAULT 365;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_student_orders_course_id ON student_orders(course_id);
