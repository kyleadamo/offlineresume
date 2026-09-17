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
    <section className="flex flex-col items-center pt-20 sm:pt-24 pb-16 px-3 sm:px-6">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-foreground text-4xl md:text-5xl font-semibold tracking-tight mb-4" style={{ fontFamily: "'Merriweather', serif" }}>
          Offline Resume
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          A beautiful resume, stored locally. No cloud, no accounts.
        </p>
      </div>

      <button
        onClick={onEditClick}
        className="inline-flex items-center gap-1.5 text-sm transition-colors mb-4 text-accent"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit this resume
      </button>

      <div className="not-dark w-full sm:max-w-[900px]" style={{ colorScheme: 'light' }}>
        <ResumePreview
          resume={resume}
          onTemplateChange={onTemplateChange}
          hideControls
        />
      </div>
    </section>
  );
};

export default HeroSection;
