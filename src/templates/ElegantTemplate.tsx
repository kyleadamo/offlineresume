import { Resume } from '@/schema/resume';
import { LinkedInDisplay, WebsiteDisplay } from './LinkedInBadge';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const ElegantTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="font-sans text-foreground text-sm leading-relaxed" style={{ letterSpacing: '0.01em' }}>
      {profile.name && (
        <div data-section="profile" className={`mb-8 ${sectionClass}`}>
          <div className="flex items-center gap-5">
            {profile.photo && (
              <img src={profile.photo} alt={profile.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
            )}
            <div>
              <h2 className="text-2xl font-light tracking-wide uppercase">{profile.name}</h2>
              {resume.targetRole && (
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{resume.targetRole}</p>
              )}
            </div>
          </div>
          <div className="border-b border-border mt-4" />
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground mt-3">
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

      {summary && (
        <div data-section="summary" className={`mb-7 ${sectionClass}`}>
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div data-section="experience" className={`mb-7 ${sectionClass}`}>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">Experience</h3>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} data-pdf-section>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium">{exp.role}</span>
                    {exp.company && (exp.companyUrl ? (
                      <><span className="text-muted-foreground mx-1.5">—</span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">{exp.company}</a></>
                    ) : (
                      <><span className="text-muted-foreground mx-1.5">—</span><span className="text-muted-foreground">{exp.company}</span></>
                    ))}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                    </span>
                  )}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 mt-0.5 text-xs">◦</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div data-section="education" className={`mb-7 ${sectionClass}`}>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">Education</h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} data-pdf-section>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium">{edu.institution}</span>
                    {(edu.degree || edu.field) && (
                      <><span className="text-muted-foreground mx-1.5">—</span><span className="text-muted-foreground">{[edu.degree, edu.field].filter(Boolean).join(', ')}</span></>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div data-section="skills" className={`mb-7 ${sectionClass}`}>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">Skills</h3>
          <div className="space-y-2">
            {skills.map((cat) => (
              <div key={cat.id} data-pdf-section>
                {cat.category && <span className="text-xs font-medium text-foreground">{cat.category}: </span>}
                <span className="text-xs text-muted-foreground">{cat.skills.join(' · ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div data-section="projects" className={`mb-7 ${sectionClass}`}>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">Projects</h3>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} data-pdf-section>
                <span className="font-medium">{proj.name}</span>
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
      )}

      {certifications && certifications.length > 0 && (
        <div data-section="certifications" className={`mb-7 ${sectionClass}`}>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">Certifications</h3>
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
          <p className="text-lg font-light tracking-wide">Your resume will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default ElegantTemplate;
