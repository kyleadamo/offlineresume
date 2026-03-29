

## Fix Section Spacing in Minimal Template

### Problem
The projects and skills sections lack the `mb-5` bottom margin that other sections (summary, experience, education) have, causing inconsistent vertical spacing.

### Fix — `src/templates/MinimalTemplate.tsx`

Add `mb-5` to the projects and skills section wrappers:

- Line 108: `className={sectionClass}` → `className={\`mb-5 ${sectionClass}\`}`
- Line 128: `className={sectionClass}` → `className={\`mb-5 ${sectionClass}\`}`

This matches the pattern already used by the summary (`mb-5`), experience (`mb-5`), and education (`mb-5`) sections.

### Files
1. `src/templates/MinimalTemplate.tsx` — add `mb-5` to projects and skills sections

