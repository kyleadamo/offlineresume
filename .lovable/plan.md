

## Full-Page Preview and PDF Download

### Overview
Add two features: (1) a full-page preview modal to view the resume without the editor panel, and (2) a "Download PDF" button that generates a cleanly formatted PDF using the browser's print API with `@media print` styles.

### Approach: Browser Print-to-PDF
Using `window.print()` with a print-specific stylesheet is the most reliable way to get pixel-perfect PDF output that matches the preview exactly — no third-party library needed. The template renders as HTML/CSS, so the browser's print engine captures it faithfully.

### Changes

**`src/preview/ResumePreview.tsx`**
- Add "Full Page" and "Download PDF" buttons next to the template switcher
- "Full Page" opens a `Dialog` (full-screen) showing just the resume template at A4 dimensions
- "Download PDF" opens the same full-page view in a new window and triggers `window.print()`, which lets the user save as PDF via the browser's native dialog

**`src/preview/FullPagePreview.tsx`** (new file)
- A dialog/modal component that renders the resume template at A4 size (210mm × 297mm) centered on a neutral background
- Contains "Download PDF" and "Close" buttons in a floating toolbar
- The PDF download function: opens a print-optimized window containing just the resume content with print CSS that hides everything except the resume, sets A4 page size, removes margins

**`src/index.css`**
- Add `@media print` rules: hide all UI chrome, set the resume container to fill the page, A4 page size with zero margins, ensure colors print (`-webkit-print-color-adjust: exact`)

### PDF Formatting Details
- Page size: A4 (210mm × 297mm)
- Margins: controlled by the template padding (matching preview)
- Colors print accurately via `print-color-adjust: exact`
- Photos, borders, backgrounds all preserved
- Multi-page support via CSS `break-inside: avoid` on sections

### Technical Notes
- No new dependencies required
- Uses `Dialog` from shadcn/ui for the full-page modal
- Print approach ensures WYSIWYG — what you see in preview is exactly what prints

