import { useResume } from '@/hooks/ResumeContext';
import { Resume, SectionConfig, DEFAULT_SECTION_ORDER } from '@/schema/resume';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { ExperienceItem, EducationItem, SkillCategory, ProjectItem, normalizeSkill, SkillItem } from '@/schema/resume';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useCallback } from 'react';
import { SortableList, toStringItems, fromStringItems, type StringItem } from '@/components/SortableList';

const SECTIONS = ['profile', 'summary', 'experience', 'education', 'projects', 'skills'];

const sectionEditorMap: Record<string, { label: string; component: (resume: Resume, update: (c: Partial<Resume>) => void) => React.ReactNode }> = {
  summary: {
    label: 'Summary',
    component: (resume, update) => (
      <Textarea
        value={resume.summary}
        onChange={(e) => update({ summary: e.target.value })}
        placeholder="Write a brief professional summary..."
        rows={4}
        className="resize-none"
      />
    ),
  },
  experience: {
    label: 'Experience',
    component: (resume, update) => <ExperienceEditor resume={resume} onUpdate={update} />,
  },
  education: {
    label: 'Education',
    component: (resume, update) => <EducationEditor resume={resume} onUpdate={update} />,
  },
  projects: {
    label: 'Projects',
    component: (resume, update) => <ProjectsEditor resume={resume} onUpdate={update} />,
  },
  skills: {
    label: 'Skills',
    component: (resume, update) => <SkillsEditor resume={resume} onUpdate={update} />,
  },
};

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
  const sectionOrder = activeResume.sectionOrder ?? DEFAULT_SECTION_ORDER;

  const handleSectionReorder = (reordered: SectionConfig[]) => {
    update({ sectionOrder: reordered });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    update({
      sectionOrder: sectionOrder.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
    });
  };

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      {/* Section order & visibility panel */}
      <div className="bg-secondary/30 border border-border rounded-lg px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Section Order</p>
        <SortableList
          items={sectionOrder}
          onReorder={handleSectionReorder}
          className="space-y-1"
          renderItem={(section, dragHandle) => (
            <div className="flex items-center gap-2 py-1">
              {dragHandle}
              <span className={`text-sm flex-1 ${section.visible ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                {section.label}
              </span>
              <Switch
                checked={section.visible}
                onCheckedChange={() => toggleSectionVisibility(section.id)}
                className="scale-75"
              />
            </div>
          )}
        />
      </div>

      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections}>
        <AccordionItem value="profile" id="editor-section-profile" className="bg-secondary/30 border border-border rounded-lg mb-3 px-4">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-foreground">Contact</AccordionTrigger>
          <AccordionContent>
            <ProfileEditor resume={activeResume} onUpdate={update} />
          </AccordionContent>
        </AccordionItem>

        {sectionOrder.map((section) => {
          const editor = sectionEditorMap[section.id];
          if (!editor) return null;
          return (
            <AccordionItem
              key={section.id}
              value={section.id}
              id={`editor-section-${section.id}`}
              className={`bg-secondary/30 border border-border rounded-lg mb-3 px-4 ${!section.visible ? 'opacity-40' : ''}`}
            >
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-foreground">
                {editor.label}
                {!section.visible && <span className="text-xs font-normal normal-case tracking-normal text-muted-foreground ml-2">(hidden)</span>}
              </AccordionTrigger>
              <AccordionContent>
                {editor.component(activeResume, update)}
              </AccordionContent>
            </AccordionItem>
          );
        })}
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
    if (file.size > 2 * 1024 * 1024) return;
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
      <div className="space-y-2">
        <Input
          value={p.linkedin || ''}
          onChange={(e) => set('linkedin', e.target.value)}
          placeholder="LinkedIn URL (e.g., linkedin.com/in/username)"
        />
        {p.linkedin && (
          <div className="flex items-center gap-2">
            <Switch
              id="linkedin-display"
              checked={p.linkedinDisplayFull ?? false}
              onCheckedChange={(checked) =>
                onUpdate({ profile: { ...p, linkedinDisplayFull: checked } })
              }
            />
            <Label htmlFor="linkedin-display" className="text-xs text-muted-foreground cursor-pointer">
              Show full URL (otherwise icon only)
            </Label>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Input
          value={p.website || ''}
          onChange={(e) => set('website', e.target.value)}
          placeholder="Personal website URL (e.g., johndoe.com)"
        />
        {p.website && (
          <div className="flex items-center gap-2">
            <Switch
              id="website-display"
              checked={p.websiteDisplayFull ?? false}
              onCheckedChange={(checked) =>
                onUpdate({ profile: { ...p, websiteDisplayFull: checked } })
              }
            />
            <Label htmlFor="website-display" className="text-xs text-muted-foreground cursor-pointer">
              Show full URL (otherwise icon only)
            </Label>
          </div>
        )}
      </div>
      <Input value={resume.targetRole} onChange={(e) => onUpdate({ targetRole: e.target.value })} placeholder="Target role (e.g., Senior Software Engineer)" />
    </div>
  );
}

function BulletList({
  items,
  onChange,
  placeholder = 'Describe what you did...',
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const stringItems = toStringItems(items);

  return (
    <div className="space-y-2">
      <SortableList
        items={stringItems}
        onReorder={(reordered) => onChange(fromStringItems(reordered))}
        className="space-y-2"
        renderItem={(si, dragHandle) => (
          <div className="flex gap-2 items-center">
            {dragHandle}
            <span className="text-muted-foreground text-xs">•</span>
            <Input
              value={si.value}
              onChange={(e) => {
                const newItems = [...items];
                const idx = stringItems.findIndex((s) => s.id === si.id);
                newItems[idx] = e.target.value;
                onChange(newItems);
              }}
              placeholder={placeholder}
              className="flex-1"
            />
            {items.length > 1 && (
              <button
                onClick={() => {
                  const idx = stringItems.findIndex((s) => s.id === si.id);
                  onChange(items.filter((_, i) => i !== idx));
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      />
      <button
        onClick={() => onChange([...items, ''])}
        className="text-xs text-muted-foreground hover:text-accent transition-colors"
      >
        + Add bullet
      </button>
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
      companyUrl: '',
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
      <SortableList
        items={items}
        onReorder={(reordered) => onUpdate({ experience: reordered })}
        className="space-y-4"
        renderItem={(item, dragHandle) => (
          <div className={`p-4 bg-secondary/50 rounded-lg space-y-3 ${item.hidden ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-2">
              <div className="mt-2.5">{dragHandle}</div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input value={item.role} onChange={(e) => updateItem(item.id, { role: e.target.value })} placeholder="Role" />
                  <Input value={item.company} onChange={(e) => updateItem(item.id, { company: e.target.value })} placeholder="Company" />
                </div>
                <Input value={item.companyUrl || ''} onChange={(e) => updateItem(item.id, { companyUrl: e.target.value })} placeholder="Company URL (optional)" />
                <div className="grid grid-cols-2 gap-3">
                  <Input value={item.startDate} onChange={(e) => updateItem(item.id, { startDate: e.target.value })} placeholder="Start date" />
                  <Input value={item.endDate} onChange={(e) => updateItem(item.id, { endDate: e.target.value })} placeholder="End date (or Present)" />
                </div>
                <BulletList
                  items={item.bullets}
                  onChange={(bullets) => updateItem(item.id, { bullets })}
                />
              </div>
              <button onClick={() => updateItem(item.id, { hidden: !item.hidden })} className="text-muted-foreground hover:text-foreground transition-colors mt-2" title={item.hidden ? 'Show in resume' : 'Hide from resume'}>
                {item.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors mt-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      />
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
      <SortableList
        items={items}
        onReorder={(reordered) => onUpdate({ education: reordered })}
        className="space-y-4"
        renderItem={(item, dragHandle) => (
          <div className={`p-4 bg-secondary/50 rounded-lg space-y-3 ${item.hidden ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-2">
              <div className="mt-2.5">{dragHandle}</div>
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
              <button onClick={() => updateItem(item.id, { hidden: !item.hidden })} className="text-muted-foreground hover:text-foreground transition-colors mt-2" title={item.hidden ? 'Show in resume' : 'Hide from resume'}>
                {item.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors mt-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      />
      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add education
      </Button>
    </div>
  );
}

function ProjectsEditor({ resume, onUpdate }: { resume: Resume; onUpdate: (c: Partial<Resume>) => void }) {
  const items = resume.projects;

  const addItem = () => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      url: '',
      highlights: [''],
    };
    onUpdate({ projects: [...items, newItem] });
  };

  const updateItem = (id: string, changes: Partial<ProjectItem>) => {
    onUpdate({ projects: items.map((item) => (item.id === id ? { ...item, ...changes } : item)) });
  };

  const removeItem = (id: string) => {
    onUpdate({ projects: items.filter((item) => item.id !== id) });
  };

  return (
    <div className="space-y-4">
      <SortableList
        items={items}
        onReorder={(reordered) => onUpdate({ projects: reordered })}
        className="space-y-4"
        renderItem={(item, dragHandle) => (
          <div className={`p-4 bg-secondary/50 rounded-lg space-y-3 ${item.hidden ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-2">
              <div className="mt-2.5">{dragHandle}</div>
              <div className="flex-1 space-y-3">
                <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} placeholder="Project name" />
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  placeholder="Brief description..."
                  rows={2}
                  className="resize-none"
                />
                <Input value={item.url} onChange={(e) => updateItem(item.id, { url: e.target.value })} placeholder="Project URL (optional)" />
                <BulletList
                  items={item.highlights}
                  onChange={(highlights) => updateItem(item.id, { highlights })}
                  placeholder="Key highlight..."
                />
              </div>
              <button onClick={() => updateItem(item.id, { hidden: !item.hidden })} className="text-muted-foreground hover:text-foreground transition-colors mt-2" title={item.hidden ? 'Show in resume' : 'Hide from resume'}>
                {item.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors mt-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      />
      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add project
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

  const updateSkill = (catId: string, skillIndex: number, changes: Partial<SkillItem>) => {
    const cat = items.find((c) => c.id === catId);
    if (!cat) return;
    const normalized = cat.skills.map(normalizeSkill);
    normalized[skillIndex] = { ...normalized[skillIndex], ...changes };
    updateCategory(catId, { skills: normalized });
  };

  const removeSkill = (catId: string, skillIndex: number) => {
    const cat = items.find((c) => c.id === catId);
    if (!cat) return;
    const normalized = cat.skills.map(normalizeSkill).filter((_, i) => i !== skillIndex);
    updateCategory(catId, { skills: normalized });
  };

  const addSkill = (catId: string) => {
    const cat = items.find((c) => c.id === catId);
    if (!cat) return;
    const normalized = [...cat.skills.map(normalizeSkill), { name: '' }];
    updateCategory(catId, { skills: normalized });
  };

  return (
    <div className="space-y-4">
      <SortableList
        items={items}
        onReorder={(reordered) => onUpdate({ skills: reordered })}
        className="space-y-4"
        renderItem={(cat, dragHandle) => (
          <div className={`p-4 bg-secondary/50 rounded-lg space-y-3 ${cat.hidden ? 'opacity-50' : ''}`}>
            <div className="flex gap-2">
              <div className="mt-2">{dragHandle}</div>
              <Input
                value={cat.category}
                onChange={(e) => updateCategory(cat.id, { category: e.target.value })}
                placeholder="Category (e.g., Languages, Frameworks)"
                className="flex-1"
              />
              <button onClick={() => updateCategory(cat.id, { hidden: !cat.hidden })} className="text-muted-foreground hover:text-foreground transition-colors" title={cat.hidden ? 'Show in resume' : 'Hide from resume'}>
                {cat.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => removeCategory(cat.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {cat.skills.map((rawSkill, i) => {
                const skill = normalizeSkill(rawSkill);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(cat.id, i, { name: e.target.value })}
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <button onClick={() => removeSkill(cat.id, i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => addSkill(cat.id)}
                className="text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                + Add skill
              </button>
            </div>
          </div>
        )}
      />
      <Button variant="outline" size="sm" onClick={addCategory} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add skill category
      </Button>
    </div>
  );
}

export default ResumeEditor;
