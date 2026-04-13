/**
 * Standalone PDF export utility.
 * Grabs the paginated preview DOM and opens a print window.
 * Structured for future replacement by a Puppeteer-based backend service.
 */

interface PageConfig {
  widthMm: number;
  cssSize: string;
}

export function exportResumeToPrint(
  printElement: HTMLElement,
  pageConfig: PageConfig,
  footerEmail?: string
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const content = printElement.innerHTML;
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
          .page-break-line { display: none !important; }
          /* Hide paged.js chrome in print */
          .pagedjs_margin-content { display: none !important; }
          .print-footer {
            position: fixed; bottom: 0; left: 0; right: 0;
            font-size: 8pt; color: #666; padding: 0;
          }
        </style>
      </head>
      <body>
        <div class="resume-print-content">${content}</div>
        ${footerEmail ? `<div class="print-footer">${footerEmail}</div>` : ''}
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for fonts and styles to load before printing
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
