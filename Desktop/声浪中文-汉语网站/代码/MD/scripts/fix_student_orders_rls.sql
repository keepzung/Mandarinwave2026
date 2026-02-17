-- Fix student_orders RLS policies
-- Run this in Supabase SQL Editor

-- Drop all existing policies on student_orders
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

-- Create new permissive policies
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
