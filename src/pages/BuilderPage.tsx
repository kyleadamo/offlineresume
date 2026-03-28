import { useResume } from '@/hooks/ResumeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ResumeEditor from '@/editor/ResumeEditor';
import ResumePreview from '@/preview/ResumePreview';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BuilderPage = () => {
  const { activeResume } = useResume();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeResume) navigate('/');
  }, [activeResume, navigate]);

  if (!activeResume) return null;

  return (
    <div className="h-screen flex flex-col">
      <BuilderHeader />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-border overflow-y-auto">
          <ResumeEditor />
        </div>
        <div className="w-1/2 bg-secondary/50 overflow-y-auto">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
};

function BuilderHeader() {
  const { activeResume, updateResume } = useResume();
  const navigate = useNavigate();

  if (!activeResume) return null;

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
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
