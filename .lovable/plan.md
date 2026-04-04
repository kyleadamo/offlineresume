

## Make References Section Single Column

### Problem
The references section in Modern, Brutalist, Creative, and Infographic templates uses `grid grid-cols-2`, splitting reference cards into two columns. This should be single column for better readability.

### Fix
Change `grid grid-cols-2 gap-3` to `space-y-3` (or `grid grid-cols-1 gap-3`) in the references container `<div>` in all 4 templates.

### Files
1. **`src/templates/ModernTemplate.tsx`** — line 122: `grid grid-cols-2 gap-3` → `space-y-3`
2. **`src/templates/BrutalistTemplate.tsx`** — line 125: `grid grid-cols-2 gap-3` → `space-y-3`
3. **`src/templates/CreativeTemplate.tsx`** — line 144: `grid grid-cols-2 gap-3 mt-2` → `space-y-3 mt-2`
4. **`src/templates/InfographicTemplate.tsx`** — line 164: `grid grid-cols-2 gap-3` → `space-y-3`

