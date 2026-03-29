

## Add Visibility Toggle to Resume Entries

### Overview
Add a `hidden` boolean field to experience, education, project, and skill category items. Hidden entries remain in the data but are filtered out in templates and PDF output. The editor shows an eye/eye-off toggle for each entry.

### Changes

**1. `src/schema/resume.ts`**
- Add `hidden?: boolean` to `ExperienceItem`, `EducationItem`, `ProjectItem`, and `SkillCategory` interfaces

**2. `src/editor/ResumeEditor.tsx`**
- Import `Eye`, `EyeOff` from lucide-react
- In each section editor (Experience, Education, Projects, Skills), add a toggle button next to the delete button
- When hidden, apply reduced opacity to the card (`opacity-50`) so the user can see it's inactive
- Toggle sets `hidden: !item.hidden` via the existing `updateItem` call

**3. All 12 templates**
- Filter out hidden items before rendering: `experience.filter(e => !e.hidden)`, same for education, projects, skills
- This automatically excludes them from PDF print since templates are what gets printed

No changes needed to localStorage persistence, JSON export, or the SortableList — hidden items stay in the arrays and maintain their order.

