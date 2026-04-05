

## Expandable Bullet Text Editing

### Problem
Bullet items in the resume editor use single-line `<Input>` fields. Long bullets get truncated and are hard to edit.

### Solution
Replace the `<Input>` in `BulletList` with a component that toggles between:
- **Collapsed**: single-line input with text overflow ellipsis (current behavior)
- **Expanded**: multi-line `<Textarea>` that auto-sizes, triggered on focus

When the user focuses/clicks a bullet, it switches to a `<Textarea>`. On blur, it collapses back to the single-line view. The textarea will auto-resize to fit content.

### Changes

**File: `src/editor/ResumeEditor.tsx`**

1. Create an inline `ExpandableBulletInput` component (or add state logic directly in the render):
   - State: `editing: boolean` (default false)
   - When `editing` is false: render an `<Input>` with `truncate` class (single-line, ellipsis on overflow)
   - When `editing` is true: render a `<Textarea>` that auto-sizes to content, with `onBlur` to collapse back
   - On focus of the Input, set `editing = true` and auto-focus the Textarea
   - The Textarea uses a ref to auto-resize on mount and on change (set `height = scrollHeight`)

2. Replace the `<Input>` inside `BulletList`'s `renderItem` with this new component

### Scope
- Single file change: `src/editor/ResumeEditor.tsx`
- No schema, template, or preview changes

