

## New "Keynote" Resume Template

### Concept
A resume template inspired by Apple Keynote presentation slides: huge typography, massive whitespace, very short lines, and thin San Francisco-style fonts. The layout uses dramatic scale contrast -- the name and section headings are oversized while body text remains clean and minimal. Each section breathes with generous padding, creating a presentation-like feel.

### Design Traits
- **Huge name** at the top (48-60px, font-weight 200/300, uppercase tracking)
- **Target role** as a thin subtitle beneath
- **Section headings** large (24-28px), thin weight, uppercase with wide letter-spacing
- **Body text** small and restrained (13-14px), short lines (max-width constrained)
- **Massive vertical spacing** between sections (40-60px gaps)
- **Contact info** displayed as a minimal horizontal row of thin text with subtle separators
- **No borders or rules** -- whitespace alone creates hierarchy
- **Photo** displayed large in the header area (similar to the reference image), circular or slightly rounded
- **Two-column lower section** for contact/education (left) and experience (right), echoing the reference layout
- **Color palette**: Near-black text on white, with a single dark accent bar behind the name (like the reference)
- **Font**: Uses the existing `font-sans` (Inter), styled thin (font-light/font-extralight) to approximate SF Pro

### Changes

**1. `src/templates/KeynoteTemplate.tsx`** (new file)
- Full template component following the existing `TemplateProps` pattern
- Uses `getVisibleSections` and `createNewSectionRenderers` like other templates
- Header: large photo (if available) alongside summary, dark accent band with name, role beneath
- Two-column body layout for contact+education (left) and experience+skills (right)
- All sections use `data-section` attributes and `sectionClass` for click-to-scroll
- Massive whitespace, thin fonts, short constrained lines

**2. `src/schema/resume.ts`**
- Add `'keynote'` to the `TemplateId` union type

**3. `src/preview/ResumePreview.tsx`**
- Import `KeynoteTemplate`
- Add to `templateMap`: `keynote: KeynoteTemplate`
- Add to `allTemplates` array: `{ id: 'keynote', label: 'Keynote' }`

