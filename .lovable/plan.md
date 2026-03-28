

## Fix Skills Section Alignment

**Problem:** In the Minimal and Professional templates, skills render as inline text with `category: skill1, skill2...` which wraps awkwardly and looks misaligned (as shown in the screenshot).

**Solution:** Adopt the Modern template's badge/chip approach for all three templates, with slight style variations per template to maintain their distinct character.

### Changes

**`src/templates/MinimalTemplate.tsx`** — Skills section
- Replace the inline `category: skill1, skill2` text layout with a two-row structure: bold category label on its own line, followed by a flex-wrap row of badge-style chips (`bg-secondary text-xs px-2 py-0.5 rounded`).

**`src/templates/ProfessionalTemplate.tsx`** — Skills section
- Same structural change: category label on its own line, skills as wrapped chips below. Use a slightly different chip style (e.g., `border border-border` outline pills) to keep the professional aesthetic distinct from Modern.

**`src/templates/ModernTemplate.tsx`** — No changes needed (already uses badges).

### Result
Each category gets its own block with a clear label and neatly wrapped skill chips below, eliminating the ragged inline text alignment issue.

