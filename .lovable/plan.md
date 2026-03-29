

## Remove Skill % Fields & Fix Experience Timeline Alignment

### Changes

**1. `src/editor/ResumeEditor.tsx`** — Remove the proficiency % input
- Remove the `<Input type="number">` for level and the `%` label from each skill row (lines 507-516)
- Keep the skill name input and delete button
- In `addSkill`, stop setting `level: 75` — just add `{ name: '' }`

**2. `src/templates/InfographicTemplate.tsx`** — Remove donut charts from skill badges
- Remove the SVG donut circle rendering (lines 64-81)
- Keep the badge pill styling, just show the skill name text inside `bg-secondary rounded-full` badges

**3. `src/templates/InfographicTemplate.tsx`** — Fix experience timeline vertical line alignment
- The circle dots are `w-2.5 h-2.5` (10px) positioned at `left: -14px`, `top: 1.5` (6px)
- The vertical line is at `left: 1.5` (6px from the `pl-5` container edge)
- To center the line through the dots: the dot center is at `-14px + 5px = -9px` from content edge, which is `20px - 9px = 11px` from the `pl-5` container's left edge
- Adjust the vertical line `left` value and the dot `left` value so they share the same horizontal center. Set vertical line to `left: [6px]` (matching dot center) with `w-0.5`, and adjust dot positioning accordingly

Concrete fix: set the vertical line to `left-[6px]` and dot to `-left-[14px]` with `top-[5px]` — or more precisely, calculate so the 2px-wide line center (left + 1px) equals the dot center (dot-left + 5px). Current: line center = 6px+1px = 7px, dot center = 20px-14px+5px = 11px. Fix: move line to `left-[10px]` so line center = 11px, matching dot center.

### Files
1. `src/editor/ResumeEditor.tsx`
2. `src/templates/InfographicTemplate.tsx`

