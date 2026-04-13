
Fix the regression by making the resume document carry its own light-theme scope instead of relying on surrounding page chrome.

1. Root cause
- The builder print/export flow is exporting raw resume HTML into a new window without the light document wrapper.
- Templates use semantic classes like `text-foreground`, `text-muted-foreground`, and `text-accent`, so in print they resolve against the app’s dark root tokens and become too light on white paper.
- This keeps recurring because there are two print paths: the shared export utility and a separate builder-header implementation.

2. Create one source of truth for resume document theming
- In `src/index.css`, add a dedicated resume-document theme class that defines the light document tokens and `color-scheme: light`.
- Reuse the current light resume token values from `.not-dark` so the document appearance stays consistent.
- Keep `.not-dark` as an alias or migrate existing wrappers to the new class.

3. Move theme ownership into the preview component
- In `src/preview/PagedResumePreview.tsx`, add a real `data-resume-document` wrapper around the template render and apply the resume-document theme class there.
- Use that same themed wrapper for both:
  - the hidden export source
  - the visible paged sheets
- This prevents future builder chrome/theme changes from affecting resume colors.

4. Make export use the same themed document root
- In `src/preview/exportPrint.ts`, export the marked document root (`data-resume-document`) instead of raw `innerHTML`.
- If needed, use `outerHTML` or wrap cloned content in the resume-document theme class before writing the print window.
- Keep only print-specific CSS there (`@page`, print color-adjust, page chrome cleanup), not theme definitions scattered in multiple places.
- Add a fallback guard so export still wraps content in the light document class if the marked root is missing.

5. Remove the duplicate builder print path
- In `src/pages/BuilderPage.tsx`, replace the local `handleDownloadPDF` window-print implementation with the shared `exportResumeToPrint` utility.
- This gives builder preview and builder download the same rendering contract and removes the main source of reintroducing this bug.

6. Keep scope tight
- No resume template rewrites.
- No new PDF backend work.
- No cover letter changes.
- Only harden resume preview/export theming and centralize the print path.

Validation
- Verify builder preview and browser print preview with at least Infographic, Creative, and Modern templates.
- Confirm the name, contact row, headings, and body text keep correct dark-on-light contrast.
- Check both Letter and A4.
- Confirm the landing/index preview still matches the current good state.
