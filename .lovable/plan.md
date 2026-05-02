## Goal

Add lightweight, privacy-respecting analytics so you can see:
1. **Visitors** — unique + total page views on the landing/builder
2. **Resumes created** — count of `createResume` calls
3. **PDF downloads** — count of "Download PDF" button clicks (remote + browser print fallback)

Plus a simple **admin-only dashboard** to view the numbers.

This stays consistent with the MVP "no user accounts" rule — we track anonymous events only, no auth required.

---

## Approach

### 1. Backend (Lovable Cloud)

Create one `analytics_events` table:

```text
analytics_events
  id           uuid pk
  event_type   text  -- 'page_view' | 'resume_created' | 'pdf_download'
  visitor_id   text  -- random uuid stored in localStorage, anon
  path         text  -- '/', '/builder', etc. (for page_view)
  template_id  text  -- for pdf_download / resume_created (optional)
  metadata     jsonb -- future-proof
  created_at   timestamptz default now()
```

RLS:
- `INSERT`: allowed for anyone (anon role) — needed so the client can log events without auth.
- `SELECT`: denied for anon. Reading is done via an edge function gated by an admin key.

Index on `(event_type, created_at)` for fast aggregation.

### 2. Client tracking

New file `src/lib/analytics.ts` with a single `track(eventType, payload?)` helper that:
- Reads/creates a `visitor_id` in `localStorage` (random uuid, no PII).
- Best-effort fire-and-forget `supabase.from('analytics_events').insert(...)`.
- Silently swallows errors (analytics must never break the app).
- Respects `navigator.doNotTrack` — skip if user opted out.

Wire-in points (3 only — minimal surface):
- **`src/pages/LandingPage.tsx`** + **`src/pages/BuilderPage.tsx`**: `track('page_view', { path })` in a `useEffect` on mount.
- **`src/hooks/useResumeStore.ts`** `createResume`: `track('resume_created', { templateId })`.
- **`src/preview/ResumePreview.tsx`** `DownloadPdfButton.handleDownloadPDF` (and the browser-print fallback in `OptionsMenu`): `track('pdf_download', { templateId, mode: 'remote' | 'browser_print' })`.

### 3. Admin dashboard

New route `/admin/analytics` (not linked from anywhere — security through obscurity is not enough, see below).

- New edge function `analytics-summary` (verify_jwt = false, but requires an `x-admin-key` header matching a new `ADMIN_ANALYTICS_KEY` secret).
- Returns aggregated counts: total/unique visitors, resumes created, PDF downloads, plus daily series for last 30 days and breakdown by template.
- New page `src/pages/AdminAnalyticsPage.tsx`: prompts for admin key (stored only in `sessionStorage`), then renders cards + a simple line chart using Recharts (already in the stack via shadcn).

### 4. Secret needed

`ADMIN_ANALYTICS_KEY` — a random string you choose. Used to gate the summary endpoint. I'll request it via the secrets tool when implementing.

---

## Technical details

**Files to create**
- `src/lib/analytics.ts` — `track()` + `getVisitorId()`
- `src/pages/AdminAnalyticsPage.tsx` — dashboard UI
- `supabase/functions/analytics-summary/index.ts` — aggregation endpoint
- Migration: `analytics_events` table + RLS + index

**Files to edit**
- `src/App.tsx` — add `/admin/analytics` route
- `src/pages/LandingPage.tsx` — page_view tracking
- `src/pages/BuilderPage.tsx` — page_view tracking
- `src/hooks/useResumeStore.ts` — resume_created tracking
- `src/preview/ResumePreview.tsx` — pdf_download tracking (both remote + fallback)
- `supabase/config.toml` — register `analytics-summary` function

**Privacy notes**
- `visitor_id` is a random uuid — not derived from IP, fingerprint, or any PII.
- No email, name, resume content, or IP is stored in events.
- DNT browsers are skipped.

**Why a custom table instead of Supabase analytics**
The built-in Supabase analytics tracks API calls, not product events like "resume created" or "PDF downloaded". A purpose-built table is the right tool here and stays cheap (a few rows per visit).

---

## What you'll see in the dashboard

- Total visitors (unique by `visitor_id`)
- Total page views
- Resumes created (all-time + last 30 days)
- PDF downloads (all-time + last 30 days, split remote vs browser print)
- Top templates by download
- Daily trend chart (last 30 days)
