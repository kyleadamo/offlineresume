## Goal

Make blog content easier for AI chatbots and crawlers (ChatGPT/OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, etc.) to discover, fetch, and cite. Today the blog has solid SEO basics (sitemap, RSS, JSON-LD), but nothing tailored to LLM crawlers.

## What we'll add

### 1. `llms.txt` and `llms-full.txt` (emerging standard)
A root-level Markdown index telling LLMs what the site is about and listing the most important URLs. Served via a new edge function `llms` (so it can include published posts dynamically), exposed at `/llms.txt`.

- `llms.txt` — short summary of Offline Resume + a curated link list (home, builder, blog index, all published posts with excerpts).
- `llms-full.txt` — same, but inlining the full Markdown body of each published post so a chatbot can ingest the entire blog in one fetch.

### 2. Update `public/robots.txt`
Explicitly allow the major AI crawlers (and reference both sitemap + llms.txt):

- `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI)
- `PerplexityBot`, `Perplexity-User`
- `ClaudeBot`, `anthropic-ai`, `Claude-Web`
- `Google-Extended` (Gemini/Bard training)
- `Applebot-Extended`, `CCBot`, `Bytespider`, `meta-externalagent`

Also add the canonical site URL to the sitemap line and add the llms.txt reference.

### 3. Plain-text / Markdown endpoint per post
New edge function route returning the raw Markdown body of a post at `/blog/<slug>.md` (and `/blog/<slug>.txt`). Chatbots fetch much faster and more accurately when they can grab Markdown instead of parsing the SPA. We'll also link to it from each post page via `<link rel="alternate" type="text/markdown">`.

### 4. Richer JSON-LD on blog pages
Extend `BlogPostPage` JSON-LD with:
- `wordCount`, `articleBody` (truncated), `keywords`, `inLanguage: "en"`
- A proper `Organization` `publisher` with `logo` (ImageObject)
- `BreadcrumbList` (Home → Blog → Post)
- On `BlogIndexPage`: an `ItemList` of recent posts so it's machine-readable in one fetch.

### 5. SPA pre-render fallback for crawlers (lightweight)
Many chatbots don't execute JavaScript well. Update the `blog-admin`/blog rendering path so the existing edge functions (sitemap, rss, new llms) cover discovery, and add a new `blog-article` edge function that returns server-rendered HTML for `/blog/<slug>` when a known bot User-Agent hits it (GPTBot, PerplexityBot, ClaudeBot, etc.) — proxied via a small route. *(Alternative if too invasive: skip this and rely on the `.md` endpoint + llms-full.txt, which already solves the JS-rendering problem for LLMs. Recommended: skip pre-render, keep it simple.)*

### 6. Per-post `<meta name="keywords">` and `article:tag`
Optional small win — derive 3–5 keywords from post title/excerpt (manual field on the post or auto from headings) so JSON-LD `keywords` and meta tags are populated.

## Technical details

**New edge function `supabase/functions/llms/index.ts`**
- Public (`verify_jwt = false` in `supabase/config.toml`).
- Routes: `/llms.txt` (index), `/llms-full.txt` (with bodies), `/blog/<slug>.md` (single post body).
- Reads `blog_posts` where `status = 'published'`.
- `Content-Type: text/markdown; charset=utf-8`, `Cache-Control: public, max-age=600`.

**Routing**
- The functions are reachable at `/functions/v1/llms/...`. To expose them at clean URLs (`/llms.txt`, `/blog/<slug>.md`) we'll either:
  - (a) add rewrites if hosting supports them, or
  - (b) document the function URL and reference it from `robots.txt` and `<link rel="alternate">` tags (simpler, works today).

We'll go with (b) for reliability, and link to it explicitly.

**`public/robots.txt` additions** — explicit `User-agent` blocks for each AI crawler with `Allow: /`, plus:
```
Sitemap: https://offlineresume.com/functions/v1/sitemap
# LLM-friendly index:
# https://offlineresume.com/functions/v1/llms/llms.txt
```

**`SEO.tsx`** — add optional `keywords` and `alternateMarkdown` props; render `<meta name="keywords">` and `<link rel="alternate" type="text/markdown" href=...>`.

**`BlogPostPage.tsx`** — pass `alternateMarkdown` (URL of `.md` endpoint), expand `jsonLd` with `wordCount`, `keywords`, `publisher.logo`, `BreadcrumbList`.

**`BlogIndexPage.tsx`** — add second JSON-LD `ItemList` of posts.

## What I will NOT do (unless you ask)
- Server-side rendering of the React app for bots (complex, marginal benefit once `.md` + `llms-full.txt` exist).
- Rewriting blog posts for AI tone — content quality is on the editorial side.
- Any auth or paid-tier crawler gating.

## Deliverable summary
1. New edge function: `llms` (serves `llms.txt`, `llms-full.txt`, per-post `.md`).
2. Updated `public/robots.txt` with explicit AI-bot allow rules.
3. Updated `SEO.tsx` with `keywords` + Markdown alternate link support.
4. Richer JSON-LD on `BlogPostPage` and `BlogIndexPage`.
5. `supabase/config.toml` entry for the new public function.
