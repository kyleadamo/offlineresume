## Update Sample JSON to Match Current Schema

### Problem

The hardcoded sample JSON in `ImportPage.tsx` is missing fields added over time: `references`, `sectionOrder`, profile fields (`photo`, `linkedin`, `website`, display flags), experience `companyUrl`, and project structure.

### Fix — `src/pages/ImportPage.tsx`

Update the inline sample object (lines 111-135) to include all current schema fields:

- `**profile**`: add `photo: ""`, `linkedin: "https://linkedin.com/in/alexjohnson"`, `linkedinDisplayFull: false`, `website: "https://alexjohnson.dev"`, `websiteDisplayFull: false`
- `**experience` items**: add `companyUrl: ""` 
- `**projects**`: replace empty array with one sample project including `id`, `name`, `description`, `url`, `highlights`
- `**references**`: add one sample reference with `id`, `name`, `photo: ""`, `company`, `title`, `phone`, `email`
- `**sectionOrder**`: include the default section order array matching `DEFAULT_SECTION_ORDER`
- `implement an automated process which maintains the json template to ensure users always have the most up to date template`

### Files

1. `src/pages/ImportPage.tsx` — update sample JSON object