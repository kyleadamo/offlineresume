

## Fix Editor Scroll & Replace Full Page with Download PDF + Options Menu

### 1. Fix editor pane scrolling

**`src/pages/BuilderPage.tsx`** — The editor `ResizablePanel` has `overflow-y-auto` but the parent `ResizablePanelGroup` needs `overflow-hidden` on its container to constrain height. The `flex-1` on the panel group isn't creating a bounded height context.

- Change `ResizablePanelGroup` className from `"flex-1"` to `"flex-1 overflow-hidden"` so both child panels get a bounded height and their individual overflow settings work.

### 2. Replace Full Page button with Download PDF + options menu

**`src/preview/ResumePreview.tsx`**:
- Remove `FullPagePreview` import, `fullPageOpen` state, and the `<FullPagePreview>` component usage
- Remove `Maximize2` icon import
- Add imports: `Download`, `MoreVertical` from lucide-react; `DropdownMenu` components; `Select` components; `Checkbox`; `Label`
- Add state for `pageSize` (default `'letter'`), `showPageBreaks`, `pageBreakLines`
- Move the PDF download logic (from `FullPagePreview.tsx`) into this component, using a `printRef` on the paper div
- Add page break calculation logic (from `FullPagePreview.tsx`) tied to the paper div
- Replace the "Full Page" button area with:
  - **Download PDF** button (calls the print-based PDF export)
  - **Vertical 3-dot menu** (DropdownMenu) containing:
    - Paper Size selector (A4 / US Letter)
    - Show Page Breaks toggle checkbox
- Render page break indicator lines on the paper div when enabled

### 3. Clean up

- `FullPagePreview.tsx` can remain in the codebase (unused) or be deleted. Will delete it to keep things clean.

### Technical details

The PDF download reuses the same `window.open` + `window.print()` approach from FullPagePreview, with the page size and email footer. The paper div width adjusts based on the selected page size. Page break lines are calculated using `ResizeObserver` on the paper div.

