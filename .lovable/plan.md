

## Make Section Order Panel Collapsible

### Change — `src/editor/ResumeEditor.tsx`

Replace the static `div` wrapper (lines 82-102) around the "Section Order" area with a `Collapsible` component from shadcn/ui:

1. **Import** `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` from `@/components/ui/collapsible` and `Settings2` (gear/config icon) from `lucide-react`.

2. **Replace** the current markup:
   - The outer `div` becomes `<Collapsible>` with local `open` state (default `false`).
   - The header row becomes a `CollapsibleTrigger` styled as a clickable row with the "Section Order" label on the left and a `Settings2` icon on the right (rotates or highlights when open).
   - The `SortableList` moves inside `<CollapsibleContent>` so it expands/collapses.

3. **Result**: Clicking the header row or the config icon toggles the section order list open/closed. Collapsed by default to save vertical space.

### Files
1. `src/editor/ResumeEditor.tsx`

