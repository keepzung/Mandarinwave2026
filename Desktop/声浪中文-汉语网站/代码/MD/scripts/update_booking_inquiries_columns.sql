-- Add preferred_date, preferred_time, and timezone columns to booking_inquiries table

ALTER TABLE booking_inquiries
ADD COLUMN IF NOT EXISTS preferred_date DATE,
ADD COLUMN IF NOT EXISTS preferred_time VARCHAR(10),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Beijing';

-- Update existing records to have Beijing timezone
UPDATE booking_inquiries
SET timezone = 'Asia/Beijing'
WHERE timezone IS NULL OR timezone = 'Asia/Shanghai';
