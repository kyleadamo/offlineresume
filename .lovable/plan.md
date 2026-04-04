

## Replace Emoji Icons with Lucide Icons in Infographic Template

### Problem
The Infographic template uses emoji characters (⚡, 💼, 🎓, 🚀, 👤, ✉, ☎, 📍, 🔗, ✦) for section and contact icons. These render inconsistently across platforms. Replace them with proper Lucide React icons.

### Changes

#### 1. `src/templates/InfographicTemplate.tsx`

**Import Lucide icons:**
```ts
import { Zap, Briefcase, GraduationCap, Rocket, Users, Mail, Phone, MapPin, Link, Sparkles } from 'lucide-react';
```

**Replace section heading icons** (the colored `<span>` badges keep their styling, but swap emoji for Lucide component):
- Skills: `⚡` → `<Zap className="w-3 h-3" />`
- Experience: `💼` → `<Briefcase className="w-3 h-3" />`
- Education: `🎓` → `<GraduationCap className="w-3 h-3" />`
- Projects: `🚀` → `<Rocket className="w-3 h-3" />`
- References: `👤` → `<Users className="w-3 h-3" />`

**Replace contact info icons** in the profile area:
- Email: `✉` → `<Mail className="w-3 h-3 inline" />`
- Phone: `☎` → `<Phone className="w-3 h-3 inline" />`
- Location: `📍` → `<MapPin className="w-3 h-3 inline" />`
- Links: `🔗` → `<Link className="w-3 h-3 inline" />`

#### 2. `src/templates/newSectionRenderers.tsx`

**Update `renderHeading` callback** from InfographicTemplate to accept a Lucide icon. Alternatively, update the `renderHeading` call in InfographicTemplate to pass Lucide icons per section. Since `newSectionRenderers` uses a generic `renderHeading(label)`, we'll update the InfographicTemplate's `renderHeading` to map label names to icons:

```ts
const sectionIcons: Record<string, React.ReactNode> = {
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

The `renderHeading` callback in InfographicTemplate will look up the icon by label and render it inside the colored badge span instead of `✦`.

### Icon Mapping Summary
| Section | Lucide Icon |
|---|---|
| Skills | `Zap` |
| Experience | `Briefcase` |
| Education | `GraduationCap` |
| Projects | `Rocket` |
| References | `Users` |
| Certifications | `Award` |
| Languages | `Globe` |
| Awards | `Trophy` |
| Volunteer | `Heart` |
| Publications | `BookOpen` |
| Affiliations | `Handshake` |
| Patents | `FileCheck` |
| Interests | `Sparkles` |
| Email | `Mail` |
| Phone | `Phone` |
| Location | `MapPin` |
| Links | `Link` |

### Files
1. `src/templates/InfographicTemplate.tsx` — replace all emoji with Lucide icons

