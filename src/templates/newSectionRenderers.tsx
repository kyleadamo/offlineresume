import { Resume, CertificationItem, LanguageItem, AwardItem, VolunteerItem, PublicationItem, AffiliationItem, PatentItem } from '@/schema/resume';

/**
 * Generates section renderers for the 8 new sections.
 * Each template calls this and spreads into its sectionRenderers map.
 * Style params let each template customize appearance.
 */
interface StyleConfig {
  sectionClass: string;
  headingClass: string;
  headingStyle?: React.CSSProperties;
  /** Wrapper for heading text — some templates use inline-block bg */
  renderHeading: (label: string) => React.ReactNode;
  tagClass: string;
  textClass: string;
  subTextClass: string;
  linkClass: string;
  cardClass?: string;
}

export function createNewSectionRenderers(resume: Resume, cfg: StyleConfig): Record<string, () => React.ReactNode> {
  const certifications = resume.certifications ?? [];
  const languages = resume.languages ?? [];
  const awards = resume.awards ?? [];
  const volunteer = (resume.volunteer ?? []).filter(v => !v.hidden);
  const publications = resume.publications ?? [];
  const affiliations = resume.affiliations ?? [];
  const patents = resume.patents ?? [];
  const interests = resume.interests ?? [];

  return {
    certifications: () => certifications.length > 0 ? (
      <div key="certifications" data-section="certifications" className={`mb-5 ${cfg.sectionClass}`}>
        {cfg.renderHeading('Certifications')}
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} data-pdf-section>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && <span className={cfg.subTextClass}> · {cert.issuer}</span>}
                </div>
                {(cert.issueDate || cert.date) && (
                  <span className={`text-xs shrink-0 ml-4 ${cfg.subTextClass}`}>
                    {cert.issueDate || cert.date}{cert.expirationDate ? ` – ${cert.expirationDate}` : ''}
                  </span>
                )}
              </div>
              {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className={`text-xs ${cfg.linkClass}`}>View credential{cert.credentialId ? ` (${cert.credentialId})` : ''}</a>}
              {!cert.credentialUrl && cert.credentialId && <span className={`text-xs ${cfg.subTextClass}`}>ID: {cert.credentialId}</span>}
              {cert.description && <p className={`text-xs mt-0.5 ${cfg.subTextClass}`}>{cert.description}</p>}
              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {cert.skills.map((s, i) => <span key={i} className={cfg.tagClass}>{s}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    languages: () => languages.length > 0 ? (
      <div key="languages" data-section="languages" className={`mb-5 ${cfg.sectionClass}`}>
        {cfg.renderHeading('Languages')}
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <div key={lang.id} data-pdf-section className={cfg.tagClass}>
              <span className="font-medium">{lang.language}</span>
              {lang.proficiency && <span className={cfg.subTextClass}> · {lang.proficiency}</span>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    awards: () => awards.length > 0 ? (
      <div key="awards" data-section="awards" className={`mb-5 ${cfg.sectionClass}`}>
        {cfg.renderHeading('Awards')}
        <div className="space-y-2">
          {awards.map((award) => (
            <div key={award.id} data-pdf-section>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold">{award.title}</span>
                  {award.issuer && <span className={cfg.subTextClass}> · {award.issuer}</span>}
                </div>
                {award.date && <span className={`text-xs shrink-0 ml-4 ${cfg.subTextClass}`}>{award.date}</span>}
              </div>
              {award.description && <p className={`text-xs mt-0.5 ${cfg.subTextClass}`}>{award.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    volunteer: () => volunteer.length > 0 ? (
      <div key="volunteer" data-section="volunteer" className={`mb-5 ${cfg.sectionClass}`}>
        {cfg.renderHeading('Volunteer')}
        <div className="space-y-3">
          {volunteer.map((vol) => (
            <div key={vol.id} data-pdf-section>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold">{vol.role}</span>
                  {vol.organization && <span className={cfg.subTextClass}> · {vol.organization}</span>}
                </div>
                {(vol.startDate || vol.endDate) && (
                  <span className={`text-xs shrink-0 ml-4 ${cfg.subTextClass}`}>
                    {vol.startDate}{vol.endDate ? ` – ${vol.endDate}` : ''}
                  </span>
                )}
              </div>
              {vol.description && <p className={`text-xs mt-0.5 ${cfg.subTextClass}`}>{vol.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    publications: () => publications.length > 0 ? (
      <div key="publications" data-section="publications" className={`mb-5 ${cfg.sectionClass}`}>
        {cfg.renderHeading('Publications')}
        <div className="space-y-2">
          {publications.map((pub) => (
            <div key={pub.id} data-pdf-section>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold">{pub.title}</span>
                  {pub.publisher && <span className={cfg.subTextClass}> · {pub.publisher}</span>}
                </div>
                {pub.date && <span className={`text-xs shrink-0 ml-4 ${cfg.subTextClass}`}>{pub.date}</span>}
              </div>
              {pub.url && <a href={pub.url} target="_blank" rel="noopener noreferrer" className={`text-xs ${cfg.linkClass}`}>{pub.url.replace(/^https?:\/\//, '')}</a>}
              {pub.description && <p className={`text-xs mt-0.5 ${cfg.subTextClass}`}>{pub.description}</p>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    affiliations: () => affiliations.length > 0 ? (
      <div key="affiliations" data-section="affiliations" className={`mb-5 ${cfg.sectionClass}`}>
        {cfg.renderHeading('Affiliations')}
        <div className="space-y-1.5">
          {affiliations.map((aff) => (
            <div key={aff.id} data-pdf-section className="text-xs">
              <span className="font-semibold">{aff.organization}</span>
              {aff.role && <span className={cfg.subTextClass}> · {aff.role}</span>}
              {aff.startDate && <span className={cfg.subTextClass}> ({aff.startDate})</span>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    patents: () => patents.length > 0 ? (
      <div key="patents" data-section="patents" className={`mb-5 ${cfg.sectionClass}`}>
        {cfg.renderHeading('Patents')}
        <div className="space-y-2">
          {patents.map((pat) => (
            <div key={pat.id} data-pdf-section className="text-xs">
              <span className="font-semibold">{pat.title}</span>
              {pat.patentNumber && <span className={cfg.subTextClass}> · {pat.patentNumber}</span>}
              {pat.date && <span className={cfg.subTextClass}> ({pat.date})</span>}
              {pat.url && <a href={pat.url} target="_blank" rel="noopener noreferrer" className={`ml-2 ${cfg.linkClass}`}>View</a>}
            </div>
          ))}
        </div>
      </div>
    ) : null,

    interests: () => interests.length > 0 ? (
      <div key="interests" data-section="interests" className={`mb-5 ${cfg.sectionClass}`}>
        {cfg.renderHeading('Interests')}
        <div className="flex flex-wrap gap-1.5">
          {interests.map((interest, i) => (
            <span key={i} className={cfg.tagClass}>{interest}</span>
          ))}
        </div>
      </div>
    ) : null,
  };
}
