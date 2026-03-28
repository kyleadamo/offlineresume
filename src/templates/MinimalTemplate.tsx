import { Resume } from '@/schema/resume';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const MinimalTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience, education, skills } = resume;

  return (
    <div className="font-sans text-foreground text-sm leading-relaxed">
      {profile.name && (
        <div data-section="profile" className={`mb-6 ${sectionClass}`}>
          <div className="flex items-center gap-4">
            {profile.photo && (
              <img src={profile.photo} alt={profile.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
            )}
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{profile.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs mt-1.5">
                {profile.email && <span>{profile.email}</span>}
                {profile.phone && <span>{profile.phone}</span>}
                {profile.location && <span>{profile.location}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div data-section="summary" className={`mb-5 ${sectionClass}`}>
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div data-section="experience" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 border-b border-border pb-1">Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium">{exp.role}</span>
                    {exp.company && <span className="text-muted-foreground"> · {exp.company}</span>}
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

      {education.length > 0 && (
        <div data-section="education" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 border-b border-border pb-1">Education</h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium">{edu.institution}</span>
                    {(edu.degree || edu.field) && (
                      <span className="text-muted-foreground"> · {[edu.degree, edu.field].filter(Boolean).join(', ')}</span>
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
        <div data-section="skills" className={sectionClass}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 border-b border-border pb-1">Skills</h3>
          <div className="space-y-1.5">
            {skills.map((cat) => (
              <div key={cat.id} className="flex gap-2">
                {cat.category && <span className="font-medium shrink-0">{cat.category}:</span>}
                <span className="text-muted-foreground">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!profile.name && !summary && experience.length === 0 && (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg">Your resume will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
