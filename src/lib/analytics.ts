import { supabase } from '@/integrations/supabase/client';

const VISITOR_KEY = 'or_visitor_id';

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

function dntEnabled(): boolean {
  try {
    const v = navigator.doNotTrack || (window as any).doNotTrack;
    return v === '1' || v === 'yes';
  } catch {
    return false;
  }
}

export type AnalyticsEvent = 'page_view' | 'resume_created' | 'pdf_download';

interface TrackPayload {
  path?: string;
  templateId?: string;
  metadata?: Record<string, unknown>;
}

export function track(eventType: AnalyticsEvent, payload: TrackPayload = {}): void {
  if (dntEnabled()) return;
  // Fire-and-forget; never throw.
  try {
    supabase
      .from('analytics_events')
      .insert([{
        event_type: eventType,
        visitor_id: getVisitorId(),
        path: payload.path ?? null,
        template_id: payload.templateId ?? null,
        metadata: payload.metadata ?? {},
      }])
      .then(({ error }) => {
        if (error) console.debug('[analytics] insert failed', error.message);
      });
  } catch (err) {
    console.debug('[analytics] track threw', err);
  }
}
