

## Fix Project Bullet Text Alignment on Wrap

### Problem
Project highlights use `list-disc list-inside` which causes wrapped text to indent back to the bullet character. Experience bullets use a `flex gap-2` layout with a manual `•` span, keeping wrapped lines aligned with the first line of text.

### Fix
Change all 12 template files to render project highlights the same way experience bullets are rendered — using a flex container with a fixed-width bullet character and a text span.

**Before (all templates except TechTemplate):**
```html
<ul className="list-disc list-inside">
  <li>{h}</li>
</ul>
```

**After:**
```html
<ul className="space-y-0.5">
  <li className="flex gap-2">
    <span className="shrink-0 mt-0.5">•</span>
    <span>{h}</span>
  </li>
</ul>
```

TechTemplate already uses the flex pattern (with `>` instead of `•`) so it needs no change.

### Files (11 templates)
1. `ModernTemplate.tsx`
2. `ClassicTemplate.tsx`
3. `MinimalTemplate.tsx`
4. `AcademicTemplate.tsx`
5. `ElegantTemplate.tsx`
6. `ExecutiveTemplate.tsx`
7. `ProfessionalTemplate.tsx`
8. `InfographicTemplate.tsx`
9. `CreativeTemplate.tsx`
10. `BrutalistTemplate.tsx`
11. `CompactTemplate.tsx`

