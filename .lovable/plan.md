

## Plan: Click-to-scroll from Preview to Editor

### Approach

Add `data-section` attributes to clickable regions in the preview templates and corresponding `id` attributes to accordion items in the editor. When a user clicks a section in the preview, identify the section name and scroll the editor panel to the matching accordion section (opening it if collapsed).

### Changes

**1. `src/templates/MinimalTemplate.tsx` (and Modern/Professional)**
- Wrap each section (header/profile, summary, experience, education, skills) in a `div` with `data-section="profile"`, `data-section="summary"`, etc.
- Add `cursor-pointer` and a subtle hover highlight so sections look clickable.

**2. `src/preview/ResumePreview.tsx`**
- Add an `onClick` handler on the template container that reads `data-section` from the clicked element (walking up parents).
- Call a new callback prop or dispatch a custom event (`scroll-to-section`) with the section name.

**3. `src/editor/ResumeEditor.tsx`**
- Add `id="editor-section-profile"`, `id="editor-section-summary"`, etc. to each `AccordionItem`.
- Listen for the `scroll-to-section` custom event.
- On event: find the target element by id, scroll it into view with `scrollIntoView({ behavior: 'smooth' })`, and programmatically open the accordion if collapsed.
- Convert `Accordion` from uncontrolled (`defaultValue`) to controlled (`value` + `onValueChange`) so sections can be opened programmatically.

**4. `src/pages/BuilderPage.tsx`**
- Add a `ref` to the editor scroll container so `scrollIntoView` works within the correct overflow context.

### Interaction Flow

```text
User clicks "Experience" area in preview
  → onClick reads data-section="experience"
  → dispatches CustomEvent("scroll-to-section", { detail: "experience" })
  → Editor listens, opens accordion, scrolls to #editor-section-experience
```

### Visual feedback
- Preview sections get a subtle `hover:bg-muted/30` ring on hover with `cursor-pointer` to signal clickability.

