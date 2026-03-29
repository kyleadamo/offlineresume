import { Resume } from '@/schema/resume';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const AcademicTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="text-foreground text-sm leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
      {profile.name && (
        <div data-section="profile" className={`mb-6 text-center ${sectionClass}`}>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Curriculum Vitae</p>
          <h2 className="text-3xl font-semibold tracking-tight">{profile.name}</h2>
          {resume.targetRole && (
            <p className="text-sm text-muted-foreground mt-1">{resume.targetRole}</p>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3">
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>{profile.phone}</span>}
            {profile.location && <span>{profile.location}</span>}
            {profile.links?.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">{link.label}</a>
            ))}
          </div>
          <div className="border-b border-foreground mt-4" />
        </div>
      )}

      {summary && (
        <div data-section="summary" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-sm font-semibold mb-2">Research Interests</h3>
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      )}

      {education.length > 0 && (
        <div data-section="education" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-sm font-semibold mb-3 pb-1 border-b border-border">Education</h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} data-pdf-section>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium">{edu.institution}</span>
                    {(edu.degree || edu.field) && (
                      <div className="text-muted-foreground text-xs mt-0.5">{[edu.degree, edu.field].filter(Boolean).join(' in ')}</div>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                    </span>
                  )}
                </div>
                {edu.description && <p className="text-xs text-muted-foreground mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div data-section="experience" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-sm font-semibold mb-3 pb-1 border-b border-border">Academic & Professional Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-pdf-section>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium">{exp.role}</span>
                    {exp.company && (exp.companyUrl ? (
                      <><span className="text-muted-foreground">, </span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">{exp.company}</a></>
                    ) : (
                      <span className="text-muted-foreground">, {exp.company}</span>
                    ))}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                    </span>
                  )}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 text-muted-foreground">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 mt-0.5">•</span>
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

      {projects && projects.length > 0 && (
        <div data-section="projects" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-sm font-semibold mb-3 pb-1 border-b border-border">Publications & Projects</h3>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} data-pdf-section>
                <span className="font-medium">{proj.name}</span>
                {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline ml-2">[link]</a>}
                {proj.description && <p className="text-muted-foreground text-xs mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div data-section="skills" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-sm font-semibold mb-3 pb-1 border-b border-border">Skills</h3>
          <div className="space-y-1.5">
            {skills.map((cat) => (
              <div key={cat.id} data-pdf-section className="text-xs">
                {cat.category && <span className="font-medium">{cat.category}: </span>}
                <span className="text-muted-foreground">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div data-section="certifications" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-sm font-semibold mb-3 pb-1 border-b border-border">Awards & Certifications</h3>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} data-pdf-section className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{cert.name}</span>
                {cert.issuer && <span>, {cert.issuer}</span>}
                {cert.date && <span> ({cert.date})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {!profile.name && !summary && experience.length === 0 && (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg font-semibold">Your CV will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default AcademicTemplate;
