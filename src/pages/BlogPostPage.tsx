import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import SEO from '@/components/SEO';
import { getPublishedPostBySlug, formatDate, readingTimeMinutes, type BlogPost } from '@/lib/blog';
import { Loader2 } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    getPublishedPostBySlug(slug)
      .then((p) => setPost(p ?? null))
      .catch((e) => setError(e?.message ?? 'Failed to load post'));
  }, [slug]);

  if (post === undefined && !error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error || post === null) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="text-muted-foreground text-sm">{error ?? 'This article may have been moved or unpublished.'}</p>
        <Link to="/blog" className="text-accent hover:underline text-sm">
          ← Back to blog
        </Link>
      </main>
    );
  }

  const url = typeof window !== 'undefined' ? window.location.href : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author_name },
    publisher: {
      '@type': 'Organization',
      name: 'Offline Resume',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt ?? undefined}
        image={post.cover_image_url ?? undefined}
        type="article"
        publishedTime={post.published_at ?? undefined}
        modifiedTime={post.updated_at}
        author={post.author_name}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-background">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← All posts
          </Link>

          <header className="mt-6 mb-8">
            <h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight"
              style={{ fontFamily: "'Merriweather', serif" }}
            >
              {post.title}
            </h1>
            <div className="text-sm text-muted-foreground mt-3 flex flex-wrap gap-x-3 gap-y-1">
              <span>{post.author_name}</span>
              <span>·</span>
              {post.published_at && (
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              )}
              <span>·</span>
              <span>{readingTimeMinutes(post.content_md)} min read</span>
            </div>
          </header>

          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt=""
              className="w-full aspect-[2/1] object-cover rounded-lg mb-10 bg-muted"
            />
          )}

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-a:text-accent prose-img:rounded-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {post.content_md}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </>
  );
}
