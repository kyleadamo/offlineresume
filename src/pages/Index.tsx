import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { useCoverLetter } from '@/hooks/CoverLetterContext';
import { FileText, Upload, ClipboardPaste, Plus, Mail, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const WorkspaceEntry = () => {
  const navigate = useNavigate();
  const { createResume, resumes, setActive, deleteResume } = useResume();
  const { createLetter, letters, setActive: setActiveLetter, deleteLetter } = useCoverLetter();
  const [tab, setTab] = useState<'resumes' | 'letters'>('resumes');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'resume' | 'letter'; id: string; name: string } | null>(null);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'resume') deleteResume(deleteTarget.id);
    else deleteLetter(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleStartBlank = () => {
    createResume();
    navigate('/builder');
  };

  const handleOpenExisting = (id: string) => {
    setActive(id);
    navigate('/builder');
  };

  const handleStartBlankLetter = () => {
    createLetter();
    navigate('/cover-letter/builder');
  };

  const handleOpenExistingLetter = (id: string) => {
    setActiveLetter(id);
    navigate('/cover-letter/builder');
  };

  const resumeActions = [
    {
      icon: Plus,
      title: 'Start from blank',
      description: 'Begin with a clean canvas',
      onClick: handleStartBlank,
    },
    {
      icon: Upload,
      title: 'Import JSON',
      description: 'Upload a structured resume file',
      onClick: () => navigate('/import?mode=json'),
    },
    {
      icon: ClipboardPaste,
      title: 'Paste resume',
      description: "Paste text and we'll structure it",
      onClick: () => navigate('/import?mode=paste'),
    },
  ];

  const letterActions = [
    {
      icon: Plus,
      title: 'New cover letter',
      description: 'Start a fresh cover letter',
      onClick: handleStartBlankLetter,
    },
    {
      icon: Upload,
      title: 'Import JSON',
      description: 'Upload a structured cover letter file',
      onClick: () => navigate('/cover-letter/import?mode=json'),
    },
    {
      icon: ClipboardPaste,
      title: 'Paste markdown',
      description: 'Paste text or markdown content',
      onClick: () => navigate('/cover-letter/import?mode=markdown'),
    },
  ];

  const actions = tab === 'resumes' ? resumeActions : letterActions;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-foreground mb-3">LocalCV</h1>
          <p className="text-muted-foreground text-lg">
            Start with what you have. We'll shape it from there.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-secondary rounded-lg mb-6">
          <button
            onClick={() => setTab('resumes')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
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
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
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

        <div className="grid gap-4">
          {actions.map((action, i) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              onClick={action.onClick}
              className="flex items-center gap-5 p-6 bg-card rounded-lg border border-border hover:border-accent/40 hover:shadow-sm transition-all duration-200 text-left group"
            >
              <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                <action.icon className="w-5 h-5 text-foreground/70" />
              </div>
              <div>
                <div className="font-medium text-foreground">{action.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{action.description}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Recent resumes */}
        {tab === 'resumes' && resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
              Recent resumes
            </h3>
            <div className="grid gap-3">
              {resumes.slice(0, 5).map((resume) => (
                <button
                  key={resume.id}
                  onClick={() => handleOpenExisting(resume.id)}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-accent/40 transition-all duration-200 text-left"
                >
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground truncate">{resume.title}</div>
                    {resume.targetRole && (
                      <div className="text-sm text-muted-foreground truncate">{resume.targetRole}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 text-right">
                    <div>{new Date(resume.lastEdited).toLocaleDateString()}</div>
                    <div>{new Date(resume.lastEdited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent cover letters */}
        {tab === 'letters' && letters.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
              Recent cover letters
            </h3>
            <div className="grid gap-3">
              {letters.slice(0, 5).map((letter) => (
                <button
                  key={letter.id}
                  onClick={() => handleOpenExistingLetter(letter.id)}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-accent/40 transition-all duration-200 text-left"
                >
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground truncate">{letter.title}</div>
                    {letter.companyName && (
                      <div className="text-sm text-muted-foreground truncate">{letter.companyName}</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0 text-right">
                    <div>{new Date(letter.lastEdited).toLocaleDateString()}</div>
                    <div>{new Date(letter.lastEdited).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WorkspaceEntry;
