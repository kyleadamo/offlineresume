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

// 1mm = 96/25.4 px at standard CSS DPI
const MM_TO_PX = 96 / 25.4;

const PagedResumePreview = ({
  resume,
  pageSize,
  TemplateComponent,
  currentPage,
}: PagedResumePreviewProps) => {
  const sourceHostRef = useRef<HTMLDivElement>(null);
  const sourceRootRef = useRef<Root | null>(null);

  // Outer container — its width drives the scale factor
  const outerRef = useRef<HTMLDivElement>(null);
  // Scaled wrapper (width: pageWidthMm, transform: scale(s))
  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  // Visible Paged.js render target (true page width)
  const targetRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runIdRef = useRef(0);

  const pageWidthPx = currentPage.widthMm * MM_TO_PX;

  // Mount React source tree
  useEffect(() => {
    if (!sourceHostRef.current) return;
    sourceRootRef.current = createRoot(sourceHostRef.current);
    return () => {
      sourceRootRef.current?.unmount();
      sourceRootRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!sourceRootRef.current) return;
    sourceRootRef.current.render(<TemplateComponent resume={resume} />);
  }, [resume, TemplateComponent]);

  // Recompute outer height so vertical flow accounts for the scale transform
  const updateOuterHeight = useCallback(() => {
    const target = targetRef.current;
    const outer = outerRef.current;
    if (!target || !outer) return;
    const naturalHeight = target.getBoundingClientRect().height / (scale || 1);
    // Use the scaled height so layout reserves correct vertical space
    outer.style.height = `${naturalHeight * scale}px`;
  }, [scale]);

  // Compute scale factor from container width
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const compute = () => {
      const w = outer.clientWidth;
      const next = Math.min(1, w / pageWidthPx);
      setScale(next);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(outer);
    return () => ro.disconnect();
  }, [pageWidthPx]);

  // Whenever scale changes, sync outer height
  useEffect(() => {
    updateOuterHeight();
  }, [scale, updateOuterHeight, pageCount]);

  const repaginate = useCallback(async () => {
    const source = sourceHostRef.current;
    const target = targetRef.current;
    if (!source || !target) return;

    const runId = ++runIdRef.current;
    setLoading(true);

    target.innerHTML = '';

    try {
      await document.fonts.ready;

      const pagedModule: any = await import('pagedjs');
      const Previewer = pagedModule.Previewer || pagedModule.default?.Previewer;
      if (!Previewer) throw new Error('pagedjs Previewer not found');

      const previewer = new Previewer();
      const html = source.innerHTML;
      const stylesheet = getPagedStyles(pageSize);

      const flow = await previewer.preview(html, [{ _: stylesheet }], target);

      if (runId !== runIdRef.current) return;

      setPageCount(flow?.total ?? target.querySelectorAll('.pagedjs_page').length);
      // Allow layout to settle before measuring
      requestAnimationFrame(() => {
        if (runId === runIdRef.current) updateOuterHeight();
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PagedResumePreview] pagination failed', err);
    } finally {
      if (runId === runIdRef.current) setLoading(false);
    }
  }, [pageSize, updateOuterHeight]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(repaginate, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [repaginate, resume, pageSize, TemplateComponent]);

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
    <div ref={outerRef} className="w-full mx-auto relative" style={{ maxWidth: `${currentPage.widthMm}mm` }}>
      {/* Hidden React source */}
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

      {/* Scaled wrapper — true page width, visually scaled to fit */}
      <div
        ref={scaleWrapperRef}
        style={{
          width: `${currentPage.widthMm}mm`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div
          ref={targetRef}
          className="resume-document paged-output"
          data-resume-print
          data-resume-document
          style={{ colorScheme: 'light' }}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 absolute inset-x-0 top-0">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Paginating…</span>
        </div>
      )}

      {!loading && pageCount > 1 && (
        <div className="text-center py-2 text-xs text-muted-foreground absolute -bottom-8 inset-x-0">
          {pageCount} pages
        </div>
      )}
    </div>
  );
};

export default PagedResumePreview;
