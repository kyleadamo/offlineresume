

## Fix Orphaned Section Titles

The issue: section headings (like "PROJECTS") can appear at the bottom of a page with all their content on the next page. This happens because only `[data-pdf-section]` (individual items) have `break-inside: avoid`, but the parent `[data-section]` containers (which include the heading) do not prevent the heading from being separated from the first item.

### Solution

Add a CSS rule so that section headings always keep at least some content after them, preventing orphaning. We use `break-after: avoid` on all section heading elements (h3 tags inside `[data-section]`) so the browser keeps the heading together with the next sibling.

### Changes

**1. `src/index.css`** — Add print rule near the existing `[data-pdf-section]` block:
```css
[data-section] > h3,
[data-section] > h2 {
  break-after: avoid;
}
```

**2. `src/preview/ResumePreview.tsx`** — Add the same rule in the inline print style block (line ~313):
```css
[data-section] > h3, [data-section] > h2 { break-after: avoid; }
```

**3. `src/pages/BuilderPage.tsx`** — Same inline print style addition (line ~155):
```css
[data-section] > h3, [data-section] > h2 { break-after: avoid; }
```

This ensures headings always pull at least the first content item onto the same page.

