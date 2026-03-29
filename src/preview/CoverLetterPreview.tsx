import { useCoverLetter } from '@/hooks/CoverLetterContext';
import { Button } from '@/components/ui/button';
import { Download, MoreVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useRef, useCallback } from 'react';

type PageSize = 'a4' | 'letter';

const PAGE_SIZES: Record<PageSize, { label: string; widthMm: number; heightMm: number; cssSize: string }> = {
  a4: { label: 'A4', widthMm: 210, heightMm: 297, cssSize: 'A4' },
  letter: { label: 'US Letter', widthMm: 215.9, heightMm: 279.4, cssSize: 'letter' },
};

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#2563eb;text-decoration:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

function renderMarkdown(text: string): string {
  return text
    .split(/\n\n+/)
    .map((para) => {
      const html = renderInlineMarkdown(para).replace(/\n/g, '<br/>');
      return `<p style="margin:0 0 1em 0;line-height:1.6">${html}</p>`;
    })
    .join('');
}

const CoverLetterPreview = () => {
  const { activeLetter } = useCoverLetter();
  const [pageSize, setPageSize] = useState<PageSize>('letter');
  const printRef = useRef<HTMLDivElement>(null);

  if (!activeLetter) return null;

  const currentPage = PAGE_SIZES[pageSize];

  return (
    <div className="py-8 px-6 space-y-4 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-2 justify-end">
        <DownloadPdfButton printRef={printRef} letter={activeLetter} currentPage={currentPage} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-3 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Paper Size</Label>
              <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="letter">US Letter</SelectItem>
                  <SelectItem value="a4">A4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-center">
        <div
          ref={printRef}
          className="bg-white shadow-lg"
          style={{
            width: `${currentPage.widthMm}mm`,
            minHeight: `${currentPage.heightMm}mm`,
            padding: '16mm 20mm',
            color: '#1a1a1a',
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '11pt',
            lineHeight: '1.6',
          }}
        >
          {/* Sender info */}
          {(activeLetter.senderName || activeLetter.senderContact) && (
            <div style={{ textAlign: 'right', marginBottom: '2em', fontSize: '10pt' }}>
              {activeLetter.senderName && <div style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(activeLetter.senderName) }} />}
              {activeLetter.senderContact && <div style={{ color: '#555' }} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(activeLetter.senderContact) }} />}
            </div>
          )}

          {/* Date */}
          {activeLetter.date && (
            <div style={{ marginBottom: '1.5em' }}>{activeLetter.date}</div>
          )}

          {/* Recipient block */}
          {(activeLetter.recipientName || activeLetter.companyName) && (
            <div style={{ marginBottom: '1.5em' }}>
              {activeLetter.recipientName && <div dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(activeLetter.recipientName) }} />}
              {activeLetter.recipientTitle && <div dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(activeLetter.recipientTitle) }} />}
              {activeLetter.companyName && <div dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(activeLetter.companyName) }} />}
              {activeLetter.companyAddress && <div dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(activeLetter.companyAddress) }} />}
            </div>
          )}

          {/* Greeting */}
          {activeLetter.greeting && (
            <div style={{ marginBottom: '1em' }}>{activeLetter.greeting}</div>
          )}

          {/* Body */}
          {activeLetter.body && (
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(activeLetter.body) }} />
          )}

          {/* Closing */}
          {activeLetter.closing && (
            <div style={{ marginTop: '1.5em' }}>
              <div>{activeLetter.closing}</div>
              {activeLetter.senderName && (
                <div style={{ marginTop: '2em', fontWeight: 600 }}>{activeLetter.senderName}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function DownloadPdfButton({
  printRef,
  letter,
  currentPage,
}: {
  printRef: React.RefObject<HTMLDivElement>;
  letter: any;
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
            @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap');
            @page {
              size: ${currentPage.cssSize};
              margin: 16mm 20mm;
            }
            html, body {
              margin: 0; padding: 0; background: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              width: ${currentPage.widthMm}mm;
              font-family: 'Source Serif 4', Georgia, serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #1a1a1a;
            }
            .cl-print-content { width: 100%; }
          </style>
        </head>
        <body>
          <div class="cl-print-content">${content}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }, [printRef, letter, currentPage]);

  return (
    <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
      <Download className="w-4 h-4" />
      Download PDF
    </Button>
  );
}

export default CoverLetterPreview;
