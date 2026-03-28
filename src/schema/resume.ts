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
  links: ResumeLink[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url: string;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
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

export type TemplateId = 'minimal' | 'professional' | 'modern' | 'compact' | 'editorial';

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
