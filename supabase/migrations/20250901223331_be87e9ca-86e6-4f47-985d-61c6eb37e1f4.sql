-- Create storage bucket for platform logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('platform-logos', 'platform-logos', true);

-- Create RLS policies for the platform logos bucket
CREATE POLICY "Platform logos are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'platform-logos');

-- Allow authenticated users to upload platform logos (for admin purposes)
CREATE POLICY "Authenticated users can upload platform logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'platform-logos' AND auth.role() = 'authenticated');

-- Allow authenticated users to update platform logos
CREATE POLICY "Authenticated users can update platform logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'platform-logos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete platform logos
CREATE POLICY "Authenticated users can delete platform logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'platform-logos' AND auth.role() = 'authenticated');