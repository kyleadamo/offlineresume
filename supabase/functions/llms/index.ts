import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SITE_URL = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://offlineresume.com';

const SITE_SUMMARY = `# Offline Resume

> Offline Resume is a privacy-first, browser-based resume builder. Users create, edit, and export beautiful resumes and cover letters from over a dozen templates without accounts, cloud storage, or tracking of their resume content. All resume data lives in the browser; exports are produced as PDFs or portable JSON.

Offline Resume also publishes a blog with practical resume, cover letter, and job-search advice aimed at job seekers in technical and professional roles.

## Key pages

- [Home](${SITE_URL}/): Product overview and entry point to the builder.
- [Resume Builder](${SITE_URL}/builder): The editor where users craft resumes from templates.
- [Import](${SITE_URL}/import): Import an existing resume from a URL, pasted text, PDF, or JSON.
- [Blog index](${SITE_URL}/blog): All published articles.
- [RSS feed](${SITE_URL}/functions/v1/rss): Subscribable feed of new posts.
- [Sitemap](${SITE_URL}/functions/v1/sitemap): Machine-readable sitemap of indexable pages.
`;

function postLine(p: { slug: string; title: string; excerpt: string | null }) {
  const desc = p.excerpt ? `: ${p.excerpt}` : '';
  return `- [${p.title}](${SITE_URL}/blog/${p.slug})${desc}`;
}

async function getSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

function mdResponse(body: string, maxAge = 600) {
  return new Response(body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}`,
      'X-Robots-Tag': 'all',
    },
  });
}

function notFound() {
  return new Response('Not found', {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  // The function may be invoked at /functions/v1/llms/... or /llms/...
  const path =
    url.pathname
      .replace(/^\/functions\/v1\/llms/, '')
      .replace(/^\/llms/, '') || '/';
  const supabase = await getSupabase();

  // Per-post Markdown: /blog/<slug>.md or /blog/<slug>.txt
  const postMatch = path.match(/^\/blog\/([a-z0-9-]+)\.(md|txt)$/i);
  if (postMatch) {
    const slug = postMatch[1];
    const { data: post } = await supabase
      .from('blog_posts')
      .select('title, excerpt, content_md, author_name, published_at, updated_at, slug')
      .eq('status', 'published')
      .eq('slug', slug)
      .maybeSingle();
    if (!post) return notFound();
    const body = `# ${post.title}

Source: ${SITE_URL}/blog/${post.slug}
Author: ${post.author_name ?? 'Offline Resume Team'}
${post.published_at ? `Published: ${post.published_at}\n` : ''}${post.updated_at ? `Updated: ${post.updated_at}\n` : ''}${post.excerpt ? `\n> ${post.excerpt}\n` : ''}
---

${post.content_md ?? ''}
`;
    return mdResponse(body);
  }

  if (path === '/llms.txt' || path === '/' || path === '') {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(200);
    const blogList = (posts ?? []).map(postLine).join('\n');
    const body = `${SITE_SUMMARY}
## Blog posts

${blogList || '_No posts published yet._'}

## Optional

- [Full blog content (one document)](${SITE_URL}/functions/v1/llms/llms-full.txt)
`;
    return mdResponse(body);
  }

  if (path === '/llms-full.txt') {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, content_md, author_name, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(200);
    const sections = (posts ?? []).map((p) => {
      return `\n\n---\n\n# ${p.title}

Source: ${SITE_URL}/blog/${p.slug}
Author: ${p.author_name ?? 'Offline Resume Team'}
${p.published_at ? `Published: ${p.published_at}\n` : ''}${p.excerpt ? `\n> ${p.excerpt}\n` : ''}
${p.content_md ?? ''}`;
    }).join('');
    const body = `${SITE_SUMMARY}\n${sections}\n`;
    return mdResponse(body, 300);
  }

  return notFound();
});
