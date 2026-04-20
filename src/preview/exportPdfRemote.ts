/**
 * Remote PDF export — sends the already-paginated Paged.js DOM to the
 * `render-pdf` edge function, which renders it via headless Chromium
 * (Browserless.io) and returns a PDF blob.
 *
 * THEMING SAFETY (this has regressed multiple times):
 *  - We always wrap the captured HTML in `<div class="resume-document">…</div>`.
 *  - We always inline the `.resume-document` light-theme token block AND the
 *    Paged.js per-sheet token block. Without these, the dark builder palette
 *    leaks into the PDF.
 * Do not "simplify" by trusting the app's global tokens.
 */

import { supabase } from '@/integrations/supabase/client';
import { getPagedStyles } from './pagedStyles';

interface ExportOptions {
  pageSize: 'letter' | 'a4';
  filename: string;
}

/** Light-theme token block — mirrors `.resume-document` in src/index.css. */
const RESUME_DOCUMENT_THEME_CSS = `
.resume-document {
  color-scheme: light;
  --background: 60 20% 97%;
  --foreground: 215 29% 13%;
  --card: 0 0% 100%;
  --card-foreground: 215 29% 13%;
  --popover: 0 0% 100%;
  --popover-foreground: 215 29% 13%;
  --primary: 215 29% 13%;
  --primary-foreground: 60 20% 97%;
  --secondary: 216 12% 95%;
  --secondary-foreground: 215 29% 13%;
  --muted: 216 12% 95%;
  --muted-foreground: 215 13% 50%;
  --accent: 262 52% 47%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 76% 42%;
  --destructive-foreground: 0 0% 100%;
  --border: 216 12% 92%;
  --input: 216 12% 89%;
  --ring: 262 52% 47%;
  background: white;
}
`;

/** Print-specific tweaks so paginated chrome doesn't leak into the PDF. */
const PRINT_NORMALIZATION_CSS = `
.pagedjs_page { box-shadow: none !important; margin: 0 !important; background: white !important; }
.pagedjs_pages { gap: 0 !important; display: block !important; }
.pagedjs_margin-content { display: none !important; }
[data-section] { cursor: default !important; background: transparent !important; outline: none !important; box-shadow: none !important; }
[data-section]:hover { background: transparent !important; outline: none !important; }
.page-break-line { display: none !important; }
`;

/** Collect every <style> tag from the host page so Tailwind utility CSS travels with the HTML. */
function collectAppStyles(): string {
  return Array.from(document.querySelectorAll('style'))
    .map((el) => el.textContent ?? '')
    .join('\n');
}

export async function exportResumePdfRemote(
  printElement: HTMLElement,
  { pageSize, filename }: ExportOptions,
): Promise<void> {
  const docRoot = (printElement.closest('[data-resume-document]') as HTMLElement | null) ?? printElement;
  const innerHtml = docRoot.innerHTML;

  // Wrap with the .resume-document class so the inlined token block applies.
  const wrappedHtml = `<div class="resume-document" data-resume-print>${innerHtml}</div>`;

  const css = [
    collectAppStyles(),
    RESUME_DOCUMENT_THEME_CSS,
    getPagedStyles(pageSize),
    PRINT_NORMALIZATION_CSS,
  ].join('\n');

  const { data, error } = await supabase.functions.invoke('render-pdf', {
    body: { html: wrappedHtml, css, pageSize, filename },
  });

  if (error) {
    console.error('[exportPdfRemote] edge function error', error);
    throw error;
  }

  // supabase-js returns the body parsed; for binary we asked for a Blob via the
  // function returning application/pdf. The client wraps it in a Blob already.
  const blob =
    data instanceof Blob
      ? data
      : new Blob([data as ArrayBuffer], { type: 'application/pdf' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
