-- Update the culture course to customed course
UPDATE courses 
SET 
  title_zh = '定制课程',
  title_en = 'Customed Courses',
  description_zh = '高端定制化中文学习服务',
  description_en = 'Premium customized Chinese learning services',
  updated_at = NOW()
WHERE course_key = 'culture';
