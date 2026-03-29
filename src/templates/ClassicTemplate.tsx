import { Resume } from '@/schema/resume';
import { LinkedInDisplay } from './LinkedInBadge';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const ClassicTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="text-foreground text-sm leading-relaxed" style={{ fontFamily: "'Times New Roman', 'Source Serif 4', Georgia, serif" }}>
      {profile.name && (
        <div data-section="profile" className={`mb-5 text-center ${sectionClass}`}>
          <h2 className="text-2xl font-bold tracking-wide uppercase">{profile.name}</h2>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1.5">
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>|</span>}
            {profile.phone && <span>{profile.phone}</span>}
            {profile.location && <span>|</span>}
            {profile.location && <span>{profile.location}</span>}
            {profile.linkedin && <span>|</span>}
            <LinkedInDisplay profile={profile} />
            {profile.links?.filter(link => !(profile.linkedin && link.label?.toLowerCase() === 'linkedin')).map((link) => (
              <><span key={`sep-${link.id}`}>|</span><a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">{link.label}</a></>
            ))}
          </div>
          <div className="border-b-2 border-foreground mt-3" />
        </div>
      )}

      {summary && (
        <div data-section="summary" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-bold uppercase text-center mb-1.5 border-b border-muted-foreground/30 pb-0.5">Objective</h3>
          <p className="text-muted-foreground leading-relaxed text-center">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div data-section="experience" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-bold uppercase text-center mb-2 border-b border-muted-foreground/30 pb-0.5">Professional Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-pdf-section>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{exp.role}</span>
                    {exp.company && (exp.companyUrl ? (
                      <><span className="text-muted-foreground">, </span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">{exp.company}</a></>
                    ) : (
                      <span className="text-muted-foreground">, {exp.company}</span>
                    ))}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-4 italic">
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                    </span>
                  )}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-muted-foreground pl-4">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="list-disc">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div data-section="education" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-bold uppercase text-center mb-2 border-b border-muted-foreground/30 pb-0.5">Education</h3>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} data-pdf-section>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{edu.institution}</span>
                    {(edu.degree || edu.field) && (
                      <span className="text-muted-foreground">, {[edu.degree, edu.field].filter(Boolean).join(' in ')}</span>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-4 italic">
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
        <div data-section="skills" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-bold uppercase text-center mb-2 border-b border-muted-foreground/30 pb-0.5">Skills</h3>
          <div className="space-y-1">
            {skills.map((cat) => (
              <div key={cat.id} data-pdf-section className="text-xs">
                {cat.category && <span className="font-bold">{cat.category}: </span>}
                <span className="text-muted-foreground">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div data-section="projects" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-bold uppercase text-center mb-2 border-b border-muted-foreground/30 pb-0.5">Projects</h3>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} data-pdf-section>
                <span className="font-bold">{proj.name}</span>
                {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline ml-2">{proj.url.replace(/^https?:\/\//, '')}</a>}
                {proj.description && <span className="text-muted-foreground"> — {proj.description}</span>}
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
        <div data-section="certifications" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-bold uppercase text-center mb-2 border-b border-muted-foreground/30 pb-0.5">Certifications</h3>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} data-pdf-section className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{cert.name}</span>
                {cert.issuer && <span>, {cert.issuer}</span>}
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

export default ClassicTemplate;
