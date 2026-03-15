INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'message-attachments');

CREATE POLICY "Anyone can view message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'message-attachments');

CREATE POLICY "Users can delete own message attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'message-attachments' AND (storage.foldername(name))[1] = auth.uid()::text);