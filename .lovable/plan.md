## Goal

Add a footer to the landing page (`/`) that displays the 5 most recent published blog post titles, plus a final "More posts" link to `/blog`.

## Implementation

### 1. New component: `src/components/landing/LandingFooter.tsx`

- On mount, fetch published posts via `listPublishedPosts()` from `src/lib/blog.ts`.
- Take the first 5 (already ordered by `published_at` desc).
- Render a footer section with:
  - Heading: "From the blog"
  - List of 5 post titles, each a `<Link to={\`/blog/${slug}\`}>` showing title + formatted publish date (using `formatDate` from `src/lib/blog.ts`).
  - Final row: `<Link to="/blog">More posts →</Link>` styled as the accent link.
- Hide the whole list area gracefully if there are no posts (still render the "More posts" link so the footer remains useful).
- Move the existing "Made with ❤️ and ☕ in 🇨🇦" tagline (currently in `HeroSection.tsx`) into this footer for a cleaner structure.

### 2. Update `src/components/landing/HeroSection.tsx`

- Remove the inline `<footer>` tagline (now lives in `LandingFooter`).

### 3. Update `src/pages/LandingPage.tsx`

- Import and render `<LandingFooter />` after `<HeroSection />` inside the main `<div className="dark min-h-screen bg-background">`.

## Styling

- Match existing landing aesthetic: dark background, `border-t border-border`, max width container (`max-w-4xl mx-auto px-6`), generous vertical padding.
- Post titles: `text-foreground` with `hover:text-accent` transition.
- Dates: small, `text-muted-foreground`, `text-xs uppercase tracking-wider`.
- Subtle divider between rows (`border-b border-border/50`).

## Notes

- No new packages, no schema changes.
- Reuses existing `blog_posts` table (public RLS already allows reading published posts).
- No analytics tracking added (can be added later if desired).
