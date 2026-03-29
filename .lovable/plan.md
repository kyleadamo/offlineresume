

## Add Projects Editor Section

### Change — `src/editor/ResumeEditor.tsx`

1. Add `'projects'` to the `SECTIONS` array
2. Import `ProjectItem` from schema
3. Add a new `AccordionItem` for projects between education and skills
4. Create a `ProjectsEditor` component following the same pattern as `ExperienceEditor`:
   - Add/remove project entries
   - Fields: name, description (textarea), URL, highlights (bullet list with add/remove)
   - Same card styling (`p-4 bg-secondary/50 rounded-lg`)

Single file change. The `ProjectItem` schema already has `id`, `name`, `description`, `url`, and `highlights[]`.

