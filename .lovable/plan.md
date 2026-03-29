
Diagnosed root cause: the blank cover letter PDF is most likely caused by the global print stylesheet, not the iframe itself.

What I found
- In `src/index.css`, the print rules do this:
  - `body * { visibility: hidden; }`
  - then only `.resume-print-content, .resume-print-content * { visibility: visible; }`
- In `src/preview/CoverLetterPreview.tsx`, the PDF content is injected into:
  - `<div class="cl-print-content">...</div>`
- That means when print mode starts, the entire cover letter document is hidden, because there is no matching print override for `.cl-print-content`.

Why resume works but cover letter is blank
- Resume export uses the class name `resume-print-content`, which the global print CSS explicitly reveals.
- Cover letter export uses a different class name, `cl-print-content`, which stays hidden during printing.
- This fully explains a blank print preview and blank saved PDF even though the DOM content exists.

Implementation plan
1. Update the global print CSS in `src/index.css`
- Extend the existing print visibility rules to also include:
  - `.cl-print-content`
  - `.cl-print-content *`
- Mirror the same positioning rule currently used for `.resume-print-content` so the cover letter print container is also laid out correctly in print.

2. Keep the iframe-based print flow in `src/preview/CoverLetterPreview.tsx`
- The iframe/font-loading approach is not the main blocker based on the current code.
- No structural rewrite is needed first; the visibility mismatch should be fixed before changing the print mechanism again.

3. Optional cleanup for consistency
- Either:
  - keep `cl-print-content` and support both classes in global print CSS, or
  - rename the cover letter print wrapper to `resume-print-content` for shared behavior.
- I’d prefer supporting both class names to keep resume and cover letter semantics explicit.

Technical detail
```text
Current print chain:

global print CSS
  hides: body *
  shows: .resume-print-content only

cover letter iframe HTML
  renders into: .cl-print-content

result
  cover letter remains hidden at print time
```

Files to change
- `src/index.css`
- Possibly no change needed in `src/preview/CoverLetterPreview.tsx` unless we choose to rename the wrapper class for consistency
