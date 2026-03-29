import { Resume } from '@/schema/resume';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer transition-colors duration-150 hover:bg-yellow-100/30 -mx-2 px-2 py-0.5";

const BrutalistTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience, education, skills } = resume;

  return (
    <div className="font-mono text-foreground text-sm leading-relaxed">
      {profile.name && (
        <div data-section="profile" className={`mb-6 ${sectionClass}`}>
          <div className="flex items-center gap-4">
            {profile.photo && (
              <img src={profile.photo} alt={profile.name} className="w-16 h-16 object-cover shrink-0 border-[3px] border-foreground" />
            )}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight">{profile.name}</h2>
              {resume.targetRole && (
                <p className="text-sm font-bold uppercase tracking-widest mt-1 bg-foreground text-background inline-block px-2 py-0.5">{resume.targetRole}</p>
              )}
            </div>
          </div>
          <div className="border-b-[3px] border-foreground mt-3 pb-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {profile.location && <span>{profile.location}</span>}
            </div>
          </div>
        </div>
      )}

      {summary && (
        <div data-section="summary" className={`mb-6 ${sectionClass}`}>
          <div className="border-[2px] border-foreground">
            <div className="bg-yellow-300 text-foreground px-3 py-1 text-xs font-black uppercase tracking-widest border-b-[2px] border-foreground">
              About
            </div>
            <p className="px-3 py-2 text-muted-foreground leading-relaxed">{summary}</p>
          </div>
        </div>
      )}

      {experience.length > 0 && (
        <div data-section="experience" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-xs font-black uppercase tracking-widest mb-3 bg-foreground text-background inline-block px-2 py-1">Experience</h3>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} data-pdf-section className="border-[2px] border-foreground p-3">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <div>
                    <span className="font-black uppercase">{exp.role}</span>
                    {exp.company && (exp.companyUrl ? (
                      <><span className="text-muted-foreground"> // </span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline">{exp.company}</a></>
                    ) : (
                      <span className="text-muted-foreground"> // {exp.company}</span>
                    ))}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-xs font-bold uppercase shrink-0">
                      {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                    </span>
                  )}
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="shrink-0 font-bold text-foreground">→</span>
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
        <div data-section="education" className={`mb-6 ${sectionClass}`}>
          <h3 className="text-xs font-black uppercase tracking-widest mb-3 bg-foreground text-background inline-block px-2 py-1">Education</h3>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} data-pdf-section className="border-[2px] border-foreground p-3">
                <span className="font-black uppercase">{edu.institution}</span>
                {(edu.degree || edu.field) && (
                  <span className="text-muted-foreground"> // {[edu.degree, edu.field].filter(Boolean).join(', ')}</span>
                )}
                {(edu.startDate || edu.endDate) && (
                  <div className="text-xs font-bold uppercase mt-1">
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div data-section="skills" className={sectionClass}>
          <h3 className="text-xs font-black uppercase tracking-widest mb-3 bg-foreground text-background inline-block px-2 py-1">Skills</h3>
          <div className="space-y-3">
            {skills.map((cat) => (
              <div key={cat.id} data-pdf-section>
                {cat.category && <span className="text-xs font-black uppercase block mb-1.5">{cat.category}</span>}
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, i) => (
                    <span key={i} className="border-[2px] border-foreground text-foreground text-xs font-bold px-2 py-0.5 uppercase">
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
          <p className="text-lg font-black uppercase">Your resume will appear here</p>
          <p className="text-sm mt-1">Start editing on the left panel</p>
        </div>
      )}
    </div>
  );
};

export default BrutalistTemplate;
