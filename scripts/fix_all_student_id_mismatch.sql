-- Fix student_id mismatch in all tables
-- This script converts auth.users.id to user_profiles.id in all related tables
-- Run this in Supabase SQL Editor

-- 1. Fix class_schedules.student_id
-- Check what needs to be fixed first
SELECT 
  cs.id as schedule_id,
  cs.student_id as current_student_id,
  up.id as correct_student_id,
  up.name as student_name
FROM class_schedules cs
LEFT JOIN user_profiles up ON cs.student_id = up.user_id
WHERE cs.student_id IS NOT NULL
  AND cs.student_id != up.id;

-- Update class_schedules to use user_profiles.id
UPDATE class_schedules cs
SET student_id = up.id
FROM user_profiles up
WHERE cs.student_id = up.user_id
  AND cs.student_id != up.id;

-- 2. Fix student_orders.student_id
-- Check what needs to be fixed
SELECT 
  so.id as order_id,
  so.student_id as current_student_id,
  up.id as correct_student_id,
  up.name as student_name
FROM student_orders so
LEFT JOIN user_profiles up ON so.student_id = up.user_id
WHERE so.student_id IS NOT NULL
  AND so.student_id != up.id;

-- Update student_orders to use user_profiles.id
UPDATE student_orders so
SET student_id = up.id
FROM user_profiles up
WHERE so.student_id = up.user_id
  AND so.student_id != up.id;

-- 3. Fix student_class_balance.student_id
-- Check what needs to be fixed
SELECT 
  scb.id as balance_id,
  scb.student_id as current_student_id,
  up.id as correct_student_id,
  up.name as student_name
FROM student_class_balance scb
LEFT JOIN user_profiles up ON scb.student_id = up.user_id
WHERE scb.student_id IS NOT NULL
  AND scb.student_id != up.id;

-- Update student_class_balance to use user_profiles.id
UPDATE student_class_balance scb
SET student_id = up.id
FROM user_profiles up
WHERE scb.student_id = up.user_id
  AND scb.student_id != up.id;

-- 4. Verify the fixes
SELECT 'class_schedules' as table_name, COUNT(*) as records_with_auth_id
FROM class_schedules cs
WHERE cs.student_id IN (SELECT user_id FROM user_profiles WHERE user_id IS NOT NULL)
  AND cs.student_id NOT IN (SELECT id FROM user_profiles);

SELECT 'student_orders' as table_name, COUNT(*) as records_with_auth_id
FROM student_orders so
WHERE so.student_id IN (SELECT user_id FROM user_profiles WHERE user_id IS NOT NULL)
  AND so.student_id NOT IN (SELECT id FROM user_profiles);

SELECT 'student_class_balance' as table_name, COUNT(*) as records_with_auth_id
FROM student_class_balance scb
WHERE scb.student_id IN (SELECT user_id FROM user_profiles WHERE user_id IS NOT NULL)
  AND scb.student_id NOT IN (SELECT id FROM user_profiles);
