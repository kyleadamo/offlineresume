import { useResume } from '@/hooks/ResumeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import ResumeEditor from '@/editor/ResumeEditor';
import ResumePreview from '@/preview/ResumePreview';
import { Download, PanelLeftClose, PanelLeftOpen, MoreVertical, FileJson, Copy, PenLine, LayoutTemplate, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PageSize = 'a4' | 'letter';

const PAGE_SIZES: Record<PageSize, { label: string; widthMm: number; heightMm: number; cssSize: string }> = {
  a4: { label: 'A4', widthMm: 210, heightMm: 297, cssSize: 'A4' },
  letter: { label: 'US Letter', widthMm: 215.9, heightMm: 279.4, cssSize: 'letter' },
};

const BuilderPage = () => {
  const { activeResume } = useResume();
  const navigate = useNavigate();
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>('letter');
  const [showPageBreaks, setShowPageBreaks] = useState(false);

  useEffect(() => {
    if (!activeResume) navigate('/');
  }, [activeResume, navigate]);

  useEffect(() => {
    const section = sessionStorage.getItem('scroll-to-section');
    if (section && activeResume) {
      sessionStorage.removeItem('scroll-to-section');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('scroll-to-section', { detail: section }));
      }, 300);
    }
  }, [activeResume]);

  if (!activeResume) return null;

  return (
    <div className="h-screen flex flex-col">
      <BuilderHeader
        editorCollapsed={editorCollapsed}
        onToggleEditor={() => setEditorCollapsed((c) => !c)}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        showPageBreaks={showPageBreaks}
        onShowPageBreaksChange={setShowPageBreaks}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {!editorCollapsed && (
          <>
            <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="border-r border-border overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ResumeEditor />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel defaultSize={editorCollapsed ? 100 : 60} className="bg-secondary/50 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <ResumePreview
              hideControls
              pageSize={pageSize}
              showPageBreaks={showPageBreaks}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

function BuilderHeader({
  editorCollapsed,
  onToggleEditor,
  pageSize,
  onPageSizeChange,
  showPageBreaks,
  onShowPageBreaksChange,
}: {
  editorCollapsed: boolean;
  onToggleEditor: () => void;
  pageSize: PageSize;
  onPageSizeChange: (v: PageSize) => void;
  showPageBreaks: boolean;
  onShowPageBreaksChange: (v: boolean) => void;
}) {
  const { resumes, activeResume, updateResume, duplicateResume, deleteResume, setActive, createResume } = useResume();
  const navigate = useNavigate();
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [pageLayoutOpen, setPageLayoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!activeResume) return null;

  const handleDownloadPDF = () => {
    const printTarget = document.querySelector('[data-resume-print]') as HTMLDivElement | null;
    if (!printTarget) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentPage = PAGE_SIZES[pageSize];
    const content = printTarget.innerHTML;
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
          <div class="print-footer">${activeResume.profile.email || ''}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const handleExportJSON = () => {
    const { id, lastEdited, ...exportData } = activeResume;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeResume.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDuplicate = () => {
    duplicateResume(activeResume.id);
  };

  const handleRenameOpen = () => {
    setRenameValue(activeResume.title);
    setRenameOpen(true);
  };

  const handleRenameConfirm = () => {
    if (renameValue.trim()) {
      updateResume(activeResume.id, { title: renameValue.trim() });
    }
    setRenameOpen(false);
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
        <Button variant="ghost" size="icon" onClick={onToggleEditor} title={editorCollapsed ? 'Show editor' : 'Hide editor'}>
          {editorCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </Button>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Studio
        </button>
        <div className="h-4 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-sm font-medium text-foreground truncate min-w-0 flex items-center gap-1 hover:text-foreground/80 transition-colors max-w-[200px]">
              <span className="truncate">{activeResume.title}</span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {resumes.map((r) => (
              <DropdownMenuItem
                key={r.id}
                onClick={() => setActive(r.id)}
                className={r.id === activeResume.id ? 'bg-accent' : ''}
              >
                <span className="truncate">{r.title}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { createResume(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add new resume
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-xs text-muted-foreground">
          Saved {new Date(activeResume.lastEdited).toLocaleTimeString()}
        </span>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleExportJSON}>
              <FileJson className="w-4 h-4 mr-2" />
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRenameOpen}>
              <PenLine className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPageLayoutOpen(true)}>
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Page Layout
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename-input">Title</Label>
            <Input
              id="rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameConfirm()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameConfirm}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Page Layout Dialog */}
      <Dialog open={pageLayoutOpen} onOpenChange={setPageLayoutOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Page Layout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Paper Size</Label>
              <Select value={pageSize} onValueChange={(v) => onPageSizeChange(v as PageSize)}>
                <SelectTrigger>
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
                id="page-breaks-layout"
                checked={showPageBreaks}
                onCheckedChange={(checked) => onShowPageBreaksChange(checked === true)}
              />
              <Label htmlFor="page-breaks-layout" className="text-sm cursor-pointer">
                Show page breaks
              </Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BuilderPage;
