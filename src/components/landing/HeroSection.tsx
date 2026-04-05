import { Resume, TemplateId } from '@/schema/resume';
import ResumePreview from '@/preview/ResumePreview';
import { Pencil } from 'lucide-react';

interface HeroSectionProps {
  resume: Resume;
  onTemplateChange: (id: TemplateId) => void;
  onEditClick: () => void;
}

const HeroSection = ({ resume, onTemplateChange, onEditClick }: HeroSectionProps) => {
  return (
    <section className="flex flex-col items-center pt-24 pb-16 px-6">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-foreground text-4xl md:text-5xl font-semibold tracking-tight mb-4">
          Offline Resume
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          A beautiful resume, stored locally. No cloud, no accounts.
        </p>
      </div>

      <button
        onClick={onEditClick}
        className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/80 transition-colors mb-4"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit this resume
      </button>

      <div className="relative w-full max-w-[900px] rounded-xl border border-border bg-card/50 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-accent/5 blur-3xl rounded-full scale-75 opacity-50" />
        <div className="max-h-[70vh] overflow-y-auto">
          <ResumePreview
            resume={resume}
            onTemplateChange={onTemplateChange}
            hideControls
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
