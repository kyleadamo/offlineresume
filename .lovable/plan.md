

## Fix Blank Cover Letter PDF

### Problem
The cover letter PDF download opens a blank print preview. The root cause is twofold:
1. The Google Fonts `@import` inside the `<style>` block likely doesn't load within the 500ms timeout before `print()` fires, causing text to be invisible
2. The popup window approach may face sandbox restrictions in the preview iframe

### Solution
Replace the popup-window print approach with the same proven pattern used for resume PDF — write the content into a hidden iframe instead of `window.open`, and wait for fonts to load before printing.

### Changes — `src/preview/CoverLetterPreview.tsx`

1. **Add a `<link>` tag for the font** instead of `@import` inside a style block — `<link>` tags are fetched eagerly and can be waited on
2. **Use a hidden iframe** instead of `window.open` to avoid popup blockers in sandboxed contexts
3. **Wait for the font to load** using the iframe's `onload` event plus `document.fonts.ready` before calling `print()`
4. **Add a fallback font stack** so content is always visible even if the web font fails

Single file change. The fix mirrors how the resume PDF already works but adds proper font-loading handling.

