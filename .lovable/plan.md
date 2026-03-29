

## Make Contact Info a Multiline Markdown Field

### Changes

**`src/editor/CoverLetterEditor.tsx`**
- Replace the `<Input>` for `senderContact` with a `<Textarea>` (already imported)
- Set `rows={3}` and update placeholder to show multiline example (e.g. `"jane@example.com\n(555) 123-4567\n123 Main St, City"`)

**`src/preview/CoverLetterPreview.tsx`**
- In the sender info block, split `senderContact` by newlines and render each line as a separate `<div>`, each processed through `renderInlineMarkdown`

