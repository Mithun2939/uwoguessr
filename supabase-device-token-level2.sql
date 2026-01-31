-- Level 2 (no-login) daily attempt enforcement:
-- one daily submission per DEVICE, enforced server-side.
--
-- Run this in Supabase SQL Editor.

-- 1) Table to track per-device daily submissions (private)
CREATE TABLE IF NOT EXISTS daily_device_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT NOT NULL,
  challenge_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Unique constraint: one per device per day
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'daily_device_submissions_unique_device_date'
  ) THEN
    CREATE UNIQUE INDEX daily_device_submissions_unique_device_date
      ON daily_device_submissions (device_id, challenge_date);
  END IF;
END $$;

-- 3) RLS ON, no public policies (service role in Edge Function bypasses RLS)
ALTER TABLE daily_device_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert device submissions" ON daily_device_submissions;
DROP POLICY IF EXISTS "Anyone can view device submissions" ON daily_device_submissions;

