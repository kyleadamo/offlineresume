import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://offlineresume.com';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, published_at, author_name')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50);

  const items = (posts ?? [])
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const pub = p.published_at ? new Date(p.published_at).toUTCString() : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <author>noreply@offlineresume.com (${escapeXml(p.author_name ?? 'Offline Resume')})</author>
      <description>${escapeXml(p.excerpt ?? '')}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Offline Resume Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Resume tips, career advice, and product updates.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
});
