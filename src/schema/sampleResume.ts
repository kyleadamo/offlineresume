import { Resume, createBlankResume } from './resume';

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
    certifications: [
      { id: "1", name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2023", url: "", issueDate: "2023-03", expirationDate: "2026-03", credentialId: "ABC123", credentialUrl: "https://aws.amazon.com/verify", description: "Associate-level cloud development certification", skills: ["AWS", "Cloud Architecture"] },
    ],
    languages: [
      { id: "1", language: "English", proficiency: "Native" },
      { id: "2", language: "Spanish", proficiency: "Professional" },
    ],
    awards: [
      { id: "1", title: "Hackathon Winner", issuer: "TechCrunch Disrupt", date: "2022", description: "First place for building an accessibility tool" },
    ],
    volunteer: [
      { id: "1", organization: "Code for America", role: "Volunteer Developer", startDate: "2020-01", endDate: "Present", description: "Building civic tech tools for local communities" },
    ],
    publications: [
      { id: "1", title: "Modern CSS Techniques for Scalable Design Systems", publisher: "CSS-Tricks", date: "2023-05", url: "https://css-tricks.com/example", description: "" },
    ],
    affiliations: [
      { id: "1", organization: "ACM", role: "Member", startDate: "2019" },
    ],
    patents: [
      { id: "1", title: "Method for Optimizing Web Component Rendering", patentNumber: "US-2023-0001234", date: "2023", url: "" },
    ],
    interests: ["Open Source", "Accessibility", "Design Systems", "Rock Climbing"],
    customSections: [],
  };

  const { id, lastEdited, ...rest } = sample;
  return rest;
}
