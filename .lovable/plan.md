

## Fix LinkedIn Display: Remove Extra Text & Fix Icon Alignment

### Changes — `src/templates/LinkedInBadge.tsx`

**1. Full URL mode** — Currently shows icon + URL text. No "LinkedIn" label exists in code, so this should be correct. Will verify the rendered output matches. If the user is seeing stale content, the rebuild will fix it.

**2. Icon-only mode — fix vertical alignment**
The icon-only `<a>` tag currently has no flex alignment. It needs `inline-flex items-baseline` so the icon sits on the text baseline of sibling elements in the contact row.

```tsx
// Icon-only mode: add inline-flex + items-baseline + vertical alignment tweak
<a href={url} target="_blank" rel="noopener noreferrer" 
   className={className || "inline-flex items-baseline hover:opacity-70"} title="LinkedIn">
  <LinkedInIcon className="w-3 h-3 relative top-[0.5px]" />
</a>
```

**3. Full URL mode: ensure baseline alignment too**
```tsx
<a href={url} target="_blank" rel="noopener noreferrer" 
   className={className || "inline-flex items-baseline gap-1 hover:underline"}>
  <LinkedInIcon className="w-3 h-3 shrink-0 relative top-[0.5px]" />
  <span>{profile.linkedin.replace(/^https?:\/\//, '')}</span>
</a>
```

Single file change. The `relative top-[0.5px]` nudges the SVG icon down slightly to sit flush with text baselines.

