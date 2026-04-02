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
  level?: number;
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
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
  description: string;
  skills: string[];
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  hidden?: boolean;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  description: string;
}

export interface AffiliationItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
}

export interface PatentItem {
  id: string;
  title: string;
  patentNumber: string;
  date: string;
  url: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  photo: string;
  company: string;
  title: string;
  phone: string;
  email: string;
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
  { id: 'references', label: 'References', visible: true },
  { id: 'certifications', label: 'Certifications', visible: false },
  { id: 'languages', label: 'Languages', visible: false },
  { id: 'awards', label: 'Awards', visible: false },
  { id: 'volunteer', label: 'Volunteer', visible: false },
  { id: 'publications', label: 'Publications', visible: false },
  { id: 'affiliations', label: 'Affiliations', visible: false },
  { id: 'patents', label: 'Patents', visible: false },
  { id: 'interests', label: 'Interests', visible: false },
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
  references: ReferenceItem[];
  sectionOrder: SectionConfig[];
  languages: LanguageItem[];
  awards: AwardItem[];
  volunteer: VolunteerItem[];
  publications: PublicationItem[];
  affiliations: AffiliationItem[];
  patents: PatentItem[];
  interests: string[];
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
  references: [],
  sectionOrder: DEFAULT_SECTION_ORDER.map(s => ({ ...s })),
  languages: [],
  awards: [],
  volunteer: [],
  publications: [],
  affiliations: [],
  patents: [],
  interests: [],
});
