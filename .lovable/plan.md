

## Add Visual Contrast to Editor Sections

### Problem
The accordion sections (Contact, Summary, Experience, etc.) blend together with minimal visual separation — just thin borders from the default `AccordionItem`.

### Fix — `src/editor/ResumeEditor.tsx`

1. **Style each `AccordionItem`** with a background, border, rounded corners, and padding to create card-like sections:
   - Add `className="bg-secondary/30 border border-border rounded-lg mb-3 px-4"` to each `AccordionItem`

2. **Boost the trigger text** — make section headers larger and bolder:
   - Change `className="text-sm font-medium"` → `className="text-sm font-semibold uppercase tracking-wide text-foreground"`

3. **Increase outer spacing** — change `space-y-2` → `space-y-1` on the wrapper (the `mb-3` on items handles spacing)

Single file change: `src/templates/` files are untouched.

