import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-admin-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'post';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const adminKey = req.headers.get('x-admin-key');
  const expected = Deno.env.get('ADMIN_ANALYTICS_KEY');
  if (!expected || adminKey !== expected) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const action = body?.action as string;

  try {
    switch (action) {
      case 'list_all': {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return json({ posts: data });
      }

      case 'get': {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', body.id)
          .maybeSingle();
        if (error) throw error;
        return json({ post: data });
      }

      case 'create': {
        const title = (body.title ?? '').trim() || 'Untitled';
        let slug = (body.slug ?? '').trim() || slugify(title);
        // ensure unique slug
        for (let i = 0; i < 20; i++) {
          const { data: existing } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();
          if (!existing) break;
          slug = `${slugify(title)}-${i + 2}`;
        }
        const insert = {
          title,
          slug,
          excerpt: body.excerpt ?? null,
          content_md: body.content_md ?? '',
          cover_image_url: body.cover_image_url ?? null,
          author_name: body.author_name ?? 'Offline Resume Team',
          status: body.status === 'published' ? 'published' : 'draft',
          published_at: body.status === 'published' ? new Date().toISOString() : null,
        };
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(insert)
          .select('*')
          .single();
        if (error) throw error;
        return json({ post: data });
      }

      case 'update': {
        const id = body.id;
        if (!id) return json({ error: 'id required' }, 400);

        const patch: Record<string, unknown> = {};
        if (typeof body.title === 'string') patch.title = body.title;
        if (typeof body.slug === 'string' && body.slug.trim()) patch.slug = slugify(body.slug);
        if ('excerpt' in body) patch.excerpt = body.excerpt;
        if ('content_md' in body) patch.content_md = body.content_md ?? '';
        if ('cover_image_url' in body) patch.cover_image_url = body.cover_image_url;
        if ('author_name' in body) patch.author_name = body.author_name;

        if (body.status === 'published' || body.status === 'draft') {
          patch.status = body.status;
          if (body.status === 'published') {
            // set published_at if not already published
            const { data: cur } = await supabase
              .from('blog_posts')
              .select('status, published_at')
              .eq('id', id)
              .maybeSingle();
            if (cur && cur.status !== 'published') {
              patch.published_at = new Date().toISOString();
            } else if (cur && !cur.published_at) {
              patch.published_at = new Date().toISOString();
            }
          }
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .update(patch)
          .eq('id', id)
          .select('*')
          .single();
        if (error) throw error;
        return json({ post: data });
      }

      case 'delete': {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', body.id);
        if (error) throw error;
        return json({ ok: true });
      }

      case 'upload_image': {
        // body: { filename, contentType, dataBase64 }
        const filename = (body.filename ?? 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
        const path = `${crypto.randomUUID()}-${filename}`;
        const contentType = body.contentType ?? 'application/octet-stream';
        const bytes = Uint8Array.from(atob(body.dataBase64), (c) => c.charCodeAt(0));
        if (bytes.byteLength > 5 * 1024 * 1024) {
          return json({ error: 'Image larger than 5MB' }, 400);
        }
        const { error } = await supabase.storage
          .from('blog-images')
          .upload(path, bytes, { contentType, upsert: false });
        if (error) throw error;
        const { data: pub } = supabase.storage.from('blog-images').getPublicUrl(path);
        return json({ url: pub.publicUrl, path });
      }

      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (e: any) {
    console.error('[blog-admin] error', e);
    return json({ error: e?.message ?? 'Internal error' }, 500);
  }
});
