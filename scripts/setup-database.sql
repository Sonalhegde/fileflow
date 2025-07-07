-- Create the shared_images table
CREATE TABLE IF NOT EXISTS shared_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(6) UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the code column for faster lookups
CREATE INDEX IF NOT EXISTS idx_shared_images_code ON shared_images(code);

-- Create a storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS (Row Level Security) policies
ALTER TABLE shared_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to shared_images
CREATE POLICY "Allow public read access" ON shared_images
  FOR SELECT USING (true);

-- Allow public insert access to shared_images
CREATE POLICY "Allow public insert access" ON shared_images
  FOR INSERT WITH CHECK (true);

-- Set up storage policies
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public downloads" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');
