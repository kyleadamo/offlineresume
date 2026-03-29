

## Hide Print Header & Customize Footer

### Problem
When printing/exporting to PDF, the browser adds a default header (page title + date) and footer ("about:blank" URL). These need to be removed/customized.

### Solution
In the print window styles in `FullPagePreview.tsx`, update the `@page` rule to suppress the default header and show the user's email in the footer, left-aligned with content margins.

### Changes

**`src/preview/FullPagePreview.tsx`** — Update the `@page` CSS block in `handleDownloadPDF`:

```css
@page {
  size: ${currentPage.cssSize};
  margin: 12mm 16mm;
  
  @top-left { content: ''; }
  @top-center { content: ''; }
  @top-right { content: ''; }
  
  @bottom-left { content: '${resume.profile.email || ''}'; font-size: 8pt; color: #666; }
  @bottom-center { content: ''; }
  @bottom-right { content: ''; }
}
```

**Note:** `@page` margin boxes (`@top-left`, etc.) are a CSS Paged Media spec feature with limited browser support. Since Chrome/Edge (the primary print-to-PDF browsers) don't fully support margin boxes, the more reliable approach is:

1. Set the print window `<title>` to an empty string (removes the header which shows the title)
2. Use a `javascript:void(0)` or blank URL trick — but since we already use `window.open('', '_blank')`, the URL will show as blank
3. The most reliable fix: add a note in the print dialog instructing to uncheck "Headers and footers" — **or** inject a visible footer element at the bottom of the content itself

**Revised approach — inject a custom footer element:**
- Set `<title>` to empty string `''` to suppress the browser header title
- Open the print window with a blank URL (already done) — but browsers still show "about:blank"
- The only reliable cross-browser way to control headers/footers is to tell the user to uncheck "Headers and footers" in the print dialog. However, we can also help by:
  - Adding a visible footer `<div>` with the email at the bottom of each page using CSS `position: running()` or `position: fixed` in print media
  - Using `position: fixed; bottom: 0;` in print CSS to render a footer on every page

### Final Approach

**`src/preview/FullPagePreview.tsx`**:
1. Change `<title>` from `${resume.title || 'Resume'}` to `''` (empty) — removes the title from browser's default header
2. Add a fixed-position footer div in the print HTML body with the email address, styled to appear at the bottom of every printed page
3. Adjust `@page` margin-bottom slightly to accommodate the footer

```html
<div class="print-footer">${resume.profile.email || ''}</div>
```
```css
.print-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 8pt;
  color: #666;
  padding: 0;
}
```

The fixed-position element repeats on every printed page in Chrome/Edge. Left-aligned by default, matching the content margin since `@page { margin: 12mm 16mm }` controls the printable area.

