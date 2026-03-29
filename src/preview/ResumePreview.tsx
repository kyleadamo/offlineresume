import { useResume } from '@/hooks/ResumeContext';
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
import { TemplateId } from '@/schema/resume';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Maximize2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import FullPagePreview from './FullPagePreview';

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
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'modern', label: 'Modern' },
  { id: 'brutalist', label: 'Brutalist' },
];

const moreTemplates: { id: TemplateId; label: string }[] = [
  { id: 'executive', label: 'Executive' },
  { id: 'creative', label: 'Creative' },
  { id: 'compact', label: 'Compact' },
  { id: 'academic', label: 'Academic' },
  { id: 'tech', label: 'Tech / Terminal' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'infographic', label: 'Infographic' },
  { id: 'classic', label: 'Classic' },
];

const ResumePreview = () => {
  const { activeResume, updateResume } = useResume();
  const [fullPageOpen, setFullPageOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  if (!activeResume) return null;

  const TemplateComponent = templateMap[activeResume.templateId] || MinimalTemplate;
  const isMoreActive = moreTemplates.some((t) => t.id === activeResume.templateId);
  const activeMoreLabel = moreTemplates.find((t) => t.id === activeResume.templateId)?.label;

  return (
    <div className="p-6 space-y-4 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-2 flex-wrap">
        {primaryTemplates.map((t) => (
          <button
            key={t.id}
            onClick={() => updateResume(activeResume.id, { templateId: t.id })}
            className={`text-xs px-3 py-1.5 rounded-md transition-all duration-200 ${
              activeResume.templateId === t.id
                ? 'bg-foreground text-background font-medium'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}

        <Popover open={moreOpen} onOpenChange={setMoreOpen}>
          <PopoverTrigger asChild>
            <button
              className={`text-xs px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1 ${
                isMoreActive
                  ? 'bg-foreground text-background font-medium'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {isMoreActive ? activeMoreLabel : 'More'}
              <ChevronDown className="w-3 h-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-1" align="start">
            {moreTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  updateResume(activeResume.id, { templateId: t.id });
                  setMoreOpen(false);
                }}
                className={`w-full text-left text-xs px-3 py-2 rounded transition-colors ${
                  activeResume.templateId === t.id
                    ? 'bg-foreground text-background font-medium'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {t.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={() => setFullPageOpen(true)}>
            <Maximize2 className="w-4 h-4" />
            Full Page
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          className="bg-white shadow-lg relative"
          style={{ width: '215.9mm', padding: '12mm 16mm' }}
          onClick={(e) => {
            let el = e.target as HTMLElement | null;
            while (el && !el.getAttribute('data-section')) {
              if (el === e.currentTarget) { el = null; break; }
              el = el.parentElement;
            }
            if (el) {
              const section = el.getAttribute('data-section')!;
              window.dispatchEvent(new CustomEvent('scroll-to-section', { detail: section }));
            }
          }}
        >
          <TemplateComponent resume={activeResume} />
        </div>
      </div>

      <FullPagePreview
        resume={activeResume}
        open={fullPageOpen}
        onOpenChange={setFullPageOpen}
      />
    </div>
  );
};

export default ResumePreview;
