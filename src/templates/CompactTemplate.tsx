import { Resume } from '@/schema/resume';
import { LinkedInDisplay, WebsiteDisplay } from './LinkedInBadge';
import { getVisibleSections } from './useSectionOrder';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-1 px-1 py-0.5";

const CompactTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience: allExp, education: allEdu, skills: allSkills, certifications, projects: allProj, references = [] } = resume;
  const experience = allExp.filter(e => !e.hidden);
  const education = allEdu.filter(e => !e.hidden);
  const skills = allSkills.filter(e => !e.hidden);
  const projects = allProj.filter(e => !e.hidden);
  const visibleSections = getVisibleSections(resume);

  // Compact uses a two-column layout: main (summary/experience/education/projects) left, skills right
  const mainSections: Record<string, () => React.ReactNode> = {
    summary: () => summary ? (
      <div key="summary" data-section="summary" className={`mb-3 ${sectionClass}`}>
        <p className="text-muted-foreground leading-snug">{summary}</p>
      </div>
    ) : null,
    experience: () => experience.length > 0 ? (
      <div key="experience" data-section="experience" className={`mb-3 ${sectionClass}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 border-b border-border pb-0.5">Experience</h3>
        <div className="space-y-2.5">
          {experience.map((exp) => (
            <div key={exp.id} data-pdf-section>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-xs">{exp.role}</span>
                  {exp.company && (exp.companyUrl ? (
                    <><span className="text-muted-foreground"> · </span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">{exp.company}</a></>
                  ) : (
                    <span className="text-muted-foreground"> · {exp.company}</span>
                  ))}
                </div>
                {(exp.startDate || exp.endDate) && (
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{exp.startDate}{exp.endDate ? `–${exp.endDate}` : ''}</span>
                )}
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0 text-muted-foreground">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="flex gap-1.5"><span className="shrink-0">•</span><span>{b}</span></li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,
    education: () => education.length > 0 ? (
      <div key="education" data-section="education" className={`mb-3 ${sectionClass}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 border-b border-border pb-0.5">Education</h3>
        <div className="space-y-1.5">
          {education.map((edu) => (
            <div key={edu.id} data-pdf-section>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold">{edu.institution}</span>
                  {(edu.degree || edu.field) && <span className="text-muted-foreground"> · {[edu.degree, edu.field].filter(Boolean).join(', ')}</span>}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,
    projects: () => projects.length > 0 ? (
      <div key="projects" data-section="projects" className={`mb-3 ${sectionClass}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 border-b border-border pb-0.5">Projects</h3>
        <div className="space-y-1.5">
          {projects.map((proj) => (
            <div key={proj.id} data-pdf-section>
              <span className="font-semibold">{proj.name}</span>
              {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline ml-2">{proj.url.replace(/^https?:\/\//, '')}</a>}
              {proj.description && <span className="text-muted-foreground"> — {proj.description}</span>}
              {proj.highlights && proj.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-0.5 text-xs text-muted-foreground list-disc list-inside">
                  {proj.highlights.filter(Boolean).map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,
  };

  const sidebarSections: Record<string, () => React.ReactNode> = {
    skills: () => skills.length > 0 ? (
      <div key="skills" data-section="skills" className={`mb-3 ${sectionClass}`}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 border-b border-border pb-0.5">Skills</h3>
        <div className="space-y-2">
          {skills.map((cat) => (
            <div key={cat.id} data-pdf-section>
              {cat.category && <span className="text-[10px] font-semibold block mb-0.5">{cat.category}</span>}
              <div className="flex flex-wrap gap-1">
                {cat.skills.map((rawSkill, i) => (
                  <span key={i} className="bg-secondary text-foreground text-[10px] px-1.5 py-0.5 rounded">
                    {typeof rawSkill === 'string' ? rawSkill : rawSkill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,
  };

  // Split visible sections into main vs sidebar
  const mainVisible = visibleSections.filter(id => id !== 'skills');
  const showSkills = visibleSections.includes('skills');

  return (
    <div className="font-sans text-foreground text-xs leading-snug">
      {profile.name && (
        <div data-section="profile" className={`mb-4 ${sectionClass}`}>
          <div className="flex items-center gap-3">
            {profile.photo && <img src={profile.photo} alt={profile.name} className="w-10 h-10 rounded-full object-cover shrink-0" />}
            <div className="flex-1">
              <h2 className="text-xl font-bold tracking-tight">{profile.name}</h2>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground text-[11px] mt-0.5">
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
          </div>
        </div>
      )}

      <div className="grid grid-cols-[1fr_0.4fr] gap-x-5">
        <div>
          {mainVisible.map((id) => mainSections[id]?.())}
        </div>
        <div>
          {showSkills && sidebarSections.skills?.()}
          {certifications && certifications.length > 0 && (
            <div data-section="certifications" className={`mb-3 ${sectionClass}`}>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 border-b border-border pb-0.5">Certifications</h3>
              <div className="space-y-1">
                {certifications.map((cert) => (
                  <div key={cert.id} data-pdf-section className="text-[10px] text-muted-foreground">
                    <span className="font-medium text-foreground block">{cert.name}</span>
                    {cert.issuer && <span>{cert.issuer}</span>}
                    {cert.date && <span> · {cert.date}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!profile.name && !summary && experience.length === 0 && (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg">Your resume will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default CompactTemplate;
