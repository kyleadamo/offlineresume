import { useRef, useEffect, useState, useCallback } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Resume } from '@/schema/resume';
import { Loader2 } from 'lucide-react';
import { getPagedStyles } from './pagedStyles';

interface PagedResumePreviewProps {
  resume: Resume;
  pageSize: 'letter' | 'a4';
  TemplateComponent: React.ComponentType<{ resume: Resume }>;
  currentPage: { widthMm: number; heightMm: number };
}

/**
 * PagedResumePreview uses Paged.js to chunk the rendered resume HTML
 * into discrete `.pagedjs_page` sheets — real CSS Paged Media behavior.
 *
 * Two fixes vs. the earlier failed attempt:
 *  1. Theme tokens are injected into the chunker via getPagedStyles(),
 *     so the cloned tree (which sits outside our React .resume-document
 *     wrapper) still resolves the light document palette.
 *  2. Click-to-scroll uses event delegation on the output container
 *     instead of React handlers, so it survives the HTML serialization
 *     that Paged.js performs internally.
 */
const PagedResumePreview = ({
  resume,
  pageSize,
  TemplateComponent,
  currentPage,
}: PagedResumePreviewProps) => {
  // Hidden React mount point — kept live so Tailwind JIT + handlers work
  const sourceHostRef = useRef<HTMLDivElement>(null);
  const sourceRootRef = useRef<Root | null>(null);

  // Visible Paged.js render target
  const targetRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runIdRef = useRef(0);

  // Mount the React source tree once
  useEffect(() => {
    if (!sourceHostRef.current) return;
    sourceRootRef.current = createRoot(sourceHostRef.current);
    return () => {
      sourceRootRef.current?.unmount();
      sourceRootRef.current = null;
    };
  }, []);

  // Render current resume into the source tree
  useEffect(() => {
    if (!sourceRootRef.current) return;
    sourceRootRef.current.render(<TemplateComponent resume={resume} />);
  }, [resume, TemplateComponent]);

  const repaginate = useCallback(async () => {
    const source = sourceHostRef.current;
    const target = targetRef.current;
    if (!source || !target) return;

    const runId = ++runIdRef.current;
    setLoading(true);

    // Clear any previous output
    target.innerHTML = '';

    try {
      await document.fonts.ready;

      // Dynamic import keeps pagedjs out of the initial bundle
      const pagedModule: any = await import('pagedjs');
      const Previewer = pagedModule.Previewer || pagedModule.default?.Previewer;
      if (!Previewer) throw new Error('pagedjs Previewer not found');

      const previewer = new Previewer();
      const html = source.innerHTML;
      const stylesheet = getPagedStyles(pageSize);

      const flow = await previewer.preview(
        html,
        [{ _: stylesheet }],
        target,
      );

      // Drop result if a newer run started during pagination
      if (runId !== runIdRef.current) return;

      setPageCount(flow?.total ?? target.querySelectorAll('.pagedjs_page').length);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PagedResumePreview] pagination failed', err);
    } finally {
      if (runId === runIdRef.current) setLoading(false);
    }
  }, [pageSize]);

  // Debounced re-pagination on inputs that affect layout
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(repaginate, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [repaginate, resume, pageSize, TemplateComponent]);

  // Delegated click-to-scroll — works on Paged.js cloned DOM
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const onClick = (e: MouseEvent) => {
      let el = e.target as HTMLElement | null;
      while (el && el !== target) {
        const section = el.getAttribute?.('data-section');
        if (section) {
          window.dispatchEvent(
            new CustomEvent('scroll-to-section', { detail: section }),
          );
          return;
        }
        el = el.parentElement;
      }
    };

    target.addEventListener('click', onClick);
    return () => target.removeEventListener('click', onClick);
  }, []);

  return (
    <div style={{ width: `${currentPage.widthMm}mm` }} className="mx-auto relative">
      {/* Hidden, live React source — Tailwind/handlers stay intact here */}
      <div
        ref={sourceHostRef}
        className="resume-document"
        data-resume-source
        style={{
          position: 'absolute',
          left: '-99999px',
          top: 0,
          width: `${currentPage.widthMm}mm`,
          visibility: 'hidden',
          pointerEvents: 'none',
          colorScheme: 'light',
        }}
      />

      {/* Visible Paged.js output — wrapped so light tokens cascade in */}
      <div
        ref={targetRef}
        className="resume-document paged-output"
        data-resume-print
        data-resume-document
        style={{ colorScheme: 'light' }}
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Paginating…</span>
        </div>
      )}

      {!loading && pageCount > 1 && (
        <div className="text-center py-2 text-xs text-muted-foreground">
          {pageCount} pages
        </div>
      )}
    </div>
  );
};

export default PagedResumePreview;
