/**
 * CSS injected into the Paged.js chunker so the cloned `.pagedjs_page`
 * tree resolves the same light-theme tokens as our `.resume-document`
 * scope. Without this, semantic Tailwind classes like
 * `text-foreground` / `text-muted-foreground` / `text-accent` fall back
 * to the dark builder root and look washed out on white paper.
 *
 * Also defines @page margins/size and break-control rules.
 */

export function getPagedStyles(pageSize: 'letter' | 'a4'): string {
  const size = pageSize === 'a4' ? 'A4' : 'letter';

  return `
    /* Light-theme document tokens scoped to every paginated sheet.
       Mirrors the .resume-document block in src/index.css. */
    .pagedjs_page,
    .pagedjs_page_content,
    .pagedjs_page * {
      color-scheme: light;
    }

    .pagedjs_page {
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

    @page {
      size: ${size};
      margin: 12mm 16mm 16mm 16mm;
    }

    /* Break control */
    [data-pdf-section] { break-inside: avoid; }
    [data-section] > h2,
    [data-section] > h3,
    h2, h3 { break-after: avoid; }
    [data-section] > h2:first-child,
    [data-section] > h3:first-child { break-after: avoid-page; }
    [data-pdf-section]:first-of-type { break-before: avoid; }
    li, .experience-entry, .education-entry { break-inside: avoid; }

    /* Cursor for delegated click-to-scroll */
    [data-section] { cursor: pointer; }
  `;
}
