

## Landing Page Refactor Plan

### Overview
Replace the current `Index.tsx` workspace entry page with a polished dark-mode landing page featuring an interactive resume preview as the hero element, conditional CTAs based on saved resume state, and clean entry flows into the builder.

### Phase 1 — Foundation & Data

**Goal**: Add demo data, make `ResumePreview` reusable outside the builder, and set up dark mode.

**Files**:
- **`public/demo-resume.json`** — Copy the Barclay JSON as the demo data file
- **`src/preview/ResumePreview.tsx`** — Refactor to accept an optional `resume` prop and an optional `onTemplateChange` callback. When provided, these override the context-based `activeResume` and `updateResume`. This lets the landing page render a preview without touching the resume store. Also accept an optional `hideControls` prop to hide download/options buttons when used on the landing page
- **`src/index.css`** — Add a `.dark` class scope for the landing page (Tailwind dark mode via class strategy)

### Phase 2 — Landing Page Components

**Goal**: Build the new landing page from composable components.

**New files**:
- **`src/pages/LandingPage.tsx`** — Main page component. On mount, checks `localStorage` for saved resumes. Loads demo JSON via fetch if none exist. Manages `previewResume`, `selectedTemplateId`, and `isCreateModalOpen` state. Wraps content in a `dark` class container for dark theming
- **`src/components/landing/LandingHeader.tsx`** — Fixed header with "Offline Resume" on the left, conditional CTA button on the right ("Create my resume" vs "My resumes")
- **`src/components/landing/HeroSection.tsx`** — Centered tagline + the `ResumePreview` component rendered in a contained, scrollable card with a hover/focus overlay showing "Edit this resume" button. Default template: Creative
- **`src/components/landing/CreateResumeModal.tsx`** — Dialog with 3 options: Start from scratch, Import JSON, Convert existing resume. Each routes to the appropriate flow
- **`src/components/landing/SavedResumesSheet.tsx`** — A sheet/dialog listing all saved resumes and cover letters with the existing Resumes/Cover Letters tab toggle, metadata display, and open/delete actions. Reuses existing context hooks

### Phase 3 — Routing & Integration

**Goal**: Wire everything together without breaking existing flows.

**Files**:
- **`src/App.tsx`** — Change `/` route from `Index` to `LandingPage`
- **`src/pages/Index.tsx`** — Keep as-is temporarily (the saved resumes view logic can be referenced by `SavedResumesSheet`)

### Component Interaction Flow

```text
LandingPage
├── LandingHeader
│   └── CTA button → CreateResumeModal (no resumes)
│                   → SavedResumesSheet (has resumes)
├── HeroSection
│   ├── Tagline
│   └── ResumePreview (with resume prop override)
│       ├── Template switcher strip (reused from ResumePreview)
│       └── Hover overlay → "Edit this resume" → navigate to /builder
└── CreateResumeModal
    ├── Start from scratch → createResume() → /builder
    ├── Import JSON → /import?mode=json
    └── Convert existing → /import?mode=paste
```

### Key Technical Decisions

1. **ResumePreview prop override** — Adding `resume?: Resume` and `onTemplateChange?: (id: TemplateId) => void` props avoids duplicating template rendering. When these props are present, the component uses them instead of context
2. **Dark mode scoping** — The landing page wraps itself in `<div className="dark bg-background min-h-screen">` so dark theme applies only to this page without affecting the builder
3. **Demo data** — Loaded via `fetch('/demo-resume.json')` on mount, only when no saved resumes exist. The Creative template is selected by default per spec
4. **"Edit this resume" flow** — For demo data: calls `createResume(demoData)` to persist it, then navigates to `/builder`. For saved resumes: calls `setActive(id)` then navigates

### What stays the same
- All existing builder, editor, template, and import pages remain untouched
- Resume/cover letter storage logic unchanged
- All 13 templates continue working as-is

### Phases summary
- **Phase 1**: 3 files touched — safe, no UI changes visible yet
- **Phase 2**: 4 new component files — the new landing page, isolated
- **Phase 3**: 1 file changed (`App.tsx` route swap) — the cutover

