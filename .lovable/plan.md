

## Fix: Resume Preview Inheriting Dark Mode on Landing Page

### Problem
The landing page wraps everything in `<div className="dark">`, which changes CSS variables (e.g., `--foreground` becomes light, `--background` becomes dark). The resume templates use Tailwind classes like `text-foreground` and `bg-background`, so they inherit the dark theme — causing white text on dark backgrounds inside the preview.

### Fix
Wrap the `ResumePreview` in the `HeroSection` with a light-mode reset div so templates render with their intended light-mode colors.

### Change — `src/components/landing/HeroSection.tsx`

Add a `<div className="light">` wrapper (which resets to the `:root` CSS variables) around the resume preview container. Since Tailwind's dark mode uses the `dark` class, we need to explicitly scope a non-dark context. The simplest approach: add a wrapper div with an inline style or a class that resets to the light CSS variable values.

Specifically, wrap the preview `<div>` in a container that removes the `dark` class scope:

```tsx
{/* Reset to light mode for resume preview */}
<div className="not-dark" style={{ colorScheme: 'light' }}>
  <div className="relative w-full max-w-[900px] rounded-xl border border-border bg-card/50 overflow-hidden">
    ...ResumePreview...
  </div>
</div>
```

And add a small `.not-dark` rule in `src/index.css` that re-applies the `:root` (light) CSS variable values, ensuring all resume template styles render correctly.

### Files
1. **`src/index.css`** — Add a `.not-dark` class that re-declares the light-mode CSS variables (copy from `:root`)
2. **`src/components/landing/HeroSection.tsx`** — Wrap the preview container in `<div className="not-dark">`

