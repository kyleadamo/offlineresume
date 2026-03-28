

## Add Target Role Editor Field

**Problem:** The `targetRole` field displays below the name in preview templates but has no corresponding input in the editor.

**Change:** Add a "Target Role" input to the `ProfileEditor` section in `src/editor/ResumeEditor.tsx`, right below the name field.

**Details:**
- Add an `Input` with placeholder "Target role (e.g., Senior Software Engineer)" after the name/photo row
- Wire it to `update({ targetRole: e.target.value })` directly on the resume (it's a top-level field, not nested under `profile`)

Single file change: `src/editor/ResumeEditor.tsx`

