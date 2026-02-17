-- Fix RLS policies for admin_accounts table to allow login

-- Drop existing policies
DROP POLICY IF EXISTS "Allow service role to manage admin accounts" ON admin_accounts;
DROP POLICY IF EXISTS "Anyone can view admin accounts for login" ON admin_accounts;

-- Create policy to allow anyone to SELECT (for login verification)
-- This is safe because passwords are hashed
CREATE POLICY "Anyone can view admin accounts for login"
ON admin_accounts FOR SELECT
TO public
USING (true);

-- Create policy to allow only service role to INSERT, UPDATE, DELETE
CREATE POLICY "Only service role can modify admin accounts"
ON admin_accounts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
