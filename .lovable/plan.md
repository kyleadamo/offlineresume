

## Add Delete Buttons to Resumes & Cover Letters on Index Page

### Changes — `src/pages/Index.tsx`

1. **Import** `Trash2` from lucide-react and `AlertDialog` components from shadcn/ui for a confirmation prompt.

2. **Add delete buttons** to each resume and cover letter row in the "Recent" lists — a small trash icon button on the right side of each row. Use `e.stopPropagation()` to prevent triggering navigation when clicking delete.

3. **Add confirmation dialog** — clicking the trash icon opens an `AlertDialog` asking "Delete this resume/cover letter? This cannot be undone." with Cancel and Delete actions.

4. **Wire up delete handlers** — call `deleteResume(id)` or `deleteLetter(id)` (already exposed by the context hooks) on confirmation. These already remove from state and localStorage.

### Files
1. `src/pages/Index.tsx` — add delete buttons with confirmation to both resume and cover letter lists

