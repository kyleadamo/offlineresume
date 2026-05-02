import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { listPublishedPosts, formatDate, type BlogPost } from '@/lib/blog';
import { Loader2 } from 'lucide-react';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPublishedPosts()
      .then(setPosts)
      .catch((e) => setError(e?.message ?? 'Failed to load posts'));
  }, []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Offline Resume Blog',
    description: 'Resume tips, career advice, and product updates.',
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Resume tips, career advice, and product updates from Offline Resume."
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <header className="mb-12">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Home
            </Link>
            <h1
              className="text-4xl sm:text-5xl font-semibold tracking-tight mt-4"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              Blog
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Resume tips, career advice, and product updates.
            </p>
          </header>

          {error && <p className="text-destructive text-sm">{error}</p>}

          {!posts && !error && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {posts && posts.length === 0 && (
            <p className="text-muted-foreground">No posts yet. Check back soon.</p>
          )}

          {posts && posts.length > 0 && (
            <ul className="space-y-8">
              {posts.map((p) => (
                <li key={p.id} className="border-b border-border pb-8 last:border-b-0">
                  <Link to={`/blog/${p.slug}`} className="group block">
                    {p.cover_image_url && (
                      <img
                        src={p.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="w-full aspect-[2/1] object-cover rounded-lg mb-4 bg-muted"
                      />
                    )}
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      {formatDate(p.published_at)}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight group-hover:text-accent transition-colors">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="text-muted-foreground mt-2 leading-relaxed">{p.excerpt}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
