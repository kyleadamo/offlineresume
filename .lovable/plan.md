

## Make Preview Mobile-Friendly (Landing + Builder)

### Problem

The resume preview is fixed at the page's physical width (`216mm` ≈ `816px` for Letter). On a 360px phone, that overflows by 2.3×. The builder additionally uses a side-by-side resizable split (editor + preview) which is unusable below ~768px.

### Approach: scale-to-fit, don't reflow

The resume MUST stay at true page dimensions (Paged.js paginates against `mm` units — reflowing would change page breaks and break PDF parity). The fix is **CSS `transform: scale()`** to visually fit narrow viewports while preserving the underlying layout.

```text
┌─ container (100% viewport width) ─────────┐
│  ┌─ scaled wrapper (width: 216mm) ─────┐  │
│  │  transform: scale(viewport/216mm)   │  │
│  │  transform-origin: top left          │  │
│  │  ┌─ PagedResumePreview (216mm) ──┐  │  │
│  │  │  ...real Paged.js sheets...   │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

A `ResizeObserver` on the container computes scale; the wrapper's height is set to `naturalHeight * scale` so the page reserves the right vertical space.

### Changes

**1. `src/preview/PagedResumePreview.tsx`** — add fit-to-width scaling
- Wrap the visible target in an outer `div` whose width tracks the container.
- Inner div keeps `width: ${widthMm}mm`; apply `transform: scale(s)` where `s = min(1, containerPx / pageWidthPx)`.
- Set outer height to `targetHeight * s` after each repagination so layout flows correctly.
- Recompute on resize and after pagination completes.

**2. `src/preview/ResumePreview.tsx`** — mobile-friendly controls
- Template strip: on `<sm`, collapse all templates into the existing "More" popover (show only current + More button) so 360px doesn't horizontally scroll.
- Container: drop `width: ${widthMm}mm` on the strip wrapper at small sizes; use `width: 100%` and let scaling handle the preview.
- Download / options: keep visible; they already fit.

**3. `src/components/landing/HeroSection.tsx`** — tighten mobile spacing
- `pt-24 → pt-20 sm:pt-24`, `px-6 → px-3 sm:px-6`.
- Drop `max-w-[900px]` cap on small screens; use `w-full`.
- H1 already responsive — fine.

**4. `src/pages/BuilderPage.tsx`** — stack on mobile
- Below `md` (768px): replace `ResizablePanelGroup` with a tabbed view: **Edit** | **Preview** tabs (shadcn `Tabs`), each filling the viewport.
- At `md+`: keep current resizable split unchanged.
- Header: hide the "← Home" text label on `<sm`, keep just an icon button. Title dropdown already truncates.
- "Download PDF" button: show icon-only on `<sm` (`<Download/>` + sr-only label).

**5. `src/components/landing/LandingHeader.tsx`** — already mostly fine
- No change needed; logo + button fit at 360px.

### Out of scope
- Editor internal layout changes (forms already stack vertically and work on mobile).
- Cover letter pages (separate follow-up if needed).
- Touch gestures for swiping between Edit/Preview tabs.

### Validation
- 360×595 (current), 390×844, 768×1024, 1280×800, 1920×1080.
- Landing: preview fits without horizontal scroll; template picker doesn't overflow; click-to-scroll still navigates to builder.
- Builder: tabs appear <md, resizable split appears ≥md; PDF download works in both modes.
- Confirm Paged.js page count is identical scaled vs unscaled (it should be — only visual transform changes).

