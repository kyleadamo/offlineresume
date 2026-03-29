

## Paper-Style Background for Preview Pane

### Problem
The full-page preview shows the resume on a white paper-like background with padding, shadow, and a fixed width — but the main workspace preview pane lacks this treatment. Also, in both views, the paper background should extend to the bottom of the content with equal top/bottom margin.

### Changes

**`src/preview/ResumePreview.tsx`**
- Replace the current `bg-card rounded-lg paper-shadow` wrapper (lines 123-140) with a paper-style treatment matching the full-page preview:
  - Set a fixed paper width (e.g. `215.9mm` / US Letter width) instead of fluid
  - Add `bg-white shadow-lg` styling like FullPagePreview
  - Use padding `12mm 16mm` to match print margins
  - Remove `min-h-[842px]` — let content determine height naturally
- Wrap the paper div in a centered container with `bg-muted/50` (or use the existing `bg-secondary/50` from the parent) and padding top/bottom for equal spacing
- The outer `max-w-[1200px]` stays to constrain the overall area; the paper sits centered within it

**`src/preview/FullPagePreview.tsx`**
- The paper div (line 208-227) already has top padding via `py-8` on the scroll container — this gives equal top/bottom margin around the paper. No changes needed here since `py-8` already provides symmetric spacing.

### Result
Both the workspace preview and full-page preview show the resume on a white, paper-width background with shadow, with equal margin above and below the content.

