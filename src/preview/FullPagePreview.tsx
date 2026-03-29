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

// A4 dimensions in mm
const A4_HEIGHT_MM = 297;
const PAGE_MARGIN_Y_MM = 12;
const USABLE_PAGE_HEIGHT_MM = A4_HEIGHT_MM - PAGE_MARGIN_Y_MM * 2; // 273mm

interface FullPagePreviewProps {
  resume: Resume;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FullPagePreview = ({ resume, open, onOpenChange }: FullPagePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showPageBreaks, setShowPageBreaks] = useState(false);
  const [pageBreakLines, setPageBreakLines] = useState<number[]>([]);
  const TemplateComponent = templateMap[resume.templateId] || MinimalTemplate;

  // Calculate page break positions
  useEffect(() => {
    if (!showPageBreaks || !printRef.current) {
      setPageBreakLines([]);
      return;
    }

    const calculateBreaks = () => {
      if (!printRef.current) return;
      const containerHeight = printRef.current.scrollHeight;
      // Convert 273mm to pixels: 1mm ≈ 3.7795px at 96dpi
      const usableHeightPx = USABLE_PAGE_HEIGHT_MM * 3.7795;
      const lines: number[] = [];
      let pos = usableHeightPx;
      while (pos < containerHeight) {
        lines.push(pos);
        pos += usableHeightPx;
      }
      setPageBreakLines(lines);
    };

    calculateBreaks();
    // Recalculate on resize
    const observer = new ResizeObserver(calculateBreaks);
    observer.observe(printRef.current);
    return () => observer.disconnect();
  }, [showPageBreaks, resume]);

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
              size: A4;
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
              width: 210mm;
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
            [data-section] {
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
  }, [resume.title]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-[95vw] h-[95vh] p-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
          <span className="text-sm font-medium text-foreground">Full Page Preview</span>
          <div className="flex items-center gap-4">
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
            style={{ width: '210mm', minHeight: '297mm', padding: '12mm 16mm' }}
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
