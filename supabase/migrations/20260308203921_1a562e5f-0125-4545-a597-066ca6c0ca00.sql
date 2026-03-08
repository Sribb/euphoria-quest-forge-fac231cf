
-- LTI 1.3 Platform configurations (Canvas instances)
CREATE TABLE public.lti_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text NOT NULL,
  client_id text NOT NULL,
  deployment_id text NOT NULL,
  auth_login_url text NOT NULL,
  auth_token_url text NOT NULL,
  jwks_url text NOT NULL,
  educator_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(issuer, client_id, deployment_id)
);

-- RSA key pairs for JWKS
CREATE TABLE public.lti_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kid text NOT NULL UNIQUE,
  public_key_jwk jsonb NOT NULL,
  private_key_pem text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Track LTI launches for grade passback
CREATE TABLE public.lti_launches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id uuid REFERENCES public.lti_platforms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  content_type text NOT NULL, -- 'lesson' or 'simulator'
  content_id text NOT NULL,
  scoring_mode text NOT NULL DEFAULT 'score', -- 'score' or 'completion'
  lineitem_url text, -- AGS lineitem for grade passback
  ags_endpoint text, -- AGS base endpoint
  ags_token_url text, -- Token endpoint for AGS
  lti_user_id text, -- LTI user sub claim
  launched_at timestamptz NOT NULL DEFAULT now(),
  last_score_synced_at timestamptz,
  score_value numeric,
  score_max numeric DEFAULT 100,
  completion_status text DEFAULT 'pending' -- 'pending','completed','failed'
);

-- Nonce tracking to prevent replay attacks
CREATE TABLE public.lti_nonces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nonce text NOT NULL,
  platform_id uuid REFERENCES public.lti_platforms(id) ON DELETE CASCADE NOT NULL,
  used_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(nonce, platform_id)
);

-- LTI deep linking selections (content items available)
CREATE TABLE public.lti_content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  educator_id uuid NOT NULL,
  content_type text NOT NULL, -- 'lesson' or 'simulator'
  content_id text NOT NULL, -- lesson order_index or simulator session type
  pathway text, -- for lessons
  title text NOT NULL,
  description text,
  scoring_mode text NOT NULL DEFAULT 'score',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(educator_id, content_type, content_id, pathway)
);

-- RLS
ALTER TABLE public.lti_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_nonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_content_items ENABLE ROW LEVEL SECURITY;

-- lti_platforms: educators manage their own
CREATE POLICY "Educators manage own platforms" ON public.lti_platforms FOR ALL
  USING (auth.uid() = educator_id)
  WITH CHECK (auth.uid() = educator_id);

-- lti_keys: readable by all (for JWKS endpoint via service role), managed by service role only
CREATE POLICY "Anyone can read active keys" ON public.lti_keys FOR SELECT
  USING (is_active = true);

-- lti_launches: users see their own
CREATE POLICY "Users view own launches" ON public.lti_launches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert launches" ON public.lti_launches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can update launches" ON public.lti_launches FOR UPDATE
  USING (true);

-- lti_nonces: service role manages
CREATE POLICY "Service can manage nonces" ON public.lti_nonces FOR ALL
  USING (true) WITH CHECK (true);

-- lti_content_items: educators manage their own
CREATE POLICY "Educators manage own content items" ON public.lti_content_items FOR ALL
  USING (auth.uid() = educator_id)
  WITH CHECK (auth.uid() = educator_id);

-- Cleanup old nonces (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_lti_nonces()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.lti_nonces WHERE used_at < now() - interval '1 hour';
$$;
