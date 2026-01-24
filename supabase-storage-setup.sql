-- Run this in Supabase SQL Editor so Contribute (image upload) works.
-- If you already have an "images" bucket, you can skip step 1 and run only step 2.

-- 1) Create the "images" bucket (if it doesn't exist)
--    If you prefer the Dashboard: Storage → New bucket → name "images", set Public ON.
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2) Allow the app to upload and read images (RLS on storage.objects)
--    Drop first in case you already created them with different names.
DROP POLICY IF EXISTS "Allow uploads to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
CREATE POLICY "Allow uploads to images bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images'::text);

DROP POLICY IF EXISTS "Allow public read for images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
CREATE POLICY "Allow public read for images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images'::text);
