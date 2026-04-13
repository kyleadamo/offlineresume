import { useRef, useEffect, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Resume } from '@/schema/resume';
import { getPagedStyles } from './pagedStyles';
import { Loader2 } from 'lucide-react';

interface PagedResumePreviewProps {
  resume: Resume;
  pageSize: 'letter' | 'a4';
  TemplateComponent: React.ComponentType<{ resume: Resume }>;
  currentPage: { widthMm: number; heightMm: number };
}

/**
 * PagedResumePreview renders the resume template into a hidden container,
 * then uses Paged.js to paginate it into discrete visual pages.
 *
 * The paginated output is displayed as separate "sheets" with shadows.
 * A `data-resume-print` attribute is set on the container for PDF export.
 */
const PagedResumePreview = ({
  resume,
  pageSize,
  TemplateComponent,
  currentPage,
}: PagedResumePreviewProps) => {
  const sourceRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactRootRef = useRef<ReturnType<typeof createRoot> | null>(null);

  const runPagination = useCallback(async () => {
    const source = sourceRef.current;
    const target = targetRef.current;
    if (!source || !target) return;

    setLoading(true);

    // Wait for fonts to be ready
    await document.fonts.ready;

    // Render the template into the hidden source container using a React root
    // so that the full component tree (including hooks) works correctly.
    await new Promise<void>((resolve) => {
      if (!reactRootRef.current) {
        reactRootRef.current = createRoot(source);
      }
      reactRootRef.current.render(<TemplateComponent resume={resume} />);
      // Give React a frame to flush
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    const htmlContent = source.innerHTML;

    // Clear the target before re-paginating
    target.innerHTML = '';

    try {
      // Dynamic import to avoid SSR issues and reduce initial bundle
      const { Previewer } = await import('pagedjs');
      const previewer = new Previewer();

      const pagedCSS = getPagedStyles(pageSize);

      // Paged.js expects content as a string or DOM, and a stylesheet array.
      // We pass the HTML content and an inline stylesheet via a Blob URL.
      const cssBlob = new Blob([pagedCSS], { type: 'text/css' });
      const cssUrl = URL.createObjectURL(cssBlob);

      // Also gather the app's stylesheets so templates render correctly
      const appStylesheets = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      ).map((el) => (el as HTMLLinkElement).href);

      const flow = await previewer.preview(
        htmlContent,
        [...appStylesheets, cssUrl],
        target
      );

      URL.revokeObjectURL(cssUrl);
      setPageCount(flow.total || 0);
    } catch (err) {
      console.error('Paged.js pagination error:', err);
      // Fallback: just show the raw content
      target.innerHTML = `<div style="padding: 12mm 16mm; background: white;">${htmlContent}</div>`;
      setPageCount(1);
    }

    setLoading(false);
  }, [resume, pageSize, TemplateComponent]);

  useEffect(() => {
    // Debounce pagination to avoid excessive re-runs while typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runPagination, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [runPagination]);

  // Cleanup React root on unmount
  useEffect(() => {
    return () => {
      if (reactRootRef.current) {
        reactRootRef.current.unmount();
        reactRootRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: `${currentPage.widthMm}mm` }} className="mx-auto">
      {/* Hidden source container for React template rendering */}
      <div
        ref={sourceRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: `${currentPage.widthMm}mm`,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      />

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Paginating…
          </span>
        </div>
      )}

      {/* Paginated output from Paged.js */}
      <div
        ref={targetRef}
        data-resume-print
        className={loading ? 'opacity-0 h-0 overflow-hidden' : ''}
        onClick={(e) => {
          // Preserve section click-to-scroll behavior
          let el = e.target as HTMLElement | null;
          while (el && !el.getAttribute('data-section')) {
            if (el === e.currentTarget) {
              el = null;
              break;
            }
            el = el.parentElement;
          }
          if (el) {
            const section = el.getAttribute('data-section')!;
            window.dispatchEvent(
              new CustomEvent('scroll-to-section', { detail: section })
            );
          }
        }}
      />

      {/* Page count indicator */}
      {!loading && pageCount > 0 && (
        <div className="text-center py-2 text-xs text-muted-foreground">
          {pageCount} {pageCount === 1 ? 'page' : 'pages'}
        </div>
      )}
    </div>
  );
};

export default PagedResumePreview;
