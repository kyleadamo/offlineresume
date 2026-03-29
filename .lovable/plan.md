

## Add Missing References Renderers to 3 Templates

### Problem
The Brutalist, Creative, and Infographic templates destructure `references` from the resume but never define a `references` entry in their `sectionRenderers` map. The section is silently skipped when rendering.

### Fix

Add a `references` renderer to each template's `sectionRenderers` object, styled as **contact cards** per the original plan.

**1. `src/templates/BrutalistTemplate.tsx`** — Add after the `skills` renderer (line ~110):
- Contact card with `border-[2px] border-foreground` styling
- Optional photo with border
- Name in bold uppercase, title + company below, email/phone in small text
- Grid layout for multiple references

**2. `src/templates/CreativeTemplate.tsx`** — Add references renderer:
- Cards with rounded corners, gradient or accent border
- Photo circle, name/title/company, contact details
- Matches the creative template's playful style

**3. `src/templates/InfographicTemplate.tsx`** — Add references renderer:
- Cards with left accent border or icon-based layout
- Photo circle, structured contact info
- Matches infographic's visual data-presentation style

Each renderer follows the same pattern already used in `ModernTemplate.tsx`:
```tsx
references: () => references.length > 0 ? (
  <div key="references" data-section="references" className={`mb-X ${sectionClass}`}>
    <h3>References</h3>
    <div className="grid grid-cols-2 gap-3">
      {references.map((ref) => (
        <div key={ref.id} data-pdf-section className="card-styles">
          {ref.photo && <img ... />}
          <span>{ref.name}</span>
          {ref.title && <span>{ref.title}</span>}
          ...
        </div>
      ))}
    </div>
  </div>
) : null,
```

### Files
1. `src/templates/BrutalistTemplate.tsx`
2. `src/templates/CreativeTemplate.tsx`
3. `src/templates/InfographicTemplate.tsx`

