import { Resume, TemplateId } from '@/schema/resume';
import MinimalTemplate from '@/templates/MinimalTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import BrutalistTemplate from '@/templates/BrutalistTemplate';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, X } from 'lucide-react';
import { useRef, useCallback, useState, useEffect } from 'react';

const templateMap: Record<TemplateId, React.ComponentType<any>> = {
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  brutalist: BrutalistTemplate,
  compact: MinimalTemplate,
  editorial: ProfessionalTemplate,
};

type PageSize = 'a4' | 'letter';

const PAGE_SIZES: Record<PageSize, { label: string; widthMm: number; heightMm: number; cssSize: string }> = {
  a4: { label: 'A4', widthMm: 210, heightMm: 297, cssSize: 'A4' },
  letter: { label: 'US Letter', widthMm: 215.9, heightMm: 279.4, cssSize: 'letter' },
};

const PAGE_MARGIN_Y_MM = 12;

interface FullPagePreviewProps {
  resume: Resume;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FullPagePreview = ({ resume, open, onOpenChange }: FullPagePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showPageBreaks, setShowPageBreaks] = useState(false);
  const [pageBreakLines, setPageBreakLines] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('letter');
  const TemplateComponent = templateMap[resume.templateId] || MinimalTemplate;

  const currentPage = PAGE_SIZES[pageSize];
  const usableHeightMm = currentPage.heightMm - PAGE_MARGIN_Y_MM * 2;

  // Calculate page break positions
  useEffect(() => {
    if (!showPageBreaks || !printRef.current) {
      setPageBreakLines([]);
      return;
    }

    const calculateBreaks = () => {
      if (!printRef.current) return;
      const containerHeight = printRef.current.scrollHeight;
      const usableHeightPx = usableHeightMm * 3.7795;
      const lines: number[] = [];
      let pos = usableHeightPx;
      while (pos < containerHeight) {
        lines.push(pos);
        pos += usableHeightPx;
      }
      setPageBreakLines(lines);
    };

    calculateBreaks();
    const observer = new ResizeObserver(calculateBreaks);
    observer.observe(printRef.current);
    return () => observer.disconnect();
  }, [showPageBreaks, resume, usableHeightMm]);

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
          <title>${resume.title || 'Resume'}</title>
          ${styles}
          <style>
            @page {
              size: ${currentPage.cssSize};
              margin: 12mm 16mm;
            }
            html, body {
              margin: 0;
              padding: 0;
              background: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              width: ${currentPage.widthMm}mm;
            }
            .resume-print-content {
              width: 100%;
            }
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
            [data-pdf-section] {
              break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <div class="resume-print-content">${content}</div>
        </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, [resume.title, currentPage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[95vw] h-[95vh] p-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
          <span className="text-sm font-medium text-foreground">Full Page Preview</span>
          <div className="flex items-center gap-4">
            <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="letter">US Letter</SelectItem>
                <SelectItem value="a4">A4</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Checkbox
                id="page-breaks"
                checked={showPageBreaks}
                onCheckedChange={(checked) => setShowPageBreaks(checked === true)}
              />
              <Label htmlFor="page-breaks" className="text-xs text-muted-foreground cursor-pointer">
                Show page breaks
              </Label>
            </div>
            <Button size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-muted/50 flex justify-center py-8">
          <div
            ref={printRef}
            className="bg-white shadow-lg relative"
            style={{ width: `${currentPage.widthMm}mm`, minHeight: `${currentPage.heightMm}mm`, padding: '12mm 16mm' }}
          >
            <TemplateComponent resume={resume} />
            {showPageBreaks && pageBreakLines.map((top, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 pointer-events-none"
                style={{ top: `${top}px` }}
              >
                <div className="border-t-2 border-dashed border-destructive/60 relative">
                  <span className="absolute -top-3 right-2 text-[10px] font-medium text-destructive/60 bg-white px-1">
                    Page {i + 1} → {i + 2}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullPagePreview;
