/**
 * CSS styles injected into the Paged.js previewer.
 * These control page sizing, margins, and break behavior
 * for the paginated resume preview.
 */

export function getPagedStyles(pageSize: 'letter' | 'a4'): string {
  const size = pageSize === 'a4' ? '210mm 297mm' : '8.5in 11in';

  return `
    @page {
      size: ${size};
      margin: 12mm 16mm 16mm 16mm;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: white;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Section break control */
    [data-pdf-section] {
      break-inside: avoid;
    }

    [data-section] > h2,
    [data-section] > h3 {
      break-after: avoid;
    }

    [data-section] {
      break-inside: avoid;
    }

    /* Prevent orphaned headings */
    h2, h3 {
      break-after: avoid;
    }

    /* Keep list items and experience entries together */
    li, .experience-entry, .education-entry {
      break-inside: avoid;
    }

    /* Clean up interactive styles in print/preview context */
    [data-section] {
      cursor: default !important;
    }
  `;
}
