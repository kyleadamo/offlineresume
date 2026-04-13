

## Integrate Paged.js for Paginated Resume Preview

### Overview

Replace the current fake page-break overlay with Paged.js, which will chunk the resume HTML into discrete visual pages in the preview. The existing templates remain untouched — Paged.js operates on the rendered DOM output.

### How Paged.js works

Paged.js is a CSS Paged Media polyfill. You give it an HTML container and it splits it into page-sized chunks, applying `@page` rules, `break-inside: avoid`, etc. It outputs a DOM structure with `.pagedjs_page` elements, each representing one sheet.

### Files to create / modify

#### 1. Install `pagedjs` package
```
npm install pagedjs
```

#### 2. Create `src/preview/PagedResumePreview.tsx` (new file)

A wrapper component that:
- Renders the selected template into a hidden "source" container
- Uses a `useEffect` to run `new Paged.Previewer().preview(sourceHTML, pagedStyles, targetContainer)` whenever resume data, template, or page size changes
- Debounces re-pagination (300ms) to avoid flicker during typing
- Shows a loading spinner during pagination
- Displays the paginated output: discrete page sheets with shadows and gaps between them
- Exposes a ref (`data-resume-print`) for the PDF export to grab content from
- Preserves the `data-section` click handler for scroll-to-section behavior

Key structure:
```tsx
function PagedResumePreview({ resume, pageSize, TemplateComponent }) {
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debounced: render template to sourceRef, then call
    // Paged.Previewer to paginate into targetRef
    // Set loading=false when done
  }, [resume, pageSize, TemplateComponent]);

  return (
    <>
      {/* Hidden source container where React renders the template */}
      <div ref={sourceRef} style={{ position: 'absolute', visibility: 'hidden' }}>
        <TemplateComponent resume={resume} />
      </div>
      {/* Visible paginated output */}
      {loading && <Spinner />}
      <div ref={targetRef} data-resume-print />
    </>
  );
}
```

#### 3. Create `src/preview/pagedStyles.ts` (new file)

Exports a CSS string for Paged.js containing:
- `@page` rules for letter and A4 with margins `12mm 16mm`
- `[data-pdf-section] { break-inside: avoid; }`
- `[data-section] > h2, [data-section] > h3 { break-after: avoid; }`
- Page background white, body reset styles
- Named page sizes so switching letter/A4 works

#### 4. Modify `src/preview/ResumePreview.tsx`

- Remove the `PageBreakOverlay` component entirely (no longer needed)
- Remove `showPageBreaks` prop handling and the `usableHeightMm` calculation
- Replace the single `printRef` div with `PagedResumePreview`
- Keep the template selector strip, download button, and options menu
- The options menu loses the "Show page breaks" checkbox (pages are always shown)
- Pass `pageSize` and `resume` to `PagedResumePreview`

The preview area becomes:
```tsx
<div className="flex justify-center">
  <PagedResumePreview
    resume={displayResume}
    pageSize={pageSize}
    TemplateComponent={TemplateComponent}
    currentPage={currentPage}
  />
</div>
```

#### 5. Modify `src/pages/BuilderPage.tsx`

- Remove `showPageBreaks` state (no longer needed)
- Remove `showPageBreaks` prop from `BuilderHeader` and `ResumePreview`
- Remove the "Show page breaks" checkbox from the Page Layout dialog
- Keep the page size selector

#### 6. Update `src/index.css`

- Add Paged.js preview styling:
```css
/* Paged.js preview sheets */
.pagedjs_page {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  margin-bottom: 24px;
}
```
- Keep existing `@media print` rules; add a rule to hide `.pagedjs_page` shadows in print

#### 7. Refactor PDF export (both in `BuilderPage.tsx` header and `ResumePreview.tsx`)

- The export function grabs `[data-resume-print]` innerHTML as before
- Add the paged styles CSS to the print window
- The content is already paginated DOM, so print output is more accurate
- Structure the export as a standalone `exportResumeToPrint(element, pageConfig)` utility in `src/preview/exportPrint.ts` for future Puppeteer reuse

### What stays the same

- All 14 template components — zero changes
- `useResumeStore`, `ResumeContext`, schema — unchanged
- Template selector strip UI — unchanged
- Cover letter preview — unchanged

### Limitations remaining after this change

- PDF export still uses browser print dialog (not pixel-perfect)
- Browser print may add headers/footers depending on user settings
- Fonts must be loaded before pagination runs (handled via `document.fonts.ready`)
- Very long single items that exceed one page height cannot be split mid-element

### Recommended next step for future PDF export

Create a backend edge function that receives the paginated HTML, runs headless Chromium/Puppeteer, and returns a PDF blob — reusing the same HTML + CSS that `PagedResumePreview` generates.

