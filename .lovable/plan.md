

## Add Neo-Brutalist Resume Template

### Overview
Add a new "Brutalist" template with bold, raw aesthetics: thick black borders, high-contrast colors, chunky typography, and sharp corners — a distinctive alternative to the existing refined templates.

### Visual Direction
- **Borders**: Thick 2-3px solid black borders around sections
- **Typography**: Bold, uppercase headings; monospace or heavy sans-serif feel
- **Colors**: High contrast — black/white with a vivid accent (yellow or red highlight blocks)
- **Corners**: Sharp (no border-radius)
- **Spacing**: Generous, deliberate gaps between blocks
- **Skills**: Chunky bordered badges, no rounding

### Changes

**`src/schema/resume.ts`**
- Add `'brutalist'` to the `TemplateId` union type

**`src/templates/BrutalistTemplate.tsx`** (new file)
- Full template component following the same `TemplateProps` interface
- Profile: name in large bold uppercase, thick bottom border, contact info in monospace-style text
- Photo: square with thick black border (no rounding)
- Summary: inside a bordered box with a yellow/accent background strip
- Experience: each entry in a bordered card with bold role, uppercase dates
- Education: similar bordered blocks
- Skills: chunky square badges with thick borders
- Same `data-section` attributes and `sectionClass` hover behavior as other templates

**`src/preview/ResumePreview.tsx`**
- Import `BrutalistTemplate`
- Add to `templateMap`: `brutalist: BrutalistTemplate`
- Add to `templateNames`: `{ id: 'brutalist', label: 'Brutalist' }`

### Result
A fourth template option appears in the preview switcher. Clicking "Brutalist" renders the resume with a bold, neo-brutalist aesthetic while preserving all content and click-to-scroll interactivity.

