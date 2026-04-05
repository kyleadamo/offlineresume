import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { useCoverLetter } from '@/hooks/CoverLetterContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileText, Mail, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavedResumesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNew: () => void;
}

const SavedResumesSheet = ({ open, onOpenChange, onCreateNew }: SavedResumesSheetProps) => {
  const navigate = useNavigate();
  const { resumes, setActive, deleteResume } = useResume();
  const { letters, setActive: setActiveLetter, deleteLetter } = useCoverLetter();
  const [tab, setTab] = useState<'resumes' | 'letters'>('resumes');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'resume' | 'letter'; id: string; name: string } | null>(null);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'resume') deleteResume(deleteTarget.id);
    else deleteLetter(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleOpenResume = (id: string) => {
    setActive(id);
    navigate('/builder');
  };

  const handleOpenLetter = (id: string) => {
    setActiveLetter(id);
    navigate('/cover-letter/builder');
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>My documents</SheetTitle>
          </SheetHeader>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-secondary rounded-lg mb-4">
            <button
              onClick={() => setTab('resumes')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === 'resumes'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4" />
              Resumes
              {resumes.length > 0 && (
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                  {resumes.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('letters')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === 'letters'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Mail className="w-4 h-4" />
              Cover Letters
              {letters.length > 0 && (
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                  {letters.length}
                </span>
              )}
            </button>
          </div>

          {/* Create new button */}
          <Button
            variant="outline"
            className="w-full mb-4 gap-2"
            onClick={onCreateNew}
          >
            <Plus className="w-4 h-4" />
            {tab === 'resumes' ? 'New resume' : 'New cover letter'}
          </Button>

          {/* Resume list */}
          {tab === 'resumes' && (
            <div className="grid gap-2">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/40 transition-all cursor-pointer"
                  onClick={() => handleOpenResume(resume.id)}
                >
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-sm truncate">{resume.title}</div>
                    {resume.targetRole && (
                      <div className="text-xs text-muted-foreground truncate">{resume.targetRole}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(resume.lastEdited).toLocaleDateString()}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'resume', id: resume.id, name: resume.title }); }}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {resumes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No resumes yet</p>
              )}
            </div>
          )}

          {/* Cover letters list */}
          {tab === 'letters' && (
            <div className="grid gap-2">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/40 transition-all cursor-pointer"
                  onClick={() => handleOpenLetter(letter.id)}
                >
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground text-sm truncate">{letter.title}</div>
                    {letter.companyName && (
                      <div className="text-xs text-muted-foreground truncate">{letter.companyName}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(letter.lastEdited).toLocaleDateString()}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'letter', id: letter.id, name: letter.title }); }}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {letters.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No cover letters yet</p>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === 'resume' ? 'resume' : 'cover letter'}?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.name}" will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SavedResumesSheet;
