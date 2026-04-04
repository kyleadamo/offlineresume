

## Add Lucide Section Icons to Creative Template

### Change — `src/templates/CreativeTemplate.tsx`

Import the same `sectionIcons` map and Lucide icons used in the Infographic template. Add each icon inside the purple section heading badge, before the label text.

**Imports to add:**
```ts
import { Zap, Briefcase, GraduationCap, Rocket, Users, Award, Globe, Trophy, Heart, BookOpen, Handshake, FileCheck, Sparkles } from 'lucide-react';
```

**Icon map** (same as Infographic):
```ts
const sectionIcons: Record<string, React.ReactNode> = {
  Skills: <Zap className="w-3 h-3" />,
  Experience: <Briefcase className="w-3 h-3" />,
  Education: <GraduationCap className="w-3 h-3" />,
  Projects: <Rocket className="w-3 h-3" />,
  References: <Users className="w-3 h-3" />,
  Certifications: <Award className="w-3 h-3" />,
  Languages: <Globe className="w-3 h-3" />,
  Awards: <Trophy className="w-3 h-3" />,
  Volunteer: <Heart className="w-3 h-3" />,
  Publications: <BookOpen className="w-3 h-3" />,
  Affiliations: <Handshake className="w-3 h-3" />,
  Patents: <FileCheck className="w-3 h-3" />,
  Interests: <Sparkles className="w-3 h-3" />,
};
```

**Update all `<h3>` section headings** (Experience, Education, Skills, Projects, References) to include the icon before the label. Add `flex items-center gap-1.5` to the heading and render the icon inline. The icon inherits `text-accent-foreground` (same as the label text) via `currentColor`.

Example before:
```tsx
<h3 className="... text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>Experience</h3>
```

After:
```tsx
<h3 className="... text-accent-foreground inline-flex items-center gap-1.5" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>
  {sectionIcons['Experience']}<span>Experience</span>
</h3>
```

**Update `renderHeading` callback** (line 23) for new/custom sections to also include the icon lookup with fallback to `Sparkles`.

### Files
1. `src/templates/CreativeTemplate.tsx`

