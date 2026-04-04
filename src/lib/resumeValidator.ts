import { z } from 'zod';

/* ── helpers ───────────────────────────────────────────── */

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '');

const capLength = (max: number) => (s: string) => s.slice(0, max);

const safeStr = (max = 500) =>
  z
    .string()
    .default('')
    .transform((v) => capLength(max)(stripHtml(v.trim())));

const safeId = () => z.string().default('').transform((v) => v || crypto.randomUUID());

/* ── sub-schemas ───────────────────────────────────────── */

const linkSchema = z.object({
  id: safeId(),
  label: safeStr(100),
  url: safeStr(500),
});

const profileSchema = z.object({
  name: safeStr(100),
  email: safeStr(255),
  phone: safeStr(50),
  location: safeStr(200),
  photo: safeStr(2000),
  linkedin: safeStr(500),
  linkedinDisplayFull: z.boolean().default(false),
  website: safeStr(500),
  websiteDisplayFull: z.boolean().default(false),
  links: z.array(linkSchema).default([]),
});

const experienceSchema = z.object({
  id: safeId(),
  role: safeStr(200),
  company: safeStr(200),
  companyUrl: safeStr(500),
  startDate: safeStr(50),
  endDate: safeStr(50),
  bullets: z.array(safeStr(500)).default([]),
  hidden: z.boolean().default(false),
});

const educationSchema = z.object({
  id: safeId(),
  institution: safeStr(200),
  degree: safeStr(200),
  field: safeStr(200),
  startDate: safeStr(50),
  endDate: safeStr(50),
  description: safeStr(1000),
  hidden: z.boolean().default(false),
});

const projectSchema = z.object({
  id: safeId(),
  name: safeStr(200),
  description: safeStr(1000),
  url: safeStr(500),
  highlights: z.array(safeStr(500)).default([]),
  hidden: z.boolean().default(false),
});

const skillItemSchema = z.union([
  z.string().transform((s) => ({ name: s, level: 75 })),
  z.object({ name: safeStr(100), level: z.number().min(0).max(100).default(75) }),
]);

const skillCategorySchema = z.object({
  id: safeId(),
  category: safeStr(100),
  skills: z.array(skillItemSchema).default([]),
  hidden: z.boolean().default(false),
});

const certificationSchema = z.object({
  id: safeId(),
  name: safeStr(200),
  issuer: safeStr(200),
  date: safeStr(50),
  url: safeStr(500),
  issueDate: safeStr(50),
  expirationDate: safeStr(50),
  credentialId: safeStr(100),
  credentialUrl: safeStr(500),
  description: safeStr(1000),
  skills: z.array(safeStr(100)).default([]),
});

const languageSchema = z.object({
  id: safeId(),
  language: safeStr(100),
  proficiency: safeStr(50),
});

const awardSchema = z.object({
  id: safeId(),
  title: safeStr(200),
  issuer: safeStr(200),
  date: safeStr(50),
  description: safeStr(1000),
});

const volunteerSchema = z.object({
  id: safeId(),
  organization: safeStr(200),
  role: safeStr(200),
  startDate: safeStr(50),
  endDate: safeStr(50),
  description: safeStr(1000),
  hidden: z.boolean().default(false),
});

const publicationSchema = z.object({
  id: safeId(),
  title: safeStr(200),
  publisher: safeStr(200),
  date: safeStr(50),
  url: safeStr(500),
  description: safeStr(1000),
});

const affiliationSchema = z.object({
  id: safeId(),
  organization: safeStr(200),
  role: safeStr(200),
  startDate: safeStr(50),
});

const patentSchema = z.object({
  id: safeId(),
  title: safeStr(200),
  patentNumber: safeStr(100),
  date: safeStr(50),
  url: safeStr(500),
});

const referenceSchema = z.object({
  id: safeId(),
  name: safeStr(100),
  photo: safeStr(2000),
  company: safeStr(200),
  title: safeStr(200),
  phone: safeStr(50),
  email: safeStr(255),
});

const customSectionSchema = z.object({
  id: safeId(),
  title: safeStr(200),
  content: safeStr(5000),
});

/* ── main resume schema (partial – all fields optional) ── */

export const resumeParseSchema = z
  .object({
    profile: profileSchema.default({}),
    summary: safeStr(5000),
    experience: z.array(experienceSchema).default([]),
    education: z.array(educationSchema).default([]),
    projects: z.array(projectSchema).default([]),
    skills: z.array(skillCategorySchema).default([]),
    certifications: z.array(certificationSchema).default([]),
    languages: z.array(languageSchema).default([]),
    awards: z.array(awardSchema).default([]),
    volunteer: z.array(volunteerSchema).default([]),
    publications: z.array(publicationSchema).default([]),
    affiliations: z.array(affiliationSchema).default([]),
    patents: z.array(patentSchema).default([]),
    interests: z.array(safeStr(100)).default([]),
    references: z.array(referenceSchema).default([]),
    customSections: z.array(customSectionSchema).default([]),
  })
  .passthrough()
  // drop any keys we don't recognise
  .transform((data) => {
    const {
      profile, summary, experience, education, projects, skills,
      certifications, languages, awards, volunteer, publications,
      affiliations, patents, interests, references, customSections,
    } = data;
    return {
      profile, summary, experience, education, projects, skills,
      certifications, languages, awards, volunteer, publications,
      affiliations, patents, interests, references, customSections,
    };
  });

export type ParsedResume = z.infer<typeof resumeParseSchema>;
