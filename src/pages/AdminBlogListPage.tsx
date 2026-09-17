import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, ExternalLink, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/blog';

const KEY_STORAGE = 'admin_analytics_key';

interface AdminPost {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  published_at: string | null;
  updated_at: string;
}

export default function AdminBlogListPage() {
  const navigate = useNavigate();
  const [key, setKey] = useState<string>(() => sessionStorage.getItem(KEY_STORAGE) ?? '');
  const [authed, setAuthed] = useState<boolean>(!!sessionStorage.getItem(KEY_STORAGE));
  const [posts, setPosts] = useState<AdminPost[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (k: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('blog-admin', {
        body: { action: 'list_all' },
        headers: { 'x-admin-key': k },
      });
      if (error) throw error;
      setPosts((data as any).posts ?? []);
      sessionStorage.setItem(KEY_STORAGE, k);
      setAuthed(true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load');
      setAuthed(false);
      sessionStorage.removeItem(KEY_STORAGE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed && key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    try {
      const { error } = await supabase.functions.invoke('blog-admin', {
        body: { action: 'delete', id },
        headers: { 'x-admin-key': key },
      });
      if (error) throw error;
      toast({ title: 'Post deleted' });
      load(key);
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e?.message, variant: 'destructive' });
    }
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin · Blog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="password"
              placeholder="Admin key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && key && load(key)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={() => load(key)} disabled={!key || loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog posts</h1>
          <p className="text-sm text-muted-foreground">
            {posts?.length ?? 0} total · drafts are hidden from the public site
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/blog/new">
              <Plus className="w-4 h-4" /> New post
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem(KEY_STORAGE);
              setAuthed(false);
              setKey('');
              setPosts(null);
            }}
          >
            Sign out
          </Button>
        </div>
      </header>

      {!posts ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No posts yet. Create your first post.
          </CardContent>
        </Card>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-lg">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium truncate">{p.title}</span>
                  <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>
                    {p.status}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">
                  /{p.slug} · updated {formatDate(p.updated_at)}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {p.status === 'published' && (
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                    <Link to={`/blog/${p.slug}`} target="_blank">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigate(`/admin/blog/${p.id}`)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
