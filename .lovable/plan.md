## Style the "Download PDF" button with the teal accent

Update the Download PDF button in `src/pages/BuilderPage.tsx` (line 215) so it uses the teal accent as its default fill, with a darker teal on hover.

### Change

Replace the current `outline` button styling with accent-colored classes:

```tsx
<Button
  variant="outline"
  size={isMobile ? 'icon' : 'sm'}
  onClick={handleDownloadPDF}
  className={`bg-accent text-accent-foreground border-accent hover:bg-teal-600 hover:border-teal-600 hover:text-white ${isMobile ? 'h-9 w-9' : ''}`}
  title="Download PDF"
>
  <Download className="w-4 h-4" />
  <span className="hidden sm:inline">Download PDF</span>
</Button>
```

### Notes

- Default state uses `bg-accent` (the existing teal `#00D4AA` token from `--accent`), keeping the button consistent with other accent UI on the site.
- Hover uses Tailwind's `teal-600` (`#0d9488`), a darker teal that gives a clear pressed/hover feedback.
- Text/icon stay on `accent-foreground` for contrast in both states.
- No other files change; the `Button` component and design tokens stay as-is.