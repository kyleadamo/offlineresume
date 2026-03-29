

## Fix LinkedIn Icon + Text Alignment

### Problem
When "Show full LinkedIn" is toggled on, only the text URL is displayed. The screenshot shows the user wants the LinkedIn icon **and** the text "LinkedIn" displayed together, with the icon baseline-aligned with surrounding text and close to the label.

### Changes

**`src/templates/LinkedInBadge.tsx`**
- When `linkedinDisplayFull` is true: render both the icon and the text inside the same `<a>` tag, using `inline-flex items-baseline gap-1` so the icon sits on the text baseline and stays tight to the label
- Add `relative top-[1px]` or `self-end` to fine-tune the icon's vertical position to match surrounding text
- Keep icon-only mode unchanged for when the toggle is off

```tsx
if (profile.linkedinDisplayFull) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" 
       className={className || "inline-flex items-center gap-1 hover:underline"}>
      <LinkedInIcon className="w-3 h-3 shrink-0" />
      <span>LinkedIn</span>
    </a>
  );
}
```

No template file changes needed — the fix is entirely in the shared `LinkedInBadge.tsx` component.

