-- Update student_orders status constraint to use 'paid' instead of 'completed'
-- Run this in Supabase SQL Editor

-- 1. Drop old constraint
ALTER TABLE student_orders DROP CONSTRAINT IF EXISTS student_orders_status_check;

-- 2. Update existing data
UPDATE student_orders SET status = 'paid' WHERE status = 'completed';

-- 3. Add new constraint
ALTER TABLE student_orders ADD CONSTRAINT student_orders_status_check 
  CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded'));
