

## PDF Page Breaks and Preview Indicators

### Problem
The current PDF export uses padding on a single container div, so margins only appear on page 1. Subsequent pages have no top/bottom margins, and content breaks arbitrarily mid-section.

### Solution

**1. Fix PDF margins** — Use `@page { margin: 12mm 16mm; }` instead of padding on the wrapper div. This gives consistent margins on every printed page automatically.

**2. Control page breaks** — Apply `break-inside: avoid` only to meaningful content blocks (experience entries, education entries, skill categories) via `data-pdf-section` attributes on template elements, not on `*`.

**3. Page break preview checkbox** — Add a "Show page breaks" checkbox in the full-page preview toolbar. When enabled, render dashed red lines at intervals of `297mm - 24mm` (A4 height minus top+bottom margins) to visualize where pages will split.

### Changes

**`src/preview/FullPagePreview.tsx`**
- Add `showPageBreaks` state and a `Checkbox` + label in the toolbar
- When enabled, overlay horizontal dashed lines at each page boundary (every ~273mm of content height)
- Change print CSS: use `@page { margin: 12mm 16mm; }`, remove padding from wrapper, remove `* { break-inside: avoid }`, add targeted `[data-pdf-section] { break-inside: avoid; }` and `[data-section] { break-inside: avoid; }`

**`src/templates/MinimalTemplate.tsx`**, **`ProfessionalTemplate.tsx`**, **`ModernTemplate.tsx`**, **`BrutalistTemplate.tsx`**
- Add `data-pdf-section` attribute to each individual experience entry, education entry, project entry, and skill category block (the inner items, not the whole section) so they won't split across pages but the section as a whole can flow across pages

### Page Break Indicator Implementation
- Calculate content height via ref, divide by usable page height (`297mm - 24mm = 273mm ≈ 1032px at 96dpi`)
- Render absolute-positioned dashed lines at each multiple of that height
- Lines only visible when checkbox is checked, never in print output

