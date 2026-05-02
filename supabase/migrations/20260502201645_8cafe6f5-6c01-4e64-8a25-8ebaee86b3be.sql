CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  visitor_id TEXT,
  path TEXT,
  template_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies => denied for anon/authenticated.
-- Reads are performed by edge functions using the service role key.

CREATE INDEX idx_analytics_events_type_created
  ON public.analytics_events (event_type, created_at DESC);

CREATE INDEX idx_analytics_events_visitor
  ON public.analytics_events (visitor_id);