

## Fix Skills Alignment in Executive Template

### Problem
The skills section uses `flex gap-2` which doesn't align the category labels and skill lists into consistent columns. When category names vary in length, the skills text starts at different horizontal positions, creating a ragged layout (visible in the screenshot).

### Change — `src/templates/ExecutiveTemplate.tsx` (lines 114-118)

Switch from `flex gap-2` to a CSS grid with a fixed left column for category labels, so all skill lists align at the same horizontal position.

```tsx
// Change the container from space-y-2 to grid layout
<div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
  {skills.map((cat) => (
    <React.Fragment key={cat.id}>
      {cat.category && <span className="text-xs font-semibold text-foreground shrink-0 text-right">{cat.category}:</span>}
      {!cat.category && <span />}
      <span className="text-xs text-muted-foreground">{cat.skills.join(' · ')}</span>
    </React.Fragment>
  ))}
</div>
```

The `grid-cols-[auto_1fr]` makes the left column auto-size to the widest category label, and all skill lists start at the same position. Category labels are right-aligned for a clean executive look matching the screenshot.

