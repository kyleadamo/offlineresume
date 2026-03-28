import { useNavigate } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { FileText, Upload, ClipboardPaste, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkspaceEntry = () => {
  const navigate = useNavigate();
  const { createResume, resumes, setActive } = useResume();

  const handleStartBlank = () => {
    createResume();
    navigate('/builder');
  };

  const handleOpenExisting = (id: string) => {
    setActive(id);
    navigate('/builder');
  };

  const actions = [
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-foreground mb-3">Resume Studio</h1>
          <p className="text-muted-foreground text-lg">
            Start with what you have. We'll shape it from there.
          </p>
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

        {resumes.length > 0 && (
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
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(resume.lastEdited).toLocaleDateString()}
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
