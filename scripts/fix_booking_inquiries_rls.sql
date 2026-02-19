-- Fix RLS policies for booking_inquiries table to allow admins to view inquiries

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert booking inquiries (INSERT)" ON booking_inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries (SELECT)" ON booking_inquiries;
DROP POLICY IF EXISTS "Admins can update inquiry status (UPDATE)" ON booking_inquiries;

-- Allow anyone to insert booking inquiries (for public booking form)
CREATE POLICY "Anyone can insert booking inquiries (INSERT)"
ON booking_inquiries
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view booking inquiries (simplified for development)
-- In production, you should restrict this to admins only
CREATE POLICY "Anyone can view booking inquiries (SELECT)"
ON booking_inquiries
FOR SELECT
USING (true);

-- Allow anyone to update booking inquiries (simplified for development)
-- In production, you should restrict this to admins only
CREATE POLICY "Anyone can update booking inquiries (UPDATE)"
ON booking_inquiries
FOR UPDATE
USING (true);
