import { useCoverLetter } from '@/hooks/CoverLetterContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CoverLetterEditor from '@/editor/CoverLetterEditor';
import CoverLetterPreview from '@/preview/CoverLetterPreview';
import { Download, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CoverLetterBuilderPage = () => {
  const { activeLetter } = useCoverLetter();
  const navigate = useNavigate();
  const [editorCollapsed, setEditorCollapsed] = useState(false);

  useEffect(() => {
    if (!activeLetter) navigate('/');
  }, [activeLetter, navigate]);

  if (!activeLetter) return null;

  return (
    <div className="h-screen flex flex-col">
      <BuilderHeader
        editorCollapsed={editorCollapsed}
        onToggleEditor={() => setEditorCollapsed((c) => !c)}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {!editorCollapsed && (
          <>
            <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="border-r border-border overflow-hidden">
              <div className="h-full overflow-y-auto">
                <CoverLetterEditor />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel defaultSize={editorCollapsed ? 100 : 60} className="bg-secondary/50 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <CoverLetterPreview />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

function BuilderHeader({ editorCollapsed, onToggleEditor }: { editorCollapsed: boolean; onToggleEditor: () => void }) {
  const { activeLetter, updateLetter } = useCoverLetter();
  const navigate = useNavigate();

  if (!activeLetter) return null;

  const exportJson = () => {
    const { id, lastEdited, ...exportData } = activeLetter;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeLetter.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    const lines: string[] = [];
    if (activeLetter.senderName) lines.push(`**${activeLetter.senderName}**`);
    if (activeLetter.senderContact) lines.push(activeLetter.senderContact);
    if (lines.length) lines.push('');
    if (activeLetter.date) { lines.push(activeLetter.date); lines.push(''); }
    if (activeLetter.recipientName) lines.push(activeLetter.recipientName);
    if (activeLetter.recipientTitle) lines.push(activeLetter.recipientTitle);
    if (activeLetter.companyName) lines.push(activeLetter.companyName);
    if (activeLetter.companyAddress) lines.push(activeLetter.companyAddress);
    if (activeLetter.recipientName || activeLetter.companyName) lines.push('');
    if (activeLetter.greeting) { lines.push(activeLetter.greeting); lines.push(''); }
    if (activeLetter.body) { lines.push(activeLetter.body); lines.push(''); }
    if (activeLetter.closing) lines.push(activeLetter.closing);
    if (activeLetter.senderName) { lines.push(''); lines.push(activeLetter.senderName); }

    const md = lines.join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeLetter.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
      <Button variant="ghost" size="icon" onClick={onToggleEditor} title={editorCollapsed ? 'Show editor' : 'Hide editor'}>
        {editorCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </Button>
      <button
        onClick={() => navigate('/')}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Home
      </button>
      <div className="h-4 w-px bg-border" />
      <input
        value={activeLetter.title}
        onChange={(e) => updateLetter(activeLetter.id, { title: e.target.value })}
        className="text-sm font-medium bg-transparent border-none outline-none text-foreground flex-1 min-w-0"
        placeholder="Cover letter title"
      />
      <span className="text-xs text-muted-foreground">
        Saved {new Date(activeLetter.lastEdited).toLocaleTimeString()}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={exportJson}>
            <FileText className="w-4 h-4 mr-2" />
            Export JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportMarkdown}>
            <FileText className="w-4 h-4 mr-2" />
            Export Markdown
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default CoverLetterBuilderPage;
