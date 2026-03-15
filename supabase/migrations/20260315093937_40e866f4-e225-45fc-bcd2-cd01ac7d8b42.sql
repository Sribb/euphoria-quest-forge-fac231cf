
-- Table to store issued certificates/credentials
CREATE TABLE IF NOT EXISTS user_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  credential_id text NOT NULL UNIQUE DEFAULT 'EU-' || upper(substr(md5(random()::text), 1, 8)),
  certificate_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  tier text NOT NULL DEFAULT 'beginner',
  category text NOT NULL DEFAULT 'general',
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE user_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates" ON user_certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own certificates" ON user_certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Public verification: anyone can verify a certificate by credential_id
CREATE POLICY "Anyone can verify certificates" ON user_certificates FOR SELECT USING (true);

-- Function to generate credential IDs
CREATE OR REPLACE FUNCTION generate_credential_id() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.credential_id := 'EU-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_credential_id BEFORE INSERT ON user_certificates FOR EACH ROW EXECUTE FUNCTION generate_credential_id();

-- Notification trigger when certificate is issued
CREATE OR REPLACE FUNCTION notify_on_certificate_earned() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, notification_type, category, icon)
  VALUES (
    NEW.user_id,
    '🎉 New Achievement Unlocked!',
    'You earned: ' || NEW.title,
    'achievement',
    'info',
    '🏆'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_certificate_earned AFTER INSERT ON user_certificates FOR EACH ROW EXECUTE FUNCTION notify_on_certificate_earned();
