import { useResume } from '@/hooks/ResumeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ResumeEditor from '@/editor/ResumeEditor';
import ResumePreview from '@/preview/ResumePreview';
import { Download, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const BuilderPage = () => {
  const { activeResume } = useResume();
  const navigate = useNavigate();
  const [editorCollapsed, setEditorCollapsed] = useState(false);

  useEffect(() => {
    if (!activeResume) navigate('/');
  }, [activeResume, navigate]);

  if (!activeResume) return null;

  return (
    <div className="h-screen flex flex-col">
      <BuilderHeader
        editorCollapsed={editorCollapsed}
        onToggleEditor={() => setEditorCollapsed((c) => !c)}
      />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {!editorCollapsed && (
          <>
            <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="overflow-y-auto border-r border-border">
              <ResumeEditor />
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel defaultSize={editorCollapsed ? 100 : 60} className="bg-secondary/50 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <ResumePreview />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

function BuilderHeader({ editorCollapsed, onToggleEditor }: { editorCollapsed: boolean; onToggleEditor: () => void }) {
  const { activeResume, updateResume } = useResume();
  const navigate = useNavigate();

  if (!activeResume) return null;

  return (
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
      <input
        value={activeResume.title}
        onChange={(e) => updateResume(activeResume.id, { title: e.target.value })}
        className="text-sm font-medium bg-transparent border-none outline-none text-foreground flex-1 min-w-0"
        placeholder="Resume title"
      />
      <span className="text-xs text-muted-foreground">
        Saved {new Date(activeResume.lastEdited).toLocaleTimeString()}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const { id, lastEdited, ...exportData } = activeResume;
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${activeResume.title.replace(/\s+/g, '-').toLowerCase()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        <Download className="w-4 h-4" />
        Export JSON
      </Button>
    </header>
  );
}

export default BuilderPage;
