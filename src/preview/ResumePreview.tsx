import { useResume } from '@/hooks/ResumeContext';
import MinimalTemplate from '@/templates/MinimalTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import BrutalistTemplate from '@/templates/BrutalistTemplate';
import ExecutiveTemplate from '@/templates/ExecutiveTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import CompactTemplate from '@/templates/CompactTemplate';
import AcademicTemplate from '@/templates/AcademicTemplate';
import TechTemplate from '@/templates/TechTemplate';
import ElegantTemplate from '@/templates/ElegantTemplate';
import InfographicTemplate from '@/templates/InfographicTemplate';
import ClassicTemplate from '@/templates/ClassicTemplate';
import { Resume, TemplateId } from '@/schema/resume';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, ChevronDown, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

const templateMap: Record<TemplateId, React.ComponentType<any>> = {
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  brutalist: BrutalistTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  compact: CompactTemplate,
  academic: AcademicTemplate,
  tech: TechTemplate,
  elegant: ElegantTemplate,
  infographic: InfographicTemplate,
  classic: ClassicTemplate,
  editorial: ProfessionalTemplate,
};

const allTemplates: { id: TemplateId; label: string }[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'modern', label: 'Modern' },
  { id: 'brutalist', label: 'Brutalist' },
  { id: 'executive', label: 'Executive' },
  { id: 'creative', label: 'Creative' },
  { id: 'compact', label: 'Compact' },
  { id: 'academic', label: 'Academic' },
  { id: 'tech', label: 'Tech / Terminal' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'infographic', label: 'Infographic' },
  { id: 'classic', label: 'Classic' },
];

function useVisibleTemplateCount(containerRef: React.RefObject<HTMLElement>) {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      // ~80px per button + 70px for More button + gap
      if (w >= 900) setCount(12);
      else if (w >= 780) setCount(9);
      else if (w >= 620) setCount(7);
      else if (w >= 480) setCount(5);
      else setCount(4);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);
  return count;
}

type PageSize = 'a4' | 'letter';

const PAGE_SIZES: Record<PageSize, { label: string; widthMm: number; heightMm: number; cssSize: string }> = {
  a4: { label: 'A4', widthMm: 210, heightMm: 297, cssSize: 'A4' },
  letter: { label: 'US Letter', widthMm: 215.9, heightMm: 279.4, cssSize: 'letter' },
};

const PAGE_MARGIN_Y_MM = 12;

interface ResumePreviewProps {
  resume?: Resume;
  onTemplateChange?: (id: TemplateId) => void;
  hideControls?: boolean;
}

