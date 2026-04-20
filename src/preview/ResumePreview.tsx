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
import KeynoteTemplate from '@/templates/KeynoteTemplate';
import { Resume, TemplateId } from '@/schema/resume';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { Download, ChevronDown, MoreVertical, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import PagedResumePreview from './PagedResumePreview';
import { exportResumeToPrint } from './exportPrint';
import { exportResumePdfRemote } from './exportPdfRemote';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

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
  keynote: KeynoteTemplate,
};

const allTemplates: { id: TemplateId; label: string }[] = [
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'creative', label: 'Creative' },
  { id: 'brutalist', label: 'Brutalist' },
  { id: 'tech', label: 'Terminal' },
  { id: 'keynote', label: 'Keynote' },
  { id: 'compact', label: 'Compact' },
  { id: 'infographic', label: 'Infographic' },
  { id: 'professional', label: 'Professional' },
  { id: 'executive', label: 'Executive' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'classic', label: 'Classic' },
  { id: 'academic', label: 'Academic' },
  { id: 'editorial', label: 'Editorial' },
];

function useVisibleTemplateCount(containerRef: React.RefObject<HTMLElement>) {
  const [count, setCount] = useState(allTemplates.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const GAP = 8;
    const MORE_BTN_WIDTH = 72;

    const measure = () => {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:absolute;visibility:hidden;display:flex;gap:8px;white-space:nowrap;';
      allTemplates.forEach((t) => {
        const btn = document.createElement('button');
        btn.className = 'text-xs px-3 py-1.5 rounded-md';
        btn.textContent = t.label;
        probe.appendChild(btn);
      });
      container.appendChild(probe);

      const buttons = Array.from(probe.children) as HTMLElement[];
      const btnWidths = buttons.map((b) => b.offsetWidth);
      probe.remove();

      const containerWidth = container.clientWidth;
      let usedWidth = 0;
      let fit = 0;

      for (let i = 0; i < btnWidths.length; i++) {
        const needed = usedWidth + btnWidths[i] + (i > 0 ? GAP : 0);
        const remaining = i < btnWidths.length - 1 ? MORE_BTN_WIDTH + GAP : 0;
        if (needed + remaining > containerWidth) break;
        usedWidth = needed;
        fit++;
      }

      setCount(Math.max(2, fit));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [containerRef]);

  return count;
}

type PageSize = 'a4' | 'letter';

const PAGE_SIZES: Record<PageSize, { label: string; widthMm: number; heightMm: number; cssSize: string }> = {
  a4: { label: 'A4', widthMm: 210, heightMm: 297, cssSize: 'A4' },
  letter: { label: 'US Letter', widthMm: 215.9, heightMm: 279.4, cssSize: 'letter' },
};

interface ResumePreviewProps {
  resume?: Resume;
  onTemplateChange?: (id: TemplateId) => void;
  hideControls?: boolean;
  pageSize?: PageSize;
}

const ResumePreview = ({ resume: resumeProp, onTemplateChange, hideControls, pageSize: pageSizeProp }: ResumePreviewProps = {}) => {
  const { activeResume: contextResume, updateResume } = useResume();
  const displayResume = resumeProp ?? contextResume;
  const [moreOpen, setMoreOpen] = useState(false);
  const [pageSizeLocal, setPageSizeLocal] = useState<PageSize>('letter');
  const pageSize = pageSizeProp ?? pageSizeLocal;
  const setPageSize = setPageSizeLocal;
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
                  resume={displayResume}
                  currentPage={currentPage}
                  pageSize={pageSize}
                />
                <OptionsMenu
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  resume={displayResume}
                  currentPage={currentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <PagedResumePreview
          resume={displayResume}
          pageSize={pageSize}
          TemplateComponent={TemplateComponent}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

/* ── Download PDF button (remote Browserless render with browser-print fallback) ── */
function DownloadPdfButton({
  resume,
  currentPage,
  pageSize,
}: {
  resume: any;
  currentPage: { widthMm: number; cssSize: string };
  pageSize: 'letter' | 'a4';
}) {
  const [loading, setLoading] = useState(false);

  const filename = useCallback(() => {
    const name = resume?.profile?.fullName || resume?.title || 'resume';
    return `${String(name).trim().replace(/\s+/g, '_')}.pdf`;
  }, [resume]);

  const browserFallback = useCallback(() => {
    const printTarget = document.querySelector('[data-resume-print]') as HTMLDivElement | null;
    if (!printTarget) return;
    exportResumeToPrint(printTarget, currentPage, resume.profile.email || '');
  }, [resume, currentPage]);

  const handleDownloadPDF = useCallback(async () => {
    const printTarget = document.querySelector('[data-resume-print]') as HTMLDivElement | null;
    if (!printTarget) return;

    setLoading(true);
    try {
      await exportResumePdfRemote(printTarget, { pageSize, filename: filename() });
      toast({ title: 'PDF downloaded' });
    } catch (err) {
      console.error('[DownloadPdfButton] remote export failed', err);
      toast({
        title: 'PDF generation failed',
        description: 'Falling back to browser print.',
        variant: 'destructive',
      });
      browserFallback();
    } finally {
      setLoading(false);
    }
  }, [pageSize, filename, browserFallback]);

  return (
    <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={loading}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {loading ? 'Generating…' : 'Download PDF'}
    </Button>
  );
}

/* ── 3-dot options menu ── */
function OptionsMenu({
  pageSize,
  onPageSizeChange,
  resume,
  currentPage,
}: {
  pageSize: PageSize;
  onPageSizeChange: (v: PageSize) => void;
  resume: any;
  currentPage: { widthMm: number; cssSize: string };
}) {
  const handleBrowserPrint = useCallback(() => {
    const printTarget = document.querySelector('[data-resume-print]') as HTMLDivElement | null;
    if (!printTarget) return;
    exportResumeToPrint(printTarget, currentPage, resume?.profile?.email || '');
  }, [resume, currentPage]);

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
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleBrowserPrint} className="text-xs cursor-pointer">
          Print via browser
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ResumePreview;
