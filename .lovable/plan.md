

## Add 8 New Resume Templates + "More..." Overflow Menu

### Overview
Add all 8 proposed templates (Executive, Creative, Compact, Academic, Tech/Terminal, Elegant, Infographic, Classic) and introduce a "More..." popover button in the template selector to keep the UI clean.

### New Templates

| Template | Key Visual Traits |
|----------|------------------|
| **Executive** | Serif font, navy accent color, centered header with thick bottom border, traditional layout |
| **Creative** | Left accent sidebar (colored strip), asymmetric layout, bold section headings with background color |
| **Compact** | Two-column layout, smaller font size, maximum density |
| **Academic** | Clean serif, "Curriculum Vitae" header, publications-friendly spacing |
| **Tech/Terminal** | Monospace font, dark-themed section headers, `>` bullet prefix, code-block skill tags |
| **Elegant** | Thin lines, small-caps headings, generous whitespace, refined spacing |
| **Infographic** | Skill bars (visual %), colorful section icons, timeline dots for experience |
| **Classic** | Centered name, Times-style serif, traditional Word-doc look, simple underline dividers |

### Files to Create (8 new template files)
- `src/templates/ExecutiveTemplate.tsx`
- `src/templates/CreativeTemplate.tsx`
- `src/templates/CompactTemplate.tsx`
- `src/templates/AcademicTemplate.tsx`
- `src/templates/TechTemplate.tsx`
- `src/templates/ElegantTemplate.tsx`
- `src/templates/InfographicTemplate.tsx`
- `src/templates/ClassicTemplate.tsx`

Each follows the same pattern as existing templates: takes `{ resume: Resume }` props, uses `data-section` for click-to-scroll, `data-pdf-section` on individual entries for print break-inside protection, and the `sectionClass` hover pattern.

### Files to Modify

**`src/schema/resume.ts`** — Expand `TemplateId` union:
```ts
export type TemplateId = 'minimal' | 'professional' | 'modern' | 'brutalist' 
  | 'compact' | 'editorial' | 'executive' | 'creative' | 'academic' 
  | 'tech' | 'elegant' | 'infographic' | 'classic';
```

**`src/preview/ResumePreview.tsx`** — Update `templateMap` and `templateNames`. Show first 4 templates as direct buttons, then a "More..." popover/dropdown for the remaining 8:
```
[Minimal] [Professional] [Modern] [Brutalist] [More... ▾]
```
The "More..." button opens a `Popover` listing: Executive, Creative, Compact, Academic, Tech, Elegant, Infographic, Classic. Selecting one applies it and closes the popover. Active template shown with same styling whether in main row or dropdown.

**`src/preview/FullPagePreview.tsx`** — Update `templateMap` to include all new templates.

### Template Design Details

All templates use only Tailwind CSS classes and Google Fonts already imported (Inter, Source Serif 4). The Tech template uses `font-mono` (system monospace). No new dependencies needed.

Each template renders: profile header, summary, experience (with separator fix between role/company), education, skills, and the empty state. Certifications, projects, and custom sections are included where present in the resume data.

### "More..." Button Implementation
Uses the existing `Popover` component from shadcn/ui. The trigger is styled consistently with the template buttons. Inside, a vertical list of template names as clickable items, with the active one highlighted.

