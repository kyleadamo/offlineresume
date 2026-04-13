import { useRef, useEffect, useState, useCallback } from 'react';
import { Resume } from '@/schema/resume';
import { Loader2 } from 'lucide-react';

interface PagedResumePreviewProps {
  resume: Resume;
  pageSize: 'letter' | 'a4';
  TemplateComponent: React.ComponentType<{ resume: Resume }>;
  currentPage: { widthMm: number; heightMm: number };
}

const PAGE_MARGIN_TOP_MM = 12;
const PAGE_MARGIN_BOTTOM_MM = 16;
const PAGE_MARGIN_X_MM = 16;

/**
 * PagedResumePreview renders the resume template directly, then
 * visually splits it into discrete page-sized sheets using CSS clipping.
 *
 * This avoids Paged.js DOM manipulation issues while giving the
 * appearance of real paginated pages with shadows and gaps.
 */
const PagedResumePreview = ({
  resume,
  pageSize,
  TemplateComponent,
  currentPage,
}: PagedResumePreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [contentHeight, setContentHeight] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Usable content height per page (page height minus top+bottom margins)
  const usableHeightMm = currentPage.heightMm - PAGE_MARGIN_TOP_MM - PAGE_MARGIN_BOTTOM_MM;

  const calculatePages = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    const totalHeight = el.scrollHeight;
    setContentHeight(totalHeight);

    // Convert usable height from mm to px (1mm ≈ 3.7795px at 96dpi)
    const usableHeightPx = usableHeightMm * 3.7795;

    const pageCount = Math.max(1, Math.ceil(totalHeight / usableHeightPx));
    const offsets: number[] = [];
    for (let i = 0; i < pageCount; i++) {
      offsets.push(i * usableHeightPx);
    }
    setPages(offsets);
  }, [usableHeightMm]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Wait for fonts before measuring
      document.fonts.ready.then(calculatePages);
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [calculatePages, resume, pageSize]);

  // Also observe resize changes on the content
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => calculatePages());
    ro.observe(el);
    return () => ro.disconnect();
  }, [calculatePages]);

  const usableHeightPx = usableHeightMm * 3.7795;
  const pageWidthMm = currentPage.widthMm;

  return (
    <div style={{ width: `${pageWidthMm}mm` }} className="mx-auto">
      {/* Hidden full-height container that renders the template at correct width.
          This is measured to determine page count, and is the source for clipping. */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: `${pageWidthMm}mm`,
          padding: `${PAGE_MARGIN_TOP_MM}mm ${PAGE_MARGIN_X_MM}mm ${PAGE_MARGIN_BOTTOM_MM}mm`,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div ref={contentRef}>
          <TemplateComponent resume={resume} />
        </div>
      </div>

      {/* Visible page sheets — each clips a portion of the template */}
      {pages.length > 0 ? (
        <div className="flex flex-col items-center gap-6">
          {pages.map((offset, i) => {
            const isLastPage = i === pages.length - 1;
            const remainingHeight = contentHeight - offset;
            const pageContentHeight = isLastPage
              ? Math.min(usableHeightPx, remainingHeight)
              : usableHeightPx;

            return (
              <div
                key={i}
                className="bg-white shadow-lg relative"
                style={{
                  width: `${pageWidthMm}mm`,
                  height: `${pageContentHeight + (PAGE_MARGIN_TOP_MM + PAGE_MARGIN_BOTTOM_MM) * 3.7795}px`,
                  padding: `${PAGE_MARGIN_TOP_MM}mm ${PAGE_MARGIN_X_MM}mm ${PAGE_MARGIN_BOTTOM_MM}mm`,
                  overflow: 'hidden',
                }}
                data-resume-print={i === 0 ? '' : undefined}
              >
                <div
                  style={{
                    marginTop: `-${offset}px`,
                    height: `${contentHeight}px`,
                  }}
                >
                  <TemplateComponent resume={resume} />
                </div>

                {/* Page number */}
                <div
                  className="absolute bottom-2 right-4 text-[10px] text-gray-400"
                  style={{ pointerEvents: 'none' }}
                >
                  {i + 1} / {pages.length}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading…</span>
        </div>
      )}

      {/* Page count */}
      {pages.length > 1 && (
        <div className="text-center py-2 text-xs text-muted-foreground">
          {pages.length} pages
        </div>
      )}
    </div>
  );
};

export default PagedResumePreview;
