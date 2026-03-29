import { Resume } from '@/schema/resume';
import { LinkedInDisplay } from './LinkedInBadge';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 -mx-2 px-2 py-0.5";

const TechTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience, education, skills, certifications, projects } = resume;

  return (
    <div className="font-mono text-foreground text-sm leading-relaxed">
      {profile.name && (
        <div data-section="profile" className={`mb-6 ${sectionClass}`}>
          <div className="flex items-center gap-4">
            {profile.photo && (
              <img src={profile.photo} alt={profile.name} className="w-14 h-14 rounded object-cover shrink-0 border border-border" />
            )}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
              {resume.targetRole && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="text-green-600">$</span> {resume.targetRole}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 bg-secondary/50 rounded px-3 py-1.5">
            {profile.email && <span>{profile.email}</span>}
            {profile.phone && <span>{profile.phone}</span>}
            {profile.location && <span>{profile.location}</span>}
            <LinkedInDisplay profile={profile} />
            {profile.links?.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">{link.label}</a>
            ))}
          </div>
        </div>
      )}

      {summary && (
        <div data-section="summary" className={`mb-6 ${sectionClass}`}>
          <div className="bg-secondary/50 rounded px-3 py-2">
            <p className="text-muted-foreground leading-relaxed text-xs">
              <span className="text-green-600 font-bold">/* </span>{summary}<span className="text-green-600 font-bold"> */</span>
            </p>
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div data-section="experience" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 bg-foreground text-background inline-block px-2 py-0.5 rounded">
            experience
          </h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} data-pdf-section>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <div>
                    <span className="font-bold">{exp.role}</span>
                    {exp.company && (exp.companyUrl ? (
                      <><span className="text-muted-foreground"> | </span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">{exp.company}</a></>
                    ) : (
                      <span className="text-muted-foreground"> | {exp.company}</span>
                    ))}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {exp.startDate}{exp.endDate ? ` → ${exp.endDate}` : ''}
                    </span>
                  )}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 text-muted-foreground text-xs">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 text-green-600 font-bold">&gt;</span>
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
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 bg-foreground text-background inline-block px-2 py-0.5 rounded">
            projects
          </h3>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} data-pdf-section>
                <span className="font-bold">{proj.name}</span>
                {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline ml-2">{proj.url}</a>}
                {proj.description && <p className="text-muted-foreground text-xs mt-0.5">{proj.description}</p>}
                {proj.highlights && proj.highlights.filter(Boolean).length > 0 && (
                  <ul className="mt-1 text-xs text-muted-foreground space-y-0">
                    {proj.highlights.filter(Boolean).map((h, i) => (
                      <li key={i} className="flex gap-2"><span className="text-green-600 font-bold">&gt;</span><span>{h}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div data-section="skills" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 bg-foreground text-background inline-block px-2 py-0.5 rounded">
            skills
          </h3>
          <div className="space-y-2">
            {skills.map((cat) => (
              <div key={cat.id} data-pdf-section>
                {cat.category && <span className="text-[10px] font-bold uppercase block mb-1">{cat.category}</span>}
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, i) => (
                    <span key={i} className="bg-secondary text-foreground text-[11px] px-2 py-0.5 rounded border border-border font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div data-section="education" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 bg-foreground text-background inline-block px-2 py-0.5 rounded">
            education
          </h3>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} data-pdf-section>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{edu.institution}</span>
                    {(edu.degree || edu.field) && (
                      <span className="text-muted-foreground"> | {[edu.degree, edu.field].filter(Boolean).join(', ')}</span>
                    )}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-4">
                      {edu.startDate}{edu.endDate ? ` → ${edu.endDate}` : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div data-section="certifications" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3 bg-foreground text-background inline-block px-2 py-0.5 rounded">
            certifications
          </h3>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} data-pdf-section className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{cert.name}</span>
                {cert.issuer && <span> | {cert.issuer}</span>}
                {cert.date && <span> ({cert.date})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {!profile.name && !summary && experience.length === 0 && (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg font-bold">$ cat resume.txt</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default TechTemplate;
