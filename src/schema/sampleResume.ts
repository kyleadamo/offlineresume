import { Resume, createBlankResume } from './resume';

/**
 * Generates a sample resume that always matches the current schema.
 * Built on top of createBlankResume() so any new fields are automatically included.
 */
export function createSampleResume(): Omit<Resume, 'id' | 'lastEdited'> {
  const base = createBlankResume();

  const sample: Resume = {
    ...base,
    title: "Sample Resume",
    targetRole: "Frontend Engineer",
    profile: {
      ...base.profile,
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "https://linkedin.com/in/alexjohnson",
      linkedinDisplayFull: false,
      website: "https://alexjohnson.dev",
      websiteDisplayFull: false,
      links: [{ id: "1", label: "GitHub", url: "https://github.com/alexjohnson" }],
    },
    summary: "Detail-oriented frontend engineer with 5 years of experience building performant web applications using React, TypeScript, and modern CSS.",
    experience: [
      {
        id: "1", role: "Senior Frontend Engineer", company: "Acme Corp", companyUrl: "https://acme.com",
        startDate: "2021-06", endDate: "Present",
        bullets: ["Led migration from legacy jQuery codebase to React, improving page load times by 40%", "Mentored 3 junior developers through code reviews and pair programming"],
      },
      {
        id: "2", role: "Frontend Developer", company: "StartupXYZ", companyUrl: "",
        startDate: "2019-01", endDate: "2021-05",
        bullets: ["Built component library used across 4 product teams", "Implemented accessibility improvements achieving WCAG 2.1 AA compliance"],
      },
    ],
    education: [{ id: "1", institution: "University of California", degree: "B.S.", field: "Computer Science", startDate: "2015", endDate: "2019", description: "" }],
    skills: [
      { id: "1", category: "Languages", skills: ["TypeScript", "JavaScript", "HTML", "CSS"] },
      { id: "2", category: "Frameworks", skills: ["React", "Next.js", "Tailwind CSS"] },
    ],
    projects: [
      { id: "1", name: "Personal Portfolio", description: "Responsive portfolio site built with React and Tailwind CSS", url: "https://alexjohnson.dev", highlights: ["Lighthouse score of 98", "Fully accessible"] },
    ],
    references: [
      { id: "1", name: "Jane Smith", photo: "", company: "Acme Corp", title: "Engineering Manager", phone: "(555) 987-6543", email: "jane.smith@acme.com" },
    ],
    certifications: [],
    customSections: [],
  };

  // Strip internal fields so the sample shows only importable data
  const { id, lastEdited, ...rest } = sample;
  return rest;
}
