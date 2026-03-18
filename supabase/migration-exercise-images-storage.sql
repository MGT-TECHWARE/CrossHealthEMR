-- Create storage bucket for exercise images
-- Run this in Supabase SQL Editor

-- Create the bucket (public so images can be displayed without auth)
INSERT INTO storage.buckets (id, name, public)
VALUES ('exercise-images', 'exercise-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload exercise images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exercise-images');

-- Allow authenticated users to update/overwrite images
CREATE POLICY "Authenticated users can update exercise images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'exercise-images');

-- Allow anyone to view exercise images (public bucket)
CREATE POLICY "Anyone can view exercise images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'exercise-images');
