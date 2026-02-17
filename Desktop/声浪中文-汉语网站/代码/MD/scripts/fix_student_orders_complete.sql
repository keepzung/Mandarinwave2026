-- Complete fix for student_orders table
-- Run this in Supabase SQL Editor

-- 1. Add missing columns if they don't exist
ALTER TABLE student_orders 
ADD COLUMN IF NOT EXISTS course_id UUID;

ALTER TABLE student_orders
ADD COLUMN IF NOT EXISTS package_id TEXT;

ALTER TABLE student_orders
ADD COLUMN IF NOT EXISTS validity_days INTEGER DEFAULT 365;

-- 2. Update status constraint from 'completed' to 'paid'
ALTER TABLE student_orders DROP CONSTRAINT IF EXISTS student_orders_status_check;
UPDATE student_orders SET status = 'paid' WHERE status = 'completed';
ALTER TABLE student_orders ADD CONSTRAINT student_orders_status_check 
  CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded', 'pending_confirmation'));

-- 3. Drop and recreate RLS policies
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'student_orders'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON student_orders', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Allow select on student_orders"
  ON student_orders FOR SELECT
  USING (true);

CREATE POLICY "Allow insert on student_orders"
  ON student_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update on student_orders"
  ON student_orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete on student_orders"
  ON student_orders FOR DELETE
  USING (true);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_orders_course_id ON student_orders(course_id);
