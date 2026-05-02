import { useResume } from '@/hooks/ResumeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ResumeEditor from '@/editor/ResumeEditor';
import ResumePreview from '@/preview/ResumePreview';
import { exportResumeToPrint } from '@/preview/exportPrint';
import { track } from '@/lib/analytics';
import { Download, PanelLeftClose, PanelLeftOpen, MoreVertical, FileJson, Copy, PenLine, LayoutTemplate, ChevronDown, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

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
        isMobile={isMobile}
      />
      {isMobile ? (
        <Tabs defaultValue="edit" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mx-3 mt-2 grid grid-cols-2 w-auto">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="flex-1 overflow-y-auto mt-2">
            <ResumeEditor />
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-y-auto mt-2 bg-secondary/50">
            <div className="not-dark" style={{ colorScheme: 'light' }}>
              <ResumePreview hideControls pageSize={pageSize} />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
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
              <div className="not-dark" style={{ colorScheme: 'light' }}>
                <ResumePreview hideControls pageSize={pageSize} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

function BuilderHeader({
  editorCollapsed,
  onToggleEditor,
  pageSize,
  onPageSizeChange,
  isMobile,
}: {
  editorCollapsed: boolean;
  onToggleEditor: () => void;
  pageSize: PageSize;
  onPageSizeChange: (v: PageSize) => void;
  isMobile: boolean;
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
    const currentPage = PAGE_SIZES[pageSize];
    exportResumeToPrint(printTarget, currentPage, activeResume.profile.email || '');
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
      <header className="h-14 border-b border-border bg-card flex items-center px-2 sm:px-4 gap-2 sm:gap-4 shrink-0">
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onToggleEditor} title={editorCollapsed ? 'Show editor' : 'Hide editor'}>
            {editorCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </Button>
        )}
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 shrink-0"
          title="Home"
        >
          <ArrowLeft className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">← Home</span>
        </button>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-sm font-medium text-foreground truncate min-w-0 flex items-center gap-1 hover:text-foreground/80 transition-colors max-w-[140px] sm:max-w-[200px]">
              <span className="truncate">{activeResume.title}</span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {resumes.map((r) => (
              <DropdownMenuItem
                key={r.id}
                onClick={() => setActive(r.id)}
                className={`flex flex-col items-start gap-0 ${r.id === activeResume.id ? 'bg-accent text-accent-foreground' : 'hover:bg-transparent hover:text-accent'}`}
              >
                <span className="truncate w-full">{r.title}</span>
                <span className={`text-[10px] ${r.id === activeResume.id ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>Saved {new Date(r.lastEdited).toLocaleTimeString()}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { createResume(); }} className="hover:bg-transparent hover:text-accent">
              <Plus className="w-4 h-4 mr-2" />
              Add new resume
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex-1" />
        <Button variant="outline" size={isMobile ? 'icon' : 'sm'} onClick={handleDownloadPDF} className={isMobile ? 'h-9 w-9' : ''} title="Download PDF">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download PDF</span>
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
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">"{activeResume.title}"</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { deleteResume(activeResume.id); setDeleteOpen(false); navigate('/'); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BuilderPage;
