import { useNavigate } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Upload, ClipboardPaste } from 'lucide-react';

interface CreateResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateResumeModal = ({ open, onOpenChange }: CreateResumeModalProps) => {
  const navigate = useNavigate();
  const { createResume } = useResume();

  const options = [
    {
      icon: Plus,
      title: 'Start from scratch',
      description: 'Begin with a clean canvas',
      onClick: () => {
        createResume();
        navigate('/builder');
      },
    },
    {
      icon: Upload,
      title: 'Import saved offline resume JSON',
      description: 'Upload or paste compatible resume JSON',
      onClick: () => navigate('/import?mode=json'),
    },
    {
      icon: ClipboardPaste,
      title: 'Convert my existing resume',
      description: "Paste your resume text and we'll structure it",
      onClick: () => navigate('/import?mode=paste'),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create my resume</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 pt-2">
          {options.map((opt) => (
            <button
              key={opt.title}
              onClick={opt.onClick}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 text-left group"
            >
              <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                <opt.icon className="w-5 h-5 text-foreground/70" />
              </div>
              <div>
                <div className="font-medium text-foreground text-sm">{opt.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{opt.description}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResumeModal;
