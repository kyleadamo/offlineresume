

## Hide Wordmark on Mobile

Add `hidden md:flex` to the wordmark text container (line 32) so only the SVG icon shows on small screens.

### Changes

**`src/components/landing/LandingHeader.tsx`** — Line 32:
- Change `<div className="flex flex-col">` to `<div className="hidden md:flex flex-col">`

Single line change. The logo icon remains visible at all sizes; the "OfflineResume" text and tagline hide below the `md` (768px) breakpoint.

