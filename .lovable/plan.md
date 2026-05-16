## Plan: Static generated sitemap at /sitemap.xml

### What to build
1. **`scripts/generate-sitemap.ts`** — Node script that:
   - Imports `@supabase/supabase-js`, connects with the public anon key + URL from `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
   - Fetches all `blog_posts` where `status = 'published'` (RLS already allows public read of published posts — confirmed by the existing client-side `listPublishedPosts`).
   - Emits `public/sitemap.xml` containing:
     - `/` (priority 1.0, weekly)
     - `/blog` (priority 0.8, weekly)
     - `/builder` (priority 0.7, monthly)
     - `/import` (priority 0.5, monthly)
     - One `<url>` per published post at `/blog/{slug}` with `lastmod = updated_at ?? published_at`.
   - `BASE_URL = "https://offlineresume.com"`.
   - If the Supabase fetch fails (offline build), logs a warning and writes the static routes only — never breaks the build.

2. **`package.json`** — add hooks so it runs before dev and prod builds:
   - `"predev": "bunx tsx scripts/generate-sitemap.ts"`
   - `"prebuild": "bunx tsx scripts/generate-sitemap.ts"`

3. **`public/robots.txt`** — change the `Sitemap:` line from the Supabase edge function URL to:
   ```
   Sitemap: https://offlineresume.com/sitemap.xml
   ```

### What stays the same
- The dynamic `supabase/functions/sitemap` edge function is left in place (harmless, no longer referenced). I can delete it if you prefer — let me know.
- `llms.txt` / RSS / per-post Markdown endpoints unchanged.

### Trade-off (re-confirming)
New blog posts created via the admin UI will only appear in `sitemap.xml` after the next deploy/publish. Google will still discover them via internal links from `/blog`, but their `lastmod` won't update until rebuild.

### Updated sitemap URL to give Google
After this ships and you publish, in Google Search Console replace the existing sitemap entry with:

```
https://offlineresume.com/sitemap.xml
```

(Remove the old `…supabase.co/functions/v1/sitemap` entry that's currently flagged as HTML.)
