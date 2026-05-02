import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPublishedPosts, formatDate, type BlogPost } from '@/lib/blog';

const LandingFooter = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    listPublishedPosts()
      .then((all) => setPosts(all.slice(0, 5)))
      .catch(() => setPosts([]));
  }, []);

  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
          From the blog
        </h2>

        {posts.length > 0 && (
          <ul className="mb-6">
            {posts.map((post) => (
              <li key={post.id} className="border-b border-border/50">
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex items-baseline justify-between gap-4 py-3 group"
                >
                  <span className="text-foreground group-hover:text-accent transition-colors truncate">
                    {post.title}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground shrink-0">
                    {formatDate(post.published_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          More posts →
        </Link>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Made with ❤️ and ☕ in 🇨🇦
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;