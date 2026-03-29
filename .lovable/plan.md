

## Fix Modern Template Contact Info Alignment

### Root Cause
The `LinkedInDisplay` and `WebsiteDisplay` components accept a `className` that **replaces** their default flex/alignment classes. The Modern template passes only visual styling (`bg-secondary px-2 py-0.5 rounded`) without layout utilities, so icons and text lose proper alignment.

### Fix — `src/templates/ModernTemplate.tsx`

Update the className passed to both components to include `inline-flex items-center gap-1`:

```
// Before
className="bg-secondary px-2 py-0.5 rounded hover:underline"

// After  
className="inline-flex items-center gap-1 bg-secondary px-2 py-0.5 rounded hover:underline"
```

This ensures:
- Icons vertically center within the badge pill
- Icon + text pairs align properly when full URL is shown
- Icon-only badges still look consistent (small pill with centered icon)

### Files to change
1. `src/templates/ModernTemplate.tsx` — lines 35-36, add `inline-flex items-center gap-1` to both component classNames

