

## Reintroduce Paged.js — Properly This Time

The two earlier blockers are solvable. Here's how.

### Root cause recap

1. **Tailwind/CSS scoping broke** — Paged.js moved content into `.pagedjs_pages` outside our `.resume-document` wrapper, so light-theme CSS variables stopped resolving.
2. **React handlers lost** — We fed Paged.js an HTML *string* via `previewer.preview(html, ...)`, which serializes and clones. The new DOM has no React fiber attached.

### Solutions

**Fix 1 — CSS scoping**
Apply `.resume-document` to the Paged.js *output container*, not just the source. Two options:
- Wrap Paged.js's render target in a div with `class="resume-document"` so all generated `.pagedjs_page` descendants inherit the light tokens.
- Inject our resume-document CSS variables into the Paged.js chunker's stylesheet list so they apply inside the cloned tree.

Use `previewer.preview(content, [stylesheets], renderTo)` where `stylesheets` includes a synthesized stylesheet containing `.pagedjs_page { /* light tokens */ }`.

**Fix 2 — React handlers**
Use **event delegation** instead of per-element handlers. Attach a single `click` listener to the Paged.js output container that walks up looking for `[data-section]` and dispatches the existing `scroll-to-section` event. This already works with serialized DOM because we only need the data attribute, not React fibers.

For anything more interactive in the future, use the same delegation pattern — data attributes + container-level listeners.

**Fix 3 — Render flow**
- Render templates to a hidden React mount point as today
- Pass `mountNode.innerHTML` to Paged.js (one-shot serialization is fine)
- Debounce re-pagination (300ms) on resume/template/pageSize changes
- Show a spinner overlay during chunking so users don't see flicker
- Wait for `document.fonts.ready` before each pagination pass

### Files to change

1. **`src/preview/PagedResumePreview.tsx`** — Rewrite to use `pagedjs` Previewer:
   - Hidden React source container (current approach)
   - Visible Paged.js target container wrapped in `.resume-document`
   - Effect: serialize source → call `previewer.preview()` → set loading false
   - Single delegated click listener on target for `data-section`
   - Debounced re-run on deps change

2. **`src/preview/pagedStyles.ts`** — Re-activate. Export CSS string with:
   - `@page { size: letter|a4; margin: 12mm 16mm 16mm 16mm }`
   - `.pagedjs_page { background: white; box-shadow: ...; margin-bottom: 24px }`
   - **Embed the full light-theme token block** scoped to `.pagedjs_page` so colors resolve inside the cloned tree
   - `[data-pdf-section] { break-inside: avoid }`, heading break rules

3. **`src/preview/exportPrint.ts`** — Update to grab the Paged.js output (already paginated) and feed it to the print window, keeping the existing light-theme injection as a safety net.

4. **`src/index.css`** — Add `.pagedjs_page` polish rules (sheet shadows, page-break gap in screen view, hide shadows in `@media print`).

5. **`package.json`** — `pagedjs` already installed; keep it.

### What we gain

- Real CSS Paged Media break behavior (much smarter than viewport clipping)
- Foundation for `@page :first`, running headers/footers, page numbers
- Same paginated DOM can later be sent to a Puppeteer edge function for pixel-perfect PDFs
- Better handling of long sections that span pages

### What we accept

- Pagination cost (~100–400ms per run) — mitigated by debouncing
- Click-to-scroll uses delegation, not React handlers — fine for current needs
- Slightly more complex than viewport clipping — worth it for the control gained

### Validation

- Switch through Modern, Creative, Infographic, Brutalist templates; confirm colors stay correct
- Toggle Letter ↔ A4; confirm page dimensions update
- Click a section in preview; confirm scroll-to-section still fires
- Download PDF; confirm output matches preview
- Verify dark builder chrome doesn't leak into pages

