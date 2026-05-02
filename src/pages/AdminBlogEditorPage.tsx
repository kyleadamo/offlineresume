import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, ArrowLeft, ImagePlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const KEY_STORAGE = 'admin_analytics_key';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

interface PostState {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  cover_image_url: string;
  author_name: string;
  status: 'draft' | 'published';
}

const blank: PostState = {
  title: '',
  slug: '',
  excerpt: '',
  content_md: '',
  cover_image_url: '',
  author_name: 'Offline Resume Team',
  status: 'draft',
};

export default function AdminBlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const adminKey = sessionStorage.getItem(KEY_STORAGE) ?? '';
  const isNew = !id || id === 'new';

  const [post, setPost] = useState<PostState>(blank);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!adminKey) {
      navigate('/admin/blog');
      return;
    }
    if (isNew) return;
    supabase.functions
      .invoke('blog-admin', {
        body: { action: 'get', id },
        headers: { 'x-admin-key': adminKey },
      })
      .then(({ data, error }) => {
        if (error) throw error;
        const p = (data as any).post;
        if (!p) {
          toast({ title: 'Post not found', variant: 'destructive' });
          navigate('/admin/blog');
          return;
        }
        setPost({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? '',
          content_md: p.content_md ?? '',
          cover_image_url: p.cover_image_url ?? '',
          author_name: p.author_name ?? 'Offline Resume Team',
          status: p.status,
        });
        setSlugTouched(true);
      })
      .catch((e) => {
        toast({ title: 'Failed to load', description: e?.message, variant: 'destructive' });
        navigate('/admin/blog');
      })
      .finally(() => setLoading(false));
  }, [id, isNew, adminKey, navigate]);

  const setField = <K extends keyof PostState>(k: K, v: PostState[K]) => {
    setPost((p) => ({ ...p, [k]: v }));
  };

  const handleTitleChange = (v: string) => {
    setPost((p) => ({
      ...p,
      title: v,
      slug: slugTouched ? p.slug : slugify(v),
    }));
  };

  const handleUploadImage = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image too large (max 5MB)', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      const dataBase64 = btoa(bin);
      const { data, error } = await supabase.functions.invoke('blog-admin', {
        body: {
          action: 'upload_image',
          filename: file.name,
          contentType: file.type,
          dataBase64,
        },
        headers: { 'x-admin-key': adminKey },
      });
      if (error) throw error;
      const url = (data as any).url as string;
      // If no cover yet, set as cover; otherwise insert markdown into body.
      if (!post.cover_image_url) {
        setField('cover_image_url', url);
        toast({ title: 'Set as cover image' });
      } else {
        setField('content_md', `${post.content_md}\n\n![${file.name}](${url})\n`);
        toast({ title: 'Image inserted into post' });
      }
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e?.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const save = async (publish?: boolean) => {
    if (!post.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const status = publish === true ? 'published' : publish === false ? 'draft' : post.status;
      const payload: Record<string, unknown> = {
        title: post.title,
        slug: post.slug || slugify(post.title),
        excerpt: post.excerpt || null,
        content_md: post.content_md,
        cover_image_url: post.cover_image_url || null,
        author_name: post.author_name,
        status,
      };
      const action = isNew ? 'create' : 'update';
      if (!isNew) payload.id = post.id;
      const { data, error } = await supabase.functions.invoke('blog-admin', {
        body: { action, ...payload },
        headers: { 'x-admin-key': adminKey },
      });
      if (error) throw error;
      const saved = (data as any).post;
      toast({ title: publish === true ? 'Published' : 'Saved' });
      if (isNew && saved?.id) {
        navigate(`/admin/blog/${saved.id}`, { replace: true });
      } else if (saved) {
        setPost((p) => ({ ...p, status: saved.status }));
      }
    } catch (e: any) {
      toast({ title: 'Save failed', description: e?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/admin/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Switch
              id="publish-toggle"
              checked={post.status === 'published'}
              onCheckedChange={(v) => setField('status', v ? 'published' : 'draft')}
            />
            <Label htmlFor="publish-toggle" className="text-sm">
              {post.status === 'published' ? 'Published' : 'Draft'}
            </Label>
          </div>
          <Button variant="outline" onClick={() => save(false)} disabled={saving}>
            Save draft
          </Button>
          <Button onClick={() => save(true)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <section className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={post.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="How to write a resume that gets interviews"
            />
          </div>

          <div>
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              value={post.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField('slug', slugify(e.target.value));
              }}
              placeholder="how-to-write-a-resume"
            />
            <p className="text-xs text-muted-foreground mt-1">/blog/{post.slug || 'your-slug'}</p>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt (used for SEO meta description, max ~160 chars)</Label>
            <Textarea
              id="excerpt"
              value={post.excerpt}
              onChange={(e) => setField('excerpt', e.target.value)}
              rows={2}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">{post.excerpt.length} / 160</p>
          </div>

          <div>
            <Label htmlFor="cover">Cover image URL</Label>
            <div className="flex gap-2">
              <Input
                id="cover"
                value={post.cover_image_url}
                onChange={(e) => setField('cover_image_url', e.target.value)}
                placeholder="https://…"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              </Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUploadImage(f);
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload sets cover if empty, otherwise inserts an image into the post body.
            </p>
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={post.author_name}
              onChange={(e) => setField('author_name', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="body">Body (Markdown)</Label>
            <Textarea
              id="body"
              value={post.content_md}
              onChange={(e) => setField('content_md', e.target.value)}
              rows={24}
              className="font-mono text-sm"
              placeholder={'## Heading\n\nWrite your post in **Markdown**.\n\n```ts\nconst x = 1;\n```'}
            />
          </div>
        </section>

        {/* Preview */}
        <section className="lg:sticky lg:top-6 lg:self-start">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Preview</Label>
          <div className="border border-border rounded-lg p-6 mt-2 bg-card max-h-[80vh] overflow-auto">
            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt=""
                className="w-full aspect-[2/1] object-cover rounded-lg mb-6 bg-muted"
              />
            )}
            <h1
              className="text-2xl font-semibold tracking-tight mb-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {post.title || 'Untitled post'}
            </h1>
            <div className="prose prose-invert prose-sm max-w-none prose-a:text-accent prose-img:rounded-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {post.content_md || '_Start writing…_'}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
