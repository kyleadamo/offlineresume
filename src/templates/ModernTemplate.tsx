import { Resume } from '@/schema/resume';

interface TemplateProps {
  resume: Resume;
}

const ModernTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience, education, skills } = resume;

  return (
    <div className="font-sans text-foreground text-sm leading-relaxed">
      {/* Header with accent bar */}
      {profile.name && (
        <div className="mb-6">
          <div className="w-12 h-1 bg-accent rounded-full mb-3" />
          <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
          {resume.targetRole && (
            <p className="text-accent font-medium text-sm mt-0.5">{resume.targetRole}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground text-xs mt-2">
            {profile.email && <span className="bg-secondary px-2 py-0.5 rounded">{profile.email}</span>}
            {profile.phone && <span className="bg-secondary px-2 py-0.5 rounded">{profile.phone}</span>}
            {profile.location && <span className="bg-secondary px-2 py-0.5 rounded">{profile.location}</span>}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mb-5 pl-4 border-l-2 border-accent/30">
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="pl-4 border-l border-border">
                <div>
                  <span className="font-semibold">{exp.role}</span>
                  {exp.company && <span className="text-accent font-medium"> @ {exp.company}</span>}
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {exp.startDate}{exp.endDate ? ` → ${exp.endDate}` : ''}
                  </div>
                )}
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 text-muted-foreground">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-accent shrink-0">–</span>
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

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Education</h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="pl-4 border-l border-border">
                <span className="font-semibold">{edu.institution}</span>
                {(edu.degree || edu.field) && (
                  <span className="text-muted-foreground"> · {[edu.degree, edu.field].filter(Boolean).join(', ')}</span>
                )}
                {(edu.startDate || edu.endDate) && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {edu.startDate}{edu.endDate ? ` → ${edu.endDate}` : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills as tags */}
      {skills.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Skills</h3>
          <div className="space-y-2">
            {skills.map((cat) => (
              <div key={cat.id}>
                {cat.category && <span className="text-xs font-medium text-muted-foreground block mb-1">{cat.category}</span>}
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, i) => (
                    <span key={i} className="bg-secondary text-foreground text-xs px-2 py-0.5 rounded">
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
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg">Your resume will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
