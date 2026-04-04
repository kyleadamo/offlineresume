

## Landing Page Refactor

This is a large change touching the home page layout, routing, and component structure. I recommend splitting it into two phases. This plan covers **Phase 1**: the new landing page with hero preview. Phase 2 (the "My Resumes" view refactor) can follow once Phase 1 is solid.

### Phase 1 Scope

Turn the current `Index.tsx` (workspace entry) into a polished dark-mode landing page with an interactive resume preview hero, template switcher, and conditional CTA.

### New & Modified Files

#### 1. `src/data/demoResume.json` — Demo resume data
Copy the uploaded Barclay JSON file here as the fallback demo data for the preview.

#### 2. `src/pages/Index.tsx` — Full rewrite as `LandingPage`
Replace the current workspace entry with the new landing page layout:

- **Dark mode wrapper**: Apply `dark` class to the page root so it uses existing dark theme tokens without affecting other pages.
- **LandingHeader**: Product name "Offline Resume" left, single CTA button right.
  - No saved resumes → "Create my resume" (opens modal)
  - Has saved resumes → "My resumes" (navigates to `/workspace`)
- **Hero section**: Tagline centered above the preview.
- **HeroResumePreview**: Scrollable resume preview container with realistic paper appearance, centered on page. Uses existing template components directly (same `templateMap` from `ResumePreview.tsx`). Data source: most recent saved resume from `useResume().resumes`, or demo JSON fallback.
- **Hover overlay**: "Edit this resume" button appears on hover/focus over the preview. Clicking it sets the resume as active and navigates to `/builder`.
- **TemplateSwitcher**: Horizontal tabs above preview. Visible: Creative (default), Modern, Professional, Minimal, Classic. Overflow: rest under "...more" popover. Switching updates the preview template in local state (does not mutate stored resume).

#### 3. `src/pages/WorkspacePage.tsx` — Extract current Index content
Move the existing workspace entry UI (resume/cover letter lists, create actions, delete dialog) into a new route. This preserves the "My Resumes" + "Cover Letters" tabbed view.

#### 4. `src/App.tsx` — Add route
Add `/workspace` route pointing to `WorkspacePage`.

#### 5. `src/components/CreateResumeModal.tsx` — New modal
Three options:
1. **Start from scratch** → `createResume()` + navigate to `/builder`
2. **Import saved offline resume JSON** → navigate to `/import?mode=json`
3. **Convert my existing resume** → navigate to `/import?mode=paste`

Uses existing `Dialog` component, focus trap and escape-to-close come for free.

#### 6. `src/index.css` — No structural changes needed
The existing `.dark` class tokens already cover the dark theme. The landing page just wraps itself in `<div className="dark">`.

### Component Hierarchy

```text
LandingPage (Index.tsx)
├── LandingHeader
│   ├── "Offline Resume" logo/text
│   └── CTA Button (conditional)
├── Hero
│   ├── Tagline
│   ├── TemplateSwitcher (tabs + overflow popover)
│   └── HeroResumePreview
│       ├── Scrollable paper container
│       ├── TemplateComponent (reused from templates/)
│       └── Hover overlay ("Edit this resume")
└── CreateResumeModal (conditional)
```

### Key Decisions
- The landing page applies `dark` class locally — other pages remain unchanged.
- Template switching on the landing page is local state only; it does not persist or mutate any stored resume.
- Default template for the preview: **Creative**.
- The existing `ResumePreview` component is NOT reused directly (it has toolbar/PDF/page-break logic); instead, the landing page renders template components directly with a simpler wrapper.
- The current Index.tsx workspace UI moves to `/workspace` as-is.

### Files Summary
1. `src/data/demoResume.json` — new (demo data)
2. `src/pages/Index.tsx` — rewrite (landing page)
3. `src/pages/WorkspacePage.tsx` — new (moved workspace UI)
4. `src/components/CreateResumeModal.tsx` — new
5. `src/App.tsx` — add `/workspace` route

