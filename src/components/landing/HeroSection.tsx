import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Resume, TemplateId } from '@/schema/resume';
import ResumePreview from '@/preview/ResumePreview';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface HeroSectionProps {
  resume: Resume;
  onTemplateChange: (id: TemplateId) => void;
  onEditClick: () => void;
}

const HeroSection = ({ resume, onTemplateChange, onEditClick }: HeroSectionProps) => {
  const [hovered, setHovered] = useState(false);

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

      <div
        className="relative w-full max-w-[900px] rounded-xl border border-border bg-card/50 overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {/* Subtle glow behind the preview */}
        <div className="absolute inset-0 -z-10 bg-accent/5 blur-3xl rounded-full scale-75 opacity-50" />

        <div className="max-h-[70vh] overflow-y-auto">
          <ResumePreview
            resume={resume}
            onTemplateChange={onTemplateChange}
            hideControls
          />
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity duration-200 ${
            hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Button
            size="lg"
            onClick={onEditClick}
            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            tabIndex={hovered ? 0 : -1}
          >
            <Pencil className="w-4 h-4" />
            Edit this resume
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
