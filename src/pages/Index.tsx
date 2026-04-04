import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '@/hooks/ResumeContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { TemplateId, Resume } from '@/schema/resume';
import CreateResumeModal from '@/components/CreateResumeModal';

import MinimalTemplate from '@/templates/MinimalTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import BrutalistTemplate from '@/templates/BrutalistTemplate';
import ExecutiveTemplate from '@/templates/ExecutiveTemplate';
import CreativeTemplate from '@/templates/CreativeTemplate';
import CompactTemplate from '@/templates/CompactTemplate';
import AcademicTemplate from '@/templates/AcademicTemplate';
import TechTemplate from '@/templates/TechTemplate';
import ElegantTemplate from '@/templates/ElegantTemplate';
import InfographicTemplate from '@/templates/InfographicTemplate';
import ClassicTemplate from '@/templates/ClassicTemplate';

import demoResumeData from '@/data/demoResume.json';

const templateMap: Record<TemplateId, React.ComponentType<any>> = {
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  brutalist: BrutalistTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
  compact: CompactTemplate,
  academic: AcademicTemplate,
  tech: TechTemplate,
  elegant: ElegantTemplate,
  infographic: InfographicTemplate,
  classic: ClassicTemplate,
  editorial: ProfessionalTemplate,
};

const primaryTemplates: { id: TemplateId; label: string }[] = [
  { id: 'creative', label: 'Creative' },
  { id: 'modern', label: 'Modern' },
  { id: 'professional', label: 'Professional' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'classic', label: 'Classic' },
];

const overflowTemplates: { id: TemplateId; label: string }[] = [
  { id: 'brutalist', label: 'Brutalist' },
  { id: 'executive', label: 'Executive' },
  { id: 'compact', label: 'Compact' },
  { id: 'academic', label: 'Academic' },
  { id: 'tech', label: 'Tech' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'infographic', label: 'Infographic' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { resumes, setActive } = useResume();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('creative');
  const [modalOpen, setModalOpen] = useState(false);

  const hasSavedResumes = resumes.length > 0;

  // Use most recent saved resume or demo fallback
  const previewResume: Resume = hasSavedResumes
    ? { ...resumes[0], templateId: selectedTemplate }
    : { ...demoResumeData as unknown as Resume, templateId: selectedTemplate };

  const TemplateComponent = templateMap[selectedTemplate] || CreativeTemplate;

  const handleEditResume = () => {
    if (hasSavedResumes) {
      setActive(resumes[0].id);
      navigate('/builder');
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Offline Resume
        </span>
        {hasSavedResumes ? (
          <Button variant="outline" size="sm" onClick={() => navigate('/workspace')}>
            My resumes
          </Button>
        ) : (
          <Button size="sm" onClick={() => setModalOpen(true)}>
            Create my resume
          </Button>
        )}
      </header>

      {/* Hero */}
      <section className="px-6 pt-12 pb-6 text-center max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
        >
          Your resume, stored locally
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto"
        >
          No accounts. No cloud. Build a beautiful resume that stays on your device.
        </motion.p>
      </section>

      {/* Template Switcher */}
      <div className="flex items-center justify-center gap-1 px-6 mb-6">
        {primaryTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedTemplate === t.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
            }`}
          >
            {t.label}
          </button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                overflowTemplates.some((t) => t.id === selectedTemplate)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1" align="center">
            {overflowTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedTemplate === t.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-accent/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Resume Preview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-6 pb-16 flex justify-center"
      >
        <div className="relative group w-full max-w-4xl">
          <div
            className="bg-white rounded-lg shadow-2xl overflow-y-auto mx-auto"
            style={{ maxHeight: '80vh', aspectRatio: '8.5/11' }}
          >
            <div className="origin-top-left" style={{ width: '794px', transform: 'scale(var(--preview-scale, 1))' }}>
              <TemplateComponent resume={previewResume} />
            </div>
          </div>

          {/* Hover overlay */}
          <div
            onClick={handleEditResume}
            className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          >
            <Button size="lg" className="shadow-lg">
              {hasSavedResumes ? 'Edit this resume' : 'Create my resume'}
            </Button>
          </div>
        </div>
      </motion.div>

      <CreateResumeModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default LandingPage;
