

## Add 8 New Resume Sections

### Overview
Add Certifications (expanded), Languages, Awards, Volunteer, Publications, Affiliations, Patents, and Interests sections to the resume schema, editor, all templates, sample data, and persistence backfill.

### 1. Schema — `src/schema/resume.ts`

**Update existing `CertificationItem`** to add new fields:
```ts
export interface CertificationItem {
  id: string; name: string; issuer: string;
  issueDate: string; expirationDate: string;
  credentialId: string; credentialUrl: string;
  description: string; skills: string[];
}
```

**Add new interfaces:**
```ts
export interface LanguageItem { id: string; language: string; proficiency: string; }
export interface AwardItem { id: string; title: string; issuer: string; date: string; description: string; }
export interface VolunteerItem { id: string; organization: string; role: string; startDate: string; endDate: string; description: string; hidden?: boolean; }
export interface PublicationItem { id: string; title: string; publisher: string; date: string; url: string; description: string; }
export interface AffiliationItem { id: string; organization: string; role: string; startDate: string; }
export interface PatentItem { id: string; title: string; patentNumber: string; date: string; url: string; }
```

**Update `Resume` interface** — add:
```ts
languages: LanguageItem[];
awards: AwardItem[];
volunteer: VolunteerItem[];
publications: PublicationItem[];
affiliations: AffiliationItem[];
patents: PatentItem[];
interests: string[];
```

**Update `DEFAULT_SECTION_ORDER`** — append:
```ts
{ id: 'certifications', label: 'Certifications', visible: false },
{ id: 'languages', label: 'Languages', visible: false },
{ id: 'awards', label: 'Awards', visible: false },
{ id: 'volunteer', label: 'Volunteer', visible: false },
{ id: 'publications', label: 'Publications', visible: false },
{ id: 'affiliations', label: 'Affiliations', visible: false },
{ id: 'patents', label: 'Patents', visible: false },
{ id: 'interests', label: 'Interests', visible: false },
```

New sections default to **hidden** so existing resumes are unaffected until toggled on.

**Update `createBlankResume`** — add empty arrays for all new fields.

### 2. Persistence Backfill — `src/hooks/useResumeStore.ts`

In `loadResumes()`, backfill missing arrays (`languages ?? []`, `awards ?? []`, etc.) the same way `references` is currently backfilled. The existing `DEFAULT_SECTION_ORDER` backfill loop already handles new section IDs automatically.

### 3. Sample Data — `src/schema/sampleResume.ts`

Add sample entries for each new section so the downloadable JSON template demonstrates the full schema.

### 4. Editor — `src/editor/ResumeEditor.tsx`

Add editor components and register them in `sectionEditorMap` for all 8 new sections:
- **Certifications**: name, issuer, issueDate, expirationDate, credentialId, credentialUrl, description, skills (comma-separated input)
- **Languages**: language, proficiency (dropdown: Native, Fluent, Professional, Intermediate, Basic)
- **Awards**: title, issuer, date, description
- **Volunteer**: organization, role, startDate, endDate, description
- **Publications**: title, publisher, date, url, description
- **Affiliations**: organization, role, startDate
- **Patents**: title, patentNumber, date, url
- **Interests**: simple comma-separated text input or tag-style entry

Each follows the existing add/remove/edit pattern with `Plus`/`Trash2` buttons.

### 5. Templates — All 13 template files

Add section renderers for all 8 new sections to each template's `sectionRenderers` map. Styling follows each template's existing conventions:
- **Certifications**: name + issuer + dates, credential link, description, skill tags
- **Languages**: language + proficiency badge/label
- **Awards**: title + issuer + date, description
- **Volunteer**: styled like experience (org, role, dates, description)
- **Publications**: title + publisher + date, link, description
- **Affiliations**: organization + role + date
- **Patents**: title + patent number, date, link
- **Interests**: inline tags/chips

Templates: `MinimalTemplate`, `ProfessionalTemplate`, `ModernTemplate`, `BrutalistTemplate`, `CompactTemplate`, `ExecutiveTemplate`, `CreativeTemplate`, `AcademicTemplate`, `TechTemplate`, `ElegantTemplate`, `InfographicTemplate`, `ClassicTemplate`, `EditorialTemplate` (if exists).

### Files Changed
1. `src/schema/resume.ts` — new interfaces, updated Resume, updated defaults
2. `src/schema/sampleResume.ts` — sample entries for new sections
3. `src/hooks/useResumeStore.ts` — backfill new arrays
4. `src/editor/ResumeEditor.tsx` — 8 new editor components + sectionEditorMap entries
5. All 13 template files — new section renderers

