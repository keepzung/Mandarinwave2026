-- Fix student_id mismatch in class_schedules table
-- This script converts auth.users.id to user_profiles.id in class_schedules.student_id
-- Run this in Supabase SQL Editor

-- First, let's see what needs to be fixed
SELECT 
  cs.id as schedule_id,
  cs.student_id as current_student_id,
  up.id as correct_student_id,
  up.name as student_name
FROM class_schedules cs
LEFT JOIN user_profiles up ON cs.student_id = up.user_id
WHERE cs.student_id IS NOT NULL;

-- Update class_schedules to use user_profiles.id instead of auth.users.id
-- This joins class_schedules.student_id (which is auth.users.id) with user_profiles.user_id
-- and then updates class_schedules.student_id to be user_profiles.id
UPDATE class_schedules cs
SET student_id = up.id
FROM user_profiles up
WHERE cs.student_id = up.user_id
  AND cs.student_id != up.id;

-- Also fix student_orders table if needed
-- Check student_orders
SELECT 
  so.id as order_id,
  so.student_id as current_student_id,
  up.id as correct_student_id,
  up.name as student_name
FROM student_orders so
LEFT JOIN user_profiles up ON so.student_id = up.user_id
WHERE so.student_id IS NOT NULL;

-- Update student_orders to use user_profiles.id
UPDATE student_orders so
SET student_id = up.id
FROM user_profiles up
WHERE so.student_id = up.user_id
  AND so.student_id != up.id;

-- Also fix student_class_balance table if needed
UPDATE student_class_balance scb
SET student_id = up.id
FROM user_profiles up
WHERE scb.student_id = up.user_id
  AND scb.student_id != up.id;
