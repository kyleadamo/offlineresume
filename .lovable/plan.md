

## Reorderable, Toggleable Resume Sections

### Overview
Add a section configuration system that lets users reorder and show/hide the five content sections (Summary, Experience, Education, Projects, Skills). The configuration persists as part of the resume data.

### Data Model — `src/schema/resume.ts`

Add a new interface and default:

```ts
export interface SectionConfig {
  id: string; // 'summary' | 'experience' | 'education' | 'projects' | 'skills'
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
```

Add `sectionOrder?: SectionConfig[]` to the `Resume` interface. Default it in `createBlankResume()`.

### Editor — `src/editor/ResumeEditor.tsx`

1. Add a new "Sections" panel at the top of the editor (above the accordion), showing each section as a draggable row with a toggle switch and grip handle — using the existing `SortableList` component.
2. The accordion sections below render in the order defined by `sectionOrder`, and hidden sections are collapsed/dimmed or omitted.
3. Profile/Contact always stays first and is not part of the reorderable list.

### Templates — all 13 template files

Each template currently renders sections in a hardcoded order. Change each to:
1. Read `resume.sectionOrder` (falling back to `DEFAULT_SECTION_ORDER` if undefined)
2. Filter to `visible: true` entries
3. Map over the ordered list, rendering the corresponding section JSX via a lookup/switch

This is a mechanical change per template — extract each section's JSX into a named block, then render them in order.

### Store Migration — `src/hooks/useResumeStore.ts`

In `loadResumes()`, backfill any resume missing `sectionOrder` with `DEFAULT_SECTION_ORDER`.

### Files to change
1. `src/schema/resume.ts` — add `SectionConfig`, `DEFAULT_SECTION_ORDER`, update `Resume` and `createBlankResume`
2. `src/hooks/useResumeStore.ts` — migration for existing resumes
3. `src/editor/ResumeEditor.tsx` — section reorder/toggle UI + render accordion in configured order
4. All 13 templates (`MinimalTemplate.tsx`, `ProfessionalTemplate.tsx`, `ModernTemplate.tsx`, `BrutalistTemplate.tsx`, `CompactTemplate.tsx`, `ExecutiveTemplate.tsx`, `CreativeTemplate.tsx`, `AcademicTemplate.tsx`, `TechTemplate.tsx`, `ElegantTemplate.tsx`, `InfographicTemplate.tsx`, `ClassicTemplate.tsx`) — render sections dynamically based on `sectionOrder`

