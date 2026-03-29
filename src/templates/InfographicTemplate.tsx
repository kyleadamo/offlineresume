import { Resume, normalizeSkill } from '@/schema/resume';
import { LinkedInDisplay, WebsiteDisplay } from './LinkedInBadge';
import { getVisibleSections } from './useSectionOrder';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const InfographicTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience: allExp, education: allEdu, skills: allSkills, certifications, projects: allProj, references = [] } = resume;
  const experience = allExp.filter(e => !e.hidden);
  const education = allEdu.filter(e => !e.hidden);
  const skills = allSkills.filter(e => !e.hidden);
  const projects = allProj.filter(e => !e.hidden);
  const visibleSections = getVisibleSections(resume);

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () => summary ? (
      <div key="summary" data-section="summary" className={`mb-6 ${sectionClass}`}>
        <p className="text-muted-foreground leading-relaxed">{summary}</p>
      </div>
    ) : null,
    skills: () => skills.length > 0 ? (
      <div key="skills" data-section="skills" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>⚡</span>
          Skills
        </h3>
        <div className="space-y-3">
          {skills.map((cat) => (
            <div key={cat.id} data-pdf-section>
              {cat.category && <span className="text-xs font-semibold block mb-1.5">{cat.category}</span>}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((rawSkill, i) => {
                  const skill = normalizeSkill(rawSkill);
                  return (
                    <span key={i} className="bg-secondary rounded-full px-2.5 py-1 text-xs">{skill.name}</span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,
    experience: () => experience.length > 0 ? (
      <div key="experience" data-section="experience" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-accent-foreground" style={{ backgroundColor: 'hsl(142, 72%, 29%)' }}>💼</span>
          Experience
        </h3>
        <div className="relative pl-5">
          <div className="absolute left-[10px] top-0 bottom-0 w-0.5 rounded" style={{ backgroundColor: 'hsl(243, 75%, 85%)' }} />
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-pdf-section className="relative">
                <div className="absolute -left-[14px] top-[5px] w-2.5 h-2.5 rounded-full border-2 bg-card" style={{ borderColor: 'hsl(243, 75%, 59%)' }} />
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
                  <ul className="mt-1.5 space-y-0.5 text-muted-foreground text-xs">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex gap-2"><span className="shrink-0 mt-0.5">•</span><span>{b}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : null,
    education: () => education.length > 0 ? (
      <div key="education" data-section="education" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-accent-foreground" style={{ backgroundColor: 'hsl(32, 91%, 37%)' }}>🎓</span>
          Education
        </h3>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} data-pdf-section>
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
    projects: () => projects.length > 0 ? (
      <div key="projects" data-section="projects" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>🚀</span>
          Projects
        </h3>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} data-pdf-section>
              <span className="font-semibold">{proj.name}</span>
              {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline ml-2">{proj.url.replace(/^https?:\/\//, '')}</a>}
              {proj.description && <p className="text-muted-foreground text-xs mt-0.5">{proj.description}</p>}
              {proj.highlights && proj.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-1 text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                  {proj.highlights.filter(Boolean).map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    references: () => references.length > 0 ? (
      <div key="references" data-section="references" className={`mb-6 ${sectionClass}`}>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-accent-foreground" style={{ backgroundColor: 'hsl(243, 75%, 59%)' }}>👤</span>
          References
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {references.map((ref) => (
            <div key={ref.id} data-pdf-section className="rounded-lg border border-border p-3 flex items-start gap-3">
              {ref.photo && <img src={ref.photo} alt={ref.name} className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-accent" />}
              <div className="min-w-0">
                <div className="font-semibold text-sm">{ref.name}</div>
                {(ref.title || ref.company) && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {[ref.title, ref.company].filter(Boolean).join(' · ')}
                  </div>
                )}
                {ref.email && <div className="text-xs mt-1" style={{ color: 'hsl(243, 75%, 59%)' }}>{ref.email}</div>}
                {ref.phone && <div className="text-xs text-muted-foreground">{ref.phone}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,
  };

  return (
    <div className="font-sans text-foreground text-sm leading-relaxed">
      {profile.name && (
        <div data-section="profile" className={`mb-6 ${sectionClass}`}>
          <div className="flex items-center gap-4">
            {profile.photo && <img src={profile.photo} alt={profile.name} className="w-16 h-16 rounded-full object-cover shrink-0 ring-4 ring-accent" />}
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{profile.name}</h2>
              {resume.targetRole && <p className="text-sm font-medium mt-0.5" style={{ color: 'hsl(243, 75%, 59%)' }}>{resume.targetRole}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
            {profile.email && <span>✉ {profile.email}</span>}
            {profile.phone && <span>☎ {profile.phone}</span>}
            {profile.location && <span>📍 {profile.location}</span>}
            <LinkedInDisplay profile={profile} />
            <WebsiteDisplay profile={profile} />
            {profile.links?.filter(link => !(profile.linkedin && link.label?.toLowerCase() === 'linkedin') && !(profile.website && ['website', 'personal site', 'portfolio'].includes(link.label?.toLowerCase()))).map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">🔗 {link.label}</a>
            ))}
          </div>
        </div>
      )}

      {visibleSections.map((id) => sectionRenderers[id]?.())}

      {certifications && certifications.length > 0 && (
        <div data-section="certifications" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-accent-foreground" style={{ backgroundColor: 'hsl(142, 72%, 29%)' }}>🏆</span>
            Certifications
          </h3>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} data-pdf-section className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{cert.name}</span>
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.date && <span> ({cert.date})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {!profile.name && !summary && experience.length === 0 && (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg font-bold">Your resume will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default InfographicTemplate;
