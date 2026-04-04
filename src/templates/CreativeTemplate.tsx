import { Resume } from '@/schema/resume';
import { LinkedInDisplay, WebsiteDisplay } from './LinkedInBadge';
import { getVisibleSections } from './useSectionOrder';
import { createNewSectionRenderers } from './newSectionRenderers';
import { Zap, Briefcase, GraduationCap, Rocket, Users, Award, Globe, Trophy, Heart, BookOpen, Handshake, FileCheck, Sparkles } from 'lucide-react';

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

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const CreativeTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience: allExp, education: allEdu, skills: allSkills, projects: allProj, references = [] } = resume;
  const experience = allExp.filter(e => !e.hidden);
  const education = allEdu.filter(e => !e.hidden);
  const skills = allSkills.filter(e => !e.hidden);
  const projects = allProj.filter(e => !e.hidden);
  const visibleSections = getVisibleSections(resume);

  const newRenderers = createNewSectionRenderers(resume, {
    sectionClass,
    headingClass: '',
    renderHeading: (label) => <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 py-1 rounded inline-flex items-center gap-1.5 text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>{sectionIcons[label] ?? <Sparkles className="w-3 h-3" />}<span>{label}</span></h3>,
    tagClass: "text-xs px-2 py-0.5 rounded-full border" + " " + "border-[hsl(243,75%,80%)] text-[hsl(243,75%,45%)]",
    textClass: "text-foreground",
    subTextClass: "text-muted-foreground",
    linkClass: "hover:text-foreground underline text-[hsl(243,75%,59%)]",
  });

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () => summary ? (
      <div key="summary" data-section="summary" className={`mb-6 ${sectionClass}`}>
        <div className="flex">
          <div className="w-1 rounded-full shrink-0 mr-3" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }} />
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </div>
    ) : null,
    experience: () => experience.length > 0 ? (
      <div key="experience" data-section="experience" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 py-1 rounded inline-flex items-center gap-1.5 text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>{sectionIcons['Experience']}<span>Experience</span></h3>
        <div className="space-y-4 mt-2">
          {experience.map((exp) => (
            <div key={exp.id} data-pdf-section className="border-l-2 pl-3" style={{ borderColor: 'hsl(243, 75%, 85%)' }}>
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <div>
                  <span className="font-semibold">{exp.role}</span>
                  {exp.company && (exp.companyUrl ? (
                    <><span className="text-muted-foreground"> @ </span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline" style={{ color: 'hsl(243, 75%, 59%)' }}>{exp.company}</a></>
                  ) : (
                    <span className="text-muted-foreground"> @ {exp.company}</span>
                  ))}
                </div>
                {(exp.startDate || exp.endDate) && <span className="text-xs text-muted-foreground shrink-0">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>}
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1.5 space-y-0.5 text-muted-foreground">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-2"><span className="shrink-0 mt-0.5" style={{ color: 'hsl(243, 75%, 59%)' }}>▸</span><span>{b}</span></li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    education: () => education.length > 0 ? (
      <div key="education" data-section="education" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 py-1 rounded inline-flex items-center gap-1.5 text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>{sectionIcons['Education']}<span>Education</span></h3>
        <div className="space-y-3 mt-2">
          {education.map((edu) => (
            <div key={edu.id} data-pdf-section className="border-l-2 pl-3" style={{ borderColor: 'hsl(243, 75%, 85%)' }}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold">{edu.institution}</span>
                  {(edu.degree || edu.field) && <span className="text-muted-foreground"> — {[edu.degree, edu.field].filter(Boolean).join(', ')}</span>}
                </div>
                {(edu.startDate || edu.endDate) && <span className="text-xs text-muted-foreground shrink-0 ml-4">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,
    skills: () => skills.length > 0 ? (
      <div key="skills" data-section="skills" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 py-1 rounded inline-flex items-center gap-1.5 text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>{sectionIcons['Skills']}<span>Skills</span></h3>
        <div className="space-y-2 mt-2">
          {skills.map((cat) => (
            <div key={cat.id} data-pdf-section>
              {cat.category && <span className="text-xs font-medium text-muted-foreground block mb-1">{cat.category}</span>}
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((rawSkill, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: 'hsl(243, 75%, 80%)', color: 'hsl(243, 75%, 45%)' }}>
                    {typeof rawSkill === 'string' ? rawSkill : rawSkill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,
    projects: () => projects.length > 0 ? (
      <div key="projects" data-section="projects" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 py-1 rounded inline-flex items-center gap-1.5 text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>{sectionIcons['Projects']}<span>Projects</span></h3>
        <div className="space-y-3 mt-2">
          {projects.map((proj) => (
            <div key={proj.id} data-pdf-section className="border-l-2 pl-3" style={{ borderColor: 'hsl(243, 75%, 85%)' }}>
              <span className="font-semibold">{proj.name}</span>
              {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline ml-2">{proj.url.replace(/^https?:\/\//, '')}</a>}
              {proj.description && <p className="text-muted-foreground text-xs mt-0.5">{proj.description}</p>}
              {proj.highlights && proj.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-1 text-xs text-muted-foreground space-y-0.5">
                  {proj.highlights.filter(Boolean).map((h, i) => <li key={i} className="flex gap-2"><span className="shrink-0 mt-0.5">•</span><span>{h}</span></li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    references: () => references.length > 0 ? (
      <div key="references" data-section="references" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 px-2 py-1 rounded inline-flex items-center gap-1.5 text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>{sectionIcons['References']}<span>References</span></h3>
        <div className="space-y-3 mt-2">
          {references.map((ref) => (
            <div key={ref.id} data-pdf-section className="border rounded-lg p-3" style={{ borderColor: 'hsl(243, 75%, 80%)' }}>
              <div className="flex items-start gap-3">
                {ref.photo && <img src={ref.photo} alt={ref.name} className="w-10 h-10 rounded-full object-cover shrink-0" />}
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{ref.name}</div>
                  {(ref.title || ref.company) && (
                    <div className="text-xs text-muted-foreground mt-0.5">{[ref.title, ref.company].filter(Boolean).join(' @ ')}</div>
                  )}
                  {ref.email && <div className="text-xs mt-1" style={{ color: 'hsl(243, 75%, 59%)' }}>{ref.email}</div>}
                  {ref.phone && <div className="text-xs text-muted-foreground">{ref.phone}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,
    ...newRenderers,
  };

  return (
    <div className="font-sans text-foreground text-sm leading-relaxed">
      {profile.name && (
        <div data-section="profile" className={`mb-6 ${sectionClass}`}>
          <div className="flex items-center gap-4">
            {profile.photo && <img src={profile.photo} alt={profile.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{profile.name}</h2>
              {resume.targetRole && <p className="text-sm font-medium mt-0.5" style={{ color: 'hsl(243, 75%, 59%)' }}>{resume.targetRole}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3 pl-1">
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>{profile.phone}</span>}
            {profile.location && <span>{profile.location}</span>}
            <LinkedInDisplay profile={profile} />
            <WebsiteDisplay profile={profile} />
            {profile.links?.filter(link => !(profile.linkedin && link.label?.toLowerCase() === 'linkedin') && !(profile.website && ['website', 'personal site', 'portfolio'].includes(link.label?.toLowerCase()))).map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">{link.label}</a>
            ))}
          </div>
        </div>
      )}

      {visibleSections.map((id) => sectionRenderers[id]?.())}

      {!profile.name && !summary && experience.length === 0 && (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg font-bold">Your resume will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default CreativeTemplate;
