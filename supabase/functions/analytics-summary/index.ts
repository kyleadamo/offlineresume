import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const adminKey = req.headers.get('x-admin-key');
  const expected = Deno.env.get('ADMIN_ANALYTICS_KEY');
  if (!expected || adminKey !== expected) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('event_type, visitor_id, template_id, created_at, metadata')
    .order('created_at', { ascending: false })
    .limit(50000);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const now = Date.now();
  const days30 = now - 30 * 24 * 60 * 60 * 1000;

  const visitors = new Set<string>();
  const visitors30 = new Set<string>();
  let pageViews = 0;
  let pageViews30 = 0;
  let resumesCreated = 0;
  let resumesCreated30 = 0;
  let pdfDownloads = 0;
  let pdfDownloads30 = 0;
  let pdfRemote = 0;
  let pdfBrowser = 0;
  const templateCounts: Record<string, number> = {};
  const importMethodCounts: Record<string, number> = { paste: 0, pdf: 0, url: 0, json: 0 };
  const importMethodCounts30: Record<string, number> = { paste: 0, pdf: 0, url: 0, json: 0 };
  let resumesImported = 0;
  let resumesImported30 = 0;
  const dailyMap: Record<string, { date: string; visitors: Set<string>; pdf: number; created: number }> = {};

  for (const e of events ?? []) {
    const ts = new Date(e.created_at).getTime();
    const recent = ts >= days30;
    const day = new Date(e.created_at).toISOString().slice(0, 10);
    if (!dailyMap[day]) dailyMap[day] = { date: day, visitors: new Set(), pdf: 0, created: 0 };
    if (e.visitor_id) {
      visitors.add(e.visitor_id);
      if (recent) {
        visitors30.add(e.visitor_id);
        dailyMap[day].visitors.add(e.visitor_id);
      }
    }

    if (e.event_type === 'page_view') {
      pageViews++;
      if (recent) pageViews30++;
    } else if (e.event_type === 'resume_created') {
      resumesCreated++;
      if (recent) {
        resumesCreated30++;
        dailyMap[day].created++;
      }
    } else if (e.event_type === 'resume_imported') {
      resumesImported++;
      if (recent) resumesImported30++;
      const method = String((e.metadata as any)?.method ?? 'unknown');
      importMethodCounts[method] = (importMethodCounts[method] || 0) + 1;
      if (recent) importMethodCounts30[method] = (importMethodCounts30[method] || 0) + 1;
    } else if (e.event_type === 'pdf_download') {
      pdfDownloads++;
      if (recent) {
        pdfDownloads30++;
        dailyMap[day].pdf++;
      }
      const mode = (e.metadata as any)?.mode;
      if (mode === 'browser_print') pdfBrowser++;
      else pdfRemote++;
      if (e.template_id) {
        templateCounts[e.template_id] = (templateCounts[e.template_id] || 0) + 1;
      }
    }
  }

  const daily = Object.values(dailyMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({ date: d.date, visitors: d.visitors.size, pdf: d.pdf, created: d.created }));

  const topTemplates = Object.entries(templateCounts)
    .map(([template_id, count]) => ({ template_id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return new Response(
    JSON.stringify({
      totals: {
        uniqueVisitors: visitors.size,
        pageViews,
        resumesCreated,
        pdfDownloads,
        pdfRemote,
        pdfBrowserPrint: pdfBrowser,
        resumesImported,
      },
      last30Days: {
        uniqueVisitors: visitors30.size,
        pageViews: pageViews30,
        resumesCreated: resumesCreated30,
        pdfDownloads: pdfDownloads30,
        resumesImported: resumesImported30,
      },
      topTemplates,
      importMethods: importMethodCounts,
      importMethods30: importMethodCounts30,
      daily,
      eventsSampled: events?.length ?? 0,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
