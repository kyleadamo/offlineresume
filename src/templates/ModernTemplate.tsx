import { Resume } from '@/schema/resume';
import { LinkedInDisplay, WebsiteDisplay } from './LinkedInBadge';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const ModernTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience: allExperience, education: allEducation, skills: allSkills, projects: allProjects } = resume;
  const experience = allExperience.filter(e => !e.hidden);
  const education = allEducation.filter(e => !e.hidden);
  const skills = allSkills.filter(e => !e.hidden);
  const projects = allProjects.filter(e => !e.hidden);

  return (
    <div className="font-sans text-foreground text-sm leading-relaxed">
      {profile.name && (
        <div data-section="profile" className={`mb-6 ${sectionClass}`}>
          <div className="flex items-center gap-4">
            {profile.photo && (
              <img src={profile.photo} alt={profile.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
            )}
            <div>
              <div className="w-12 h-1 bg-accent rounded-full mb-3" />
              <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
              {resume.targetRole && (
                <p className="text-accent font-medium text-sm mt-0.5">{resume.targetRole}</p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground text-xs mt-2">
                {profile.email && <span className="bg-secondary px-2 py-0.5 rounded">{profile.email}</span>}
                {profile.phone && <span className="bg-secondary px-2 py-0.5 rounded">{profile.phone}</span>}
                {profile.location && <span className="bg-secondary px-2 py-0.5 rounded">{profile.location}</span>}
                <LinkedInDisplay profile={profile} className="inline-flex items-center gap-1 bg-secondary px-2 py-0.5 rounded hover:underline" />
                <WebsiteDisplay profile={profile} className="inline-flex items-center gap-1 bg-secondary px-2 py-0.5 rounded hover:underline" />
              </div>
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div data-section="summary" className={`mb-5 ${sectionClass}`}>
          <div className="pl-4 border-l-2 border-accent/30">
            <p className="text-muted-foreground leading-relaxed">{summary}</p>
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div data-section="experience" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-pdf-section className="pl-4 border-l border-border">
                <div>
                  <span className="font-semibold">{exp.role}</span>
                  {exp.company && (exp.companyUrl ? (
                    <><span className="text-accent font-medium"> @ </span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-accent font-medium hover:underline">{exp.company}</a></>
                  ) : (
                    <span className="text-accent font-medium"> @ {exp.company}</span>
                  ))}
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

      {education.length > 0 && (
        <div data-section="education" className={`mb-5 ${sectionClass}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Education</h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} data-pdf-section className="pl-4 border-l border-border">
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

      {projects && projects.length > 0 && (
        <div data-section="projects" className={sectionClass}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Projects</h3>
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
      )}

      {skills.length > 0 && (
        <div data-section="skills" className={sectionClass}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Skills</h3>
          <div className="space-y-2">
            {skills.map((cat) => (
              <div key={cat.id} data-pdf-section>
                {cat.category && <span className="text-xs font-medium text-muted-foreground block mb-1">{cat.category}</span>}
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((rawSkill, i) => (
                    <span key={i} className="bg-secondary text-foreground text-xs px-2 py-0.5 rounded">
                      {typeof rawSkill === 'string' ? rawSkill : rawSkill.name}
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
