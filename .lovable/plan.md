

## Fix Builder Preview Color Scheme

The landing page wraps `ResumePreview` in a `<div className="not-dark">` which forces light-mode CSS variables. The builder page lacks this wrapper, so the resume content inherits dark theme colors (light text on a would-be-white page).

### Changes

**`src/pages/BuilderPage.tsx`** — Wrap the `ResumePreview` in a `not-dark` container (around line 86-92):

```tsx
<div className="h-full overflow-y-auto">
  <div className="not-dark" style={{ colorScheme: 'light' }}>
    <ResumePreview
      hideControls
      pageSize={pageSize}
      showPageBreaks={showPageBreaks}
    />
  </div>
</div>
```

Single wrapper addition. The template selector bar and surrounding chrome remain in dark mode; only the resume document itself gets light-mode variables.

