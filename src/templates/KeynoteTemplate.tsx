import { Resume, normalizeSkill } from '@/schema/resume';
import { LinkedInDisplay, WebsiteDisplay } from './LinkedInBadge';
import { getVisibleSections } from './useSectionOrder';
import { createNewSectionRenderers } from './newSectionRenderers';

interface TemplateProps {
  resume: Resume;
}

const sectionClass = "cursor-pointer rounded transition-colors duration-150 hover:bg-muted/30 px-2 py-1";

const KeynoteTemplate = ({ resume }: TemplateProps) => {
  const { profile, summary, experience: allExperience, education: allEducation, skills: allSkills, projects: allProjects, references = [] } = resume;
  const experience = allExperience.filter(e => !e.hidden);
  const education = allEducation.filter(e => !e.hidden);
  const skills = allSkills.filter(e => !e.hidden);
  const projects = allProjects.filter(e => !e.hidden);
  const visibleSections = getVisibleSections(resume);

  const renderHeading = (label: string) => (
    <h3 className="text-[22px] font-extralight uppercase tracking-[0.25em] text-slate-800 mb-6">{label}</h3>
  );

  const newRenderers = createNewSectionRenderers(resume, {
    sectionClass,
    headingClass: '',
    renderHeading,
    tagClass: "text-[11px] font-light text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full",
    textClass: "text-slate-800",
    subTextClass: "text-slate-400",
    linkClass: "text-slate-400 hover:text-slate-600 underline",
  });

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    summary: () => summary ? (
      <div key="summary" data-section="summary" className={sectionClass}>
        <p className="text-[13px] font-light text-slate-500 leading-relaxed max-w-[360px]">{summary}</p>
      </div>
    ) : null,

    experience: () => experience.length > 0 ? (
      <div key="experience" data-section="experience" className={sectionClass}>
        {renderHeading('Experience')}
        <div className="space-y-8">
          {experience.map((exp) => (
            <div key={exp.id} data-pdf-section>
              <div className="mb-1">
                <span className="text-[15px] font-light text-slate-800">{exp.role}</span>
                {exp.company && (exp.companyUrl ? (
                  <><span className="text-slate-300 mx-2">—</span><a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-[13px] font-light text-slate-400 hover:text-slate-600">{exp.company}</a></>
                ) : (
                  <><span className="text-slate-300 mx-2">—</span><span className="text-[13px] font-light text-slate-400">{exp.company}</span></>
                ))}
              </div>
              {(exp.startDate || exp.endDate) && (
                <p className="text-[11px] font-light text-slate-400 tracking-wide uppercase mb-2">
                  {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                </p>
              )}
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="space-y-1 max-w-[400px]">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-[12px] font-light text-slate-500 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:bg-slate-300 before:rounded-full">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    education: () => education.length > 0 ? (
      <div key="education" data-section="education" className={sectionClass}>
        {renderHeading('Education')}
        <div className="space-y-5">
          {education.map((edu) => (
            <div key={edu.id} data-pdf-section>
              <p className="text-[14px] font-light text-slate-800">{edu.institution}</p>
              {(edu.degree || edu.field) && (
                <p className="text-[12px] font-light text-slate-400">{[edu.degree, edu.field].filter(Boolean).join(', ')}</p>
              )}
              {(edu.startDate || edu.endDate) && (
                <p className="text-[11px] font-light text-slate-400 tracking-wide uppercase mt-0.5">
                  {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    projects: () => projects.length > 0 ? (
      <div key="projects" data-section="projects" className={sectionClass}>
        {renderHeading('Projects')}
        <div className="space-y-6">
          {projects.map((proj) => (
            <div key={proj.id} data-pdf-section>
              <p className="text-[14px] font-light text-slate-800">{proj.name}</p>
              {proj.description && <p className="text-[12px] font-light text-slate-500 max-w-[360px] mt-0.5">{proj.description}</p>}
              {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-light text-slate-400 hover:text-slate-600 underline">{proj.url}</a>}
              {proj.highlights.filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 max-w-[380px]">
                  {proj.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} className="text-[12px] font-light text-slate-500 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-1 before:bg-slate-300 before:rounded-full">{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    skills: () => skills.length > 0 ? (
      <div key="skills" data-section="skills" className={sectionClass}>
        {renderHeading('Skills')}
        <div className="space-y-4">
          {skills.map((cat) => (
            <div key={cat.id}>
              {cat.category && <p className="text-[12px] font-light text-slate-400 uppercase tracking-wider mb-1.5">{cat.category}</p>}
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((s, i) => {
                  const skill = normalizeSkill(s);
                  return (
                    <span key={i} className="text-[11px] font-light text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full">{skill.name}</span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null,

    references: () => references.length > 0 ? (
      <div key="references" data-section="references" className={sectionClass}>
        {renderHeading('References')}
        <div className="space-y-4">
          {references.map((ref) => (
            <div key={ref.id} data-pdf-section>
              <p className="text-[14px] font-light text-slate-800">{ref.name}</p>
              {(ref.title || ref.company) && <p className="text-[12px] font-light text-slate-400">{[ref.title, ref.company].filter(Boolean).join(' · ')}</p>}
              {(ref.email || ref.phone) && <p className="text-[11px] font-light text-slate-400">{[ref.email, ref.phone].filter(Boolean).join(' · ')}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    ...newRenderers,
  };

  const contactItems = [
    profile.email,
    profile.phone,
    profile.location,
  ].filter(Boolean);

  return (
    <div className="font-sans" style={{ fontWeight: 200 }}>
      {/* Header: Dark accent band with name */}
      <div className="bg-slate-900 -mx-[16mm] -mt-[12mm] px-[16mm] pt-[14mm] pb-10 mb-12">
        <div className="flex items-start gap-8">
          {profile.photo && (
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-white/20 shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[48px] font-extralight uppercase tracking-[0.2em] text-white leading-none mb-2">
              {profile.name || 'Your Name'}
            </h1>
            {resume.targetRole && (
              <p className="text-[16px] font-extralight text-slate-400 tracking-[0.15em] uppercase">{resume.targetRole}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact row */}
      {contactItems.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-10 text-[11px] font-light text-slate-400 tracking-wide">
          {contactItems.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
          {profile.linkedin && (
            <span><LinkedInDisplay url={profile.linkedin} displayFull={profile.linkedinDisplayFull} className="text-slate-400 hover:text-slate-600" /></span>
          )}
          {profile.website && (
            <span><WebsiteDisplay url={profile.website} displayFull={profile.websiteDisplayFull} className="text-slate-400 hover:text-slate-600" /></span>
          )}
          {profile.links?.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">{link.label || link.url}</a>
          ))}
        </div>
      )}

      {/* Two-column body */}
      <div className="grid grid-cols-12 gap-12">
        {/* Left column: summary, education, skills, references */}
        <div className="col-span-4 flex flex-col gap-10">
          {visibleSections.filter(s => ['summary', 'education', 'skills', 'languages', 'interests', 'references'].includes(s)).map(id => {
            const renderer = sectionRenderers[id];
            return renderer ? <div key={id}>{renderer()}</div> : null;
          })}
        </div>

        {/* Right column: experience, projects, and remaining sections */}
        <div className="col-span-8 flex flex-col gap-10">
          {visibleSections.filter(s => !['summary', 'education', 'skills', 'languages', 'interests', 'references'].includes(s)).map(id => {
            const renderer = sectionRenderers[id];
            return renderer ? <div key={id}>{renderer()}</div> : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default KeynoteTemplate;
