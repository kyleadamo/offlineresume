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
import { Download, X } from 'lucide-react';
import { useRef, useCallback } from 'react';

const templateMap: Record<TemplateId, React.ComponentType<any>> = {
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  brutalist: BrutalistTemplate,
  compact: MinimalTemplate,
  editorial: ProfessionalTemplate,
};

interface FullPagePreviewProps {
  resume: Resume;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FullPagePreview = ({ resume, open, onOpenChange }: FullPagePreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const TemplateComponent = templateMap[resume.templateId] || MinimalTemplate;

  const handleDownloadPDF = useCallback(() => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = printRef.current.innerHTML;

    // Collect all stylesheets from the current page
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
              margin: 0;
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
              min-height: 297mm;
            }
            .resume-print-content {
              width: 210mm;
              min-height: 297mm;
              padding: 12mm 16mm;
              box-sizing: border-box;
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
            * {
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

    // Wait for styles/images to load
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
          <div className="flex items-center gap-2">
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
            className="bg-white shadow-lg"
            style={{ width: '210mm', minHeight: '297mm', padding: '12mm 16mm' }}
          >
            <TemplateComponent resume={resume} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullPagePreview;
