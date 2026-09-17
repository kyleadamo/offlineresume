/**
 * Standalone PDF export utility.
 * Grabs the paginated preview DOM and opens a print window.
 * Structured for future replacement by a Puppeteer-based backend service.
 */

interface PageConfig {
  widthMm: number;
  cssSize: string;
}

/* Light-theme CSS variables embedded directly into the print window
   so exported HTML never depends on the app's dark-mode tokens. */
const RESUME_DOCUMENT_THEME = `
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
}
`;

export function exportResumeToPrint(
  printElement: HTMLElement,
  pageConfig: PageConfig,
  footerEmail?: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Prefer the themed document root (which now contains the Paged.js output);
  // fall back to wrapping raw content.
  const docRoot = printElement.closest('[data-resume-document]') as HTMLElement | null;
  const content = docRoot
    ? docRoot.innerHTML
    : printElement.innerHTML;

  const styles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]')
  )
    .map((el) => el.outerHTML)
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title></title>
        ${styles}
        <style>
          ${RESUME_DOCUMENT_THEME}
          @page {
            size: ${pageConfig.cssSize};
            margin: 12mm 16mm 16mm 16mm;
          }
          html, body {
            margin: 0; padding: 0; background: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body { width: ${pageConfig.widthMm}mm; }
          .resume-print-content { width: 100%; }
          [data-section] {
            cursor: default !important;
            background: transparent !important;
            outline: none !important;
            box-shadow: none !important;
          }
          [data-section]:hover {
            background: transparent !important;
            outline: none !important;
          }
          [data-pdf-section] { break-inside: avoid; }
          [data-section] > h3, [data-section] > h2 { break-after: avoid; }
          [data-section] > h3:first-child, [data-section] > h2:first-child { break-after: avoid-page; }
          [data-pdf-section]:first-of-type { break-before: avoid; }
          .page-break-line { display: none !important; }
          .pagedjs_margin-content { display: none !important; }
          /* Strip preview chrome from paginated sheets when printing */
          .pagedjs_page { box-shadow: none !important; margin: 0 !important; background: white !important; }
          .pagedjs_pages { gap: 0 !important; display: block !important; }
          .print-footer {
            position: fixed; bottom: 0; left: 0; right: 0;
            font-size: 8pt; color: #666; padding: 0;
          }
        </style>
      </head>
      <body>
        <div class="resume-document resume-print-content">${content}</div>
        ${footerEmail ? `<div class="print-footer">${footerEmail}</div>` : ''}
      </body>
    </html>
  `);

  printWindow.document.close();

  const tryPrint = () => {
    if (printWindow.document.fonts) {
      printWindow.document.fonts.ready.then(() => {
        printWindow.print();
        printWindow.close();
      });
    } else {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  setTimeout(tryPrint, 300);
}
