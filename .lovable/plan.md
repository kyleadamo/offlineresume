

## Show Demo Preview When Contact Name Is Blank

Currently, if any saved resume exists, the landing page shows the most recent one in the preview. The change: also check if the most recent resume's `profile.name` is blank — if so, fall back to demo data for the preview, while still keeping `hasSavedResumes` true so the CTA says "My resumes".

### Changes

**`src/pages/LandingPage.tsx`** — Update the `useEffect` logic (lines 22-57):
- Find the most recent resume as before
- If its `profile.name` is empty/blank, load demo data instead
- `hasSavedResumes` remains unchanged (still `true`), so the header CTA stays "My resumes"

```typescript
useEffect(() => {
  const shouldShowDemo = !hasSavedResumes || 
    (hasSavedResumes && !resumes.some(r => r.profile?.name?.trim()));
    
  if (!shouldShowDemo) {
    const sorted = [...resumes].sort(
      (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
    );
    const best = sorted.find(r => r.profile?.name?.trim()) || sorted[0];
    setPreviewResume({ ...best });
  } else {
    // Load demo data
    fetch('/demo-resume.json')...
  }
}, [hasSavedResumes, resumes]);
```

This checks if **any** saved resume has a non-blank contact name. If none do, the preview falls back to demo data while the "My resumes" button remains visible.

