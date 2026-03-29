

## Add Drag-to-Reorder for Resume Items

### Overview
Add drag-and-drop reordering using the already-installed `@dnd-kit` library. Two levels of reordering:

1. **Item-level**: Reorder entries within experience, education, projects, and skills sections
2. **Sub-item-level**: Reorder bullet points within experience entries, highlight points within project entries, and skill categories' individual skills

Since arrays are stored in order in the Resume schema and templates render them with `.map()`, reordering the arrays automatically reflects in localStorage persistence, JSON export, and PDF print.

### Technical Plan

**1. Create a reusable `SortableList` helper component** (`src/components/SortableList.tsx`)
- Wraps `@dnd-kit/core` `DndContext` + `@dnd-kit/sortable` `SortableContext` with `verticalListSortingStrategy`
- Accepts `items` (array with `id`), `onReorder` callback, and a render function for each item
- Create a `SortableItem` wrapper that provides the drag handle via `useSortable`
- Uses `arrayMove` from `@dnd-kit/sortable` for reorder logic
- Includes `restrictToVerticalAxis` modifier and collision detection

**2. Update `ResumeEditor.tsx` — Item-level reordering**
- Wrap each section's item list (experience, education, projects, skills) with the `SortableList` component
- The existing `GripVertical` icons become functional drag handles
- On drag end, call `onUpdate` with the reordered array

**3. Update `ResumeEditor.tsx` — Sub-item reordering**
- Wrap bullet point lists in `ExperienceEditor` with a nested `SortableList`
- Wrap highlight lists in `ProjectsEditor` with a nested `SortableList`  
- Wrap skills within each `SkillCategory` — since skills are comma-separated strings, convert the input to a tag-based sortable list with drag handles

**4. No schema or template changes needed**
- Arrays already determine render order everywhere
- localStorage saves the array order as-is
- JSON export serializes the arrays in order
- PDF print renders from the same template components

