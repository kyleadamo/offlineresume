

## Fix: Entire Sections Pushed to Next Page

### Problem
The print CSS includes `[data-section] { break-inside: avoid; }` (line 132-134 in FullPagePreview.tsx, and in index.css). Since `data-section` wraps the **entire** Experience section (all entries together), the browser treats it as one unbreakable block. If it doesn't fully fit on page 1, the whole section jumps to page 2 — leaving page 1 with only the profile/summary.

### Fix
Remove `[data-section] { break-inside: avoid; }` from both:
1. **`src/preview/FullPagePreview.tsx`** — lines 132-134 in the print styles injected into the print window
2. **`src/index.css`** — the `@media print` block's `[data-section] { break-inside: avoid; }` rule

Keep only `[data-pdf-section] { break-inside: avoid; }` which protects individual entries (single experience block, single education block) from splitting — allowing the section as a whole to flow across pages naturally.

### Result
Page 1 will contain the profile, summary, and as many experience entries as fit. The section flows across pages, with only individual entries protected from splitting mid-item.

