import { useResume } from '@/hooks/ResumeContext';
import { Resume } from '@/schema/resume';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { ExperienceItem, EducationItem, SkillCategory } from '@/schema/resume';
import { useState, useEffect, useCallback } from 'react';

const SECTIONS = ['profile', 'summary', 'experience', 'education', 'skills'];

const ResumeEditor = () => {
  const { activeResume, updateResume } = useResume();
  const [openSections, setOpenSections] = useState<string[]>(SECTIONS);

  const scrollToSection = useCallback((section: string) => {
    setOpenSections((prev) => prev.includes(section) ? prev : [...prev, section]);
    setTimeout(() => {
      const el = document.getElementById(`editor-section-${section}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => scrollToSection((e as CustomEvent).detail);
    window.addEventListener('scroll-to-section', handler);
    return () => window.removeEventListener('scroll-to-section', handler);
  }, [scrollToSection]);

  if (!activeResume) return null;

  const update = (changes: Partial<Resume>) => updateResume(activeResume.id, changes);

  return (
    <div className="p-6 space-y-2 animate-fade-in">
      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections}>
        <AccordionItem value="profile" id="editor-section-profile">
          <AccordionTrigger className="text-sm font-medium">Contact</AccordionTrigger>
          <AccordionContent>
            <ProfileEditor resume={activeResume} onUpdate={update} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="summary" id="editor-section-summary">
          <AccordionTrigger className="text-sm font-medium">Summary</AccordionTrigger>
          <AccordionContent>
            <Textarea
              value={activeResume.summary}
              onChange={(e) => update({ summary: e.target.value })}
              placeholder="Write a brief professional summary..."
              rows={4}
              className="resize-none"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience" id="editor-section-experience">
          <AccordionTrigger className="text-sm font-medium">Experience</AccordionTrigger>
          <AccordionContent>
            <ExperienceEditor resume={activeResume} onUpdate={update} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education" id="editor-section-education">
          <AccordionTrigger className="text-sm font-medium">Education</AccordionTrigger>
          <AccordionContent>
            <EducationEditor resume={activeResume} onUpdate={update} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" id="editor-section-skills">
          <AccordionTrigger className="text-sm font-medium">Skills</AccordionTrigger>
          <AccordionContent>
            <SkillsEditor resume={activeResume} onUpdate={update} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

function ProfileEditor({ resume, onUpdate }: { resume: Resume; onUpdate: (c: Partial<Resume>) => void }) {
  const p = resume.profile;
  const set = (field: string, value: string) =>
    onUpdate({ profile: { ...p, [field]: value } });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // 2MB limit
    const reader = new FileReader();
    reader.onload = () => set('photo', reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <label className="cursor-pointer block">
            {p.photo ? (
              <img src={p.photo} alt="Headshot" className="w-16 h-16 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-secondary border border-dashed border-border flex items-center justify-center text-muted-foreground text-xs text-center leading-tight">
                Add<br/>photo
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
          {p.photo && (
            <button
              onClick={() => set('photo', '')}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex-1">
          <Input value={p.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input value={p.email} onChange={(e) => set('email', e.target.value)} placeholder="Email" />
        <Input value={p.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Phone" />
      </div>
      <Input value={p.location} onChange={(e) => set('location', e.target.value)} placeholder="Location" />
      <Input value={resume.targetRole} onChange={(e) => onUpdate({ targetRole: e.target.value })} placeholder="Target role (e.g., Senior Software Engineer)" />
    </div>
  );
}

function ExperienceEditor({ resume, onUpdate }: { resume: Resume; onUpdate: (c: Partial<Resume>) => void }) {
  const items = resume.experience;

  const addItem = () => {
    const newItem: ExperienceItem = {
      id: crypto.randomUUID(),
      role: '',
      company: '',
      startDate: '',
      endDate: '',
      bullets: [''],
    };
    onUpdate({ experience: [...items, newItem] });
  };

  const updateItem = (id: string, changes: Partial<ExperienceItem>) => {
    onUpdate({ experience: items.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  };

  const removeItem = (id: string) => {
    onUpdate({ experience: items.filter((item) => item.id !== id) });
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 bg-secondary/50 rounded-lg space-y-3 group">
          <div className="flex items-start gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input value={item.role} onChange={(e) => updateItem(item.id, { role: e.target.value })} placeholder="Role" />
                <Input value={item.company} onChange={(e) => updateItem(item.id, { company: e.target.value })} placeholder="Company" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input value={item.startDate} onChange={(e) => updateItem(item.id, { startDate: e.target.value })} placeholder="Start date" />
                <Input value={item.endDate} onChange={(e) => updateItem(item.id, { endDate: e.target.value })} placeholder="End date (or Present)" />
              </div>
              <div className="space-y-2">
                {item.bullets.map((bullet, bi) => (
                  <div key={bi} className="flex gap-2">
                    <span className="text-muted-foreground mt-2 text-xs">•</span>
                    <Input
                      value={bullet}
                      onChange={(e) => {
                        const newBullets = [...item.bullets];
                        newBullets[bi] = e.target.value;
                        updateItem(item.id, { bullets: newBullets });
                      }}
                      placeholder="Describe what you did..."
                      className="flex-1"
                    />
                    {item.bullets.length > 1 && (
                      <button
                        onClick={() => updateItem(item.id, { bullets: item.bullets.filter((_, i) => i !== bi) })}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => updateItem(item.id, { bullets: [...item.bullets, ''] })}
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  + Add bullet
                </button>
              </div>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors mt-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add experience
      </Button>
    </div>
  );
}

function EducationEditor({ resume, onUpdate }: { resume: Resume; onUpdate: (c: Partial<Resume>) => void }) {
  const items = resume.education;

  const addItem = () => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onUpdate({ education: [...items, newItem] });
  };

  const updateItem = (id: string, changes: Partial<EducationItem>) => {
    onUpdate({ education: items.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  };

  const removeItem = (id: string) => {
    onUpdate({ education: items.filter((item) => item.id !== id) });
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 bg-secondary/50 rounded-lg space-y-3 group">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-3">
              <Input value={item.institution} onChange={(e) => updateItem(item.id, { institution: e.target.value })} placeholder="Institution" />
              <div className="grid grid-cols-2 gap-3">
                <Input value={item.degree} onChange={(e) => updateItem(item.id, { degree: e.target.value })} placeholder="Degree" />
                <Input value={item.field} onChange={(e) => updateItem(item.id, { field: e.target.value })} placeholder="Field of study" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input value={item.startDate} onChange={(e) => updateItem(item.id, { startDate: e.target.value })} placeholder="Start date" />
                <Input value={item.endDate} onChange={(e) => updateItem(item.id, { endDate: e.target.value })} placeholder="End date" />
              </div>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors mt-2">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add education
      </Button>
    </div>
  );
}

function SkillsEditor({ resume, onUpdate }: { resume: Resume; onUpdate: (c: Partial<Resume>) => void }) {
  const items = resume.skills;

  const addCategory = () => {
    const newCat: SkillCategory = { id: crypto.randomUUID(), category: '', skills: [] };
    onUpdate({ skills: [...items, newCat] });
  };

  const updateCategory = (id: string, changes: Partial<SkillCategory>) => {
    onUpdate({ skills: items.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  };

  const removeCategory = (id: string) => {
    onUpdate({ skills: items.filter((item) => item.id !== id) });
  };

  return (
    <div className="space-y-4">
      {items.map((cat) => (
        <div key={cat.id} className="p-4 bg-secondary/50 rounded-lg space-y-3">
          <div className="flex gap-2">
            <Input
              value={cat.category}
              onChange={(e) => updateCategory(cat.id, { category: e.target.value })}
              placeholder="Category (e.g., Languages, Frameworks)"
              className="flex-1"
            />
            <button onClick={() => removeCategory(cat.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <Input
            value={cat.skills.join(', ')}
            onChange={(e) => updateCategory(cat.id, { skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            placeholder="Skill 1, Skill 2, Skill 3..."
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addCategory} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add skill category
      </Button>
    </div>
  );
}

export default ResumeEditor;
