

## Add Personal Website Field to Contact Section

### Changes

**1. `src/schema/resume.ts`** — Add two new fields to `ResumeProfile`:
- `website: string` — the URL
- `websiteDisplayFull: boolean` — toggle icon-only vs icon+URL

Update `createBlankResume` defaults accordingly.

**2. `src/templates/LinkedInBadge.tsx`** — Add a `WebsiteDisplay` export mirroring `LinkedInDisplay`:
- Uses `Globe` icon from lucide-react
- When `websiteDisplayFull` is true: icon + URL text
- When false: icon only
- Same baseline alignment approach (`items-baseline`, `relative top-[0.5px]`)

**3. `src/editor/ResumeEditor.tsx`** — In `ProfileEditor`, add below the LinkedIn field:
- Input for website URL
- When filled, show a Switch toggle for "Show full URL (otherwise icon only)" — same pattern as LinkedIn

**4. All 12 templates** — Add `<WebsiteDisplay profile={profile} />` next to `<LinkedInDisplay>` in the contact info row. Also filter out links labeled "website"/"personal site" when the dedicated field is filled (same dedup pattern as LinkedIn).

