## Problem

In Brutalist, Keynote, Professional, Elegant and Editorial templates, the PDF leaves a near-blank page 1 after the Summary, then jumps to Experience on page 2.

## Root cause

In `src/preview/pagedStyles.ts` the rule:

```css
[data-section]     { break-inside: avoid; }
```

is applied to **every top-level section wrapper** (Summary, Experience, Education, Skills, Projects, References...). When Experience is taller than the remaining space on page 1, Paged.js refuses to split it and pushes the *entire* Experience block to page 2 — leaving page 1 mostly empty after the Summary.

The other listed templates use the exact same `data-section` wrapper pattern, which is why they all reproduce the bug. ATS / Modern / Compact / Classic happen to look fine because their sections are smaller or their first section already overflows naturally.

We *do* want to keep individual entries (one job, one degree, one project) intact — those are already marked `data-pdf-section`. We only need to remove the "never split" rule from the *outer* section wrapper.

## Fix

Update `src/preview/pagedStyles.ts`:

1. Remove `[data-section] { break-inside: avoid; }` so big sections (Experience, Projects, etc.) can flow across pages naturally.
2. Keep `[data-pdf-section] { break-inside: avoid; }` so each individual job/education/project entry stays whole.
3. Keep `h2, h3 { break-after: avoid; }` so a section heading is never orphaned at the bottom of a page (it pulls forward with its first entry).
4. Add `[data-section] > h2:first-child, [data-section] > h3:first-child { break-after: avoid-page; }` and `[data-pdf-section]:first-of-type { break-before: avoid; }` to ensure the heading always travels with at least the first entry — preventing a heading-only orphan at the page bottom.
5. Mirror the same change in `src/preview/exportPrint.ts` (its inline `<style>` duplicates the break rules) so the print-window export behaves identically.

## Why this is the right approach

- Keeps the existing Paged.js pipeline (matches the project memory note about not adding a new pagination engine).
- Surgical: one CSS rule removed, two safeguards added. No template files need changes.
- Fixes all five reported templates at once, plus any future templates using the same wrappers.
- Page 1 will fill with the Summary plus as many Experience entries as fit; remaining entries flow to page 2. No more blank space.

## Files to change

- `src/preview/pagedStyles.ts`
- `src/preview/exportPrint.ts`

## Out of scope

- No template-file edits.
- No change to `render-pdf` edge function — it just consumes the HTML/CSS we send.
- Not switching off Paged.js or rewriting the pagination engine.
