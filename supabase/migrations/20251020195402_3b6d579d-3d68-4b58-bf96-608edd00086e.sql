-- Create storage bucket for community posts
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-posts', 'community-posts', true);

-- Enable RLS for storage
CREATE POLICY "Anyone can view community post images"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-posts');

CREATE POLICY "Users can upload their own post images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'community-posts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own post images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'community-posts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own post images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'community-posts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add category column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';

-- Add media type column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_type text;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Update existing posts to have a category
UPDATE posts SET category = 'general' WHERE category IS NULL;