export interface ResumeLink {
  id: string;
  label: string;
  url: string;
}

export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  photo: string;
  linkedin: string;
  linkedinDisplayFull: boolean;
  website: string;
  websiteDisplayFull: boolean;
  links: ResumeLink[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  hidden?: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  hidden?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url: string;
  highlights: string[];
  hidden?: boolean;
}

export interface SkillItem {
  name: string;
  level?: number; // 0-100 percentage
}

export function normalizeSkill(s: string | SkillItem): SkillItem {
  if (typeof s === 'string') return { name: s, level: 75 };
  return s;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: (string | SkillItem)[];
  hidden?: boolean;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
}

export const DEFAULT_SECTION_ORDER: SectionConfig[] = [
  { id: 'summary', label: 'Summary', visible: true },
  { id: 'experience', label: 'Experience', visible: true },
  { id: 'education', label: 'Education', visible: true },
  { id: 'projects', label: 'Projects', visible: true },
  { id: 'skills', label: 'Skills', visible: true },
];

export type TemplateId = 'minimal' | 'professional' | 'modern' | 'brutalist' | 'compact' | 'editorial' | 'executive' | 'creative' | 'academic' | 'tech' | 'elegant' | 'infographic' | 'classic';

export interface Resume {
  id: string;
  title: string;
  targetRole: string;
  lastEdited: string;
  templateId: TemplateId;
  profile: ResumeProfile;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  certifications: CertificationItem[];
  customSections: CustomSection[];
  sectionOrder: SectionConfig[];
}

export const createBlankResume = (): Resume => ({
  id: crypto.randomUUID(),
  title: 'Untitled Resume',
  targetRole: '',
  lastEdited: new Date().toISOString(),
  templateId: 'minimal',
  profile: {
    name: '',
    email: '',
    phone: '',
    location: '',
    photo: '',
    linkedin: '',
    linkedinDisplayFull: false,
    website: '',
    websiteDisplayFull: false,
    links: [],
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  customSections: [],
});
