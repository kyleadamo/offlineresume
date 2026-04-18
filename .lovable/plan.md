

## Prompt: Build Puppeteer-Based PDF Export

Below is a ready-to-paste prompt the user can send to kick off the implementation. It's grounded in this codebase: `PagedResumePreview` already produces a paginated `.resume-document` DOM, `exportResumeToPrint` is the current export entry point, and Lovable Cloud / Supabase Edge Functions are available.

---

### The prompt

> Build a Puppeteer-based PDF export that replaces the current browser-print fallback while keeping it as a backup. Reuse the exact same paginated HTML that `src/preview/PagedResumePreview.tsx` already produces — do not rebuild templates server-side.
>
> **Architecture**
> - Add a Supabase Edge Function `supabase/functions/render-pdf/index.ts` that accepts `{ html, css, pageSize: 'letter' | 'a4', filename }`, launches headless Chromium, sets the page content, waits for fonts + network idle, and returns a PDF blob.
> - Use `@sparticuz/chromium` + `puppeteer-core` (Deno-compatible build) so it runs inside the Edge runtime. If that proves too heavy for Edge, fall back to Browserless.io with an API key stored as a secret — ask me which I prefer before committing.
> - Add CORS headers, validate input with Zod, cap HTML size (e.g. 2MB), and return `application/pdf` with a `Content-Disposition` header.
>
> **Client side**
> 1. In `src/preview/PagedResumePreview.tsx`, expose a method (or a ref) that returns:
>    - the serialized `outerHTML` of the `data-resume-document` Paged.js output
>    - the concatenated CSS from `getPagedStyles()` plus the `.resume-document` light-theme tokens from `src/index.css` plus the Google Fonts `<link>` URL
> 2. Create `src/preview/exportPdfRemote.ts` that POSTs the payload to the new edge function via `supabase.functions.invoke('render-pdf')`, downloads the returned blob, and triggers a save with the resume name.
> 3. Update `src/preview/exportPrint.ts` to remain as a "Print (browser)" fallback. Wire the builder header's primary "Download PDF" button to `exportPdfRemote` and add a secondary menu item for the browser fallback.
>
> **Fidelity requirements**
> - Embed the same Inter + Source Serif 4 fonts the preview loads; wait for `page.evaluateHandle('document.fonts.ready')` before printing.
> - Set viewport to the page size in pixels at 96dpi so Paged.js chunks identically to the preview.
> - Use `printBackground: true`, `preferCSSPageSize: true`, no header/footer template (the document supplies its own).
> - Pass `@page { size: letter|a4; margin: 12mm 16mm 16mm 16mm }` so margins match `pagedStyles.ts`.
>
> **Theming safety (this has regressed 3 times — protect against it)**
> - The HTML sent to the edge function must be wrapped in `<div class="resume-document">…</div>` and the CSS must include the full `.resume-document` light-theme token block. Do not rely on the app's global tokens. Add a comment in `exportPdfRemote.ts` documenting why.
>
> **UX**
> - Show a loading state on the Download button while the request is in flight.
> - Toast on success ("PDF downloaded") and on failure with a "Try browser print instead" action that calls the existing `exportResumeToPrint`.
> - Log errors to console with the request id returned by the function.
>
> **Out of scope**
> - No template rewrites
> - No changes to cover letter export (yet — note as follow-up)
> - No auth-gating the function (resumes are user-supplied content; rely on rate limits)
>
> **Validation**
> - Test Modern, Creative, Infographic, Brutalist templates in both Letter and A4
> - Confirm exported PDF matches the on-screen Paged.js preview page-for-page
> - Confirm fonts, accent colors, and muted text all render correctly
> - Confirm the browser-print fallback still works when the edge function is unreachable
>
> Before writing code, ask me:
> 1. Puppeteer-in-Edge vs Browserless.io vs a separate Node service?
> 2. Should the PDF be returned inline or also stored in Supabase Storage for re-download?

---

### Why this prompt works for this codebase

- Anchors to real files (`PagedResumePreview.tsx`, `exportPrint.ts`, `pagedStyles.ts`, `index.css`) so the implementer doesn't reinvent structure.
- Forces reuse of the already-paginated DOM — no double rendering path.
- Bakes in the recurring light-theme regression guard.
- Leaves the browser print as a graceful fallback so nothing breaks during rollout.
- Defers two real architectural choices (runtime + storage) to you instead of guessing.

