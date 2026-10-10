CREATE TABLE public.beta_waitlist (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text NOT NULL UNIQUE,
 goal text NOT NULL DEFAULT 'Explorer Résonance',
 consent_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.beta_waitlist TO service_role;
ALTER TABLE public.beta_waitlist ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.beta_waitlist IS 'Private beta registrations. No browser role may read or write; validated public signup server function only.';