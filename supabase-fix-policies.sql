-- Run this in Supabase SQL Editor to fix "Loading then back to start"
-- The app needs to CREATE daily challenges and the original schema was missing this.

-- 1. Allow the app to INSERT new daily challenges (required for "Start Daily Challenge")
CREATE POLICY "Anyone can create daily challenges"
  ON daily_challenges FOR INSERT
  TO public
  WITH CHECK (true);

-- 2. Allow the app to UPDATE usage_count on locations (optional but recommended)
CREATE POLICY "Anyone can update location usage_count"
  ON locations FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
