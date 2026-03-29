

## Skill Badges with Donut Charts (Infographic Template)

### Overview
Replace the bar chart skill visualization in the Infographic template with badge-style chips, each containing a small inline SVG donut/radial chart showing the user's self-reported proficiency percentage. The data model changes to support per-skill percentages, with backward compatibility for existing data.

### Data Model — `src/schema/resume.ts`

Change `SkillCategory.skills` from `string[]` to `SkillItem[]`:

```ts
export interface SkillItem {
  name: string;
  level?: number; // 0-100 percentage, optional
}
```

Keep `skills: string[]` support via a migration helper — on load, if an entry is a plain string, convert it to `{ name: str, level: 75 }`.

Update `SkillCategory`:
```ts
export interface SkillCategory {
  id: string;
  category: string;
  skills: (string | SkillItem)[];  // backward compat
  hidden?: boolean;
}
```

Add a normalizer utility: `normalizeSkill(s: string | SkillItem): SkillItem`.

### Editor — `src/editor/ResumeEditor.tsx`

Replace the single comma-separated `<Input>` for skills with a list of individual skill rows. Each row has:
- Text input for skill name
- Number input (0-100) for proficiency level (optional, defaults to 75)
- Delete button per skill
- "Add skill" button at the bottom of each category

The comma-separated input approach is replaced so users can set percentages per skill.

### Infographic Template — `src/templates/InfographicTemplate.tsx`

Replace the bar chart rendering with a flex-wrap badge layout. Each badge contains:
- A small (20×20px) inline SVG donut chart using `stroke-dasharray` / `stroke-dashoffset` on a `<circle>` — no charting library needed
- The skill name text next to it
- Styled as a rounded pill/badge (`bg-secondary rounded-full px-2.5 py-1 inline-flex items-center gap-1.5`)

The donut uses two circles: a background track and a colored arc whose length = `percentage / 100 * circumference`.

### Other 11 Templates

Use `normalizeSkill()` to extract `.name` and render skills the same way they do now (badges/text). The `level` field is simply ignored — no visual change for non-infographic templates.

### Files to change
1. `src/schema/resume.ts` — add `SkillItem` interface, update `SkillCategory`
2. `src/editor/ResumeEditor.tsx` — per-skill row editor with name + level inputs
3. `src/templates/InfographicTemplate.tsx` — donut badge rendering
4. All other 11 templates — use `normalizeSkill()` to safely read `.name`
5. `src/hooks/useResumeStore.ts` — migrate old string[] skills on load

