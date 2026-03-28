import { useResume } from '@/hooks/ResumeContext';
import MinimalTemplate from '@/templates/MinimalTemplate';
import ProfessionalTemplate from '@/templates/ProfessionalTemplate';
import ModernTemplate from '@/templates/ModernTemplate';
import BrutalistTemplate from '@/templates/BrutalistTemplate';
import { TemplateId } from '@/schema/resume';

const templateMap: Record<TemplateId, React.ComponentType<any>> = {
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  brutalist: BrutalistTemplate,
  compact: MinimalTemplate, // fallback for now
  editorial: ProfessionalTemplate, // fallback for now
};

const templateNames: { id: TemplateId; label: string }[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
  { id: 'modern', label: 'Modern' },
  { id: 'brutalist', label: 'Brutalist' },
];

const ResumePreview = () => {
  const { activeResume, updateResume } = useResume();
  if (!activeResume) return null;

  const TemplateComponent = templateMap[activeResume.templateId] || MinimalTemplate;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        {templateNames.map((t) => (
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
      </div>

      <div
        className="bg-card rounded-lg paper-shadow overflow-hidden"
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
        <div className="p-8 min-h-[842px]">
          <TemplateComponent resume={activeResume} />
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
