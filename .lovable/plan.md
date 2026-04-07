

## Move Auto-Rename to onBlur

Currently the title updates on every keystroke. Instead, move the rename logic to a `onBlur` handler on the name input, so the title only updates when the user leaves the field.

### Changes

**`src/editor/ResumeEditor.tsx`**

1. **Remove** the title-update logic from the `set` function (lines 147-149) — revert it to just updating the profile field.

2. **Add an `onBlur` handler** to the name `<Input>` at line 186:
```tsx
<Input
  value={p.name}
  onChange={(e) => set('name', e.target.value)}
  onBlur={() => {
    if (p.name.trim() && resume.title === 'Untitled Resume') {
      onUpdate({ title: `${p.name.trim()} Resume` });
    }
  }}
  placeholder="Full name"
/>
```

This way the title stays as "Untitled Resume" while the user types, and only updates to "{Name} Resume" once they click or tab away from the name field.