const ResumePreview = ({ resume: resumeProp, onTemplateChange, hideControls }: ResumePreviewProps = {}) => {
  const { activeResume: contextResume, updateResume } = useResume();
  const displayResume = resumeProp ?? contextResume;
  const [moreOpen, setMoreOpen] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>('letter');
  const [showPageBreaks, setShowPageBreaks] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const visibleCount = useVisibleTemplateCount(stripRef);

  if (!displayResume) return null;

  const handleTemplateChange = (id: TemplateId) => {
    if (onTemplateChange) onTemplateChange(id);
    else if (displayResume) updateResume(displayResume.id, { templateId: id });
  };

  const TemplateComponent = templateMap[displayResume.templateId] || MinimalTemplate;
  const visibleTemplates = allTemplates.slice(0, visibleCount);
  const overflowTemplates = allTemplates.slice(visibleCount);
  const isMoreActive = overflowTemplates.some((t) => t.id === displayResume.templateId);
  const activeMoreLabel = overflowTemplates.find((t) => t.id === displayResume.templateId)?.label;
  const currentPage = PAGE_SIZES[pageSize];
  const usableHeightMm = currentPage.heightMm - PAGE_MARGIN_Y_MM * 2;

  return (
    <div className="py-8 px-6 space-y-4 max-w-[1200px] mx-auto">
      <div className="flex justify-center">
        <div ref={stripRef} style={{ width: `${currentPage.widthMm}mm` }}>
          <div className="flex items-center gap-2 flex-wrap">
            {visibleTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateChange(t.id)}
                className={`text-xs px-3 py-1.5 rounded-md transition-all duration-200 ${
                  displayResume.templateId === t.id
                    ? 'font-medium text-white'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
                style={displayResume.templateId === t.id ? { backgroundColor: '#FF4500' } : undefined}
              >
                {t.label}
              </button>
            ))}

            {overflowTemplates.length > 0 && (
              <Popover open={moreOpen} onOpenChange={setMoreOpen}>
                <PopoverTrigger asChild>
                  <button
                  className={`text-xs px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1 ${
                      isMoreActive
                        ? 'font-medium text-white'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                    }`}
                    style={isMoreActive ? { backgroundColor: '#FF4500' } : undefined}
                  >
                    {isMoreActive ? activeMoreLabel : 'More'}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-1" align="start">
                  {overflowTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        handleTemplateChange(t.id);
                        setMoreOpen(false);
                      }}
                      className={`w-full text-left text-xs px-3 py-2 rounded transition-colors ${
                        displayResume.templateId === t.id
                          ? 'font-medium text-white'
                          : 'text-foreground hover:bg-muted'
                      }`}
                      style={displayResume.templateId === t.id ? { backgroundColor: '#FF4500' } : undefined}
                    >
                      {t.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            )}

            {!hideControls && (
              <div className="ml-auto flex items-center gap-1.5">
                <DownloadPdfButton
                  printRef={printRef}
                  resume={displayResume}
                  currentPage={currentPage}
                />
                <OptionsMenu
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  showPageBreaks={showPageBreaks}
                  onShowPageBreaksChange={setShowPageBreaks}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          ref={printRef}
          className="bg-white shadow-lg relative"
          style={{ width: `${currentPage.widthMm}mm`, padding: '12mm 16mm' }}
          onClick={(e) => {
            let el = e.target as HTMLElement | null;
            while (el && !el.getAttribute('data-section')) {
              if (el === e.currentTarget) { el = null; break; }
              el = el.parentElement;
            }
            if (el) {
              const section = el.getAttribute('data-section')!;
              window.dispatchEvent(new CustomEvent('scroll-to-section', { detail: section }));
            }
          }}
        >
          <TemplateComponent resume={displayResume} />
          <PageBreakOverlay
            printRef={printRef}
            showPageBreaks={showPageBreaks}
            usableHeightMm={usableHeightMm}
            resume={displayResume}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Download PDF button ── */
function DownloadPdfButton({
  printRef,
  resume,
  currentPage,
}: {
  printRef: React.RefObject<HTMLDivElement>;
  resume: any;
  currentPage: { widthMm: number; cssSize: string };
}) {
  const handleDownloadPDF = useCallback(() => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = printRef.current.innerHTML;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
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
              size: ${currentPage.cssSize};
              margin: 12mm 16mm 16mm 16mm;
            }
            html, body {
              margin: 0; padding: 0; background: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body { width: ${currentPage.widthMm}mm; }
            .resume-print-content { width: 100%; }
            [data-section] { cursor: default !important; background: transparent !important; outline: none !important; box-shadow: none !important; }
            [data-section]:hover { background: transparent !important; outline: none !important; }
            [data-pdf-section] { break-inside: avoid; }
            .page-break-line { display: none !important; }
            .print-footer { position: fixed; bottom: 0; left: 0; right: 0; font-size: 8pt; color: #666; padding: 0; }
          </style>
        </head>
        <body>
          <div class="resume-print-content">${content}</div>
          <div class="print-footer">${resume.profile.email || ''}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }, [printRef, resume, currentPage]);

  return (
    <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
      <Download className="w-4 h-4" />
      Download PDF
    </Button>
  );
}

/* ── 3-dot options menu ── */
function OptionsMenu({
  pageSize,
  onPageSizeChange,
  showPageBreaks,
  onShowPageBreaksChange,
}: {
  pageSize: PageSize;
  onPageSizeChange: (v: PageSize) => void;
  showPageBreaks: boolean;
  onShowPageBreaksChange: (v: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-3 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Paper Size</Label>
          <Select value={pageSize} onValueChange={(v) => onPageSizeChange(v as PageSize)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="letter">US Letter</SelectItem>
              <SelectItem value="a4">A4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="page-breaks-toggle"
            checked={showPageBreaks}
            onCheckedChange={(checked) => onShowPageBreaksChange(checked === true)}
          />
          <Label htmlFor="page-breaks-toggle" className="text-xs text-muted-foreground cursor-pointer">
            Show page breaks
          </Label>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Page break overlay lines ── */
function PageBreakOverlay({
  printRef,
  showPageBreaks,
  usableHeightMm,
  resume,
}: {
  printRef: React.RefObject<HTMLDivElement>;
  showPageBreaks: boolean;
  usableHeightMm: number;
  resume: any;
}) {
  const [lines, setLines] = useState<number[]>([]);

  useEffect(() => {
    if (!showPageBreaks || !printRef.current) {
      setLines([]);
      return;
    }
    const calculate = () => {
      if (!printRef.current) return;
      const containerHeight = printRef.current.scrollHeight;
      const usableHeightPx = usableHeightMm * 3.7795;
      const result: number[] = [];
      let pos = usableHeightPx;
      while (pos < containerHeight) {
        result.push(pos);
        pos += usableHeightPx;
      }
      setLines(result);
    };
    calculate();
    const observer = new ResizeObserver(calculate);
    observer.observe(printRef.current);
    return () => observer.disconnect();
  }, [showPageBreaks, resume, usableHeightMm, printRef]);

  if (!showPageBreaks || lines.length === 0) return null;

  return (
    <>
      {lines.map((top, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 pointer-events-none page-break-line"
          style={{ top: `${top}px` }}
        >
          <div className="border-t-2 border-dashed border-destructive/60 relative">
            <span className="absolute -top-3 right-2 text-[10px] font-medium text-destructive/60 bg-white px-1">
              Page {i + 1} → {i + 2}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

export default ResumePreview;
