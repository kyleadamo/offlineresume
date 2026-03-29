

## Fix Preview Pane Scroll & Max Width

### Problem
1. The preview panel's `overflow-y-auto` on the `ResizablePanel` isn't propagating correctly — the panel likely needs explicit height constraint for overflow to work inside a flex layout.
2. When the editor is collapsed/shrunk, the resume content stretches to fill the full width. It should be capped at ~1200px.

### Changes

**`src/pages/BuilderPage.tsx`**
- Add `overflow-hidden` to the `ResizablePanelGroup` or the outer flex container so the panels get a bounded height
- Change the preview `ResizablePanel` to have `overflow-hidden` and wrap `ResumePreview` in a div with `h-full overflow-y-auto` to ensure scroll works within the bounded panel

**`src/preview/ResumePreview.tsx`**
- Add `max-w-[1200px] mx-auto` to the outer wrapper `<div>` (line 66) so the resume content never exceeds 1200px wide, centering it when the panel is wider

### Technical Details
- The scroll issue is caused by `ResizablePanel` with `overflow-y-auto` not having an explicit height — in a flex layout the panel needs `overflow-hidden` with an inner scrollable container, or the parent needs `overflow-hidden` to constrain it
- The max-width applies only to the preview content area, not the panel background

