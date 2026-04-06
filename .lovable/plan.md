

## Auto-rename "Untitled Resume" on Contact Name Entry

When the user types a contact name in the builder's profile editor, if the resume title is still "Untitled Resume", automatically update it to `{Contact Name} Resume`.

### Changes

**`src/editor/ResumeEditor.tsx`** — Update `ProfileEditor`'s `set` function (~line 145):
- After setting the profile field, check if the field being changed is `name`, the new value is non-empty, and the current `resume.title` is `"Untitled Resume"`
- If so, also call `onUpdate` with the new title `{value.trim()} Resume`

```typescript
const set = (field: string, value: string) => {
  const updates: Partial<Resume> = { profile: { ...p, [field]: value } };
  if (field === 'name' && value.trim() && resume.title === 'Untitled Resume') {
    updates.title = `${value.trim()} Resume`;
  }
  onUpdate(updates);
};
```

Single file, single function change.

