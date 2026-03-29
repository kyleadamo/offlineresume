import { Resume } from '@/schema/resume';
import { LinkedInDisplay, WebsiteDisplay } from './LinkedInBadge';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const ProfessionalTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience, education, skills, projects } = resume;

  return (
    <div className="font-serif text-foreground text-sm leading-relaxed">
      {profile.name && (
        <div data-section="profile" className={`text-center mb-6 pb-4 border-b-2 border-foreground ${sectionClass}`}>
          {profile.photo && (
            <img src={profile.photo} alt={profile.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-foreground" />
          )}
          <h2 className="text-3xl font-semibold tracking-tight font-serif">{profile.name}</h2>
          {resume.targetRole && (
            <p className="text-muted-foreground font-sans text-sm mt-1">{resume.targetRole}</p>
          )}
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs mt-2 font-sans">
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>{profile.phone}</span>}
            {profile.location && <span>{profile.location}</span>}
            <LinkedInDisplay profile={profile} />
            <WebsiteDisplay profile={profile} />
          </div>
        </div>
      )}

      {summary && (
        <div data-section="summary" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 font-sans">Professional Summary</h3>
          <p className="text-muted-foreground leading-relaxed font-sans text-sm">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div data-section="experience" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 font-sans border-b border-border pb-1">Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-pdf-section>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold font-sans">{exp.role}</span>
                    {exp.company && (exp.companyUrl ? (
                      <><span className="text-muted-foreground font-sans"> | </span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground font-sans hover:text-foreground underline">{exp.company}</a></>
                    ) : (
                      <span className="text-muted-foreground font-sans"> | {exp.company}</span>
                    ))}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-xs text-muted-foreground font-sans italic shrink-0 ml-4">
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                    </span>
                  )}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 text-muted-foreground font-sans">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0">▸</span>
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
        <div data-section="education" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 font-sans border-b border-border pb-1">Education</h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} data-pdf-section className="flex justify-between items-baseline">
                <div className="font-sans">
                  <span className="font-semibold">{edu.institution}</span>
                  {(edu.degree || edu.field) && (
                    <span className="text-muted-foreground"> — {[edu.degree, edu.field].filter(Boolean).join(', ')}</span>
                  )}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <span className="text-xs text-muted-foreground font-sans italic shrink-0 ml-4">
                    {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div data-section="projects" className={sectionClass}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 font-sans border-b border-border pb-1">Projects</h3>
          <div className="space-y-3 font-sans">
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
      )}

      {skills.length > 0 && (
        <div data-section="skills" className={sectionClass}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 font-sans border-b border-border pb-1">Skills</h3>
          <div className="space-y-2 font-sans">
            {skills.map((cat) => (
              <div key={cat.id} data-pdf-section>
                {cat.category && <span className="text-xs font-medium text-muted-foreground block mb-1">{cat.category}</span>}
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, i) => (
                    <span key={i} className="border border-border text-foreground text-xs px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!profile.name && !summary && experience.length === 0 && (
        <div className="text-center text-muted-foreground py-20 font-sans">
          <p className="text-lg">Your resume will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
