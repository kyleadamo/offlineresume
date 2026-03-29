## Add Cover Letter Support

### Overview

Add a full cover letter workflow: schema, persistence, editor page, PDF preview/print, import (JSON/markdown paste), and export (JSON/markdown/PDF). Cover letters are a separate entity from resumes, stored independently in localStorage.

### Data Model — `src/schema/coverLetter.ts` (new)

```ts
interface CoverLetter {
  id: string;
  title: string;
  lastEdited: string;
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  date: string;
  greeting: string;       // e.g. "Dear Hiring Manager,"
  body: string;           // markdown content
  closing: string;        // e.g. "Sincerely,"
  senderName: string;
  senderContact: string;  // email/phone line
}
```

### Persistence — `src/hooks/useCoverLetterStore.ts` (new)

- Mirror `useResumeStore` pattern with separate localStorage keys (`localcv-cover-letters`, `localcv-cover-letter-active`)
- CRUD operations: create, update, duplicate, delete, setActive

### Context — `src/hooks/CoverLetterContext.tsx` (new)

- Same provider pattern as `ResumeContext`
- Wrap in `App.tsx` alongside `ResumeProvider`

### Home Page — `src/pages/Index.tsx`

- Add a "Cover Letters" section below the resume actions
- The cover letters and resume sections can be in tabs. Each tab can be badged with how many of each are persisted in each section
- Actions: "New cover letter", "Import JSON", "Paste markdown"
- Recent cover letters list (same card style as resumes, with `Mail` icon)

### Import — `src/pages/ImportCoverLetterPage.tsx` (new)

- Two modes: `json` (paste/file upload) and `markdown` (paste textarea)
- JSON import: parse and merge with blank cover letter defaults
- Markdown import: store the pasted content as the `body` field, set defaults for other fields

### Editor — `src/pages/CoverLetterBuilderPage.tsx` (new)

- Same resizable split-panel layout as `BuilderPage`
- Left panel (`src/editor/CoverLetterEditor.tsx`): form fields for all schema properties; body field is a large textarea supporting markdown
- Right panel (`src/preview/CoverLetterPreview.tsx`): renders a clean letter layout with print CSS
- Header: title input, save indicator, export dropdown (JSON, Markdown, PDF)

### Preview/Print — `src/preview/CoverLetterPreview.tsx` (new)

- Clean letter template: sender info top-right, date, recipient block, greeting, body (render markdown as HTML), closing, signature
- PDF button using `window.print()` with print-specific CSS (same approach as resume)
- Page size toggle (Letter/A4) matching existing resume preview

### Export

- **JSON**: strip `id`/`lastEdited`, download as `.json`
- **Markdown**: convert structured fields into a formatted markdown document
- **PDF**: browser print dialog (existing pattern)

### Routes — `src/App.tsx`

- `/cover-letter/builder` → `CoverLetterBuilderPage`
- `/cover-letter/import` → `ImportCoverLetterPage`

### Files to create (6)

1. `src/schema/coverLetter.ts`
2. `src/hooks/useCoverLetterStore.ts`
3. `src/hooks/CoverLetterContext.tsx`
4. `src/pages/CoverLetterBuilderPage.tsx` (includes editor + preview inline or split)
5. `src/editor/CoverLetterEditor.tsx`
6. `src/preview/CoverLetterPreview.tsx`
7. `src/pages/ImportCoverLetterPage.tsx`

### Files to modify (2)

1. `src/App.tsx` — add provider + routes
2. `src/pages/Index.tsx` — add cover letter section + recent list